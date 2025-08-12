import React, { useState } from 'react';
import API_BASE_URL from '../../config/api';

function ProfileSettings({ user }) {
  const [activeTab, setActiveTab] = useState('personal');
  const [profileData, setProfileData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    mobileNumber: user.mobileNumber,
    location: user.location,
    bloodGroup: user.bloodGroup,
    bio: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalConditions: '',
    medications: '',
    allergies: ''
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: true,
    emergencyAlerts: true,
    profileVisibility: 'public',
    autoRespond: false,
    shareLocation: true
  });

  const handleSaveProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/update-profile/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        alert('Profile updated successfully!');
        // Update localStorage
        const updatedUser = { ...user, ...profileData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleSavePreferences = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/update-preferences/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (response.ok) {
        alert('Preferences updated successfully!');
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      alert('Failed to update preferences. Please try again.');
    }
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <input
            type="text"
            value={profileData.firstName}
            onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            value={profileData.lastName}
            onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mobile Number *
          </label>
          <input
            type="tel"
            value={profileData.mobileNumber}
            onChange={(e) => setProfileData({...profileData, mobileNumber: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location *
          </label>
          <input
            type="text"
            value={profileData.location}
            onChange={(e) => setProfileData({...profileData, location: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Blood Group *
          </label>
          <select
            value={profileData.bloodGroup}
            onChange={(e) => setProfileData({...profileData, bloodGroup: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
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
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bio (Optional)
        </label>
        <textarea
          value={profileData.bio}
          onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          rows="3"
          placeholder="Tell others about your donation journey..."
        />
      </div>

      <button
        onClick={handleSaveProfile}
        className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-md font-medium"
      >
        Save Personal Information
      </button>
    </div>
  );

  const renderEmergencyContacts = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <h4 className="font-medium text-yellow-800 mb-2">Why Emergency Contacts?</h4>
        <p className="text-sm text-yellow-700">
          Emergency contacts will be notified if there are any complications during or after blood donation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Emergency Contact Name
          </label>
          <input
            type="text"
            value={profileData.emergencyContact}
            onChange={(e) => setProfileData({...profileData, emergencyContact: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="Full name of emergency contact"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Emergency Contact Phone
          </label>
          <input
            type="tel"
            value={profileData.emergencyPhone}
            onChange={(e) => setProfileData({...profileData, emergencyPhone: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="Phone number"
          />
        </div>
      </div>

      <button
        onClick={handleSaveProfile}
        className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-md font-medium"
      >
        Save Emergency Contacts
      </button>
    </div>
  );

  const renderMedicalInfo = () => (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
        <h4 className="font-medium text-red-800 mb-2">Medical Information</h4>
        <p className="text-sm text-red-700">
          This information helps ensure your safety and the safety of blood recipients. All medical information is kept confidential.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Medical Conditions
        </label>
        <textarea
          value={profileData.medicalConditions}
          onChange={(e) => setProfileData({...profileData, medicalConditions: e.target.value})}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          rows="3"
          placeholder="List any current medical conditions (diabetes, hypertension, etc.)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Medications
        </label>
        <textarea
          value={profileData.medications}
          onChange={(e) => setProfileData({...profileData, medications: e.target.value})}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          rows="3"
          placeholder="List all medications you are currently taking"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Allergies
        </label>
        <textarea
          value={profileData.allergies}
          onChange={(e) => setProfileData({...profileData, allergies: e.target.value})}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          rows="3"
          placeholder="List any allergies (medications, foods, latex, etc.)"
        />
      </div>

      <button
        onClick={handleSaveProfile}
        className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-md font-medium"
      >
        Save Medical Information
      </button>
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Notification Preferences</h4>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h5 className="font-medium text-gray-900">Email Notifications</h5>
            <p className="text-sm text-gray-600">Receive notifications via email</p>
          </div>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={preferences.emailNotifications}
              onChange={(e) => setPreferences({...preferences, emailNotifications: e.target.checked})}
            />
            <span className="slider round"></span>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h5 className="font-medium text-gray-900">SMS Notifications</h5>
            <p className="text-sm text-gray-600">Receive notifications via text message</p>
          </div>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={preferences.smsNotifications}
              onChange={(e) => setPreferences({...preferences, smsNotifications: e.target.checked})}
            />
            <span className="slider round"></span>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h5 className="font-medium text-gray-900">Emergency Alerts</h5>
            <p className="text-sm text-gray-600">Receive urgent blood request alerts</p>
          </div>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={preferences.emergencyAlerts}
              onChange={(e) => setPreferences({...preferences, emergencyAlerts: e.target.checked})}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Privacy Settings</h4>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Visibility
          </label>
          <select
            value={preferences.profileVisibility}
            onChange={(e) => setPreferences({...preferences, profileVisibility: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="public">Public - Visible to all users</option>
            <option value="donors">Donors Only - Visible to other donors</option>
            <option value="private">Private - Only visible to me</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h5 className="font-medium text-gray-900">Share Location</h5>
            <p className="text-sm text-gray-600">Allow others to see your general location</p>
          </div>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={preferences.shareLocation}
              onChange={(e) => setPreferences({...preferences, shareLocation: e.target.checked})}
            />
            <span className="slider round"></span>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h5 className="font-medium text-gray-900">Auto-Respond to Requests</h5>
            <p className="text-sm text-gray-600">Automatically respond to compatible blood requests</p>
          </div>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={preferences.autoRespond}
              onChange={(e) => setPreferences({...preferences, autoRespond: e.target.checked})}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      <button
        onClick={handleSavePreferences}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-md font-medium"
      >
        Save Preferences
      </button>
    </div>
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 w-fit">
        {[
          { key: 'personal', label: 'Personal Info', icon: '👤' },
          { key: 'emergency', label: 'Emergency Contacts', icon: '🚨' },
          { key: 'medical', label: 'Medical Info', icon: '💊' },
          { key: 'preferences', label: 'Preferences', icon: '⚙️' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-red-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {activeTab === 'personal' && renderPersonalInfo()}
        {activeTab === 'emergency' && renderEmergencyContacts()}
        {activeTab === 'medical' && renderMedicalInfo()}
        {activeTab === 'preferences' && renderPreferences()}
      </div>
    </div>
  );
}

export default ProfileSettings;