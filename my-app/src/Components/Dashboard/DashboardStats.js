import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserStats } from '../../services/donations.service';
import { Icon } from '../icons';

function DashboardStats({ user }) {
  const [stats, setStats] = useState({
    totalDonations: 0,
    livesImpacted: 0,
    nextEligibleDate: null,
    currentStreak: 0,
    totalPoints: 0,
    achievements: [],
  });

  useEffect(() => {
    fetchUserStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  const fetchUserStats = async () => {
    try {
      setStats(await getUserStats(user.id));
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const statCards = [
    { label: 'Total Donations', value: stats.totalDonations, icon: 'droplet' },
    { label: 'Lives Impacted', value: stats.livesImpacted, icon: 'users' },
    { label: 'Current Streak', value: stats.currentStreak, icon: 'flame' },
    { label: 'Hero Points', value: stats.totalPoints, icon: 'star' },
  ];

  return (
    <div className="p-5 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5">Overview</h2>

      {/* Welcome banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#b20e0e] to-[#6a0505] text-white p-6 rounded-2xl mb-6">
        <Icon name="droplet" className="absolute -right-4 -bottom-6 w-40 h-40 opacity-10" strokeWidth={1} />
        <div className="relative">
          <h3 className="text-lg sm:text-xl font-semibold mb-1">
            Thank you for saving lives, {user.firstName}!
          </h3>
          <p className="text-white/85 text-sm sm:text-base max-w-xl">
            Your blood type{' '}
            <span className="font-bold bg-white/20 px-2 py-0.5 rounded">{user.bloodGroup || '—'}</span>{' '}
            can help save up to 3 lives per donation.
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((c) => (
          <div key={c.label} className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">{c.label}</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{c.value}</p>
              </div>
              <span className="shrink-0 w-10 h-10 rounded-full bg-red-50 text-[#b20e0e] flex items-center justify-center">
                <Icon name={c.icon} className="w-5 h-5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Eligibility + compatibility */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Donation Eligibility</h3>
          {stats.nextEligibleDate ? (
            <div>
              <p className="text-sm text-gray-500 mb-1">Next eligible date</p>
              <p className="text-xl font-bold text-[#b20e0e]">{stats.nextEligibleDate}</p>
              <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2">
                <Icon name="bulb" className="w-5 h-5 text-amber-600 shrink-0" />
                <p className="text-sm text-amber-800">
                  Wait at least 56 days between donations for your safety.
                </p>
              </div>
            </div>
          ) : (
            <div>
              <p className="inline-flex items-center gap-2 text-base font-semibold text-emerald-600 mb-3">
                <Icon name="checkCircle" className="w-5 h-5" /> Eligible to donate now!
              </p>
              <div>
                <Link
                  to="/dashboard/schedule"
                  className="inline-flex items-center gap-2 bg-[#b20e0e] hover:bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  <Icon name="calendar" className="w-4 h-4" /> Schedule Donation
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Blood Compatibility</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-700">You can donate to</p>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {getCompatibleRecipients(user.bloodGroup).map((type) => (
                  <span key={type} className="bg-red-50 text-[#b20e0e] px-2.5 py-1 rounded-md text-sm font-semibold">
                    {type}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">You can receive from</p>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {getCompatibleDonors(user.bloodGroup).map((type) => (
                  <span key={type} className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-sm font-semibold">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements / getting started */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Your Achievements</h3>
        {stats.achievements && stats.achievements.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {stats.achievements.map((a) => (
              <div key={a} className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
                <Icon name="trophy" className="w-5 h-5 text-amber-600" />
                <span className="text-sm font-medium text-amber-800">{a}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <span className="w-10 h-10 rounded-full bg-red-50 text-[#b20e0e] flex items-center justify-center shrink-0">
              <Icon name="droplet" className="w-5 h-5" />
            </span>
            <div>
              <p className="font-medium text-gray-900">No donations yet</p>
              <p className="text-sm text-gray-500">
                Schedule your first donation to start earning achievements.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper functions for blood compatibility
function getCompatibleRecipients(bloodType) {
  const compatibility = {
    'A+': ['A+', 'AB+'],
    'A-': ['A+', 'A-', 'AB+', 'AB-'],
    'B+': ['B+', 'AB+'],
    'B-': ['B+', 'B-', 'AB+', 'AB-'],
    'AB+': ['AB+'],
    'AB-': ['AB+', 'AB-'],
    'O+': ['A+', 'B+', 'AB+', 'O+'],
    'O-': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  };
  return compatibility[bloodType] || [];
}

function getCompatibleDonors(bloodType) {
  const compatibility = {
    'A+': ['A+', 'A-', 'O+', 'O-'],
    'A-': ['A-', 'O-'],
    'B+': ['B+', 'B-', 'O+', 'O-'],
    'B-': ['B-', 'O-'],
    'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    'AB-': ['A-', 'B-', 'AB-', 'O-'],
    'O+': ['O+', 'O-'],
    'O-': ['O-'],
  };
  return compatibility[bloodType] || [];
}

export default DashboardStats;
