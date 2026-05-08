import React, { createContext, useContext, useState, useEffect } from "react";
// Import your exported JSON directly
import translationsData from "../data/translations.json";

const SUPPORTED_LANGS = ["en", "mk"];
const DEFAULT_LANG = "mk";

const LocalizationContext = createContext();

export const useLocalization = () => useContext(LocalizationContext);

export const LocalizationProvider = ({ children }) => {
  const [language, setLanguage] = useState(DEFAULT_LANG);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Check localStorage only once on mount
    const saved = localStorage.getItem("language");
    if (SUPPORTED_LANGS.includes(saved)) {
      setLanguage(saved);
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("language", language);
    }
  }, [language, isMounted]);

  const changeLanguage = (lang) => {
    if (SUPPORTED_LANGS.includes(lang)) {
      setLanguage(lang);
    }
  };

  const t = (key) => {
    // 1. Try current language
    const langData = translationsData[language];
    if (langData && langData[key] !== undefined) {
      return langData[key];
    }

    // 2. Fallback to English
    const enData = translationsData["en"];
    if (enData && enData[key] !== undefined) {
      return enData[key];
    }

    // 3. Last resort: return key itself (prevents layout collapse)
    return key; 
  };

  return (
    <LocalizationContext.Provider
      value={{
        changeLanguage,
        t,
        currentLanguage: language,
        // Always true now because the file is bundled
        translationsReady: true, 
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
};

export default LocalizationContext;