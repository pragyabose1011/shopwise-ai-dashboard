from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

def init_db(app):
    """Initialize database with Flask app"""
    db.init_app(app)
    with app.app_context():
        db.create_all()
        populate_sample_data()

def populate_sample_data():
    """Populate database with sample data if empty"""
    from .product import Product
    from .user import User

    # Check if data already exists
    if Product.query.first() is not None:
        return

    # Create sample products
    products = [
        {
            'name': 'Wireless Bluetooth Headphones',
            'description': 'Premium quality wireless headphones with noise cancellation and 30-hour battery life',
            'price': 79.99,
            'category': 'Electronics',
            'image_url': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'
        },
        {
            'name': 'Smart Fitness Tracker',
            'description': 'Advanced fitness tracker with heart rate monitor, GPS, and waterproof design',
            'price': 129.99,
            'category': 'Electronics',
            'image_url': 'https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=400&h=400&fit=crop'
        },
        {
            'name': 'Organic Cotton T-Shirt',
            'description': 'Sustainable organic cotton t-shirt available in multiple colors and sizes',
            'price': 24.99,
            'category': 'Clothing',
            'image_url': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop'
        },
        {
            'name': 'Stainless Steel Water Bottle',
            'description': 'Double-wall insulated water bottle keeps drinks cold for 24 hours',
            'price': 19.99,
            'category': 'Home & Kitchen',
            'image_url': 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop'
        },
        {
            'name': 'Portable Bluetooth Speaker',
            'description': 'Compact wireless speaker with excellent sound quality and 12-hour battery',
            'price': 45.99,
            'category': 'Electronics',
            'image_url': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop'
        },
        {
            'name': 'Premium Yoga Mat',
            'description': 'Non-slip yoga mat with superior grip and cushioning for all workout types',
            'price': 34.99,
            'category': 'Sports & Fitness',
            'image_url': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop'
        },
        {
            'name': 'Smart Coffee Maker',
            'description': '12-cup programmable coffee maker with thermal carafe and mobile app control',
            'price': 89.99,
            'category': 'Home & Kitchen',
            'image_url': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop'
        },
        {
            'name': 'Professional Running Shoes',
            'description': 'Lightweight running shoes with superior cushioning and breathable mesh upper',
            'price': 119.99,
            'category': 'Sports & Fitness',
            'image_url': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'
        },
        {
            'name': 'Wireless Charging Station',
            'description': 'Multi-device wireless charging pad with fast charging for phones and earbuds',
            'price': 39.99,
            'category': 'Electronics',
            'image_url': 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop'
        },
        {
            'name': 'Chef Kitchen Knife Set',
            'description': 'Professional ceramic knife set with ergonomic handles and protective cases',
            'price': 59.99,
            'category': 'Home & Kitchen',
            'image_url': 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=400&h=400&fit=crop'
        }
    ]

    # Add products to database
    for product_data in products:
        product = Product(**product_data)
        db.session.add(product)

    # Create sample users
    users = [
        {'name': 'Alice Johnson', 'email': 'alice@example.com'},
        {'name': 'Bob Smith', 'email': 'bob@example.com'},
        {'name': 'Carol Davis', 'email': 'carol@example.com'},
        {'name': 'David Wilson', 'email': 'david@example.com'},
        {'name': 'Emma Brown', 'email': 'emma@example.com'}
    ]

    for user_data in users:
        user = User(**user_data)
        db.session.add(user)

    try:
        db.session.commit()
        print("✅ Sample data populated successfully!")
    except Exception as e:
        db.session.rollback()
        print(f"❌ Error populating sample data: {e}")
