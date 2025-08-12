import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../config/api';

function NearbyDonors({ user }) {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({
    bloodType: '',
    distance: '10',
    availability: 'all'
  });

  useEffect(() => {
    fetchNearbyDonors();
  }, [searchFilters]);

  const fetchNearbyDonors = async () => {
    try {
      const queryParams = new URLSearchParams({
        location: user.location,
        ...searchFilters
      }).toString();
      
      const response = await fetch(`${API_BASE_URL}/nearby-donors?${queryParams}`);
      if (response.ok) {
        const data = await response.json();
        setDonors(data);
      }
    } catch (error) {
      console.error('Error fetching nearby donors:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Nearby Donors</h2>

      {/* Search Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
            <select
              value={searchFilters.bloodType}
              onChange={(e) => setSearchFilters({...searchFilters, bloodType: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">All Types</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Distance</label>
            <select
              value={searchFilters.distance}
              onChange={(e) => setSearchFilters({...searchFilters, distance: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="5">Within 5 km</option>
              <option value="10">Within 10 km</option>
              <option value="25">Within 25 km</option>
              <option value="50">Within 50 km</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
            <select
              value={searchFilters.availability}
              onChange={(e) => setSearchFilters({...searchFilters, availability: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Donors</option>
              <option value="available">Available Now</option>
              <option value="recent">Recently Active</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="text-red-600 text-2xl mr-3">👥</div>
            <div>
              <p className="text-sm font-medium text-red-600">Total Donors</p>
              <p className="text-2xl font-bold text-red-900">{donors.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="text-green-600 text-2xl mr-3">✅</div>
            <div>
              <p className="text-sm font-medium text-green-600">Available</p>
              <p className="text-2xl font-bold text-green-900">
                {donors.filter(d => d.available).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="text-blue-600 text-2xl mr-3">🩸</div>
            <div>
              <p className="text-sm font-medium text-blue-600">Your Type ({user.bloodGroup})</p>
              <p className="text-2xl font-bold text-blue-900">
                {donors.filter(d => d.bloodGroup === user.bloodGroup).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="text-purple-600 text-2xl mr-3">📍</div>
            <div>
              <p className="text-sm font-medium text-purple-600">Nearby</p>
              <p className="text-2xl font-bold text-purple-900">
                {donors.filter(d => d.distance <= 5).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Donors List */}
      <div className="space-y-4">
        {donors.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No donors found</h3>
            <p className="text-gray-500">Try adjusting your search filters to find more donors.</p>
          </div>
        ) : (
          donors.map((donor) => (
            <div key={donor.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  <div className="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center">
                    <span className="text-red-600 font-bold text-lg">{donor.bloodGroup}</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 mr-3">
                        {donor.firstName} {donor.lastName}
                      </h3>
                      {donor.available && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          Available
                        </span>
                      )}
                      {donor.verified && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium ml-2">
                          Verified
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <span className="mr-2">📍</span>
                        <span>{donor.location} ({donor.distance}km away)</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">🩸</span>
                        <span>{donor.totalDonations || 0} donations</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">⭐</span>
                        <span>{donor.rating || 5.0} rating ({donor.reviews || 0} reviews)</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">📅</span>
                        <span>Last active: {donor.lastActive || '2 days ago'}</span>
                      </div>
                    </div>

                    {donor.specialties && donor.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {donor.specialties.map((specialty, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    )}

                    {donor.bio && (
                      <p className="text-sm text-gray-600 mb-3">{donor.bio}</p>
                    )}
                  </div>
                </div>

                <div className="ml-4 flex flex-col space-y-2">
                  <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-medium">
                    Contact
                  </button>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium">
                    View Profile
                  </button>
                  <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium">
                    Share
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Connect Section */}
      <div className="mt-8 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Build Your Donor Network</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-4xl mb-2">🤝</div>
            <h4 className="font-medium text-gray-900">Connect</h4>
            <p className="text-sm text-gray-600">Build relationships with fellow donors</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">💬</div>
            <h4 className="font-medium text-gray-900">Communicate</h4>
            <p className="text-sm text-gray-600">Share experiences and tips</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">🏆</div>
            <h4 className="font-medium text-gray-900">Collaborate</h4>
            <p className="text-sm text-gray-600">Organize group donation drives</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NearbyDonors;