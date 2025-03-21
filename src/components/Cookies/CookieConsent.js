import React, { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { useLocalization } from "../../context/LocalizationContext";

const CookieConsentToast = () => {
  const { addToast, removeAllToasts } = useToasts();
  const { t, currentLanguage } = useLocalization(); 
  const [hasShownToast, setHasShownToast] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
    
      removeAllToasts();
      setHasShownToast(true);
     
      addToast(
        <div className="flex flex-col">
          <p>{t("cookies")}</p>
          <button
            onClick={() => {
              localStorage.setItem("cookieConsent", "true");
              window.location.reload(); 
           }}
            className="mt-2 bg-blue-600 hover:bg-blue-500 text-black py-1 px-3 rounded"
          >
            {t("accept")}
          </button>
        </div>,
        {
          appearance: "info",
          autoDismiss: false,
        }
      );
    }
  }, [addToast, removeAllToasts, t, currentLanguage, hasShownToast]);

  return null;
};

export default CookieConsentToast;
