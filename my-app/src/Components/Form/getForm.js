import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function GetBloodForm({ onBack, setViewDisplayData }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    patientName: "",
    cnic: "",
    bloodGroup: "",
    unitsNeeded: "",
    urgency: "normal",
    hospital: "",
    location: "",
    contactNumber: "",
    neededBy: "",
    description: "",
    requesterName: "",
    relationToPatient: "",
  });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateStep1 = () => {
    if (!formData.patientName.trim()) {
      setMessage("Patient name is required.");
      return false;
    }
    if (!/^\d{13}$/.test(formData.cnic)) {
      setMessage("CNIC must be a 13-digit number.");
      return false;
    }
    if (!formData.bloodGroup) {
      setMessage("Blood group is required.");
      return false;
    }
    if (!formData.unitsNeeded || formData.unitsNeeded < 1) {
      setMessage("Units needed must be at least 1.");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.hospital.trim()) {
      setMessage("Hospital name is required.");
      return false;
    }
    if (!formData.location.trim()) {
      setMessage("Location is required.");
      return false;
    }
    if (!formData.contactNumber.trim()) {
      setMessage("Contact number is required.");
      return false;
    }
    if (!formData.neededBy) {
      setMessage("Date needed by is required.");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    setMessage("");
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    setMessage("");
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    
    if (!formData.requesterName.trim()) {
      setMessage("Requester name is required.");
      return;
    }
    if (!formData.relationToPatient.trim()) {
      setMessage("Relation to patient is required.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch("http://localhost:5000/submit-blood-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server responded with error:', response.status, errorText);
        setMessage(`Server error (${response.status}): ${errorText}`);
        return;
      }

      const result = await response.json();
      setMessage("Blood request submitted successfully! You can now search for donors or wait for donors to contact you.");
      
      // Show options to user instead of auto-redirecting
      setTimeout(() => {
        const searchNow = window.confirm(
          "Your blood request has been submitted successfully!\n\n" +
          "Would you like to search for donors now?\n\n" +
          "• Click 'OK' to search for donors immediately\n" +
          "• Click 'Cancel' to go back (you can search later from your dashboard)"
        );
        
        if (searchNow) {
          navigate('/find-donors', { 
            state: { 
              bloodGroup: formData.bloodGroup, 
              location: formData.location,
              requestId: result.requestId 
            } 
          });
        } else {
          navigate('/dashboard/blood-requests');
        }
      }, 1000);
    } catch (error) {
      console.error("Error submitting request:", error);
      setMessage(`Error: ${error.message || error}. Please check the console and try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-red-800">Request Blood</h2>
          <div className="text-sm text-gray-500">
            Step {currentStep} of 3
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className={`text-xs ${currentStep >= 1 ? 'text-red-600 font-semibold' : 'text-gray-400'}`}>
              Patient Info
            </span>
            <span className={`text-xs ${currentStep >= 2 ? 'text-red-600 font-semibold' : 'text-gray-400'}`}>
              Hospital Details
            </span>
            <span className={`text-xs ${currentStep >= 3 ? 'text-red-600 font-semibold' : 'text-gray-400'}`}>
              Requester Info
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-red-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded ${
            message.includes('success') 
              ? 'bg-green-100 text-green-700 border border-green-300' 
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Patient Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Patient Name *</label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter patient's full name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Patient CNIC *</label>
                  <input
                    type="text"
                    name="cnic"
                    value={formData.cnic}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="1234567890123"
                    maxLength={13}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Blood Group Required *</label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">Select blood group</option>
                    {bloodGroups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Units Needed *</label>
                  <input
                    type="number"
                    name="unitsNeeded"
                    value={formData.unitsNeeded}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Urgency Level</label>
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={onBack}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Back to Options
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Hospital Details */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Hospital Name *</label>
                  <input
                    type="text"
                    name="hospital"
                    value={formData.hospital}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter hospital name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Location/City *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="City, Area"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Contact Number *</label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="03001234567"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Needed By *</label>
                  <input
                    type="datetime-local"
                    name="neededBy"
                    value={formData.neededBy}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Additional Information</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Any additional details about the patient's condition or requirements..."
                ></textarea>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Requester Information */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">Request Summary</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="font-medium">Patient:</span> {formData.patientName}</div>
                  <div><span className="font-medium">Blood Group:</span> {formData.bloodGroup}</div>
                  <div><span className="font-medium">Units:</span> {formData.unitsNeeded}</div>
                  <div><span className="font-medium">Hospital:</span> {formData.hospital}</div>
                  <div><span className="font-medium">Location:</span> {formData.location}</div>
                  <div><span className="font-medium">Urgency:</span> 
                    <span className={`ml-1 capitalize ${
                      formData.urgency === 'critical' ? 'text-red-600 font-semibold' :
                      formData.urgency === 'urgent' ? 'text-orange-600 font-semibold' :
                      'text-green-600'
                    }`}>
                      {formData.urgency}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Your Name *</label>
                  <input
                    type="text"
                    name="requesterName"
                    value={formData.requesterName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Relation to Patient *</label>
                  <input
                    type="text"
                    name="relationToPatient"
                    value={formData.relationToPatient}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="e.g., Father, Mother, Brother, Friend"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default GetBloodForm;
