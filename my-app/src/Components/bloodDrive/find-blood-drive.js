// components/FindBloodDrive.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FindBloodDrive = () => {
  const [location, setLocation] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (location.trim()) {
      // Navigate to the donor search page with location and blood group filters
      navigate('/find-donors', {
        state: {
          location: location.trim(),
          bloodGroup: bloodGroup || '',
          fromHomePage: true
        }
      });
    } else {
      alert("Please enter a location to search for donors");
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="bg-gray-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-[#b20e0e] mb-2 text-center">
          Find Blood Donors Near You
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Search for registered blood donors in your area by location and blood type
        </p>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📍 Location *
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b20e0e] focus:border-[#b20e0e] outline-none"
                placeholder="Enter city, area, or region (e.g., Karachi, Lahore)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🩸 Blood Group (Optional)
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b20e0e] focus:border-[#b20e0e] outline-none"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
              >
                <option value="">All Blood Groups</option>
                {bloodGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={handleSearch}
              className="w-full bg-[#b20e0e] text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors duration-300 font-semibold flex items-center justify-center space-x-2"
            >
              <span>🔍</span>
              <span>Search Donors</span>
            </button>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-[#b20e0e]">5000+</div>
            <div className="text-sm text-gray-600">Registered Donors</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-[#b20e0e]">50+</div>
            <div className="text-sm text-gray-600">Cities Covered</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-[#b20e0e]">24/7</div>
            <div className="text-sm text-gray-600">Available</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-[#b20e0e]">100%</div>
            <div className="text-sm text-gray-600">Verified</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindBloodDrive;
