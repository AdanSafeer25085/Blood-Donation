import React, { useState, useEffect } from 'react';

function DashboardStats({ user }) {
  const [stats, setStats] = useState({
    totalDonations: 0,
    livesImpacted: 0,
    nextEligibleDate: null,
    currentStreak: 0,
    totalPoints: 0,
    achievements: []
  });

  useEffect(() => {
    fetchUserStats();
  }, [user.id]);

  const fetchUserStats = async () => {
    try {
      const response = await fetch(`http://localhost:5000/user-stats/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
      
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-6 rounded-xl mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Thank you for saving lives, {user.firstName}! 🩸
            </h3>
            <p className="opacity-90">
              Your blood type {user.bloodGroup} can help save up to 3 lives per donation
            </p>
          </div>
          <div className="text-6xl opacity-80">❤️</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Donations</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalDonations}</p>
            </div>
            <div className="text-2xl">🩸</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Lives Impacted</p>
              <p className="text-3xl font-bold text-green-600">{stats.livesImpacted}</p>
            </div>
            <div className="text-2xl">👥</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Current Streak</p>
              <p className="text-3xl font-bold text-orange-600">{stats.currentStreak}</p>
            </div>
            <div className="text-2xl">🔥</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Hero Points</p>
              <p className="text-3xl font-bold text-purple-600">{stats.totalPoints}</p>
            </div>
            <div className="text-2xl">⭐</div>
          </div>
        </div>
      </div>

      {/* Eligibility Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation Eligibility</h3>
          {stats.nextEligibleDate ? (
            <div>
              <p className="text-sm text-gray-500 mb-2">Next eligible date:</p>
              <p className="text-xl font-bold text-blue-600">{stats.nextEligibleDate}</p>
              <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  💡 Remember to wait at least 56 days between donations for your safety
                </p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-lg font-bold text-green-600 mb-2">✅ Eligible to donate now!</p>
              <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                Schedule Donation
              </button>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Blood Compatibility</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-700">You can donate to:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {getCompatibleRecipients(user.bloodGroup).map((type) => (
                  <span key={type} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                    {type}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">You can receive from:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {getCompatibleDonors(user.bloodGroup).map((type) => (
                  <span key={type} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl mr-3">🩸</div>
            <div>
              <p className="font-medium text-gray-900">Last donation: December 1, 2024</p>
              <p className="text-sm text-gray-500">City Hospital - 450ml donated</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl mr-3">🏆</div>
            <div>
              <p className="font-medium text-gray-900">Achievement unlocked: Life Saver</p>
              <p className="text-sm text-gray-500">5 successful donations completed</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl mr-3">📱</div>
            <div>
              <p className="font-medium text-gray-900">Emergency request helped</p>
              <p className="text-sm text-gray-500">AB+ blood needed - You responded!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions for blood compatibility
function getCompatibleRecipients(bloodType) {
  const compatibility = {
    'A+': ['A+', 'AB+'],
    'A-': ['A+', 'A-', 'AB+', 'AB-'],
    'B+': ['B+', 'AB+'],
    'B-': ['B+', 'B-', 'AB+', 'AB-'],
    'AB+': ['AB+'],
    'AB-': ['AB+', 'AB-'],
    'O+': ['A+', 'B+', 'AB+', 'O+'],
    'O-': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  };
  return compatibility[bloodType] || [];
}

function getCompatibleDonors(bloodType) {
  const compatibility = {
    'A+': ['A+', 'A-', 'O+', 'O-'],
    'A-': ['A-', 'O-'],
    'B+': ['B+', 'B-', 'O+', 'O-'],
    'B-': ['B-', 'O-'],
    'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    'AB-': ['A-', 'B-', 'AB-', 'O-'],
    'O+': ['O+', 'O-'],
    'O-': ['O-']
  };
  return compatibility[bloodType] || [];
}

export default DashboardStats;