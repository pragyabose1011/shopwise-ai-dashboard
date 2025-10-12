# E-commerce Recommender - Backend API

A Flask-based REST API for the e-commerce product recommendation system.

## Features

- **RESTful API** with comprehensive endpoints
- **Machine Learning Recommendations** using collaborative filtering and content-based filtering
- **LLM Integration** for generating recommendation explanations
- **SQLite Database** with automatic data seeding
- **CORS Support** for React frontend integration

## Quick Start

### 1. Setup Environment

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Environment Variables (Optional)

```bash
export FLASK_ENV=development
export OPENAI_API_KEY=your-openai-api-key  # Optional - will use mock explanations if not provided
```

### 3. Run the Server

```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Products
- `GET /api/products/` - Get all products
- `GET /api/products/{id}` - Get specific product
- `POST /api/products/interact` - Record user interaction
- `GET /api/products/categories` - Get all categories
- `GET /api/products/popular` - Get popular products

### Users
- `GET /api/users/` - Get all users
- `POST /api/users/` - Create new user
- `GET /api/users/{id}` - Get user details
- `GET /api/users/{id}/stats` - Get user statistics
- `GET /api/users/{id}/interactions` - Get user interactions

### Recommendations
- `GET /api/recommendations/{user_id}` - Get user recommendations
- `POST /api/recommendations/{user_id}/generate` - Generate fresh recommendations
- `GET /api/recommendations/popular` - Get popular recommendations

### Health Check
- `GET /api/health` - API health check

## Database

The system uses SQLite with automatic schema creation and data seeding on first run:

- **products**: Product catalog with details, pricing, and categories
- **users**: User profiles and account information  
- **interactions**: User-product interactions (views, ratings, favorites)
- **recommendations**: Generated recommendations with explanations and scores

## Recommendation Engine

The system implements multiple recommendation algorithms:

1. **Collaborative Filtering**: Recommends based on similar user preferences
2. **Content-Based Filtering**: Suggests products similar to user's past interactions
3. **Hybrid Approach**: Combines multiple algorithms for better accuracy
4. **Popularity-Based**: Fallback recommendations for new users

## Configuration

Key configuration options in `config.py`:

- `MIN_INTERACTIONS_FOR_RECOMMENDATION = 3`: Minimum interactions before personalized recommendations
- `DEFAULT_RECOMMENDATION_COUNT = 5`: Default number of recommendations to generate
- `OPENAI_API_KEY`: For LLM-powered explanations (optional)

## Development

The Flask app runs in debug mode by default. Database file `ecommerce.db` is created automatically in the project root.

For production deployment:
- Set `FLASK_ENV=production`  
- Use a production WSGI server like Gunicorn
- Configure a proper database (PostgreSQL recommended)
- Set up proper security headers and HTTPS
