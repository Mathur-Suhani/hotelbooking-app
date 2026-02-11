Hotel Booking & Comparison Platform
A full-stack hotel booking application with advanced search, comparison features, and data visualization built with React and Node.js.
Features

User Authentication: Secure login/signup flow using Supabase
Hotel Search: Real-time hotel availability search via Amadeus API
Advanced Filtering: Filter by date range, location, guests, price, and ratings
Multi-Select Comparison: Select and compare multiple hotels side-by-side
Data Visualization: Interactive charts showing price trends and rating distributions
Pagination: Efficient data loading with "Load More" functionality
Persistent State: User selections saved in local storage
Responsive Design: Mobile-friendly UI built with Material-UI

Tech Stack
Frontend

React 18+ with Hooks
Redux Toolkit for state management
Material-UI (MUI) for UI components
Recharts for data visualization
Supabase for authentication
React Router for navigation

Backend

Node.js with Express
Amadeus API for hotel data
Axios for HTTP requests
CORS for cross-origin resource sharing

Prerequisites
Before you begin, ensure you have the following installed:

Node.js (v16 or higher)
npm (v8 or higher)
Git

You'll also need API credentials from:

Amadeus for Developers - Get your API Key and Secret
Supabase - Create a project and get your URL and Anon Key

Installation & Setup

1. Clone the Repository
    git clone https://github.com/yourusername/hotel-booking-platform.git
    cd hotel-booking-platform

2. Backend Setup
    Navigate to the backend directory and install dependencies:
    bashcd backend
    npm init -y
    npm install express axios cors dotenv
    npm install amadeus

    a. Configure Environment Variables
    Create a .env file in the backend directory:
    env# Amadeus API Credentials
    AMADEUS_API_KEY=your_amadeus_api_key
    AMADEUS_API_SECRET=your_amadeus_api_secret
    # Server Configuration
    PORT=5000

    b. Start the Backend Server
    node index.js
    The backend server will run on http://localhost:5000

3. Frontend Setup
    Open a new terminal and navigate to the frontend directory:
    bashcd frontend
    Install Dependencies
    bash# Core dependencies
    npm install

    # Supabase for authentication
    npm install @supabase/supabase-js

    # Data visualization
    npm install recharts

    # Material-UI components
    npm install @mui/material @emotion/react @emotion/styled
    npm install @mui/icons-material

    # State management
    npm install @reduxjs/toolkit react-redux

    # Routing
    npm install react-router-dom

    a. Configure Environment Variables
    Create a . supabaseClientfile in the frontend directory:
    Supabase Configuration
    REACT_APP_SUPABASE_URL=your_supabase_project_url
    REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

    # Backend API URL
    REACT_APP_API_URL=http://localhost:5000
    Start the Frontend Application
    npm start

The application will open in your browser at http://localhost:3000
Project Structure
hotelbooking-app/
|
+-- backend/
|   +-- node_modules/
|   +-- .env
|   +-- amadeus.js
|   +-- index.js
|   +-- package-lock.json
|   +-- package.json
|
+-- frontend/
|   +-- node_modules/
|   +-- public/
|   +-- src/
|   |   +-- api/
|   |   |   +-- amadeus.js
|   |   +-- auth/
|   |   |   +-- login.jsx
|   |   +-- components/
|   |   |   +-- compare.jsx
|   |   |   +-- hotelCard.jsx
|   |   |   +-- hotelSearch.jsx
|   |   +-- pages/
|   |   |   +-- Dashboard.jsx
|   |   +-- redux/
|   |   |   +-- hotelSlice.js
|   |   |   +-- store.js
|   |   |   +-- userSlice.js
|   |   +-- routes/
|   |   |   +-- ProtectedRoute.jsx
|   |   +-- App.css
|   |   +-- App.js
|   |   +-- App.test.js
|   |   +-- index.css
|   |   +-- index.js
|   |   +-- logo.svg
|   |   +-- reportWebVitals.js
|   |   +-- setupTests.js
|   |   +-- supabaseClient.js
|   +-- .gitignore
|   +-- package-lock.json
|   +-- package.json
|   +-- README.md
|
+-- .gitignore
+-- README.md


Key Features Explained
1. Authentication Flow

Users can sign up or log in using Supabase authentication
JWT tokens are stored securely and included in API requests
Protected routes require authentication

2. Hotel Search & Filtering

Search hotels by city code (e.g., PAR for Paris)
Filter by date range, number of guests, price range
Results are paginated with "Load More" functionality

3. Multi-Hotel Comparison

Select multiple hotels from search results
Click "Compare" to view side-by-side comparison
Interactive charts show:

Price trends across selected hotels
Rating distribution
Distance from city center comparison
Quick summary of comparison

4. State Management

Redux Toolkit for global state management
Local storage persistence for:

Selected hotels for comparison
Search filters
User preferences

5. Data Visualization

Recharts library for responsive charts
Bar charts for price comparison
Pie charts for rating distribution
Line charts for price trends

Deployment
Backend Deployment (Railway/Render)

# Install Railway CLI
npm install -g @railway/cli
# Login to Railway
railway login
# Initialize project
railway init
# Deploy
railway up

Frontend Deployment (Vercel)

# Install Vercel CLI:
npm install -g vercel
# Deploy:
cd frontend
vercel


Configuration
# Amadeus API Setup

Go to [Amadeus Developers Portal](https://developers.amadeus.com/)
Create an account and get your API credentials
Copy the API Key and Secret to your .env file

# Supabase Setup

Create a project at [Supabase](https://supabase.com/)
Go to Settings > API
Copy the Project URL and Anon Key
Add them to your frontend .supabase file

# Usage

Sign Up / Login: Create an account or login with existing credentials
Search Hotels: Enter city, dates, and number of guests
Apply Filters: Narrow results by price, rating, amenities
Select Hotels: Click checkboxes to select hotels for comparison
Compare: Click "Compare Selected" button
View Charts: Analyze price trends and ratings visually
Book: (Future feature) Proceed to booking