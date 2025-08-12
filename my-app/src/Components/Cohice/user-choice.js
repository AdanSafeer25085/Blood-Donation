import React, { useState } from "react";
import ExampleV2 from "../Form/form";
import GetBloodForm from "../Form/getForm";
import DisplayData from "../Form/getBloodForm";

function UserChoice({ onClose }) {
  const [showForm, setShowForm] = useState(false); // Handles "Donate Blood" form
  const [showGetBloodForm, setShowGetBloodForm] = useState(false); // Handles "Get Blood" form
  const [showDisplayData, setShowDisplayData] = useState(false); // Handles data display

  const handleFormSubmit = (formData) => {
    // Logic for handling form submission
    setShowForm(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
      {showDisplayData ? (
        <DisplayData onBack={() => setShowDisplayData(false)} />
      ) : showForm ? (
        <ExampleV2
          onSubmit={handleFormSubmit}
          onClose={() => setShowForm(false)}
        />
      ) : showGetBloodForm ? (
        <GetBloodForm
          onBack={() => setShowGetBloodForm(false)}
          setViewDisplayData={(viewData) => setShowDisplayData(viewData)}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-lg w-[350px] p-6 m-5">
          <h2 className="text-2xl text-red-800 font-extrabold mb-4 ml-2">
            Choose an Option
          </h2>
          <div className="mb-2">
            <div
              className="border-[#991b1b] text-red-800 border-2 p-3 cursor-pointer mb-4 rounded-lg font-semibold"
              onClick={() => setShowForm(true)}
            >
              Donate Blood
            </div>
            <div
              className="border-[#991b1b] text-red-800 border-2 p-3 cursor-pointer rounded-lg font-semibold"
              onClick={() => setShowGetBloodForm(true)}
            >
              Get Blood
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-[#991b1b] text-white px-4 py-2 rounded-lg"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default UserChoice;
