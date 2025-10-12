# E-commerce Product Recommender System

A complete full-stack application featuring AI-powered product recommendations with explanations, built with React frontend and Flask backend.

## 🚀 Features

### 🎯 AI-Powered Recommendations
- **Collaborative Filtering**: Recommends based on similar user preferences
- **Content-Based Filtering**: Suggests products similar to user's past interactions  
- **Hybrid Algorithm**: Combines multiple approaches for optimal accuracy
- **LLM Explanations**: AI-generated explanations for each recommendation

### 🛒 Interactive Product Catalog
- Browse products with search and filtering
- Rate products and add to favorites
- Real-time interaction tracking
- Responsive product cards with high-quality images

### 📊 User Analytics Dashboard  
- Track user activity and preferences
- View interaction statistics and category preferences
- Monitor engagement metrics
- Recent activity timeline

### 🎨 Modern User Interface
- Responsive design with Material-UI
- Smooth animations and hover effects
- Mobile-first approach
- Intuitive navigation and user experience

## 🏗️ Architecture

### Backend (Flask API)
- **RESTful API** with comprehensive endpoints
- **SQLite Database** with automatic seeding
- **ML Recommendation Engine** with multiple algorithms
- **LLM Integration** for explanation generation
- **CORS Support** for React frontend

### Frontend (React)
- **React 18** with modern hooks and functional components
- **Material-UI** for beautiful, consistent design
- **React Router** for client-side navigation
- **Context API** for state management
- **Axios** for API communication

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### 1. Clone and Setup Backend

```bash
# Extract the ZIP file
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Optional: Set environment variables
export FLASK_ENV=development
export OPENAI_API_KEY=your-key-here  # Optional

# Start backend server
python app.py
```

Backend will run on `http://localhost:5000`

### 2. Setup and Start Frontend

```bash
# In a new terminal
cd frontend

# Install dependencies  
npm install

# Start development server
npm start
```

Frontend will run on `http://localhost:3000`

### 3. Access the Application

Open your browser and visit:
- **Main App**: http://localhost:3000
- **API Health**: http://localhost:5000/api/health

## 📁 Project Structure

```
ecommerce_recommender_separated/
├── backend/                 # Flask API server
│   ├── app.py              # Main Flask application
│   ├── config.py           # Configuration settings
│   ├── requirements.txt    # Python dependencies
│   ├── models/             # Database models
│   ├── routes/             # API endpoints
│   ├── services/           # Business logic
│   └── README.md           # Backend documentation
├── frontend/               # React application  
│   ├── public/             # Static assets
│   ├── src/                # React source code
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Main page components
│   │   ├── services/       # API communication
│   │   └── context/        # State management
│   ├── package.json        # Node dependencies
│   └── README.md           # Frontend documentation  
└── README.md               # This file
```

## 🎮 How to Use

### 1. Select a User Profile
- Choose from 5 pre-populated user profiles
- Each user has different preferences and interaction history

### 2. Browse Products
- Explore the product catalog
- Use search and category filters
- View product details and ratings

### 3. Interact with Products
- Rate products (1-5 stars)
- Add products to favorites
- System tracks all interactions automatically

### 4. Get Recommendations
- View AI-powered product recommendations
- Read explanations for each recommendation
- Generate fresh recommendations anytime

### 5. Monitor Your Activity
- Check the dashboard for your statistics
- View interaction breakdowns and preferences
- Track your recent activity

## 🔧 API Endpoints

### Products
- `GET /api/products/` - Get all products with filtering
- `GET /api/products/{id}` - Get specific product details
- `POST /api/products/interact` - Record user interaction

### Users  
- `GET /api/users/` - Get all users
- `GET /api/users/{id}/stats` - Get detailed user statistics

### Recommendations
- `GET /api/recommendations/{user_id}` - Get user recommendations
- `POST /api/recommendations/{user_id}/generate` - Generate fresh recommendations

## 🧠 Recommendation Algorithms

### Collaborative Filtering
- Analyzes user behavior patterns
- Finds users with similar preferences
- Recommends products liked by similar users

### Content-Based Filtering  
- Analyzes product features and categories
- Matches products to user's past interactions
- Recommends similar products to ones user liked

### Hybrid Approach
- Combines collaborative and content-based methods
- Weights different algorithms for optimal results
- Provides diverse and accurate recommendations

### Popularity-Based
- Fallback for new users with limited interactions
- Recommends trending and highly-rated products
- Helps users discover popular items

## 🎨 Customization

### Adding New Products
Modify `backend/models/database.py` to add more products to the sample data.

### Modifying Recommendation Logic
Update `backend/services/recommendation_engine.py` to adjust:
- Scoring weights
- Similarity calculations  
- Algorithm combinations

### Customizing UI Theme
Modify the Material-UI theme in `frontend/src/App.js` to change:
- Color palette
- Typography
- Component styling

## 🚀 Production Deployment

### Backend
```bash
# Use Gunicorn for production
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Frontend  
```bash
# Build for production
npm run build
# Serve static files with nginx or similar
```

### Environment Variables
- Set `FLASK_ENV=production`
- Configure proper database (PostgreSQL recommended)
- Set up HTTPS and security headers
- Use environment-specific API URLs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is for educational and demonstration purposes. Feel free to modify and extend for your needs.

## 📞 Support

For issues or questions:
1. Check the README files in backend/ and frontend/ directories
2. Review the API documentation
3. Check browser console for frontend errors
4. Monitor Flask console for backend errors

---

Built with ❤️ using React, Flask, and AI-powered recommendations
