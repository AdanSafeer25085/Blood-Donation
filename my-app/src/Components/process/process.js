// components/DonationProcess.jsx
import React from 'react';
import { useLanguage } from '../Header/Nav/LanguageContext';

const DonationProcess = () => {
  const { t } = useLanguage();

  const donorSteps = [t('process.donor1'), t('process.donor2'), t('process.donor3')];
  const recipientSteps = [t('process.recipient1'), t('process.recipient2'), t('process.recipient3')];

  const Column = ({ title, icon, steps, accent }) => (
    <div className="bg-white rounded-xl shadow-md p-6 flex-1">
      <div className="flex items-center gap-3 mb-5">
        <span className="text-3xl">{icon}</span>
        <h3 className={`text-xl font-bold ${accent}`}>{title}</h3>
      </div>
      <ol className="space-y-4">
        {steps.map((step, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className={`shrink-0 w-7 h-7 rounded-full text-white text-sm font-bold flex items-center justify-center ${accent === 'text-[#b20e0e]' ? 'bg-[#b20e0e]' : 'bg-blue-600'}`}>
              {i + 1}
            </span>
            <span className="text-gray-700 text-sm md:text-base">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );

  return (
    <div className="bg-gray-50 py-14 px-5">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-[#b20e0e] mb-10 text-center">
          {t('process.title')}
        </h2>
        <div className="flex flex-col md:flex-row gap-6">
          <Column title={t('process.donorTitle')} icon="🩸" steps={donorSteps} accent="text-[#b20e0e]" />
          <Column title={t('process.recipientTitle')} icon="🆘" steps={recipientSteps} accent="text-blue-600" />
        </div>
      </div>
    </div>
  );
};

export default DonationProcess;
