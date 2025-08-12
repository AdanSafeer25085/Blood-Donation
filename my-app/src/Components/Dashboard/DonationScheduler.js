import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../config/api';

function DonationScheduler({ user }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');
  const [hospitals, setHospitals] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [eligibilityStatus, setEligibilityStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHospitals();
    checkEligibility();
  }, []);

  useEffect(() => {
    if (selectedDate && selectedHospital) {
      fetchAvailableSlots();
    }
  }, [selectedDate, selectedHospital]);

  const fetchHospitals = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/donation-centers`);
      if (response.ok) {
        const data = await response.json();
        setHospitals(data);
      }
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    }
  };

  const checkEligibility = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/check-eligibility/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setEligibilityStatus(data);
      }
    } catch (error) {
      console.error('Error checking eligibility:', error);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/available-slots?date=${selectedDate}&hospital=${selectedHospital}`);
      if (response.ok) {
        const data = await response.json();
        setAvailableSlots(data);
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
    }
  };

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime || !selectedHospital) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/schedule-donation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donorId: user.id,
          date: selectedDate,
          time: selectedTime,
          hospitalId: selectedHospital,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert('Donation scheduled successfully! You will receive a confirmation email.');
        // Reset form
        setSelectedDate('');
        setSelectedTime('');
        setSelectedHospital('');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to schedule donation');
      }
    } catch (error) {
      console.error('Error scheduling donation:', error);
      alert('Failed to schedule donation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3); // 3 months ahead
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Schedule a Donation</h2>

      {/* Eligibility Check */}
      {eligibilityStatus && (
        <div className={`mb-6 p-4 rounded-lg ${
          eligibilityStatus.eligible 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-3">
              {eligibilityStatus.eligible ? '✅' : '❌'}
            </span>
            <h3 className={`text-lg font-semibold ${
              eligibilityStatus.eligible ? 'text-green-800' : 'text-red-800'
            }`}>
              {eligibilityStatus.eligible ? 'You are eligible to donate!' : 'Not eligible yet'}
            </h3>
          </div>
          <p className={`text-sm ${
            eligibilityStatus.eligible ? 'text-green-700' : 'text-red-700'
          }`}>
            {eligibilityStatus.message}
          </p>
          {eligibilityStatus.nextEligibleDate && (
            <p className="text-sm mt-2 text-gray-600">
              Next eligible date: <span className="font-medium">{eligibilityStatus.nextEligibleDate}</span>
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scheduling Form */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Book Your Appointment</h3>
            
            {/* Date Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={getMinDate()}
                max={getMaxDate()}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                disabled={!eligibilityStatus?.eligible}
              />
            </div>

            {/* Hospital Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Donation Center
              </label>
              <select
                value={selectedHospital}
                onChange={(e) => setSelectedHospital(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                disabled={!eligibilityStatus?.eligible}
              >
                <option value="">Choose a center...</option>
                {hospitals.map((hospital) => (
                  <option key={hospital.id} value={hospital.id}>
                    {hospital.name} - {hospital.location}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Slot Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Time Slots
              </label>
              {selectedDate && selectedHospital ? (
                <div className="grid grid-cols-2 gap-2">
                  {availableSlots.length > 0 ? (
                    availableSlots.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => setSelectedTime(slot.time)}
                        className={`p-3 text-sm font-medium rounded-md border ${
                          selectedTime === slot.time
                            ? 'bg-red-500 text-white border-red-500'
                            : slot.available
                            ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        }`}
                        disabled={!slot.available}
                      >
                        {slot.time}
                        {!slot.available && <div className="text-xs">Booked</div>}
                      </button>
                    ))
                  ) : (
                    <p className="col-span-2 text-sm text-gray-500 text-center py-4">
                      No slots available for selected date
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Please select date and center to view available slots
                </p>
              )}
            </div>

            {/* Schedule Button */}
            <button
              onClick={handleSchedule}
              disabled={!eligibilityStatus?.eligible || !selectedDate || !selectedTime || !selectedHospital || loading}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-md font-medium"
            >
              {loading ? 'Scheduling...' : 'Schedule Donation'}
            </button>
          </div>

          {/* Pre-Donation Checklist */}
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Pre-Donation Checklist</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Get a good night's sleep (at least 8 hours)
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Eat a healthy meal before donating
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Drink plenty of water (16 oz before donation)
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Avoid alcohol for 24 hours before donation
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Bring a valid ID and any donor card
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Wear comfortable clothing with sleeves
              </li>
            </ul>
          </div>
        </div>

        {/* Information Panel */}
        <div className="space-y-6">
          {/* Donation Process */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What to Expect</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-red-100 text-red-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Registration & Health Check</h4>
                  <p className="text-sm text-gray-600">ID verification, health questionnaire, and mini-physical (15 min)</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-red-100 text-red-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Blood Donation</h4>
                  <p className="text-sm text-gray-600">The actual donation process (8-10 min)</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-red-100 text-red-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Recovery & Refreshments</h4>
                  <p className="text-sm text-gray-600">Rest, snacks, and monitoring (10-15 min)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Nearby Centers Map */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation Centers Near You</h3>
            <div className="space-y-3">
              {hospitals.slice(0, 3).map((hospital) => (
                <div key={hospital.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{hospital.name}</h4>
                    <p className="text-sm text-gray-600">{hospital.location}</p>
                    <p className="text-xs text-gray-500">{hospital.distance} away</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">{hospital.rating} ★</div>
                    <div className="text-xs text-gray-500">{hospital.reviews} reviews</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900">How often can I donate?</h4>
                <p className="text-sm text-gray-600">Every 56 days (8 weeks) for whole blood donation</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">How long does it take?</h4>
                <p className="text-sm text-gray-600">The entire process takes about 45 minutes to 1 hour</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">What if I need to reschedule?</h4>
                <p className="text-sm text-gray-600">You can reschedule anytime up to 2 hours before your appointment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonationScheduler;