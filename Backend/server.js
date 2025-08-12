require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const winston = require("winston");
const jwt = require("jsonwebtoken");
const supabase = require("./config/supabase");

const app = express();

// Middleware
app.use(express.json());

// Configure CORS to allow multiple origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://blood-donation-flame.vercel.app', // Your actual Vercel domain
  'https://blood-donation-frontend.vercel.app', // Alternative frontend domain
  'https://blood-donation-frontend.netlify.app', // Alternative frontend domain
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Logger setup
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.Console(),
  ],
});

// Test Supabase connection
async function testConnection() {
  try {
    const { data, error } = await supabase.from("users").select("count").single();
    if (error && error.code !== "PGRST116") {
      logger.error("Supabase connection error:", error);
    } else {
      logger.info("Connected to Supabase!");
    }
  } catch (err) {
    logger.error("Could not connect to Supabase:", err);
  }
}

testConnection();

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// API to fetch all donors
app.get("/get-form-data", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select('id, "firstName", "lastName", "mobileNumber", email, location, "bloodGroup", created_at');

    if (error) {
      logger.error("Error fetching donors:", error);
      return res.status(500).json({ error: "Failed to fetch donors" });
    }

    res.json(data || []);
  } catch (err) {
    logger.error("Error in get-form-data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API to submit form data (Registration)
app.post("/submit-form", async (req, res) => {
  const { firstName, lastName, mobileNumber, email, password, location, bloodGroup } = req.body;

  if (!firstName || !lastName || !mobileNumber || !email || !password || !location || !bloodGroup) {
    logger.error("Validation error: Missing fields");
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    logger.info("Password hashed successfully");

    // Insert user into Supabase
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          "firstName": firstName,
          "lastName": lastName,
          "mobileNumber": mobileNumber,
          email: email,
          password: hashedPassword,
          location: location,
          "bloodGroup": bloodGroup,
        },
      ])
      .select()
      .single();

    if (error) {
      logger.error("Database error:", error);
      return res.status(500).json({ error: "Failed to save form data." });
    }

    logger.info("Form data saved successfully");
    res.status(200).json({ message: "Data saved successfully!", user: data });
  } catch (error) {
    logger.error("Error in form submission process:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Login API
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    logger.error("Validation error: Missing email or password");
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    // Fetch user from Supabase
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      logger.info("User not found");
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      logger.info("Invalid password for user:", email);
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      message: "Login successful",
      user: userWithoutPassword,
      token,
    });

    logger.info("User logged in successfully:", email);
  } catch (error) {
    logger.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// API to submit a review
app.post("/submit-review", async (req, res) => {
  const { donorId, review } = req.body;

  if (!donorId || !review) {
    logger.error("Validation error: Missing donorId or review");
    return res.status(400).json({ error: "Donor ID and review are required." });
  }

  try {
    const { data, error } = await supabase
      .from("reviews")
      .insert([{ donor_id: donorId, review }])
      .select()
      .single();

    if (error) {
      logger.error("Error inserting review:", error);
      return res.status(500).json({ error: "Failed to save review" });
    }

    logger.info("Review saved successfully");
    res.status(200).json({ message: "Review saved successfully!", review: data });
  } catch (err) {
    logger.error("Error in submit-review:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API to fetch reviews for a specific donor
app.get("/get-reviews/:donorId", async (req, res) => {
  const donorId = req.params.donorId;

  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("donor_id", donorId)
      .order("created_at", { ascending: false });

    if (error) {
      logger.error("Error fetching reviews:", error);
      return res.status(500).json({ error: "Failed to fetch reviews" });
    }

    res.json(data || []);
  } catch (err) {
    logger.error("Error in get-reviews:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API to submit "Get Blood" form data
app.post("/submit-get-blood-form", async (req, res) => {
  const { name, cnic } = req.body;

  if (!name || !cnic) {
    return res.status(400).json({ error: "Name and CNIC are required." });
  }

  if (!/^\d{13}$/.test(cnic)) {
    return res.status(400).json({ error: "CNIC must be a 13-digit number." });
  }

  try {
    const { data, error } = await supabase
      .from("blood_requests")
      .insert([{ name, cnic }])
      .select()
      .single();

    if (error) {
      logger.error("Error inserting blood request data:", error);
      return res.status(500).json({ error: "Failed to submit blood request." });
    }

    res.status(200).json({ 
      message: "Blood request submitted successfully!",
      request: data 
    });
  } catch (err) {
    logger.error("Error in submit-get-blood-form:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API to update user details (location and mobile number)
app.post("/update-user-details", async (req, res) => {
  const { userId, location, mobileNumber } = req.body;

  if (!userId || !location || !mobileNumber) {
    return res.status(400).json({ 
      error: "User ID, location, and mobile number are required." 
    });
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .update({ location: location, "mobileNumber": mobileNumber })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      logger.error("Error updating user details:", error);
      
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "User not found." });
      }
      
      return res.status(500).json({ error: "Failed to update user details." });
    }

    res.status(200).json({ 
      message: "User details updated successfully!",
      user: data 
    });
  } catch (err) {
    logger.error("Error in update-user-details:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API to search donors by blood group and/or location
app.get("/search-donors", async (req, res) => {
  const { bloodGroup, location } = req.query;

  try {
    let query = supabase
      .from("users")
      .select('id, "firstName", "lastName", "mobileNumber", email, location, "bloodGroup"');

    if (bloodGroup) {
      query = query.eq('"bloodGroup"', bloodGroup);
    }

    if (location) {
      query = query.ilike("location", `%${location}%`);
    }

    const { data, error } = await query;

    if (error) {
      logger.error("Error searching donors:", error);
      return res.status(500).json({ error: "Failed to search donors" });
    }

    res.json(data || []);
  } catch (err) {
    logger.error("Error in search-donors:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Dashboard APIs

// Get user statistics
app.get("/user-stats/:userId", async (req, res) => {
  const { userId } = req.params;
  
  try {
    // Mock data for now - replace with actual database queries
    const stats = {
      totalDonations: Math.floor(Math.random() * 10) + 1,
      livesImpacted: (Math.floor(Math.random() * 10) + 1) * 3,
      nextEligibleDate: null,
      currentStreak: Math.floor(Math.random() * 5) + 1,
      totalPoints: (Math.floor(Math.random() * 10) + 1) * 100,
      achievements: ['First Drop', 'Life Saver']
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: "Failed to fetch user statistics" });
  }
});

// Get user donations
app.get("/user-donations/:userId", async (req, res) => {
  const { userId } = req.params;
  
  try {
    // Mock data for now
    const donations = [
      {
        id: 1,
        date: '2024-12-01',
        status: 'completed',
        hospital: 'City General Hospital',
        volume: 450,
        points: 100,
        livesSaved: 3
      },
      {
        id: 2,
        date: '2024-12-15',
        status: 'scheduled',
        hospital: 'Regional Medical Center',
        volume: 450
      }
    ];
    
    res.json(donations);
  } catch (error) {
    console.error('Error fetching user donations:', error);
    res.status(500).json({ error: "Failed to fetch donation history" });
  }
});

// Get blood requests
app.get("/blood-requests", async (req, res) => {
  try {
    // Mock data for now
    const requests = [
      {
        id: 1,
        bloodType: 'O+',
        priority: 'urgent',
        location: 'Karachi, Pakistan',
        hospital: 'Aga Khan Hospital',
        unitsNeeded: 2,
        createdAt: new Date(),
        message: 'Emergency surgery required'
      },
      {
        id: 2,
        bloodType: 'AB-',
        priority: 'critical',
        location: 'Lahore, Pakistan',
        hospital: 'Shaukat Khanum Hospital',
        unitsNeeded: 1,
        createdAt: new Date(),
        message: 'Cancer patient needs immediate transfusion'
      }
    ];
    
    res.json(requests);
  } catch (error) {
    console.error('Error fetching blood requests:', error);
    res.status(500).json({ error: "Failed to fetch blood requests" });
  }
});

// Get donation centers
app.get("/donation-centers", async (req, res) => {
  try {
    const centers = [
      {
        id: 1,
        name: 'City General Hospital',
        location: 'Downtown, Karachi',
        distance: '2.5 km',
        rating: 4.8,
        reviews: 156
      },
      {
        id: 2,
        name: 'Regional Medical Center',
        location: 'North Karachi',
        distance: '5.2 km',
        rating: 4.6,
        reviews: 89
      }
    ];
    
    res.json(centers);
  } catch (error) {
    console.error('Error fetching donation centers:', error);
    res.status(500).json({ error: "Failed to fetch donation centers" });
  }
});

// Get nearby donors
app.get("/nearby-donors", async (req, res) => {
  const { location, bloodType, distance } = req.query;
  
  try {
    // Mock data for now
    const donors = [
      {
        id: 1,
        firstName: 'Ahmed',
        lastName: 'Khan',
        bloodGroup: 'O+',
        location: 'Karachi, Pakistan',
        distance: 3.2,
        totalDonations: 8,
        rating: 4.9,
        reviews: 12,
        available: true,
        verified: true
      },
      {
        id: 2,
        firstName: 'Fatima',
        lastName: 'Ali',
        bloodGroup: 'A+',
        location: 'Lahore, Pakistan',
        distance: 1.8,
        totalDonations: 15,
        rating: 5.0,
        reviews: 25,
        available: false,
        verified: true
      }
    ];
    
    res.json(donors);
  } catch (error) {
    console.error('Error fetching nearby donors:', error);
    res.status(500).json({ error: "Failed to fetch nearby donors" });
  }
});

// Check donation eligibility
app.get("/check-eligibility/:userId", async (req, res) => {
  const { userId } = req.params;
  
  try {
    // Mock eligibility check
    const eligibility = {
      eligible: true,
      message: "You are eligible to donate blood. Your last donation was 60 days ago.",
      nextEligibleDate: null
    };
    
    res.json(eligibility);
  } catch (error) {
    console.error('Error checking eligibility:', error);
    res.status(500).json({ error: "Failed to check eligibility" });
  }
});

// Get available time slots
app.get("/available-slots", async (req, res) => {
  const { date, hospital } = req.query;
  
  try {
    const slots = [
      { time: '09:00 AM', available: true },
      { time: '10:00 AM', available: false },
      { time: '11:00 AM', available: true },
      { time: '02:00 PM', available: true },
      { time: '03:00 PM', available: true },
      { time: '04:00 PM', available: false }
    ];
    
    res.json(slots);
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({ error: "Failed to fetch available slots" });
  }
});

// Schedule donation
app.post("/schedule-donation", async (req, res) => {
  const { donorId, date, time, hospitalId } = req.body;
  
  try {
    // Mock scheduling
    const appointment = {
      id: Date.now(),
      donorId,
      date,
      time,
      hospitalId,
      status: 'scheduled'
    };
    
    res.json({ success: true, appointment });
  } catch (error) {
    console.error('Error scheduling donation:', error);
    res.status(500).json({ error: "Failed to schedule donation" });
  }
});

// Get notifications
app.get("/notifications/:userId", async (req, res) => {
  const { userId } = req.params;
  
  try {
    const notifications = [
      {
        id: 1,
        type: 'urgent',
        title: 'Urgent Blood Request Nearby',
        message: 'A patient at City Hospital needs O+ blood urgently.',
        time: '2 hours ago',
        read: false
      }
    ];
    
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// ===== NEW ENHANCED BLOOD REQUEST ENDPOINTS =====

// Submit a new blood request
app.post("/submit-blood-request", async (req, res) => {
  try {
    const {
      patientName,
      cnic,
      bloodGroup,
      unitsNeeded,
      urgency,
      hospital,
      location,
      contactNumber,
      neededBy,
      description,
      requesterName,
      relationToPatient
    } = req.body;

    // Validate required fields
    if (!bloodGroup || !hospital || !location || !contactNumber || !requesterName || !relationToPatient) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data, error } = await supabase
      .from('blood_requests')
      .insert({
        patient_name: patientName || 'Anonymous Patient',
        cnic: cnic || null,
        blood_group: bloodGroup,
        units_needed: unitsNeeded || 1,
        urgency: urgency || 'normal',
        hospital: hospital,
        location: location,
        contact_number: contactNumber,
        needed_by: neededBy || null,
        description: description || null,
        requester_name: requesterName,
        relation_to_patient: relationToPatient,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      logger.error("Error creating blood request:", error);
      return res.status(500).json({ error: "Failed to create blood request" });
    }

    logger.info("Blood request created successfully:", data.id);
    res.status(201).json({ 
      message: "Blood request submitted successfully", 
      requestId: data.id,
      request: data
    });

  } catch (error) {
    logger.error("Error in submit-blood-request:", error);
    res.status(500).json({ error: "Failed to submit blood request" });
  }
});

// Get user's own blood requests
app.get("/my-blood-requests/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from('blood_requests')
      .select('*')
      .eq('requester_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error("Error fetching user blood requests:", error);
      return res.status(500).json({ error: "Failed to fetch blood requests" });
    }

    res.json(data || []);
  } catch (error) {
    logger.error("Error in my-blood-requests:", error);
    res.status(500).json({ error: "Failed to fetch blood requests" });
  }
});

// Update blood request status
app.put("/update-request-status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'fulfilled', 'cancelled', 'pending'].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const { data, error } = await supabase
      .from('blood_requests')
      .update({ status: status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error("Error updating request status:", error);
      return res.status(500).json({ error: "Failed to update request status" });
    }

    res.json({ message: "Request status updated successfully", request: data });
  } catch (error) {
    logger.error("Error in update-request-status:", error);
    res.status(500).json({ error: "Failed to update request status" });
  }
});

// Delete blood request
app.delete("/delete-blood-request/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('blood_requests')
      .delete()
      .eq('id', id);

    if (error) {
      logger.error("Error deleting blood request:", error);
      return res.status(500).json({ error: "Failed to delete blood request" });
    }

    res.json({ message: "Blood request deleted successfully" });
  } catch (error) {
    logger.error("Error in delete-blood-request:", error);
    res.status(500).json({ error: "Failed to delete blood request" });
  }
});

// Contact donor (track contact attempt)
app.post("/contact-donor", async (req, res) => {
  try {
    const { requestId, donorId, donorName } = req.body;

    const { data, error } = await supabase
      .from('donor_contacts')
      .insert({
        request_id: requestId,
        donor_id: donorId,
        donor_name: donorName,
        status: 'sent'
      })
      .select()
      .single();

    if (error) {
      logger.error("Error recording donor contact:", error);
      return res.status(500).json({ error: "Failed to record contact" });
    }

    res.json({ message: "Donor contact recorded successfully", contact: data });
  } catch (error) {
    logger.error("Error in contact-donor:", error);
    res.status(500).json({ error: "Failed to contact donor" });
  }
});

// Get public blood requests (for the public blood requests page)
app.get("/blood-requests-public", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blood_requests')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error("Error fetching public blood requests:", error);
      return res.status(500).json({ error: "Failed to fetch blood requests" });
    }

    // Transform data to match expected format
    const formattedData = data.map(request => ({
      id: request.id,
      patientName: request.patient_name,
      bloodGroup: request.blood_group,
      unitsNeeded: request.units_needed,
      urgency: request.urgency,
      hospital: request.hospital,
      location: request.location,
      contactNumber: request.contact_number,
      neededBy: request.needed_by,
      description: request.description,
      createdAt: request.created_at
    }));

    res.json(formattedData);
  } catch (error) {
    logger.error("Error in blood-requests-public:", error);
    res.status(500).json({ error: "Failed to fetch public blood requests" });
  }
});

// Respond to blood request (donor response)
app.post("/respond-to-request/:requestId", async (req, res) => {
  try {
    const { requestId } = req.params;
    const { donorId, responseType, message } = req.body;

    if (!['willing', 'maybe', 'cannot'].includes(responseType)) {
      return res.status(400).json({ error: "Invalid response type" });
    }

    const { data, error } = await supabase
      .from('request_responses')
      .insert({
        request_id: requestId,
        donor_id: donorId,
        response_type: responseType,
        message: message || null
      })
      .select()
      .single();

    if (error) {
      logger.error("Error recording request response:", error);
      return res.status(500).json({ error: "Failed to record response" });
    }

    res.json({ message: "Response recorded successfully", response: data });
  } catch (error) {
    logger.error("Error in respond-to-request:", error);
    res.status(500).json({ error: "Failed to respond to request" });
  }
});

// Update the existing blood-requests endpoint to use real data
app.get("/blood-requests", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blood_requests')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error("Error fetching blood requests:", error);
      return res.status(500).json({ error: "Failed to fetch blood requests" });
    }

    // Transform to match existing format expected by dashboard
    const formattedData = data.map(request => ({
      id: request.id,
      patientName: request.patient_name,
      bloodType: request.blood_group,
      priority: request.urgency,
      location: request.location,
      hospital: request.hospital,
      unitsNeeded: request.units_needed,
      contactNumber: request.contact_number,
      createdAt: request.created_at,
      message: request.description,
      deadline: request.needed_by
    }));

    res.json(formattedData);
  } catch (error) {
    logger.error("Error in blood-requests:", error);
    res.status(500).json({ error: "Failed to fetch blood requests" });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});