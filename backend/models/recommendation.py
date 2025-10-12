from .database import db
from datetime import datetime

class Recommendation(db.Model):
    __tablename__ = 'recommendations'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    score = db.Column(db.Float, nullable=False)  # Recommendation confidence score
    explanation = db.Column(db.Text)  # LLM-generated explanation
    algorithm_used = db.Column(db.String(100))  # collaborative, content-based, hybrid
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)  # For managing recommendation lifecycle

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'product_id': self.product_id,
            'score': self.score,
            'explanation': self.explanation,
            'algorithm_used': self.algorithm_used,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'is_active': self.is_active,
            'product': self.product.to_dict() if self.product else None
        }

    @staticmethod
    def create_recommendation(user_id, product_id, score, explanation, algorithm_used):
        """Create a new recommendation"""
        # Check if recommendation already exists for this user-product pair
        existing = Recommendation.query.filter_by(
            user_id=user_id, 
            product_id=product_id,
            is_active=True
        ).first()

        if existing:
            # Update existing recommendation
            existing.score = score
            existing.explanation = explanation
            existing.algorithm_used = algorithm_used
            existing.created_at = datetime.utcnow()
            db.session.commit()
            return existing
        else:
            # Create new recommendation
            recommendation = Recommendation(
                user_id=user_id,
                product_id=product_id,
                score=score,
                explanation=explanation,
                algorithm_used=algorithm_used
            )
            db.session.add(recommendation)
            db.session.commit()
            return recommendation

    def __repr__(self):
        return f'<Recommendation {self.user_id}->{self.product_id}: {self.score:.2f}>'
