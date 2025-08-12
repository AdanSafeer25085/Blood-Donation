import React from 'react';
import { Link } from 'react-router-dom';

function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img
                  className="w-10 h-10 rounded-full mr-3"
                  src="/image/logo.png"
                  alt="Heart To Heart"
                />
                <h1 className="text-2xl font-bold text-gray-900">About Us</h1>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/register"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                Register as Donor
              </Link>
              <Link
                to="/login"
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Connecting Hearts, Saving Lives
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Heart To Heart is a revolutionary blood donation platform that connects donors with those in need, 
            making blood donation more accessible, efficient, and impactful than ever before.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              To create a world where no one suffers or dies due to lack of blood availability by building 
              the most comprehensive and user-friendly blood donation network.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Accessibility</h3>
              <p className="text-gray-600">
                Making blood donation accessible to everyone, anywhere, anytime through our digital platform.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Efficiency</h3>
              <p className="text-gray-600">
                Streamlining the donation process with real-time matching and automated scheduling.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Impact</h3>
              <p className="text-gray-600">
                Creating meaningful connections between donors and recipients, showing the real impact of every donation.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Register</h3>
              <p className="text-gray-600">Sign up as a blood donor with your basic information and blood type.</p>
            </div>

            <div className="text-center">
              <div className="bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Matched</h3>
              <p className="text-gray-600">Our system matches you with blood requests in your area based on compatibility.</p>
            </div>

            <div className="text-center">
              <div className="bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Donate</h3>
              <p className="text-gray-600">Visit the hospital or blood bank at your convenient time to make the donation.</p>
            </div>

            <div className="text-center">
              <div className="bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Save Lives</h3>
              <p className="text-gray-600">Track your donation impact and see how you've helped save lives in your community.</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Platform Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🔔 Real-time Notifications</h3>
              <p className="text-gray-600">Get instant alerts about urgent blood requests in your area.</p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">📊 Donation Tracking</h3>
              <p className="text-gray-600">Monitor your donation history and health metrics over time.</p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">📍 Location-based Matching</h3>
              <p className="text-gray-600">Find donation opportunities near you with our smart location system.</p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">📅 Smart Scheduling</h3>
              <p className="text-gray-600">Schedule donations based on your availability and health status.</p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🏥 Hospital Network</h3>
              <p className="text-gray-600">Connected with trusted hospitals and blood banks nationwide.</p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🔒 Privacy & Security</h3>
              <p className="text-gray-600">Your personal information is protected with industry-standard security.</p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-red-50 rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Impact</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-red-600 mb-2">10,000+</div>
              <div className="text-gray-700 font-medium">Registered Donors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-600 mb-2">25,000+</div>
              <div className="text-gray-700 font-medium">Successful Donations</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-600 mb-2">50,000+</div>
              <div className="text-gray-700 font-medium">Lives Saved</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-600 mb-2">100+</div>
              <div className="text-gray-700 font-medium">Partner Hospitals</div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Compassion</h3>
              <p className="text-gray-600">
                Every donation is driven by genuine care for human life and wellbeing.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600">
                Leveraging technology to solve age-old problems in blood donation and distribution.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">
                Building strong connections between donors, recipients, and healthcare providers.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Make a Difference?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of donors who are already making a difference in their communities. 
            Your donation could be the difference between life and death for someone in need.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/register"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Become a Donor
            </Link>
            <Link
              to="/blood-requests"
              className="bg-white hover:bg-gray-50 text-red-600 border-2 border-red-600 px-6 py-3 rounded-lg font-medium"
            >
              View Requests
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;