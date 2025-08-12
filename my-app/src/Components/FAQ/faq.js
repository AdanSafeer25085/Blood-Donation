import React, { useState, useRef, useEffect } from 'react';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const contentRefs = useRef([]);

  const faqs = [
    {
      question: "Who can donate blood?",
      answer: "Healthy individuals aged 18-65, weighing at least 50kg, can donate blood."
    },
    {
      question: "How often can I donate blood?",
      answer: "You can donate whole blood every 8 weeks, and platelets every 2 weeks."
    },
    {
      question: "Is blood donation safe?",
      answer: "Yes, blood donation is a safe process. Sterile equipment is used for every donation."
    },
    {
      question: "What should I do before donating blood?",
      answer: "Drink plenty of water, have a nutritious meal, and avoid alcohol for 24 hours before donating."
    },
    {
      question: "How long does the donation process take?",
      answer: "The entire process usually takes about an hour, while the actual donation takes about 10 minutes."
    }
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
    <div className="faq bg-gray-100 p-6">
      <div className="max-w-[1250px] m-auto">
        <div className="text-center text-[#b20e0e] group">
          <h1 className="text-3xl font-bold mb-4 group-hover:hidden">FAQs</h1>
          <h1 className="text-3xl font-bold mb-4 hidden group-hover:block">Frequently Asked Questions</h1>
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
