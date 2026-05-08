import { useEffect, useState } from "react";
import { useLocalization } from "../../context/LocalizationContext";
import { IoIosInformationCircleOutline } from "react-icons/io";

const CookieConsent = () => {
  const { t, translationsReady } = useLocalization();
  const [mounted, setMounted] = useState(false);
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    setMounted(true);
    const consent = localStorage.getItem("cookieConsent");
    if (consent === "true") {
      setAccepted(true);
    } else {
      setAccepted(false);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setAccepted(true);
  };

  // Ensure we don't render during SSR or if already accepted
  if (!mounted || accepted || !translationsReady) {
    return null;
  }

  return (
    <div className="cookie-consent-banner">
      <div className="cookie-consent-banner__icon">
        <IoIosInformationCircleOutline size={24} />
      </div>

      <div className="cookie-consent-banner__body">
        <p>{t("cookies") || "We use cookies to improve your experience."}</p>
        <button onClick={handleAccept}>
          {t("accept") || "Accept"}
        </button>
      </div>

      <button
        className="cookie-consent-banner__close"
        onClick={() => setAccepted(true)}
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
};

export default CookieConsent;