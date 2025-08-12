import React from "react";
import { Link } from "react-router-dom";

function Button() {
  return (
    <div>
      <Link
        to="/register"
        className="text-transparent bg-clip-text bg-gradient-to-tr from-red-600 to-[#b20e0e] py-1 sm:py-1 px-6 sm:px-8 text-sm sm:text-lg rounded-md font-semibold border-2 border-[#F8393B]"
      >
        Register
      </Link>
    </div>
  );
}

export default Button;
