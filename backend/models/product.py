from .database import db
from datetime import datetime

class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(100), nullable=False)
    image_url = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    interactions = db.relationship('Interaction', backref='product', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'category': self.category,
            'image_url': self.image_url,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'average_rating': self.get_average_rating(),
            'interaction_count': self.get_interaction_count()
        }

    def get_average_rating(self):
        """Calculate average rating from user interactions"""
        rating_interactions = [i for i in self.interactions if i.interaction_type == 'rating' and i.rating is not None]
        if not rating_interactions:
            return 0
        return round(sum(i.rating for i in rating_interactions) / len(rating_interactions), 1)

    def get_interaction_count(self):
        """Get total number of interactions for this product"""
        return len(self.interactions)

    def __repr__(self):
        return f'<Product {self.name}>'
