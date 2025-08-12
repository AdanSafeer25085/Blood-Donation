import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../config/api';
import DashboardStats from './DashboardStats';
import DonationHistory from './DonationHistory';
import BloodRequests from './BloodRequests';
import ProfileSettings from './ProfileSettings';
import DonationScheduler from './DonationScheduler';
import NearbyDonors from './NearbyDonors';
import HealthTracker from './HealthTracker';
import Notifications from './Notifications';

function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Load notifications on dashboard load
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'donations', label: 'My Donations', icon: '🩸' },
    { id: 'requests', label: 'Blood Requests', icon: '🆘' },
    { id: 'schedule', label: 'Schedule Donation', icon: '📅' },
    { id: 'nearby', label: 'Nearby Donors', icon: '📍' },
    { id: 'health', label: 'Health Tracker', icon: '💊' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'profile', label: 'Profile Settings', icon: '⚙️' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardStats user={user} />;
      case 'donations':
        return <DonationHistory user={user} />;
      case 'requests':
        return <BloodRequests user={user} />;
      case 'schedule':
        return <DonationScheduler user={user} />;
      case 'nearby':
        return <NearbyDonors user={user} />;
      case 'health':
        return <HealthTracker user={user} />;
      case 'notifications':
        return <Notifications user={user} notifications={notifications} />;
      case 'profile':
        return <ProfileSettings user={user} />;
      default:
        return <DashboardStats user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img
                className="w-10 h-10 rounded-full mr-3"
                src="./image/logo.png"
                alt="Heart To Heart"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome, {user.firstName}!
                </h1>
                <p className="text-sm text-gray-500">
                  Blood Type: <span className="font-semibold text-red-600">{user.bloodGroup}</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notification Badge */}
              <div className="relative">
                <button
                  onClick={() => setActiveTab('notifications')}
                  className="p-2 text-gray-400 hover:text-gray-500"
                >
                  🔔
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-sm p-4">
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                        activeTab === item.id
                          ? 'bg-red-500 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-3 text-lg">{item.icon}</span>
                      {item.label}
                      {item.id === 'notifications' && notifications.length > 0 && (
                        <span className="ml-auto bg-red-100 text-red-600 text-xs rounded-full px-2 py-1">
                          {notifications.length}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;