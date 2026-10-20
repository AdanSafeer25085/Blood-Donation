import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "./LanguageContext";
import { useAuth } from "../../../contexts/AuthContext";

function Nav() {
  const { isEnglish, toggleLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 35);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/find-donors", label: t("nav.findDonors") },
    { to: "/blood-requests", label: t("nav.requests") },
    { to: "/about", label: t("nav.about") },
    { to: "/#faq", label: t("nav.faq") },
  ];

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  const LangToggle = () => (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label="Toggle language"
      className="flex items-center w-[88px] h-[38px] shadow-md rounded-full bg-[#b20e0e] cursor-pointer relative shrink-0"
    >
      <span className={`w-1/2 text-center text-sm font-bold z-10 ${isEnglish ? "text-white" : "text-gray-300"}`}>EN</span>
      <span className={`w-1/2 text-center text-sm font-bold z-10 ${!isEnglish ? "text-white" : "text-gray-300"}`}>UR</span>
      <div
        className={`absolute bg-black rounded-full w-[42px] h-[32px] top-[3px] left-[2px] transition-transform duration-300 ${isEnglish ? "translate-x-0" : "translate-x-[42px]"} z-0`}
      />
    </button>
  );

  return (
    <nav
      className={`transition-colors duration-300 z-50 ${isScrolled ? "bg-[#eaeaee] fixed top-0 w-full shadow-md" : "bg-transparent"}`}
    >
      <div className="flex items-center justify-between w-full max-w-[1250px] mx-auto py-1 px-3">
        {/* Logo */}
        <Link to="/" className="w-[50px] h-[50px] md:w-[64px] md:h-[64px] shrink-0">
          <img className="w-full h-full object-cover rounded-full" src="/image/logo.png" alt="Heart To Heart" />
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex gap-7 font-semibold text-[17px]">
          {links.map((l) => (
            <li key={l.to}>
              {l.to.startsWith("/#") ? (
                <a href={l.to} className="hover:text-[#b20e0e]">{l.label}</a>
              ) : (
                <Link to={l.to} className="hover:text-[#b20e0e]">{l.label}</Link>
              )}
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <LangToggle />

          {/* Desktop auth actions */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/dashboard" className="text-[#b20e0e] font-semibold hover:underline">
                  {t("nav.dashboard")}
                </Link>
                <button onClick={handleLogout} className="bg-[#b20e0e] text-white py-1.5 px-5 rounded-md font-semibold">
                  {t("nav.logout")}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-[#b20e0e] font-semibold hover:underline">
                  {t("nav.login")}
                </Link>
                <Link to="/register" className="bg-[#b20e0e] text-white py-1.5 px-5 rounded-md font-semibold">
                  {t("nav.register")}
                </Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label="Menu"
            className="lg:hidden w-[44px] h-[44px] rounded-full flex items-center justify-center bg-black text-[#b20e0e]"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white shadow-lg border-t">
          <ul className="flex flex-col py-2 font-semibold text-[17px]">
            {links.map((l) => (
              <li key={l.to}>
                {l.to.startsWith("/#") ? (
                  <a href={l.to} onClick={() => setIsMenuOpen(false)} className="block px-5 py-3 hover:bg-gray-100">{l.label}</a>
                ) : (
                  <Link to={l.to} onClick={() => setIsMenuOpen(false)} className="block px-5 py-3 hover:bg-gray-100">{l.label}</Link>
                )}
              </li>
            ))}
            <li className="px-5 py-3 flex gap-3">
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="flex-1 text-center bg-gray-100 py-2 rounded-md">{t("nav.dashboard")}</Link>
                  <button onClick={handleLogout} className="flex-1 bg-[#b20e0e] text-white py-2 rounded-md">{t("nav.logout")}</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex-1 text-center bg-gray-100 py-2 rounded-md">{t("nav.login")}</Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} className="flex-1 text-center bg-[#b20e0e] text-white py-2 rounded-md">{t("nav.register")}</Link>
                </>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Nav;
