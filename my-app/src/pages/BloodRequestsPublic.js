import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function BloodRequestsPublic() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('all');

  useEffect(() => {
    fetchBloodRequests();
  }, []);

  const fetchBloodRequests = async () => {
    try {
      const response = await fetch('http://localhost:5000/blood-requests-public');
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (error) {
      console.error('Error fetching blood requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = selectedBloodGroup === 'all' 
    ? requests 
    : requests.filter(request => request.bloodGroup === selectedBloodGroup);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'urgent': return 'text-orange-600 bg-orange-100';
      case 'normal': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

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
                <h1 className="text-2xl font-bold text-gray-900">Blood Requests</h1>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/register"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                Register to Help
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Blood Group</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedBloodGroup('all')}
              className={`px-4 py-2 rounded-lg font-medium ${
                selectedBloodGroup === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Groups
            </button>
            {bloodGroups.map((group) => (
              <button
                key={group}
                onClick={() => setSelectedBloodGroup(group)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  selectedBloodGroup === group
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        </div>

        {/* Requests List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <p className="mt-2 text-gray-600">Loading blood requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🩸</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Blood Requests Found</h3>
            <p className="text-gray-600">
              {selectedBloodGroup === 'all' 
                ? 'There are currently no blood requests available.'
                : `No requests found for blood group ${selectedBloodGroup}.`
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{request.patientName}</h4>
                    <p className="text-sm text-gray-600">{request.hospital}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600 mb-1">{request.bloodGroup}</div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
                      {request.urgency || 'Normal'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">📍</span>
                    <span>{request.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">🩸</span>
                    <span>{request.unitsNeeded} units needed</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">📅</span>
                    <span>Needed by: {new Date(request.neededBy).toLocaleDateString()}</span>
                  </div>
                </div>

                {request.description && (
                  <p className="text-sm text-gray-700 mb-4">{request.description}</p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Contact: {request.contactNumber}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to="/register"
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium"
                    >
                      Donate Now
                    </Link>
                    <Link
                      to="/find-donors"
                      state={{
                        bloodGroup: request.bloodGroup,
                        location: request.location
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium"
                    >
                      Find Donors
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 bg-red-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Save Lives?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join our community of blood donors and help save lives in your area. 
            Register today to get notified about urgent blood requests.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/register"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Register as Donor
            </Link>
            <Link
              to="/about"
              className="bg-white hover:bg-gray-50 text-red-600 border-2 border-red-600 px-6 py-3 rounded-lg font-medium"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BloodRequestsPublic;