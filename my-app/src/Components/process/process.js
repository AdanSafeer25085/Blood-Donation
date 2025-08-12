// components/DonationProcess.jsx
import React from 'react';

const DonationProcess = () => {
  const steps = [
    'You can register as a donor or apply to receive blood from registered donors.',
    'Click on the register button',
    'If you want to donate blood choose first Option',
    'If you want to recieve blood select second option',
    'If your reports are ok you can login as a donner',
    'If you fulfill the requirenments to get blood you will be given',
    'Find the nearest person to you and get blood',
  ];

  return (
    <div className="bg-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-[#b20e0e] mb-6 text-center">
          Donation Process
        </h2>
        <ul className="space-y-3">
          {steps.map((step, index) => (
            <li
              key={index}
              className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 bg-gray-100 p-4 rounded-md shadow-md"
            >
              <span className="text-[#b20e0e] font-bold text-lg">{index + 1}.</span>
              <span className="text-gray-700 text-sm md:text-base">{step}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DonationProcess;
