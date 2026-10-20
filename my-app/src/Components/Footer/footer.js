import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../Header/Nav/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/find-donors", label: t("nav.findDonors") },
    { to: "/blood-requests", label: t("nav.requests") },
    { to: "/about", label: t("nav.about") },
  ];

  return (
    <footer className="bg-[#eaeaee] text-black py-8">
      <div className="max-w-[1250px] mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h2 className="text-lg font-bold mb-3 text-[#b20e0e]">{t("footer.aboutTitle")}</h2>
            <p className="text-sm text-gray-700">{t("footer.aboutText")}</p>
          </div>

          {/* Links */}
          <div>
            <h2 className="text-lg font-bold mb-3 text-[#b20e0e]">{t("footer.quickLinks")}</h2>
            <ul className="space-y-2">
              {links.map((l) => (
                <li key={l.to} className="list-disc ml-5">
                  <Link to={l.to} className="hover:text-[#b20e0e]">{l.label}</Link>
                </li>
              ))}
              <li className="list-disc ml-5">
                <a href="/#faq" className="hover:text-[#b20e0e]">{t("nav.faq")}</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-lg font-bold mb-3 text-[#b20e0e]">{t("footer.contact")}</h2>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>Email: support@blooddonation.com</li>
              <li>Phone: +123 456 7890</li>
              <li>Address: 123 Blood Drive, Life City</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-400 pt-4 text-center">
          <p className="text-sm text-[#b20e0e]">
            &copy; 2024 Heart-To-Heart. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
