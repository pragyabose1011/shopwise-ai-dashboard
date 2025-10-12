from flask import Blueprint, request, jsonify
from models import db, Product, Interaction
from services import RecommendationEngine

products_bp = Blueprint('products', __name__)

@products_bp.route('/', methods=['GET'])
def get_products():
    """Get all products with optional filtering"""
    try:
        # Get query parameters
        category = request.args.get('category')
        limit = request.args.get('limit', default=20, type=int)
        offset = request.args.get('offset', default=0, type=int)

        # Build query
        query = Product.query

        if category:
            query = query.filter(Product.category.ilike(f'%{category}%'))

        # Apply pagination
        products = query.offset(offset).limit(limit).all()
        total = query.count()

        # Convert to dict
        products_data = [product.to_dict() for product in products]

        return jsonify({
            'success': True,
            'products': products_data,
            'total': total,
            'limit': limit,
            'offset': offset
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@products_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Get specific product details"""
    try:
        product = Product.query.get_or_404(product_id)
        return jsonify({
            'success': True,
            'product': product.to_dict()
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@products_bp.route('/interact', methods=['POST'])
def interact_with_product():
    """Record user interaction with product"""
    try:
        data = request.json
        user_id = data.get('user_id')
        product_id = data.get('product_id')
        interaction_type = data.get('interaction_type', 'view')
        rating = data.get('rating')

        if not user_id or not product_id:
            return jsonify({
                'success': False, 
                'error': 'user_id and product_id are required'
            }), 400

        # Validate interaction type
        valid_types = ['view', 'click', 'rating', 'favorite', 'purchase']
        if interaction_type not in valid_types:
            return jsonify({
                'success': False,
                'error': f'Invalid interaction_type. Must be one of: {valid_types}'
            }), 400

        # Validate rating if provided
        if rating is not None and (rating < 1 or rating > 5):
            return jsonify({
                'success': False,
                'error': 'Rating must be between 1 and 5'
            }), 400

        # Create interaction
        interaction = Interaction.create_interaction(
            user_id=user_id,
            product_id=product_id,
            interaction_type=interaction_type,
            rating=rating
        )

        # If this was a significant interaction, trigger recommendation update
        if interaction_type in ['rating', 'favorite', 'purchase']:
            try:
                engine = RecommendationEngine()
                recommendations = engine.generate_recommendations(user_id)
                engine.save_recommendations(user_id, recommendations)
            except Exception as rec_error:
                print(f"Warning: Failed to update recommendations: {rec_error}")

        return jsonify({
            'success': True,
            'message': 'Interaction recorded successfully',
            'interaction': interaction.to_dict()
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@products_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all product categories"""
    try:
        categories = db.session.query(Product.category).distinct().all()
        categories_list = [cat[0] for cat in categories]

        return jsonify({
            'success': True,
            'categories': categories_list
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@products_bp.route('/popular', methods=['GET'])
def get_popular_products():
    """Get popular products based on interactions"""
    try:
        limit = request.args.get('limit', default=10, type=int)

        # Get products with most interactions
        popular_products = db.session.query(
            Product,
            db.func.count(Interaction.id).label('interaction_count')
        ).outerjoin(Interaction).group_by(Product.id).order_by(
            db.func.count(Interaction.id).desc()
        ).limit(limit).all()

        products_data = []
        for product, interaction_count in popular_products:
            product_dict = product.to_dict()
            product_dict['interaction_count'] = interaction_count
            products_data.append(product_dict)

        return jsonify({
            'success': True,
            'products': products_data
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
