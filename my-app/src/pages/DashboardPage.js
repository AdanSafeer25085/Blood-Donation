import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../Components/Header/Nav/LanguageContext';
import { getNotifications } from '../services/notifications.service';
import { Icon } from '../Components/icons';

// Dashboard sections
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
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      setNotifications(await getNotifications(user.id));
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) return null;

  const menuItems = [
    { path: '/dashboard', label: t('dash.overview'), icon: 'overview', end: true },
    { path: '/dashboard/donations', label: t('dash.myDonations'), icon: 'droplet' },
    { path: '/dashboard/blood-requests', label: t('dash.requests'), icon: 'request' },
    { path: '/dashboard/schedule', label: t('dash.schedule'), icon: 'calendar' },
    { path: '/dashboard/nearby-donors', label: t('dash.nearby'), icon: 'mapPin' },
    { path: '/dashboard/health', label: t('dash.health'), icon: 'health' },
    { path: '/dashboard/notifications', label: t('dash.notifications'), icon: 'bell' },
    { path: '/dashboard/profile', label: t('dash.profile'), icon: 'profile' },
  ];

  const isActive = (item) =>
    item.end ? location.pathname === item.path : location.pathname.startsWith(item.path);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <Link to="/" className="flex items-center min-w-0">
              <img className="w-9 h-9 sm:w-10 sm:h-10 rounded-full mr-2 sm:mr-3 shrink-0" src="/image/logo.png" alt="Heart To Heart" />
              <div className="min-w-0">
                <h1 className="text-base sm:text-xl font-bold text-gray-900 truncate">
                  {t('dash.welcome')}, {user.firstName}!
                </h1>
                <p className="text-xs sm:text-sm text-gray-500">
                  {t('dash.bloodType')}: <span className="font-semibold text-red-600">{user.bloodGroup || '—'}</span>
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <Link to="/dashboard/notifications" className="relative p-2 text-gray-500 hover:text-[#b20e0e]" aria-label="Notifications">
                <Icon name="bell" className="w-6 h-6" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 bg-[#b20e0e] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 bg-[#b20e0e] hover:bg-red-800 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium"
              >
                <Icon name="logout" className="w-4 h-4" />
                <span className="hidden sm:inline">{t('nav.logout')}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile tab bar (horizontal scroll) — visible below lg */}
      <nav className="lg:hidden bg-white border-b sticky top-[57px] z-20 overflow-x-auto">
        <div className="flex gap-1 px-2 py-2 min-w-max">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                isActive(item) ? 'bg-[#b20e0e] text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon name={item.icon} className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop sidebar — hidden below lg */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-sm p-3 sticky top-20">
              <ul className="space-y-1">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                        isActive(item) ? 'bg-[#b20e0e] text-white' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon name={item.icon} className="w-5 h-5 mr-3" />
                      {item.label}
                      {item.path.endsWith('notifications') && notifications.length > 0 && (
                        <span className="ml-auto bg-red-100 text-red-700 text-xs rounded-full px-2 py-0.5">
                          {notifications.length}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-4 pt-4 border-t">
                <h3 className="text-sm font-semibold text-gray-900 mb-2 px-1">{t('dash.quickActions')}</h3>
                <div className="space-y-2">
                  <Link to="/dashboard/schedule" className="w-full bg-[#b20e0e] hover:bg-red-800 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                    <Icon name="calendar" className="w-4 h-4" /> {t('dash.schedule')}
                  </Link>
                  <Link to="/dashboard/blood-requests" className="w-full border border-[#b20e0e] text-[#b20e0e] hover:bg-red-50 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                    <Icon name="request" className="w-4 h-4" /> {t('dash.requests')}
                  </Link>
                </div>
              </div>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-lg shadow-sm">
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
          </main>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
