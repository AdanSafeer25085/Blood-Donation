import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../Header/Nav/LanguageContext';

const FAQ = () => {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(null);
  const contentRefs = useRef([]);

  const faqs = [
    { question: t('faq.q1'), answer: t('faq.a1') },
    { question: t('faq.q2'), answer: t('faq.a2') },
    { question: t('faq.q3'), answer: t('faq.a3') },
    { question: t('faq.q4'), answer: t('faq.a4') },
    { question: t('faq.q5'), answer: t('faq.a5') },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  useEffect(() => {
    if (activeIndex !== null && contentRefs.current[activeIndex]) {
      const element = contentRefs.current[activeIndex];
      element.style.maxHeight = `${element.scrollHeight}px`;
    }
    if (activeIndex === null) {
      contentRefs.current.forEach((el) => {
        if (el) el.style.maxHeight = "0px";
      });
    }
  }, [activeIndex]);

  return (
    <div id="faq" className="faq bg-gray-100 p-6 scroll-mt-24">
      <div className="max-w-[1250px] m-auto">
        <div className="text-center text-[#b20e0e]">
          <h1 className="text-3xl font-bold mb-6">{t('faq.title')}</h1>
        </div>
        <ul className="space-y-4">
          {faqs.map((faq, index) => (
            <li className="p-4 border rounded cursor-pointer hover:bg-gray-200" key={index}>
              <div className="question font-medium flex justify-between items-center">
                {faq.question}
                <span
                  className="text-xl font-bold"
                  onClick={() => toggleFAQ(index)}
                >
                  {activeIndex === index ? '-' : '+'}
                </span>
              </div>
              <div
                ref={(el) => (contentRefs.current[index] = el)}
                className={`overflow-hidden transition-[max-height] duration-500 ease-in-out`}
                style={{
                  maxHeight: activeIndex === index ? `${contentRefs.current[index]?.scrollHeight}px` : "0px",
                }}
              >
                <div className="answer text-sm mt-2">{faq.answer}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FAQ;
