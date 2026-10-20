// components/FindBloodDrive.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../Header/Nav/LanguageContext";

const FindBloodDrive = () => {
  const { t } = useLanguage();
  const [location, setLocation] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (location.trim()) {
      navigate('/find-donors', {
        state: {
          location: location.trim(),
          bloodGroup: bloodGroup || '',
          fromHomePage: true
        }
      });
    } else {
      alert(t('search.needLocation'));
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="bg-white py-14 px-5">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-[#b20e0e] mb-2 text-center">
          {t('search.title')}
        </h2>
        <p className="text-gray-600 text-center mb-8">
          {t('search.subtitle')}
        </p>

        <div className="bg-gray-50 p-6 rounded-xl shadow-md">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📍 {t('search.location')} *
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b20e0e] focus:border-[#b20e0e] outline-none"
                placeholder={t('search.locationPlaceholder')}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🩸 {t('search.bloodGroup')}
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b20e0e] focus:border-[#b20e0e] outline-none"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
              >
                <option value="">{t('search.allGroups')}</option>
                {bloodGroups.map((group) => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSearch}
              className="w-full bg-[#b20e0e] text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <span>🔍</span>
              <span>{t('search.button')}</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-[#b20e0e]">5000+</div>
            <div className="text-sm text-gray-600">{t('stats.donors')}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-[#b20e0e]">50+</div>
            <div className="text-sm text-gray-600">{t('stats.cities')}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-[#b20e0e]">24/7</div>
            <div className="text-sm text-gray-600">{t('stats.available')}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-[#b20e0e]">100%</div>
            <div className="text-sm text-gray-600">{t('stats.verified')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindBloodDrive;
