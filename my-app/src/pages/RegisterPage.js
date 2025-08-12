import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ExampleV2 from "../Components/Form/form";
import GetBloodForm from "../Components/Form/getForm";
import DisplayData from "../Components/Form/getBloodForm";

function RegisterPage() {
  const [showChoice, setShowChoice] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showGetBloodForm, setShowGetBloodForm] = useState(false);
  const [showDisplayData, setShowDisplayData] = useState(false);

  const handleFormSubmit = () => {
    setShowForm(false);
    setShowChoice(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/">
            <img
              className="mx-auto w-24 h-24 rounded-full mb-4"
              src="/image/logo.png"
              alt="Heart To Heart"
            />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Register with Heart To Heart</h1>
          <p className="mt-2 text-gray-600">Choose how you'd like to help save lives</p>
        </div>

        {showDisplayData ? (
          <DisplayData onBack={() => setShowDisplayData(false)} />
        ) : showForm ? (
          <ExampleV2
            onSubmit={handleFormSubmit}
            onClose={() => {
              setShowForm(false);
              setShowChoice(true);
            }}
          />
        ) : showGetBloodForm ? (
          <GetBloodForm
            onBack={() => {
              setShowGetBloodForm(false);
              setShowChoice(true);
            }}
            setViewDisplayData={(viewData) => setShowDisplayData(viewData)}
          />
        ) : showChoice ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl text-red-800 font-extrabold mb-6 text-center">
              Choose an Option
            </h2>
            <div className="space-y-4 mb-6">
              <div
                className="border-[#991b1b] text-red-800 border-2 p-4 cursor-pointer rounded-lg font-semibold hover:bg-red-50 transition-colors text-center"
                onClick={() => {
                  setShowForm(true);
                  setShowChoice(false);
                }}
              >
                <div className="text-4xl mb-2">🩸</div>
                <div className="text-lg">Donate Blood</div>
                <div className="text-sm text-gray-600 mt-1">Register as a blood donor</div>
              </div>
              <div
                className="border-[#991b1b] text-red-800 border-2 p-4 cursor-pointer rounded-lg font-semibold hover:bg-red-50 transition-colors text-center"
                onClick={() => {
                  setShowGetBloodForm(true);
                  setShowChoice(false);
                }}
              >
                <div className="text-4xl mb-2">🆘</div>
                <div className="text-lg">Request Blood</div>
                <div className="text-sm text-gray-600 mt-1">Find blood donors for urgent needs</div>
              </div>
            </div>
            
            <div className="text-center">
              <Link
                to="/"
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium"
              >
                Back to Home
              </Link>
            </div>

            <div className="mt-6 text-center">
              <div className="text-sm text-gray-500">Already have an account?</div>
              <Link
                to="/login"
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Sign in here
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default RegisterPage;