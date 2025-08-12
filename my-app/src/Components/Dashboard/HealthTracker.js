import React, { useState } from 'react';

function HealthTracker({ user }) {
  const [healthData, setHealthData] = useState({
    weight: '',
    hemoglobin: '',
    bloodPressure: '',
    pulse: '',
    temperature: '',
    notes: ''
  });

  const [healthHistory, setHealthHistory] = useState([
    {
      date: '2024-12-01',
      weight: 70,
      hemoglobin: 14.5,
      bloodPressure: '120/80',
      pulse: 72,
      temperature: 98.6,
      status: 'Eligible'
    },
    {
      date: '2024-11-15',
      weight: 69,
      hemoglobin: 14.2,
      bloodPressure: '118/78',
      pulse: 75,
      temperature: 98.4,
      status: 'Eligible'
    }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRecord = {
      ...healthData,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending Review'
    };
    setHealthHistory([newRecord, ...healthHistory]);
    setHealthData({
      weight: '',
      hemoglobin: '',
      bloodPressure: '',
      pulse: '',
      temperature: '',
      notes: ''
    });
    alert('Health data recorded successfully!');
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Health Tracker</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Health Form */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Record Health Metrics</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={healthData.weight}
                  onChange={(e) => setHealthData({...healthData, weight: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hemoglobin (g/dL)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={healthData.hemoglobin}
                  onChange={(e) => setHealthData({...healthData, hemoglobin: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Blood Pressure
                </label>
                <input
                  type="text"
                  placeholder="120/80"
                  value={healthData.bloodPressure}
                  onChange={(e) => setHealthData({...healthData, bloodPressure: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pulse (bpm)
                </label>
                <input
                  type="number"
                  value={healthData.pulse}
                  onChange={(e) => setHealthData({...healthData, pulse: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                value={healthData.notes}
                onChange={(e) => setHealthData({...healthData, notes: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="3"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md font-medium"
            >
              Record Health Data
            </button>
          </form>
        </div>

        {/* Health Guidelines */}
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900 mb-4">Donation Eligibility Requirements</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Weight:</span>
                <span className="font-medium">≥ 50 kg (110 lbs)</span>
              </div>
              <div className="flex justify-between">
                <span>Hemoglobin (Male):</span>
                <span className="font-medium">≥ 13.0 g/dL</span>
              </div>
              <div className="flex justify-between">
                <span>Hemoglobin (Female):</span>
                <span className="font-medium">≥ 12.5 g/dL</span>
              </div>
              <div className="flex justify-between">
                <span>Blood Pressure:</span>
                <span className="font-medium">90-180 / 50-100 mmHg</span>
              </div>
              <div className="flex justify-between">
                <span>Pulse:</span>
                <span className="font-medium">50-100 bpm</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Health Tips for Donors</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Stay hydrated - drink 16 oz of water before donating</li>
              <li>• Eat iron-rich foods (spinach, red meat, beans)</li>
              <li>• Get adequate sleep (7-8 hours)</li>
              <li>• Avoid alcohol 24 hours before donation</li>
              <li>• Take vitamin C to improve iron absorption</li>
              <li>• Exercise regularly to maintain good health</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Health History */}
      <div className="mt-8 bg-white rounded-lg border border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Health History</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Weight (kg)</th>
                  <th className="text-left py-3 px-4">Hemoglobin</th>
                  <th className="text-left py-3 px-4">Blood Pressure</th>
                  <th className="text-left py-3 px-4">Pulse</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {healthHistory.map((record, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4">{record.date}</td>
                    <td className="py-3 px-4">{record.weight}</td>
                    <td className="py-3 px-4">{record.hemoglobin}</td>
                    <td className="py-3 px-4">{record.bloodPressure}</td>
                    <td className="py-3 px-4">{record.pulse}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.status === 'Eligible' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HealthTracker;