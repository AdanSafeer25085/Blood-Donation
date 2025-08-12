import React, { useState, useEffect } from 'react';

function DonationHistory({ user }) {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, completed, scheduled, cancelled

  useEffect(() => {
    fetchDonationHistory();
  }, [user.id]);

  const fetchDonationHistory = async () => {
    try {
      const response = await fetch(`http://localhost:5000/user-donations/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setDonations(data);
      }
    } catch (error) {
      console.error('Error fetching donation history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDonations = donations.filter(donation => 
    filter === 'all' || donation.status === filter
  );

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Donations</h2>
        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
          + Schedule New Donation
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 w-fit">
        {[
          { key: 'all', label: 'All' },
          { key: 'completed', label: 'Completed' },
          { key: 'scheduled', label: 'Scheduled' },
          { key: 'cancelled', label: 'Cancelled' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === tab.key
                ? 'bg-white text-red-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="text-green-600 text-2xl mr-3">✅</div>
            <div>
              <p className="text-sm font-medium text-green-600">Completed</p>
              <p className="text-2xl font-bold text-green-900">
                {donations.filter(d => d.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="text-blue-600 text-2xl mr-3">📅</div>
            <div>
              <p className="text-sm font-medium text-blue-600">Scheduled</p>
              <p className="text-2xl font-bold text-blue-900">
                {donations.filter(d => d.status === 'scheduled').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="text-purple-600 text-2xl mr-3">📊</div>
            <div>
              <p className="text-sm font-medium text-purple-600">Total Volume</p>
              <p className="text-2xl font-bold text-purple-900">
                {donations.filter(d => d.status === 'completed').length * 450}ml
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Donations List */}
      <div className="space-y-4">
        {filteredDonations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🩸</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No donations found</h3>
            <p className="text-gray-500 mb-4">
              {filter === 'all' 
                ? "You haven't made any donations yet. Start your journey as a life-saver!"
                : `No ${filter} donations found.`}
            </p>
            <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium">
              Schedule Your First Donation
            </button>
          </div>
        ) : (
          filteredDonations.map((donation) => (
            <div key={donation.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 mr-3">
                      {donation.hospital || 'City General Hospital'}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                      {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <span className="mr-2">📅</span>
                      <span>Date: {new Date(donation.date || Date.now()).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">⏰</span>
                      <span>Time: {donation.time || '10:00 AM'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">🩸</span>
                      <span>Volume: {donation.volume || '450'}ml</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">📍</span>
                      <span>Location: {donation.location || user.location}</span>
                    </div>
                  </div>

                  {donation.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Notes:</span> {donation.notes}
                      </p>
                    </div>
                  )}

                  {donation.status === 'completed' && donation.certificate && (
                    <div className="mt-3">
                      <button className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center">
                        <span className="mr-1">📜</span>
                        Download Certificate
                      </button>
                    </div>
                  )}
                </div>

                <div className="ml-4 flex flex-col space-y-2">
                  {donation.status === 'scheduled' && (
                    <>
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                        Reschedule
                      </button>
                      <button className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm">
                        Cancel
                      </button>
                    </>
                  )}
                  
                  {donation.status === 'completed' && (
                    <div className="text-right">
                      <div className="text-green-600 font-bold text-lg">+{donation.points || 100} Points</div>
                      <div className="text-sm text-gray-500">Lives saved: {donation.livesSaved || 3}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Achievement Section */}
      <div className="mt-8 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">🏆</span>
          Your Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {getAchievements(donations).map((achievement, index) => (
            <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm">
              <div className="text-2xl mr-3">{achievement.icon}</div>
              <div>
                <p className="font-medium text-gray-900">{achievement.name}</p>
                <p className="text-sm text-gray-500">{achievement.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper function to generate achievements based on donation history
function getAchievements(donations) {
  const completed = donations.filter(d => d.status === 'completed').length;
  const achievements = [];

  if (completed >= 1) {
    achievements.push({
      icon: '🩸',
      name: 'First Drop',
      description: 'Completed your first donation'
    });
  }

  if (completed >= 5) {
    achievements.push({
      icon: '⭐',
      name: 'Life Saver',
      description: 'Completed 5 donations'
    });
  }

  if (completed >= 10) {
    achievements.push({
      icon: '👑',
      name: 'Hero Status',
      description: 'Completed 10 donations'
    });
  }

  // Default message if no achievements
  if (achievements.length === 0) {
    achievements.push({
      icon: '🎯',
      name: 'Getting Started',
      description: 'Complete your first donation to unlock achievements'
    });
  }

  return achievements;
}

export default DonationHistory;