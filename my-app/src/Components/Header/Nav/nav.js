import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Button from "../../Button/button.js";

function Nav() {
  const [isEnglish, setIsEnglish] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [translations, setTranslations] = useState({});

  const handleClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 35) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const toggleLanguage = async () => {
    setIsEnglish(!isEnglish);
    if (!isEnglish) {
      return; // Already in Urdu; no need to fetch again.
    }
    try {
      const response = await axios.post(
        "https://translation.googleapis.com/language/translate/v2", // Replace with your API URL
        {
          q: ["Home", "Testing", "About Us", "Contact", "FAQ"], // Add all content you want to translate
          target: "ur", // Target language
          source: "en", // Source language
          key: "YOUR_API_KEY" // Replace with your API key
        }
      );
      const translatedData = response.data.data.translations.reduce(
        (acc, curr, index) => {
          acc[`key${index}`] = curr.translatedText;
          return acc;
        },
        {}
      );
      setTranslations(translatedData);
    } catch (error) {
      console.error("Translation API Error:", error);
    }
  };

  return (
    <>
      <nav
        className={`transition-colors duration-300 z-50 ${isScrolled ? "bg-[#eaeaee] fixed top-0 w-full" : "bg-transparent"
          }`}
        style={isScrolled ? { boxShadow: "0 3px 8px 0 rgb(210,214,222)" } : {}}
      >
        <div className="flex items-center justify-between w-full max-w-[1250px] mx-auto py-1 px-2">
          <div className="w-[50px] md:w-[80px] h-[50px] md:h-[80px]">
            <img
              className="w-full h-full object-cover rounded-full"
              src="./image/logo.png"
              alt="Logo"
            />
          </div>

          {/* Sidebar for Small Screens */}
          <div
            className={`fixed top-0 right-0 h-full bg-white shadow-md transform transition-transform duration-300 z-40 ${isMenuOpen ? "translate-x-full" : "-translate-x-0"
              } w-2/3 sm:w-1/2 lg:hidden`}
          >
            <div className="flex justify-end p-4">
              {/* Close Icon */}

            </div>
            {/* Navigation Links */}
            <ul className="lg:flex gap-8 font-semibold text-[18px] flex flex-col justify-center text-center">
              <li>
                <button type="button" className="hover:text-[#b20e0e] bg-transparent border-none">
                  {isEnglish ? "Home" : translations.key0 || "لوڈ ہو رہا ہے"}
                </button>
              </li>
              <li>
                <button type="button" className="hover:text-[#b20e0e] bg-transparent border-none">
                  {isEnglish ? "Testing" : translations.key1 || "لوڈ ہو رہا ہے"}
                </button>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#b20e0e]">
                  {isEnglish ? "About Us" : translations.key2 || "لوڈ ہو رہا ہے"}
                </Link>
              </li>
              <li>
                <button type="button" className="hover:text-[#b20e0e] bg-transparent border-none">
                  {isEnglish ? "Contact" : translations.key3 || "لوڈ ہو رہا ہے"}
                </button>
              </li>
              <li>
                <button type="button" className="hover:text-[#b20e0e] bg-transparent border-none">
                  {isEnglish ? "FAQ" : translations.key4 || "لوڈ ہو رہا ہے"}
                </button>
              </li>
            </ul>
          </div>

          {/* Desktop Nav Links */}
          <ul className="hidden lg:flex gap-8 font-semibold text-[18px]">
            <li>
              <button type="button" className="hover:text-[#b20e0e] bg-transparent border-none">
                {isEnglish ? "Home" : translations.key0 || "لوڈ ہو رہا ہے"}
              </button>
            </li>
            <li>
              <button type="button" className="hover:text-[#b20e0e] bg-transparent border-none">
                {isEnglish ? "Testing" : translations.key1 || "لوڈ ہو رہا ہے"}
              </button>
            </li>
            <li>
              <Link to="/about" className="hover:text-[#b20e0e]">
                {isEnglish ? "About Us" : translations.key2 || "لوڈ ہو رہا ہے"}
              </Link>
            </li>
            <li>
              <button type="button" className="hover:text-[#b20e0e] bg-transparent border-none">
                {isEnglish ? "Contact" : translations.key3 || "لوڈ ہو رہا ہے"}
              </button>
            </li>
            <li>
              <button type="button" className="hover:text-[#b20e0e] bg-transparent border-none">
                {isEnglish ? "FAQ" : translations.key4 || "لوڈ ہو رہا ہے"}
              </button>
            </li>
          </ul>

          {/* Language Toggle and Button */}
          <div className=" flex sm:flex lg:flex items-center lg:gap-9">
            {/* Language Toggle */}
            <div
              onClick={toggleLanguage}
              className="flex items-center w-[90px] sm:w-[105px] h-[40px] sm:h-[45px] shadow-md rounded-full pl-1 bg-[#b20e0e] cursor-pointer relative"
            >
              <span
                className={`w-1/2 text-center text-sm sm:text-lg font-bold ${isEnglish ? "text-white" : "text-gray-400"
                  } z-10 relative`}
              >
                EN
              </span>
              <span
                className={`w-1/2 text-center text-sm sm:text-lg font-bold ${!isEnglish ? "text-white" : "text-gray-400"
                  } z-10 relative`}
              >
                UR
              </span>
              <div
                className={`absolute bg-black rounded-full w-[45px] h-[35px] sm:w-[50px] sm:h-[40px] top-[2px] transition-transform ${isEnglish
                    ? "transform translate-x-0"
                    : "transform translate-x-full"
                  } z-0`}
              />
            </div>
            <Button />
          </div>
          {/* Hamburger Menu */}
          <div className="lg:hidden border-2 border-black w-[50px] md:w-[80px] h-[50px] md:h-[80px] rounded-full flex justify-center bg-black">
            <button
              onClick={handleClick}
              className="lg:hidden text-[#b20e0e] focus:outline-none z-50"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Nav;
