from .database import db
from datetime import datetime

class Interaction(db.Model):
    __tablename__ = 'interactions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    interaction_type = db.Column(db.String(50), nullable=False)  # view, click, rating, favorite, purchase
    rating = db.Column(db.Integer)  # 1-5 rating, only for rating interactions
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'product_id': self.product_id,
            'interaction_type': self.interaction_type,
            'rating': self.rating,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
            'product_name': self.product.name if self.product else None,
            'user_name': self.user.name if self.user else None
        }

    @staticmethod
    def create_interaction(user_id, product_id, interaction_type, rating=None):
        """Create a new interaction"""
        interaction = Interaction(
            user_id=user_id,
            product_id=product_id,
            interaction_type=interaction_type,
            rating=rating
        )
        db.session.add(interaction)
        db.session.commit()
        return interaction

    def __repr__(self):
        return f'<Interaction {self.user_id}->{self.product_id}: {self.interaction_type}>'
