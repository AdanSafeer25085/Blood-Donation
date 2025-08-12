import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import API_BASE_URL from '../config/api';

// Import dashboard components
import DashboardStats from '../Components/Dashboard/DashboardStats';
import DonationHistory from '../Components/Dashboard/DonationHistory';
import BloodRequests from '../Components/Dashboard/BloodRequests';
import ProfileSettings from '../Components/Dashboard/ProfileSettings';
import DonationScheduler from '../Components/Dashboard/DonationScheduler';
import NearbyDonors from '../Components/Dashboard/NearbyDonors';
import HealthTracker from '../Components/Dashboard/HealthTracker';
import Notifications from '../Components/Dashboard/Notifications';

function DashboardPage() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchNotifications();
  }, [user, navigate]);

  const fetchNotifications = async () => {
    if (!user) return;
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  const menuItems = [
    { id: 'overview', path: '/dashboard', label: 'Overview', icon: '📊' },
    { id: 'donations', path: '/dashboard/donations', label: 'My Donations', icon: '🩸' },
    { id: 'requests', path: '/dashboard/blood-requests', label: 'Blood Requests', icon: '🆘' },
    { id: 'schedule', path: '/dashboard/schedule', label: 'Schedule Donation', icon: '📅' },
    { id: 'nearby', path: '/dashboard/nearby-donors', label: 'Nearby Donors', icon: '📍' },
    { id: 'health', path: '/dashboard/health', label: 'Health Tracker', icon: '💊' },
    { id: 'notifications', path: '/dashboard/notifications', label: 'Notifications', icon: '🔔' },
    { id: 'profile', path: '/dashboard/profile', label: 'Profile Settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
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
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Welcome, {user.firstName}!
                  </h1>
                  <p className="text-sm text-gray-500">
                    Blood Type: <span className="font-semibold text-red-600">{user.bloodGroup}</span>
                  </p>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notification Badge */}
              <Link to="/dashboard/notifications" className="relative p-2 text-gray-400 hover:text-gray-500">
                🔔
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </Link>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
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
                    <Link
                      to={item.path}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        location.pathname === item.path
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
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Quick Actions */}
            <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  to="/dashboard/schedule"
                  className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center"
                >
                  <span className="mr-2">📅</span>
                  Schedule Donation
                </Link>
                <Link
                  to="/dashboard/blood-requests"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center"
                >
                  <span className="mr-2">🆘</span>
                  View Requests
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm min-h-screen">
              <Routes>
                <Route index element={<DashboardStats user={user} />} />
                <Route path="donations" element={<DonationHistory user={user} />} />
                <Route path="blood-requests" element={<BloodRequests user={user} />} />
                <Route path="schedule" element={<DonationScheduler user={user} />} />
                <Route path="nearby-donors" element={<NearbyDonors user={user} />} />
                <Route path="health" element={<HealthTracker user={user} />} />
                <Route path="notifications" element={<Notifications user={user} notifications={notifications} />} />
                <Route path="profile" element={<ProfileSettings user={user} />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;