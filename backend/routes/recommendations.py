from flask import Blueprint, request, jsonify
from models import db, User, Product, Recommendation
from services import RecommendationEngine, LLMService

recommendations_bp = Blueprint('recommendations', __name__)

# Initialize services
engine = RecommendationEngine()
llm_service = LLMService()

@recommendations_bp.route('/<int:user_id>', methods=['GET'])
def get_user_recommendations(user_id):
    """Get recommendations for a specific user"""
    try:
        user = User.query.get_or_404(user_id)
        limit = request.args.get('limit', default=5, type=int)
        refresh = request.args.get('refresh', default=False, type=bool)

        if refresh:
            # Generate fresh recommendations
            recommendations = engine.generate_recommendations(user_id, limit)
            saved_recommendations = engine.save_recommendations(user_id, recommendations)
            recommendations_data = [rec.to_dict() for rec in saved_recommendations]
        else:
            # Get existing recommendations from database
            existing_recommendations = Recommendation.query.filter_by(
                user_id=user_id, is_active=True
            ).order_by(Recommendation.score.desc()).limit(limit).all()

            if not existing_recommendations:
                # Generate new ones if none exist
                recommendations = engine.generate_recommendations(user_id, limit)
                saved_recommendations = engine.save_recommendations(user_id, recommendations)
                recommendations_data = [rec.to_dict() for rec in saved_recommendations]
            else:
                recommendations_data = [rec.to_dict() for rec in existing_recommendations]

        return jsonify({
            'success': True,
            'user_id': user_id,
            'recommendations': recommendations_data,
            'count': len(recommendations_data)
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@recommendations_bp.route('/<int:user_id>/generate', methods=['POST'])
def generate_recommendations(user_id):
    """Generate fresh recommendations for a user"""
    try:
        user = User.query.get_or_404(user_id)
        data = request.json or {}
        num_recommendations = data.get('count', 5)

        # Generate recommendations
        recommendations = engine.generate_recommendations(user_id, num_recommendations)

        if not recommendations:
            return jsonify({
                'success': True,
                'message': 'No recommendations could be generated for this user',
                'recommendations': []
            })

        # Save to database
        saved_recommendations = engine.save_recommendations(user_id, recommendations)
        recommendations_data = [rec.to_dict() for rec in saved_recommendations]

        return jsonify({
            'success': True,
            'message': 'Recommendations generated successfully',
            'user_id': user_id,
            'recommendations': recommendations_data,
            'count': len(recommendations_data)
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@recommendations_bp.route('/popular', methods=['GET'])
def get_popular_recommendations():
    """Get generally popular products as recommendations"""
    try:
        limit = request.args.get('limit', default=10, type=int)

        # Get products with highest interaction counts
        popular_products = db.session.query(
            Product,
            db.func.count(Interaction.id).label('interaction_count')
        ).outerjoin(Interaction).group_by(Product.id).order_by(
            db.func.count(Interaction.id).desc()
        ).limit(limit).all()

        popular_recommendations = []
        for product, interaction_count in popular_products:
            popular_recommendations.append({
                'product': product.to_dict(),
                'interaction_count': interaction_count,
                'explanation': f'This popular product has {interaction_count} user interactions',
                'algorithm': 'popularity',
                'score': min(1.0, interaction_count / 10.0)
            })

        return jsonify({
            'success': True,
            'recommendations': popular_recommendations,
            'count': len(popular_recommendations)
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
