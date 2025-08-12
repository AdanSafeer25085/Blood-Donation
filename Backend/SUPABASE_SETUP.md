# Supabase Setup Guide for Blood Donation System

## Prerequisites
1. Create a Supabase account at https://supabase.com
2. Create a new project in Supabase

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the following:
   - **Project URL** (looks like: https://xxxxx.supabase.co)
   - **Anon/Public Key** (a long JWT token)

## Step 2: Update Environment Variables

Update your `.env` file with your Supabase credentials:

```env
SUPABASE_URL=your_project_url_here
SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 3: Create Database Tables

1. Go to the SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `database/schema.sql`
3. Click "Run" to execute the SQL and create your tables

## Step 4: Configure Authentication (Optional but Recommended)

For better security, you can enable Supabase Auth:

1. Go to Authentication > Providers in your Supabase dashboard
2. Enable Email provider for email/password authentication
3. Configure email templates as needed

## Step 5: Test the Setup

1. Start the server:
   ```bash
   node server-supabase.js
   ```

2. Test the health endpoint:
   ```bash
   curl http://localhost:5000/health
   ```

## Step 6: Update Frontend API Calls

Make sure your frontend is pointing to the correct backend URL (http://localhost:5000)

## Database Schema

The system uses three main tables:

### Users Table
- `id`: Primary key
- `firstName`: User's first name
- `lastName`: User's last name
- `mobileNumber`: Contact number
- `email`: Unique email address
- `password`: Hashed password
- `location`: User's location
- `bloodGroup`: Blood type (A+, A-, B+, B-, AB+, AB-, O+, O-)
- `created_at`: Registration timestamp
- `updated_at`: Last update timestamp

### Reviews Table
- `id`: Primary key
- `donor_id`: Foreign key to users table
- `review`: Review text
- `created_at`: Review timestamp

### Blood Requests Table
- `id`: Primary key
- `name`: Requester's name
- `cnic`: 13-digit CNIC number
- `created_at`: Request timestamp

## API Endpoints

All endpoints remain the same as the original MySQL version:

- `GET /get-form-data` - Fetch all donors
- `POST /submit-form` - Register new user
- `POST /login` - User login
- `POST /submit-review` - Submit a review
- `GET /get-reviews/:donorId` - Get reviews for a donor
- `POST /submit-get-blood-form` - Submit blood request
- `POST /update-user-details` - Update user location/mobile
- `GET /search-donors` - Search donors by blood group/location
- `GET /health` - Health check

## Migrating from MySQL

To run both servers during migration:
- MySQL server: `node server.js` (port 5000)
- Supabase server: `node server-supabase.js` (change PORT in .env if needed)

## Security Notes

1. Row Level Security (RLS) is enabled on all tables
2. Use environment variables for sensitive data
3. Consider implementing rate limiting for production
4. Enable CORS for specific domains in production

## Troubleshooting

1. **Connection Error**: Check that your Supabase URL and API key are correct
2. **Table Not Found**: Make sure you've run the schema.sql in your Supabase SQL editor
3. **Permission Denied**: Check RLS policies in Supabase dashboard
4. **CORS Issues**: Update CORS_ORIGIN in .env file

## Additional Features with Supabase

Supabase provides additional features you can leverage:
- Real-time subscriptions for live updates
- Storage for profile pictures or documents
- Edge Functions for serverless computing
- Vector embeddings for advanced search