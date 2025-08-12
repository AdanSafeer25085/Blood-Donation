import React, { useState, useEffect } from 'react';

function BloodRequests({ user }) {
  const [requests, setRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available'); // available, myRequests
  const [filter, setFilter] = useState('compatible'); // all, compatible, urgent, nearby
  const [showCreateRequest, setShowCreateRequest] = useState(false);

  useEffect(() => {
    fetchBloodRequests();
    fetchMyRequests();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBloodRequests = async () => {
    try {
      const response = await fetch('http://localhost:5000/blood-requests');
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

  const fetchMyRequests = async () => {
    try {
      const response = await fetch(`http://localhost:5000/my-blood-requests/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setMyRequests(data);
      }
    } catch (error) {
      console.error('Error fetching my requests:', error);
    }
  };

  const updateRequestStatus = async (requestId, status) => {
    try {
      const response = await fetch(`http://localhost:5000/update-request-status/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchMyRequests(); // Refresh my requests
        alert(`Request marked as ${status}`);
      }
    } catch (error) {
      console.error('Error updating request status:', error);
      alert('Failed to update request status');
    }
  };

  const deleteRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        const response = await fetch(`http://localhost:5000/delete-blood-request/${requestId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchMyRequests(); // Refresh my requests
          alert('Request deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting request:', error);
        alert('Failed to delete request');
      }
    }
  };

  const handleRespond = async (requestId, responseType) => {
    try {
      const response = await fetch(`http://localhost:5000/respond-to-request/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donorId: user.id,
          responseType: responseType, // 'willing', 'maybe', 'cannot'
          message: ''
        }),
      });

      if (response.ok) {
        alert(`Response sent! Thank you for ${responseType === 'willing' ? 'being willing to help' : 'responding'}.`);
        fetchBloodRequests(); // Refresh the list
      }
    } catch (error) {
      console.error('Error responding to request:', error);
      alert('Failed to send response. Please try again.');
    }
  };

  const isCompatible = (requestedType, donorType) => {
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
    return compatibility[requestedType]?.includes(donorType) || false;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'urgent':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const requestDate = new Date(dateString);
    const diffInHours = Math.floor((now - requestDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const filteredRequests = requests.filter(request => {
    switch (filter) {
      case 'compatible':
        return isCompatible(request.bloodType, user.bloodGroup);
      case 'urgent':
        return request.priority === 'critical' || request.priority === 'urgent';
      case 'nearby':
        return request.location.toLowerCase().includes(user.location.toLowerCase());
      default:
        return true;
    }
  });

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
        <h2 className="text-2xl font-bold text-gray-900">Blood Requests</h2>
        <button 
          onClick={() => setShowCreateRequest(true)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          + Create Request
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 w-fit">
        <button
          onClick={() => setActiveTab('available')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'available'
              ? 'bg-white text-red-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Available Requests ({requests.length})
        </button>
        <button
          onClick={() => setActiveTab('myRequests')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'myRequests'
              ? 'bg-white text-red-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          My Requests ({myRequests.length})
        </button>
      </div>

      {activeTab === 'available' ? (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="text-red-600 text-2xl mr-3">🚨</div>
                <div>
                  <p className="text-sm font-medium text-red-600">Critical</p>
                  <p className="text-xl font-bold text-red-900">
                    {requests.filter(r => r.priority === 'critical').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="text-green-600 text-2xl mr-3">✅</div>
                <div>
                  <p className="text-sm font-medium text-green-600">Compatible</p>
                  <p className="text-xl font-bold text-green-900">
                    {requests.filter(r => isCompatible(r.bloodType, user.bloodGroup)).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="text-blue-600 text-2xl mr-3">📍</div>
                <div>
                  <p className="text-sm font-medium text-blue-600">Nearby</p>
                  <p className="text-xl font-bold text-blue-900">
                    {requests.filter(r => r.location.toLowerCase().includes(user.location.toLowerCase())).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="text-purple-600 text-2xl mr-3">📊</div>
                <div>
                  <p className="text-sm font-medium text-purple-600">Total</p>
                  <p className="text-xl font-bold text-purple-900">{requests.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 w-fit">
            {[
              { key: 'compatible', label: 'Compatible with You', count: requests.filter(r => isCompatible(r.bloodType, user.bloodGroup)).length },
              { key: 'urgent', label: 'Urgent', count: requests.filter(r => r.priority === 'critical' || r.priority === 'urgent').length },
              { key: 'nearby', label: 'Nearby', count: requests.filter(r => r.location.toLowerCase().includes(user.location.toLowerCase())).length },
              { key: 'all', label: 'All', count: requests.length }
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
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Available Requests List */}
          <div className="space-y-4">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
                <p className="text-gray-500">
                  {filter === 'compatible' 
                    ? `No blood requests compatible with your ${user.bloodGroup} blood type at the moment.`
                    : `No ${filter} requests found.`}
                </p>
              </div>
            ) : (
              filteredRequests.map((request) => (
                <div 
                  key={request.id} 
                  className={`bg-white border rounded-lg p-6 hover:shadow-md transition-shadow ${
                    isCompatible(request.bloodType, user.bloodGroup) ? 'border-green-200 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 mr-3">
                          {request.patientName || 'Anonymous Patient'}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(request.priority)}`}>
                          {request.priority?.toUpperCase() || 'NORMAL'}
                        </span>
                        {isCompatible(request.bloodType, user.bloodGroup) && (
                          <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            Compatible
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2">🩸</span>
                          <span>Blood Type: <span className="font-bold text-red-600">{request.bloodType}</span></span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2">📊</span>
                          <span>Units Needed: {request.unitsNeeded || 2}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2">📍</span>
                          <span>Location: {request.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2">⏰</span>
                          <span>Posted: {getTimeAgo(request.createdAt || new Date())}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2">🏥</span>
                          <span>Hospital: {request.hospital || 'City General Hospital'}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2">📞</span>
                          <span>Contact: {request.contactNumber || 'Available after response'}</span>
                        </div>
                      </div>

                      {request.message && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Message:</span> {request.message}
                          </p>
                        </div>
                      )}

                      {request.deadline && (
                        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-800">
                            <span className="font-medium">⚠️ Deadline:</span> {new Date(request.deadline).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="ml-4 flex flex-col space-y-2">
                      {isCompatible(request.bloodType, user.bloodGroup) ? (
                        <>
                          <button 
                            onClick={() => handleRespond(request.id, 'willing')}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm font-medium"
                          >
                            I Can Help! 🩸
                          </button>
                          <button 
                            onClick={() => handleRespond(request.id, 'maybe')}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded text-sm font-medium"
                          >
                            Maybe
                          </button>
                          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium">
                            Share
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="text-sm text-gray-500 text-center">
                            Not compatible with {user.bloodGroup}
                          </div>
                          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium">
                            Share
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <>
          {/* My Requests Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="text-blue-600 text-2xl mr-3">📝</div>
                <div>
                  <p className="text-sm font-medium text-blue-600">Active</p>
                  <p className="text-xl font-bold text-blue-900">
                    {myRequests.filter(r => r.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="text-green-600 text-2xl mr-3">✅</div>
                <div>
                  <p className="text-sm font-medium text-green-600">Fulfilled</p>
                  <p className="text-xl font-bold text-green-900">
                    {myRequests.filter(r => r.status === 'fulfilled').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="text-yellow-600 text-2xl mr-3">⏳</div>
                <div>
                  <p className="text-sm font-medium text-yellow-600">Pending</p>
                  <p className="text-xl font-bold text-yellow-900">
                    {myRequests.filter(r => r.status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="text-purple-600 text-2xl mr-3">📊</div>
                <div>
                  <p className="text-sm font-medium text-purple-600">Total</p>
                  <p className="text-xl font-bold text-purple-900">{myRequests.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* My Requests List */}
          <div className="space-y-4">
            {myRequests.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No blood requests yet</h3>
                <p className="text-gray-500 mb-4">
                  You haven't created any blood requests. Click "Create Request" to submit your first request.
                </p>
                <button 
                  onClick={() => setShowCreateRequest(true)}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium"
                >
                  Create Your First Request
                </button>
              </div>
            ) : (
              myRequests.map((request) => (
                <div key={request.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 mr-3">
                          {request.patientName || 'Anonymous Patient'}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                          request.status === 'active' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                          request.status === 'fulfilled' ? 'bg-green-100 text-green-800 border-green-200' :
                          request.status === 'cancelled' ? 'bg-red-100 text-red-800 border-red-200' :
                          'bg-yellow-100 text-yellow-800 border-yellow-200'
                        }`}>
                          {request.status?.toUpperCase() || 'PENDING'}
                        </span>
                        <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(request.urgency)}`}>
                          {request.urgency?.toUpperCase() || 'NORMAL'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2">🩸</span>
                          <span>Blood Type: <span className="font-bold text-red-600">{request.bloodGroup}</span></span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2">📊</span>
                          <span>Units Needed: {request.unitsNeeded}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2">🏥</span>
                          <span>Hospital: {request.hospital}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2">📍</span>
                          <span>Location: {request.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2">📞</span>
                          <span>Contact: {request.contactNumber}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2">⏰</span>
                          <span>Needed By: {request.neededBy ? new Date(request.neededBy).toLocaleDateString() : 'ASAP'}</span>
                        </div>
                      </div>

                      {request.description && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Additional Info:</span> {request.description}
                          </p>
                        </div>
                      )}

                      <div className="mb-2 text-sm text-gray-500">
                        Requested by: {request.requesterName} ({request.relationToPatient})
                      </div>
                    </div>

                    <div className="ml-4 flex flex-col space-y-2 min-w-[120px]">
                      {request.status === 'active' && (
                        <>
                          <button 
                            onClick={() => updateRequestStatus(request.id, 'fulfilled')}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm font-medium"
                          >
                            Mark Fulfilled
                          </button>
                          <button 
                            onClick={() => updateRequestStatus(request.id, 'cancelled')}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm font-medium"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => deleteRequest(request.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Create Request Modal */}
      {showCreateRequest && (
        <CreateRequestModal 
          user={user}
          onClose={() => setShowCreateRequest(false)}
          onSubmit={(newRequest) => {
            setRequests([newRequest, ...requests]);
            setShowCreateRequest(false);
          }}
        />
      )}
    </div>
  );
}

// Create Request Modal Component
function CreateRequestModal({ user, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    patientName: '',
    bloodType: '',
    unitsNeeded: 1,
    priority: 'normal',
    hospital: '',
    location: user.location,
    contactNumber: user.mobileNumber,
    message: '',
    deadline: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/create-blood-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          requesterId: user.id
        }),
      });

      if (response.ok) {
        const newRequest = await response.json();
        onSubmit(newRequest);
        alert('Blood request created successfully!');
      }
    } catch (error) {
      console.error('Error creating request:', error);
      alert('Failed to create request. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Create Blood Request</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient Name (Optional)
              </label>
              <input
                type="text"
                value={formData.patientName}
                onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Can be kept anonymous"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blood Type Needed *
              </label>
              <select
                value={formData.bloodType}
                onChange={(e) => setFormData({...formData, bloodType: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select blood type</option>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Units Needed
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.unitsNeeded}
                onChange={(e) => setFormData({...formData, unitsNeeded: parseInt(e.target.value)})}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority Level
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hospital *
              </label>
              <input
                type="text"
                value={formData.hospital}
                onChange={(e) => setFormData({...formData, hospital: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="3"
                placeholder="Any additional information..."
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-md"
              >
                Create Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BloodRequests;