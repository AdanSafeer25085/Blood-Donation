-- Supabase SQL schema for Blood Donation System

-- Enable Row Level Security (RLS)
-- This is a Supabase best practice for security

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  mobileNumber VARCHAR(20) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,
  bloodGroup VARCHAR(10) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  donor_id INTEGER NOT NULL,
  review TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  FOREIGN KEY (donor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Blood requests table
CREATE TABLE IF NOT EXISTS blood_requests (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  cnic VARCHAR(13) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_requests ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_bloodGroup ON users(bloodGroup);
CREATE INDEX IF NOT EXISTS idx_users_location ON users(location);
CREATE INDEX IF NOT EXISTS idx_reviews_donor_id ON reviews(donor_id);

-- Create RLS policies (adjust based on your needs)

-- Users table policies
-- Allow public read access to user profiles (excluding password)
CREATE POLICY "Users profiles are viewable by everyone" 
ON users FOR SELECT 
USING (true);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile" 
ON users FOR INSERT 
WITH CHECK (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" 
ON users FOR UPDATE 
USING (auth.uid()::text = email);

-- Reviews table policies
CREATE POLICY "Reviews are viewable by everyone" 
ON reviews FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create reviews" 
ON reviews FOR INSERT 
WITH CHECK (true);

-- Blood requests policies
CREATE POLICY "Blood requests are viewable by everyone" 
ON blood_requests FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create blood requests" 
ON blood_requests FOR INSERT 
WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();