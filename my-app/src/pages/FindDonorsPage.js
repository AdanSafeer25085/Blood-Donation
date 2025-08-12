import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

function FindDonorsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState({});
  const [newReviews, setNewReviews] = useState({});
  const [searchLocation, setSearchLocation] = useState(location.state?.location || '');
  const [bloodGroupFilter, setBloodGroupFilter] = useState(location.state?.bloodGroup || '');
  const requestId = location.state?.requestId;

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      const donorResponse = await fetch("http://localhost:5000/get-form-data");
      if (!donorResponse.ok) throw new Error("Failed to fetch donors");
      const donorsData = await donorResponse.json();
      setDonors(donorsData);

      // Fetch reviews for each donor
      const reviewsMap = {};
      for (const donor of donorsData) {
        try {
          const reviewResponse = await fetch(
            `http://localhost:5000/get-reviews/${donor.id}`
          );
          if (reviewResponse.ok) {
            const donorReviews = await reviewResponse.json();
            reviewsMap[donor.id] = donorReviews;
          }
        } catch {
          reviewsMap[donor.id] = [];
        }
      }
      setReviews(reviewsMap);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewChange = (donorId, review) => {
    setNewReviews((prev) => ({ ...prev, [donorId]: review }));
  };

  const submitReview = async (donorId) => {
    const review = newReviews[donorId];
    if (!review) return;

    try {
      const response = await fetch("http://localhost:5000/submit-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donorId, review }),
      });

      if (!response.ok) throw new Error("Failed to submit review");

      setReviews((prev) => ({
        ...prev,
        [donorId]: [...(prev[donorId] || []), { review }],
      }));
      setNewReviews((prev) => ({ ...prev, [donorId]: "" }));
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to submit review. Please try again.");
    }
  };

  const contactDonor = async (donorId, donorName) => {
    if (requestId) {
      try {
        const response = await fetch("http://localhost:5000/contact-donor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            requestId, 
            donorId,
            donorName 
          }),
        });

        if (response.ok) {
          alert(`Contact request sent to ${donorName}. They will be notified about your blood request.`);
        } else {
          throw new Error("Failed to send contact request");
        }
      } catch (err) {
        console.error("Error contacting donor:", err);
        alert("Failed to contact donor. Please try calling them directly.");
      }
    }
  };

  const filteredDonors = donors.filter((donor) => {
    const matchesLocation = searchLocation
      ? donor.location.toLowerCase().includes(searchLocation.toLowerCase())
      : true;
    const matchesBloodGroup = bloodGroupFilter
      ? donor.bloodGroup === bloodGroupFilter
      : true;
    return matchesLocation && matchesBloodGroup;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <p className="mt-2 text-gray-600">Loading donors...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Donors</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchDonors}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                <h1 className="text-2xl font-bold text-gray-900">Find Blood Donors</h1>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/register"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                Become a Donor
              </Link>
              <button
                onClick={() => navigate(-1)}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Search & Filter Donors</h3>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search by Location
              </label>
              <input
                type="text"
                placeholder="City, area, or region"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div className="sm:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blood Group
              </label>
              <select
                value={bloodGroupFilter}
                onChange={(e) => setBloodGroupFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">All Blood Groups</option>
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
            <button
              onClick={() => {
                setSearchLocation('');
                setBloodGroupFilter('');
              }}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Found <span className="font-semibold text-red-600">{filteredDonors.length}</span> donors
            {bloodGroupFilter && <span> with blood group <span className="font-semibold">{bloodGroupFilter}</span></span>}
            {searchLocation && <span> in <span className="font-semibold">{searchLocation}</span></span>}
          </p>
        </div>

        {/* Donors Grid */}
        {filteredDonors.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Donors Found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or contact us to expand our donor network.
            </p>
            <Link
              to="/register"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Register as Donor
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDonors.map((donor) => (
              <div
                key={donor.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                {/* Donor Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {donor.firstName} {donor.lastName}
                    </h4>
                    <p className="text-sm text-gray-600">{donor.location}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600 mb-1">{donor.bloodGroup}</div>
                    <div className="w-3 h-3 bg-green-500 rounded-full inline-block" title="Available"></div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">📱</span>
                    <span>{donor.mobileNumber}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">✉️</span>
                    <span className="truncate">{donor.email}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => contactDonor(donor.id, `${donor.firstName} ${donor.lastName}`)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium"
                    disabled={!requestId}
                  >
                    {requestId ? 'Contact Donor' : 'Call Now'}
                  </button>
                  <a
                    href={`tel:${donor.mobileNumber}`}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium text-center"
                  >
                    Call Directly
                  </a>
                </div>

                {/* Reviews Section */}
                <div className="border-t pt-4">
                  <h5 className="font-medium text-gray-900 mb-2">Reviews ({reviews[donor.id]?.length || 0})</h5>
                  
                  {/* Existing Reviews */}
                  {reviews[donor.id]?.length > 0 ? (
                    <div className="space-y-1 mb-3 max-h-20 overflow-y-auto">
                      {reviews[donor.id].slice(0, 2).map((r, index) => (
                        <p key={index} className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                          {r.review}
                        </p>
                      ))}
                      {reviews[donor.id].length > 2 && (
                        <p className="text-xs text-gray-500">
                          +{reviews[donor.id].length - 2} more reviews
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 mb-3">No reviews yet</p>
                  )}

                  {/* Add Review */}
                  <div className="space-y-2">
                    <textarea
                      value={newReviews[donor.id] || ""}
                      onChange={(e) => handleReviewChange(donor.id, e.target.value)}
                      placeholder="Share your experience..."
                      className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-red-500"
                      rows={2}
                    />
                    <button
                      onClick={() => submitReview(donor.id)}
                      disabled={!newReviews[donor.id]?.trim()}
                      className="w-full text-xs bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white px-2 py-1 rounded"
                    >
                      Add Review
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-red-50 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help Finding a Donor?</h3>
          <p className="text-gray-600 mb-4">
            If you can't find a matching donor, our team can help you connect with blood banks and hospitals.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/blood-requests"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              View All Requests
            </Link>
            <a
              href="tel:+1234567890"
              className="bg-white hover:bg-gray-50 text-red-600 border-2 border-red-600 px-4 py-2 rounded-lg font-medium"
            >
              Emergency Helpline
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FindDonorsPage;