from flask import Blueprint, request, jsonify
from models import db, User, Interaction, Product
from sqlalchemy import func

users_bp = Blueprint('users', __name__)

@users_bp.route('/', methods=['GET'])
def get_users():
    """Get all users"""
    try:
        users = User.query.all()
        users_data = [user.to_dict() for user in users]

        return jsonify({
            'success': True,
            'users': users_data
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@users_bp.route('/', methods=['POST'])
def create_user():
    """Create a new user"""
    try:
        data = request.json
        name = data.get('name')
        email = data.get('email')

        if not name or not email:
            return jsonify({
                'success': False,
                'error': 'Name and email are required'
            }), 400

        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({
                'success': False,
                'error': 'User with this email already exists'
            }), 400

        # Create new user
        user = User(name=name, email=email)
        db.session.add(user)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'User created successfully',
            'user': user.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@users_bp.route('/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """Get specific user details"""
    try:
        user = User.query.get_or_404(user_id)
        user_dict = user.to_dict()

        # Add interaction statistics
        user_dict['total_interactions'] = len(user.interactions)
        user_dict['favorite_categories'] = user.get_favorite_categories()
        user_dict['average_rating'] = user.get_average_rating_given()

        return jsonify({
            'success': True,
            'user': user_dict
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@users_bp.route('/<int:user_id>/interactions', methods=['GET'])
def get_user_interactions(user_id):
    """Get user's interaction history"""
    try:
        user = User.query.get_or_404(user_id)
        limit = request.args.get('limit', default=50, type=int)
        interaction_type = request.args.get('type')

        query = Interaction.query.filter_by(user_id=user_id)
        if interaction_type:
            query = query.filter_by(interaction_type=interaction_type)

        interactions = query.order_by(
            Interaction.timestamp.desc()
        ).limit(limit).all()

        interactions_data = [interaction.to_dict() for interaction in interactions]

        return jsonify({
            'success': True,
            'interactions': interactions_data,
            'total': len(user.interactions)
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@users_bp.route('/<int:user_id>/stats', methods=['GET'])
def get_user_stats(user_id):
    """Get detailed user statistics"""
    try:
        user = User.query.get_or_404(user_id)

        # Get interaction counts by type
        interaction_stats = db.session.query(
            Interaction.interaction_type,
            func.count(Interaction.id).label('count')
        ).filter_by(user_id=user_id).group_by(
            Interaction.interaction_type
        ).all()

        interaction_counts = {stat[0]: stat[1] for stat in interaction_stats}

        # Get category preferences
        category_stats = db.session.query(
            Product.category,
            func.count(Interaction.id).label('interaction_count'),
            func.avg(Interaction.rating).label('avg_rating')
        ).join(Interaction).filter(
            Interaction.user_id == user_id
        ).group_by(Product.category).all()

        category_preferences = []
        for category, count, avg_rating in category_stats:
            category_preferences.append({
                'category': category,
                'interaction_count': count,
                'average_rating': float(avg_rating) if avg_rating else None
            })

        # Get recent activity
        recent_interactions = Interaction.query.filter_by(user_id=user_id).order_by(
            Interaction.timestamp.desc()
        ).limit(10).all()
        recent_activity = [interaction.to_dict() for interaction in recent_interactions]

        return jsonify({
            'success': True,
            'user': user.to_dict(),
            'interaction_counts': interaction_counts,
            'category_preferences': category_preferences,
            'recent_activity': recent_activity,
            'total_interactions': len(user.interactions)
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
