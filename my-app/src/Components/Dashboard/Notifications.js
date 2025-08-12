import React, { useState } from 'react';

function Notifications({ user, notifications: initialNotifications }) {
  const [notifications, setNotifications] = useState(initialNotifications || [
    {
      id: 1,
      type: 'urgent',
      title: 'Urgent Blood Request Nearby',
      message: 'A patient at City Hospital needs O+ blood urgently. You are a compatible donor.',
      time: '2 hours ago',
      read: false,
      action: 'respond'
    },
    {
      id: 2,
      type: 'reminder',
      title: 'Donation Reminder',
      message: 'You are now eligible to donate blood again. Your next donation is due.',
      time: '1 day ago',
      read: false,
      action: 'schedule'
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Achievement Unlocked!',
      message: 'Congratulations! You have completed 5 blood donations and earned the "Life Saver" badge.',
      time: '3 days ago',
      read: true,
      action: 'view'
    },
    {
      id: 4,
      type: 'update',
      title: 'Profile Update Required',
      message: 'Please update your contact information to continue receiving donation requests.',
      time: '1 week ago',
      read: true,
      action: 'update'
    }
  ]);

  const [filter, setFilter] = useState('all'); // all, unread, urgent

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'urgent':
        return '🚨';
      case 'reminder':
        return '⏰';
      case 'achievement':
        return '🏆';
      case 'update':
        return '📝';
      default:
        return '📧';
    }
  };

  const getNotificationColor = (type, read) => {
    if (type === 'urgent' && !read) {
      return 'border-red-200 bg-red-50';
    }
    if (!read) {
      return 'border-blue-200 bg-blue-50';
    }
    return 'border-gray-200 bg-white';
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const handleAction = (notification) => {
    switch (notification.action) {
      case 'respond':
        alert('Redirecting to blood request...');
        break;
      case 'schedule':
        alert('Redirecting to donation scheduler...');
        break;
      case 'view':
        alert('Redirecting to achievements...');
        break;
      case 'update':
        alert('Redirecting to profile settings...');
        break;
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    switch (filter) {
      case 'unread':
        return !notif.read;
      case 'urgent':
        return notif.type === 'urgent';
      default:
        return true;
    }
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
        <button 
          onClick={markAllAsRead}
          className="text-sm text-red-600 hover:text-red-700 font-medium"
        >
          Mark all as read
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="text-blue-600 text-2xl mr-3">📧</div>
            <div>
              <p className="text-sm font-medium text-blue-600">Total</p>
              <p className="text-2xl font-bold text-blue-900">{notifications.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="text-yellow-600 text-2xl mr-3">📬</div>
            <div>
              <p className="text-sm font-medium text-yellow-600">Unread</p>
              <p className="text-2xl font-bold text-yellow-900">
                {notifications.filter(n => !n.read).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="text-red-600 text-2xl mr-3">🚨</div>
            <div>
              <p className="text-sm font-medium text-red-600">Urgent</p>
              <p className="text-2xl font-bold text-red-900">
                {notifications.filter(n => n.type === 'urgent').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 w-fit">
        {[
          { key: 'all', label: 'All', count: notifications.length },
          { key: 'unread', label: 'Unread', count: notifications.filter(n => !n.read).length },
          { key: 'urgent', label: 'Urgent', count: notifications.filter(n => n.type === 'urgent').length }
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

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500">
              {filter === 'unread' 
                ? "All caught up! No unread notifications."
                : filter === 'urgent'
                ? "No urgent notifications at the moment."
                : "You don't have any notifications yet."}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div 
              key={notification.id}
              className={`border rounded-lg p-4 transition-all hover:shadow-md ${getNotificationColor(notification.type, notification.read)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="text-2xl flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <h3 className={`font-semibold ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="ml-2 w-2 h-2 bg-red-500 rounded-full"></span>
                      )}
                    </div>
                    
                    <p className={`text-sm mb-2 ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                      {notification.message}
                    </p>
                    
                    <p className="text-xs text-gray-400">{notification.time}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {notification.action && (
                    <button
                      onClick={() => handleAction(notification)}
                      className={`px-3 py-1 text-xs font-medium rounded ${
                        notification.type === 'urgent'
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {notification.action === 'respond' ? 'Respond' :
                       notification.action === 'schedule' ? 'Schedule' :
                       notification.action === 'view' ? 'View' :
                       notification.action === 'update' ? 'Update' : 'Action'}
                    </button>
                  )}
                  
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
                    >
                      Mark read
                    </button>
                  )}
                  
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="px-2 py-1 text-xs text-gray-400 hover:text-red-500"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Notification Settings */}
      <div className="mt-8 bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Emergency Requests</h4>
              <p className="text-sm text-gray-600">Get notified about urgent blood requests in your area</p>
            </div>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider round bg-red-500"></span>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Donation Reminders</h4>
              <p className="text-sm text-gray-600">Remind me when I'm eligible to donate again</p>
            </div>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider round bg-blue-500"></span>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Achievement Updates</h4>
              <p className="text-sm text-gray-600">Celebrate milestones and achievements</p>
            </div>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider round bg-green-500"></span>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Community Updates</h4>
              <p className="text-sm text-gray-600">News and updates from the blood donation community</p>
            </div>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider round bg-purple-500"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notifications;