import { IoIosArrowDown, IoLogoFacebook, IoLogoInstagram, IoLogoYoutube } from "react-icons/io";
import { FaXTwitter } from "react-icons/fa6";
import { MdLanguage } from "react-icons/md";
import { TbCurrencyEuro } from "react-icons/tb";
import { VscAccount } from "react-icons/vsc";
import { useLocalization } from "../../context/LocalizationContext";
import { Container } from "react-bootstrap";
import Link from "next/link";
import { useState, useEffect } from "react";
import { auth } from "../../pages/api/register"; // Adjust path if necessary
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { useToasts } from "react-toast-notifications";
import ReactCountryFlag from "react-country-flag";

const HeaderTop = () => {
  const { t, currentLanguage, changeLanguage } = useLocalization();
  const { addToast } = useToasts();
  const [currency, setCurrency] = useState("EUR");
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setCurrency(currentLanguage === "en" ? "EUR" : "MKD");
  }, [currentLanguage]);

  // Track authentication state.
  // Since our registration function signs the user out immediately,
  // a non-null "user" here indicates the user has explicitly logged in.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // Logout handler remains unchanged.
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      addToast(t("logout_success"), {
        appearance: "info",
        autoDismiss: true,
      });
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
              <MdLanguage style={{ marginRight: "6px", fontSize: "18px", verticalAlign: "middle" }} />
              <span>{currentLanguage === "en" ? t("english") : t("macedonian")}</span>
              <IoIosArrowDown />
              <ul>
                <li>
                  <button onClick={() => changeLanguage("mk")}>
                    <ReactCountryFlag countryCode="MK" svg style={{ width: "1.1em", height: "1.1em" }} /> {t("macedonian")}
                  </button>
                </li>
                <li>
                  <button onClick={() => changeLanguage("en")}>
                    <ReactCountryFlag countryCode="GB" svg style={{ width: "1.1em", height: "1.1em" }} /> {t("english")}
                  </button>
                </li>
              </ul>
            </div>
            <span className="header-separator">|</span>
            <div className="currency-change change-dropdown">
              <TbCurrencyEuro style={{ marginRight: "6px", fontSize: "18px", verticalAlign: "middle" }} />
              <span>{currency}</span> <IoIosArrowDown />
              <ul>
                <li>
                  <button onClick={() => setCurrency("MKD")} disabled={true}>
                    MKD
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrency("EUR")} disabled={true}>
                    EUR
                  </button>
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
            {/* Only show user's email & logout if user is logged in.
                Since our registration flow signs out new users,
                a non-null "user" here means the user is properly logged in. */}
            {user ? (
              <>
                <VscAccount style={{ marginRight: "6px", fontSize: "18px", verticalAlign: "middle" }} />  
                <span className="user-email">{user.email}</span>
                <span className="header-separator">|</span>
                <a href="#" className="signout-link" onClick={handleLogout}>
                  {t("logout")}
                </a>
              </>
            ) : (
              <div className="signup-link">
                <VscAccount style={{ marginRight: "6px", fontSize: "18px", verticalAlign: "middle" }} />
                <Link
                  href="/other/login-register"
                  as={process.env.PUBLIC_URL + "/other/login-register"}
                >
                  {t("signup_login")}
                </Link>
              </div>
            )}

            <span className="header-separator">|</span>
            <div className="top-social-icons">
              <ul>
                <li>
                  <a href="https://x.com" target="_blank" rel="noreferrer">
                    <FaXTwitter />
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com/kristina.iloski" target="_blank" rel="noreferrer">
                    <IoLogoFacebook />
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/kikamakeup_and_beautyacademy/" target="_blank" rel="noreferrer">
                    <IoLogoInstagram />
                  </a>
                </li>                
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HeaderTop;
