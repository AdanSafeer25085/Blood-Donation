import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { translations } from "../../../i18n/translations";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Persist the choice so it survives reloads.
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem("lang") || "en";
    } catch {
      return "en";
    }
  });

  const isEnglish = lang === "en";

  useEffect(() => {
    try {
      localStorage.setItem("lang", lang);
    } catch {
      /* ignore */
    }
    // Set the document language. Layout stays LTR so the responsive
    // design is preserved; only the text content changes.
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = useCallback(() => {
    setLang((prev) => (prev === "en" ? "ur" : "en"));
  }, []);

  // Translate a key, falling back to English, then to the key itself.
  const t = useCallback(
    (key) => {
      const dict = translations[lang] || translations.en;
      return dict[key] || translations.en[key] || key;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ isEnglish, lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;
