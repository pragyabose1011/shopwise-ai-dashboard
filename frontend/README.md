# E-commerce Recommender - React Frontend

A modern React application for the e-commerce product recommendation system.

## Features

- **Modern React 18** with hooks and functional components
- **Material-UI** for beautiful, responsive design
- **React Router** for client-side navigation  
- **Axios** for API communication
- **User Context** for state management
- **Responsive Design** that works on all devices

## Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start Development Server

```bash
npm start
```

The app will be available at `http://localhost:3000`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navigation.js    # App navigation bar
│   ├── ProductCard.js   # Product display card
│   └── UserSelector.js  # User selection dropdown
├── pages/              # Main page components
│   ├── Home.js         # Landing page
│   ├── Products.js     # Product catalog
│   ├── Recommendations.js # AI recommendations
│   └── Dashboard.js    # User analytics
├── services/           # API communication
│   └── api.js          # Axios setup and API calls
├── context/            # React context providers
│   └── UserContext.js  # User state management
├── App.js              # Main app component
└── index.js            # App entry point
```

## Key Components

### Pages
- **Home**: Landing page with features overview and user selection
- **Products**: Product catalog with search and filtering
- **Recommendations**: Personalized AI-powered recommendations
- **Dashboard**: User analytics and activity tracking

### Components  
- **ProductCard**: Interactive product display with rating and favoriting
- **UserSelector**: Dropdown for switching between user profiles
- **Navigation**: App-wide navigation with current user display

### Context
- **UserContext**: Manages current user state and provides user data

### Services
- **API**: Axios-based service for all backend communication

## Features

### User Management
- Select from pre-populated user profiles
- Persistent user selection across page refreshes
- User-specific features and recommendations

### Product Interaction
- Browse products with search and category filtering
- Rate products (1-5 stars)
- Add products to favorites
- Track product views automatically

### AI Recommendations
- View personalized product recommendations
- See AI-generated explanations for each recommendation
- Generate fresh recommendations on demand
- Different recommendation algorithms (collaborative, content-based, hybrid)

### Analytics Dashboard  
- View interaction statistics
- See category preferences
- Track recent activity
- Monitor engagement metrics

## Configuration

The app automatically proxies API requests to the backend server running on port 5000.

For production:
- Update `REACT_APP_API_URL` environment variable
- Build the app with `npm run build`
- Serve static files from the `build/` directory

## Styling

The app uses Material-UI with a custom theme:
- Primary colors: Blue gradient (#667eea to #764ba2)
- Consistent spacing and typography
- Responsive breakpoints for mobile/desktop
- Hover effects and smooth transitions

## API Integration

The frontend communicates with the Flask backend through:
- RESTful API calls using Axios
- Error handling and loading states
- Real-time interaction tracking
- Automatic recommendation updates

## Development

Run in development mode:
```bash
npm start
```

Build for production:
```bash
npm run build
```

Run tests:
```bash
npm test
```
