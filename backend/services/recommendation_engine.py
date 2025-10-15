import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from models import db, Product, User, Interaction, Recommendation
from sqlalchemy import func, select
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RecommendationEngine:
    def __init__(self):
        self.min_interactions = 3
        self.default_recommendations = 5

    def generate_recommendations(self, user_id, num_recommendations=5):
        """Generate recommendations for a user using hybrid approach"""
        try:
            user = User.query.get(user_id)
            if not user:
                logger.error(f"User {user_id} not found")
                return []

            # Get user interaction history
            user_interactions = Interaction.query.filter_by(user_id=user_id).all()

            if len(user_interactions) < self.min_interactions:
                # For new users, recommend popular products
                return self._get_popular_recommendations(user_id, num_recommendations)

            # Try collaborative filtering first
            collaborative_recs = self._collaborative_filtering(user_id, num_recommendations)

            # Try content-based filtering
            content_based_recs = self._content_based_filtering(user_id, num_recommendations)

            # Combine recommendations using hybrid approach
            hybrid_recs = self._combine_recommendations(
                collaborative_recs, 
                content_based_recs, 
                num_recommendations
            )

            return hybrid_recs

        except Exception as e:
            logger.error(f"Error generating recommendations for user {user_id}: {e}")
            return self._get_popular_recommendations(user_id, num_recommendations)

    from sqlalchemy import func, select

    def _get_popular_recommendations(self, user_id, num_recommendations):
        """Get popular products as fallback recommendations"""
        try:
            # Subquery of product IDs the user has interacted with
            user_product_ids = (
                db.session.query(Interaction.product_id)
                .filter_by(user_id=user_id)
                .subquery()
            )

            # FIX: wrap subquery in select() for IN clause
            popular_products = (
                db.session.query(
                    Product.id,
                    func.count(Interaction.id).label("interaction_count"),
                )
                .outerjoin(Interaction)
                .filter(~Product.id.in_(select(user_product_ids.c.product_id)))
                .group_by(Product.id)
                .order_by(func.count(Interaction.id).desc())
                .limit(num_recommendations)
                .all()
            )

            recommendations = [
                {
                    "product_id": product_id,
                    "score": min(0.8, count / 10.0),
                    "algorithm": "popularity",
                    "explanation": f"This is a popular product with {count} user interactions. Perfect for discovering trending items!",
                }
                for product_id, count in popular_products
            ]

            return recommendations

        except Exception as e:
            logger.error(f"Error getting popular recommendations: {e}")
            import traceback; traceback.print_exc()
            return []


    def _collaborative_filtering(self, user_id, num_recommendations):
        """User-based collaborative filtering"""
        try:
            # Create user-item matrix
            interactions = db.session.query(
                Interaction.user_id,
                Interaction.product_id,
                func.avg(Interaction.rating).label('avg_rating')
            ).filter(Interaction.rating.isnot(None)).group_by(
                Interaction.user_id, Interaction.product_id
            ).all()

            if len(interactions) < 10:  # Not enough data for collaborative filtering
                return []

            # Convert to pandas DataFrame
            df = pd.DataFrame(interactions, columns=['user_id', 'product_id', 'rating'])

            # Create user-item matrix
            user_item_matrix = df.pivot_table(
                index='user_id', 
                columns='product_id', 
                values='rating', 
                fill_value=0
            )

            if user_id not in user_item_matrix.index:
                return []

            # Calculate user similarities
            user_similarities = cosine_similarity(user_item_matrix)
            user_sim_df = pd.DataFrame(
                user_similarities, 
                index=user_item_matrix.index, 
                columns=user_item_matrix.index
            )

            # Find similar users
            similar_users = user_sim_df[user_id].sort_values(ascending=False)[1:6]  # Top 5 similar users

            # Get products liked by similar users that current user hasn't interacted with
            user_products = set(df[df['user_id'] == user_id]['product_id'].tolist())
            recommendations = []

            for similar_user_id, similarity in similar_users.items():
                if similarity < 0.1:  # Skip users with very low similarity
                    continue

                similar_user_products = df[
                    (df['user_id'] == similar_user_id) & 
                    (df['rating'] >= 4)  # Only highly rated products
                ]['product_id'].tolist()

                for product_id in similar_user_products:
                    if product_id not in user_products:
                        recommendations.append({
                            'product_id': product_id,
                            'score': similarity * 0.8,  # Weight by similarity
                            'algorithm': 'collaborative',
                            'explanation': f"Users with similar preferences have highly rated this product (similarity: {similarity:.0%})"
                        })

            # Remove duplicates and sort by score
            unique_recs = {}
            for rec in recommendations:
                product_id = rec['product_id']
                if product_id not in unique_recs or rec['score'] > unique_recs[product_id]['score']:
                    unique_recs[product_id] = rec

            sorted_recs = sorted(unique_recs.values(), key=lambda x: x['score'], reverse=True)
            return sorted_recs[:num_recommendations]

        except Exception as e:
            logger.error(f"Error in collaborative filtering: {e}")
            return []

    def _content_based_filtering(self, user_id, num_recommendations):
        """Content-based filtering using product features"""
        try:
            # Get user's interaction history
            user_interactions = db.session.query(
                Interaction, Product
            ).join(Product).filter(
                Interaction.user_id == user_id,
                Interaction.rating.isnot(None),
                Interaction.rating >= 4  # Only products user liked
            ).all()

            if not user_interactions:
                return []

            # Get all products
            all_products = Product.query.all()

            # Create feature vectors for products (category + description)
            product_features = []
            product_ids = []

            for product in all_products:
                feature_text = f"{product.category} {product.description or ''}"
                product_features.append(feature_text)
                product_ids.append(product.id)

            # Create TF-IDF vectors
            vectorizer = TfidfVectorizer(max_features=100, stop_words='english')
            tfidf_matrix = vectorizer.fit_transform(product_features)

            # Get user's liked products
            liked_product_ids = [interaction.Interaction.product_id for interaction in user_interactions]

            # Calculate similarities
            recommendations = []
            for i, product_id in enumerate(product_ids):
                if product_id in liked_product_ids:
                    continue

                max_similarity = 0
                for liked_product_id in liked_product_ids:
                    liked_idx = product_ids.index(liked_product_id)
                    similarity = cosine_similarity(
                        tfidf_matrix[i:i+1], 
                        tfidf_matrix[liked_idx:liked_idx+1]
                    )[0][0]
                    max_similarity = max(max_similarity, similarity)

                if max_similarity > 0.1:  # Only recommend if similarity is above threshold
                    product = next(p for p in all_products if p.id == product_id)
                    recommendations.append({
                        'product_id': product_id,
                        'score': max_similarity * 0.7,  # Weight content-based lower than collaborative
                        'algorithm': 'content-based',
                        'explanation': f"This {product.category.lower()} product is similar to items you've previously rated highly"
                    })

            # Sort by score and return top recommendations
            sorted_recs = sorted(recommendations, key=lambda x: x['score'], reverse=True)
            return sorted_recs[:num_recommendations]

        except Exception as e:
            logger.error(f"Error in content-based filtering: {e}")
            return []

    def _combine_recommendations(self, collaborative_recs, content_based_recs, num_recommendations):
        """Combine collaborative and content-based recommendations"""
        try:
            # Merge recommendations by product_id
            combined_recs = {}

            # Add collaborative filtering recommendations
            for rec in collaborative_recs:
                product_id = rec['product_id']
                combined_recs[product_id] = rec.copy()
                combined_recs[product_id]['collaborative_score'] = rec['score']

            # Add content-based recommendations
            for rec in content_based_recs:
                product_id = rec['product_id']
                if product_id in combined_recs:
                    # Combine scores
                    combined_recs[product_id]['score'] = (
                        combined_recs[product_id]['collaborative_score'] * 0.6 +
                        rec['score'] * 0.4
                    )
                    combined_recs[product_id]['algorithm'] = 'hybrid'
                    combined_recs[product_id]['explanation'] = (
                        "This product is recommended based on both your preferences and similar user behavior"
                    )
                else:
                    combined_recs[product_id] = rec.copy()

            # Sort by final score
            final_recs = sorted(combined_recs.values(), key=lambda x: x['score'], reverse=True)
            return final_recs[:num_recommendations]

        except Exception as e:
            logger.error(f"Error combining recommendations: {e}")
            return collaborative_recs + content_based_recs

    def save_recommendations(self, user_id, recommendations):
        """Save recommendations to database"""
        try:
            # Deactivate old recommendations
            old_recs = Recommendation.query.filter_by(user_id=user_id, is_active=True).all()
            for rec in old_recs:
                rec.is_active = False

            # Save new recommendations
            saved_recommendations = []
            for rec in recommendations:
                saved_rec = Recommendation.create_recommendation(
                    user_id=user_id,
                    product_id=rec['product_id'],
                    score=rec['score'],
                    explanation=rec['explanation'],
                    algorithm_used=rec['algorithm']
                )
                saved_recommendations.append(saved_rec)

            return saved_recommendations

        except Exception as e:
            logger.error(f"Error saving recommendations: {e}")
            return []
