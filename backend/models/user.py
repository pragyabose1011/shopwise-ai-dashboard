from .database import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    interactions = db.relationship('Interaction', backref='user', lazy=True, cascade='all, delete-orphan')
    recommendations = db.relationship('Recommendation', backref='user', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

    def get_favorite_categories(self, limit=5):
        """Get user's most interacted categories"""
        from .interaction import Interaction
        from .product import Product
        from sqlalchemy import func

        categories = db.session.query(
            Product.category,
            func.count(Interaction.id).label('interaction_count')
        ).join(Interaction).filter(
            Interaction.user_id == self.id
        ).group_by(Product.category).order_by(
            func.count(Interaction.id).desc()
        ).limit(limit).all()

        return [{'category': cat, 'count': count} for cat, count in categories]

    def get_average_rating_given(self):
        """Calculate average rating this user gives to products"""
        rating_interactions = [i for i in self.interactions if i.interaction_type == 'rating' and i.rating is not None]
        if not rating_interactions:
            return 0
        return round(sum(i.rating for i in rating_interactions) / len(rating_interactions), 1)

    def __repr__(self):
        return f'<User {self.name}>'
