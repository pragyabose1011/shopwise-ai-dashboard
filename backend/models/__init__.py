from .database import db, init_db
from .product import Product
from .user import User
from .interaction import Interaction
from .recommendation import Recommendation

__all__ = ['db', 'init_db', 'Product', 'User', 'Interaction', 'Recommendation']
