import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function DisplayData({ onBack }) {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the new donor search page
    navigate('/find-donors');
  }, [navigate]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to donor search...</p>
      </div>
    </div>
  );
}

export default DisplayData;
