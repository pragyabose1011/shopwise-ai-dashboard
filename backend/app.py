from flask import Flask, request, jsonify
from flask_cors import CORS
from config import config
from models import init_db
from datetime import datetime
import os

# Import route blueprints
from routes.products import products_bp
from routes.users import users_bp
from routes.recommendations import recommendations_bp

def create_app(config_name=None):
    """Create Flask application"""
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')

    app = Flask(__name__)
    app.config.from_object(config[config_name])

    # Enable CORS for React frontend
    CORS(app, origins=['http://localhost:3000', 'http://127.0.0.1:3000'])

    # Initialize database
    init_db(app)

    # Register blueprints
    app.register_blueprint(products_bp, url_prefix='/api/products')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(recommendations_bp, url_prefix='/api/recommendations')

    @app.route('/api/health')
    def health_check():
        """Health check endpoint"""
        return jsonify({
            'status': 'healthy',
            'message': 'E-commerce Recommender API is running',
            'timestamp': datetime.now().isoformat()
        })

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Endpoint not found'}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500

    return app

if __name__ == '__main__':
    app = create_app()
    print("🚀 E-commerce Recommender API Server Starting...")
    print("📊 API Documentation available at:")
    print("   - Health Check: http://localhost:5000/api/health")
    print("   - Products: http://localhost:5000/api/products/")
    print("   - Users: http://localhost:5000/api/users/")
    print("   - Recommendations: http://localhost:5000/api/recommendations/")
    print("🔗 CORS enabled for React frontend on http://localhost:3000")

    app.run(host='0.0.0.0', port=5000, debug=True)
