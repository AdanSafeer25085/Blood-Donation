# Blood Donation System

A full-stack blood donation management system built with React and Node.js, powered by Supabase.

## Tech Stack

- **Frontend**: React, Tailwind CSS, Axios
- **Backend**: Node.js, Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT

## Prerequisites

- Node.js v20+
- Supabase account and project

## Quick Start

### Backend Setup

1. Navigate to backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```
The backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd my-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the application:
```bash
npm start
```
The frontend will run on http://localhost:3000

## Environment Variables

Backend `.env` file:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=5000
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=your_jwt_secret
```

## Features

- User registration and authentication
- Blood donor management
- Blood request submission
- Donor search by blood group and location
- Review system for donors
- User profile updates

## API Endpoints

- `GET /get-form-data` - Fetch all donors
- `POST /submit-form` - Register new user
- `POST /login` - User login
- `POST /submit-review` - Submit donor review
- `GET /get-reviews/:donorId` - Get reviews for a donor
- `POST /submit-get-blood-form` - Submit blood request
- `POST /update-user-details` - Update user profile
- `GET /search-donors` - Search donors
- `GET /health` - Health check