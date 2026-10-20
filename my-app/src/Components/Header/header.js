import { Link } from "react-router-dom";
import { useLanguage } from "./Nav/LanguageContext";

function Header() {
  const { t } = useLanguage();

  return (
    <div className="bg-[#eaeaee] relative min-h-[70vh] flex items-center overflow-hidden">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/image/back1.mp4" type="video/mp4" />
      </video>
      {/* Dark overlay for readable text */}
      <div className="absolute inset-0 bg-black/55" />

      <div className="max-w-[1100px] mx-auto px-5 py-16 relative z-10 text-white text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          {t("hero.title")}
        </h1>
        <p className="text-sm sm:text-base md:text-lg mt-5 max-w-2xl mx-auto text-gray-100">
          {t("hero.subtitle")}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="bg-[#b20e0e] hover:bg-red-700 transition-colors px-8 py-3 rounded-lg font-semibold text-lg shadow-lg"
          >
            🩸 {t("hero.donate")}
          </Link>
          <Link
            to="/register"
            className="bg-white text-[#b20e0e] hover:bg-gray-100 transition-colors px-8 py-3 rounded-lg font-semibold text-lg shadow-lg"
          >
            🆘 {t("hero.request")}
          </Link>
          <Link
            to="/find-donors"
            className="border-2 border-white hover:bg-white hover:text-[#b20e0e] transition-colors px-8 py-3 rounded-lg font-semibold text-lg"
          >
            🔍 {t("hero.findDonors")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Header;
