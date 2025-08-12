-- Enhanced Blood Requests Schema
-- Run this to update the blood_requests table with new fields

-- Drop the existing simple blood_requests table
DROP TABLE IF EXISTS blood_requests CASCADE;

-- Create enhanced blood_requests table
CREATE TABLE blood_requests (
  id SERIAL PRIMARY KEY,
  requester_id INTEGER REFERENCES users(id),
  patient_name VARCHAR(255),
  cnic VARCHAR(13),
  blood_group VARCHAR(5) NOT NULL,
  units_needed INTEGER DEFAULT 1,
  urgency VARCHAR(20) DEFAULT 'normal', -- normal, urgent, critical
  hospital VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  contact_number VARCHAR(20) NOT NULL,
  needed_by TIMESTAMP WITH TIME ZONE,
  description TEXT,
  requester_name VARCHAR(255) NOT NULL,
  relation_to_patient VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'active', -- active, fulfilled, cancelled, pending
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create donor_contacts table to track when requesters contact donors
CREATE TABLE IF NOT EXISTS donor_contacts (
  id SERIAL PRIMARY KEY,
  request_id INTEGER REFERENCES blood_requests(id) ON DELETE CASCADE,
  donor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  donor_name VARCHAR(255),
  contacted_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  status VARCHAR(20) DEFAULT 'sent' -- sent, responded, completed
);

-- Create request_responses table to track donor responses
CREATE TABLE IF NOT EXISTS request_responses (
  id SERIAL PRIMARY KEY,
  request_id INTEGER REFERENCES blood_requests(id) ON DELETE CASCADE,
  donor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  response_type VARCHAR(20) NOT NULL, -- willing, maybe, cannot
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security
ALTER TABLE blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE donor_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_responses ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blood_requests_blood_group ON blood_requests(blood_group);
CREATE INDEX IF NOT EXISTS idx_blood_requests_location ON blood_requests(location);
CREATE INDEX IF NOT EXISTS idx_blood_requests_status ON blood_requests(status);
CREATE INDEX IF NOT EXISTS idx_blood_requests_urgency ON blood_requests(urgency);
CREATE INDEX IF NOT EXISTS idx_blood_requests_requester_id ON blood_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_donor_contacts_request_id ON donor_contacts(request_id);
CREATE INDEX IF NOT EXISTS idx_donor_contacts_donor_id ON donor_contacts(donor_id);
CREATE INDEX IF NOT EXISTS idx_request_responses_request_id ON request_responses(request_id);
CREATE INDEX IF NOT EXISTS idx_request_responses_donor_id ON request_responses(donor_id);

-- RLS Policies for blood_requests
CREATE POLICY "Blood requests are viewable by everyone" 
ON blood_requests FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create blood requests" 
ON blood_requests FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own blood requests" 
ON blood_requests FOR UPDATE 
USING (requester_id IN (SELECT id FROM users WHERE email = auth.jwt() ->> 'email'));

CREATE POLICY "Users can delete their own blood requests" 
ON blood_requests FOR DELETE 
USING (requester_id IN (SELECT id FROM users WHERE email = auth.jwt() ->> 'email'));

-- RLS Policies for donor_contacts
CREATE POLICY "Donor contacts are viewable by everyone" 
ON donor_contacts FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create donor contacts" 
ON donor_contacts FOR INSERT 
WITH CHECK (true);

-- RLS Policies for request_responses
CREATE POLICY "Request responses are viewable by everyone" 
ON request_responses FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create request responses" 
ON request_responses FOR INSERT 
WITH CHECK (true);

-- Add trigger for blood_requests updated_at
CREATE TRIGGER update_blood_requests_updated_at BEFORE UPDATE ON blood_requests
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO blood_requests (
  patient_name, cnic, blood_group, units_needed, urgency, 
  hospital, location, contact_number, needed_by, 
  description, requester_name, relation_to_patient, status
) VALUES 
(
  'Ahmad Ali', '1234567890123', 'O+', 2, 'urgent',
  'Aga Khan University Hospital', 'Karachi, Pakistan', '03001234567',
  NOW() + INTERVAL '2 days',
  'Emergency surgery required for accident patient', 
  'Muhammad Hassan', 'Brother', 'active'
),
(
  'Fatima Khan', '9876543210987', 'B-', 1, 'critical',
  'Shaukat Khanum Memorial Hospital', 'Lahore, Pakistan', '03009876543',
  NOW() + INTERVAL '1 day',
  'Cancer patient needs immediate blood transfusion',
  'Ali Khan', 'Father', 'active'
),
(
  'Sara Ahmed', '1122334455667', 'AB+', 3, 'normal',
  'Services Hospital', 'Lahore, Pakistan', '03001122334',
  NOW() + INTERVAL '5 days',
  'Planned surgery for heart operation',
  'Ahmed Ali', 'Husband', 'active'
);