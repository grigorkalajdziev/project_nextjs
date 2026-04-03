import React, { createContext, useContext, useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import { database } from "../pages/api/register";
import Preloader from "../components/Preloader";

const fonts = {
  en: "'Libre Baskerville', cursive",
  mk: "'PT Serif', cursive",
};

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
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const snapshot = await get(ref(database, "translations"));
        if (snapshot.exists()) {
          setTranslations(snapshot.val());
        } else {
          console.warn("No translations found.");
          setTranslations({});
        }
      } catch (error) {
        console.error("Failed to fetch translations:", error);
        setTranslations({});
      } finally {
        setLoading(false);
      }
    };

    fetchTranslations();
  }, []);
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("language", language);
    }

    document.body.style.fontFamily =
      fonts[language] || fonts[DEFAULT_LANG];
  }, [language]);

  const changeLanguage = (lang) => {
    if (SUPPORTED_LANGS.includes(lang)) {
      setLanguage(lang);
    }
  };
 
  const t = (key) => {
    if (!translations) return ""; 

    const langData = translations[language];
    if (langData && langData[key] !== undefined) {
      return langData[key];
    }

    const enData = translations["en"];
    if (enData && enData[key] !== undefined) {
      return enData[key];
    }

    return "";
  };

 
  if (loading) {
    return <Preloader />; 
  }

  return (
    <LocalizationContext.Provider
      value={{
        changeLanguage,
        t,
        currentLanguage: language,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
};

export default LocalizationContext;