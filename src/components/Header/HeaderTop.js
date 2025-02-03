import { IoIosArrowDown, IoLogoFacebook, IoLogoInstagram, IoLogoYoutube } from "react-icons/io";
import { FaXTwitter } from "react-icons/fa6";
import { useLocalization } from "../../context/LocalizationContext";
import { Container } from "react-bootstrap";
import Link from "next/link";
import { useState, useEffect } from "react";
import { auth } from "../../pages/api/register"; // Import Firebase auth
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { useToasts } from "react-toast-notifications";

const HeaderTop = () => {
  const { t, currentLanguage, changeLanguage } = useLocalization();
  const { addToast } = useToasts();
  const [currency, setCurrency] = useState("EUR");
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setCurrency(currentLanguage === "en" ? "EUR" : "MKD");
  }, [currentLanguage]);

  // Track login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);      
      
      addToast(t("logout_success"), {
        appearance: "info",
        autoDismiss: true,
      });
  
      // Delay the redirect
      setTimeout(() => {
        router.push("/other/login-register");
      }, 2000);
    } catch (error) {
      addToast(error.message, { appearance: "error", autoDismiss: true });
      console.error("Logout Error:", error);
    }
  };

  return (
    <div className="header-top-area border-bottom--grey space-pt--10 space-pb--10 d-none d-lg-block">
      <Container className="wide">
        <div className="header-top">
          <div className="header-top__left">
            <div className="language-change change-dropdown">
              <span>{currentLanguage === "en" ? t("english") : t("macedonian")}</span> <IoIosArrowDown />
              <ul>
                <li>
                  <button onClick={() => changeLanguage("mk")}>{t("macedonian")}</button>
                </li>
                <li>
                  <button onClick={() => changeLanguage("en")}>{t("english")}</button>
                </li>
              </ul>
            </div>
            <span className="header-separator">|</span>
            <div className="currency-change change-dropdown">
              <span>{currency}</span> <IoIosArrowDown />
              <ul>
                <li>
                  <button onClick={() => setCurrency("MKD")} disabled={true}>MKD</button>
                </li>
                <li>
                  <button onClick={() => setCurrency("EUR")} disabled={true}>EUR</button>
                </li>
              </ul>
            </div>
            <span className="header-separator">|</span>
            <div className="order-online-text">
              {t("order_online_call")}
              <span className="number">(+389) 78/343-377</span>
            </div>
          </div>

          <div className="header-top__right">
            {/* Check if user is logged in */}
            {user ? (
              <>
                <span className="user-email">{user.email}</span>
                <span className="header-separator">|</span>
                <a href="#" className="signout-link" onClick={handleLogout}>
                {t("logout")}
              </a>
              </>
            ) : (
              <>
                <div className="signup-link">
                  <Link href="/other/login-register" as={process.env.PUBLIC_URL + "/other/login-register"}>
                    <a>{t("signup_login")}</a>
                  </Link>
                </div>
              </>
            )}

            <span className="header-separator">|</span>
            <div className="top-social-icons">
              <ul>
                <li><a href="https://x.com" target="_blank"><FaXTwitter /></a></li>
                <li><a href="https://www.facebook.com" target="_blank"><IoLogoFacebook /></a></li>
                <li><a href="https://www.instagram.com" target="_blank"><IoLogoInstagram /></a></li>
                <li><a href="https://www.youtube.com" target="_blank"><IoLogoYoutube /></a></li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HeaderTop;
