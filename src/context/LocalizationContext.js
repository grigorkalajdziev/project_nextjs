import React, { createContext, useContext, useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import { database } from "../pages/api/register";

const SUPPORTED_LANGS = ["en", "mk"];
const DEFAULT_LANG = "mk";

const LocalizationContext = createContext();

export const useLocalization = () => {
  return useContext(LocalizationContext);
};

export const LocalizationProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_LANG;
    const saved = localStorage.getItem("language");
    return SUPPORTED_LANGS.includes(saved) ? saved : DEFAULT_LANG;
  });
 
  const [translations, setTranslations] = useState(null);
  useEffect(() => {
  
    const cached = sessionStorage.getItem("translations");
    if (cached) {
      try {
        setTranslations(JSON.parse(cached));
        return;
      } catch {
        sessionStorage.removeItem("translations");
      }
    }

    const fetchTranslations = async () => {
      try {
        const snapshot = await get(ref(database, "translations"));
        if (snapshot.exists()) {
          const data = snapshot.val();
          setTranslations(data);
          sessionStorage.setItem("translations", JSON.stringify(data));
        } else {
          console.warn("No translations found.");
          setTranslations({});
        }
      } catch (error) {
        console.error("Failed to fetch translations:", error);
        setTranslations({});
      }
    };

    fetchTranslations();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("language", language);
    }  
  }, [language]);

  const changeLanguage = (lang) => {
    if (SUPPORTED_LANGS.includes(lang)) {
      setLanguage(lang);
    }
  };

  const t = (key) => {
    if (!translations) return key; 

    const langData = translations[language];
    if (langData && langData[key] !== undefined) {
      return langData[key];
    }

    const enData = translations["en"];
    if (enData && enData[key] !== undefined) {
      return enData[key];
    }

    return key; 
  };
  
  return (
    <LocalizationContext.Provider
      value={{
        changeLanguage,
        t,
        currentLanguage: language,
        translationsReady: translations !== null,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
};

export default LocalizationContext;