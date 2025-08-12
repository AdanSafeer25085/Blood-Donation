import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#eaeaee] text-black py-6">
      <div className="max-w-[1250px] mx-auto px-4">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* About Section */}
          <div>
            <h2 className="text-lg font-bold mb-3 text-[#b20e0e]">About Us</h2>
            <p className="text-sm text-black">
              We are committed to saving lives through blood donation. Join us
              to make a difference by donating blood or supporting our cause.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h2 className="text-lg font-bold mb-3 text-[#b20e0e]">Quick Links</h2>
            <ul className="space-y-2">
              <li className="list-disc ml-5">
                <a href="/home" className="hover:text-[#b20e0e] group">
                <span className="relative">
                  Home
                  <span class="absolute left-0 bottom-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </a>
              </li>
              <li className="list-disc ml-5">
              <a href="/home" className="hover:text-[#b20e0e] group">
                <span className="relative">
                  Testing
                  <span class="absolute left-0 bottom-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </a>
              </li>
              <li className="list-disc ml-5">
              <a href="/home" className="hover:text-[#b20e0e] group">
                <span className="relative">
                  About Us
                  <span class="absolute left-0 bottom-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </a>
              </li>
              <li className="list-disc ml-5">
              <a href="/home" className="hover:text-[#b20e0e] group">
                <span className="relative">
                  Contact Us
                  <span class="absolute left-0 bottom-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </a>
              </li>
              <li className="list-disc ml-5">
              <a href="/home" className="hover:text-[#b20e0e] group">
                <span className="relative">
                  FAQs
                  <span class="absolute left-0 bottom-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h2 className="text-lg font-bold mb-3 text-[#b20e0e]">Contact Us</h2>
            <ul className="text-sm text-black space-y-2">
              <li>Email: support@blooddonation.com</li>
              <li>Phone: +123 456 7890</li>
              <li>Address: 123 Blood Drive, Life City</li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-6 border-t border-gray-700 pt-4 text-center">
          <p className="text-sm text-[#b20e0e]">
            &copy; 2024 Blood Donation. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
