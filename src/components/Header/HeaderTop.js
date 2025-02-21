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

  // Track authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Logout handler remains unchanged
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

  // Determine if we should show the user's email.
  // If the user is fully logged in, then lastSignInTime should differ from creationTime.
  const showUserInfo =
    user &&
    user.metadata &&
    user.metadata.lastSignInTime !== user.metadata.creationTime;

  return (
    <div className="header-top-area border-bottom--grey space-pt--10 space-pb--10 d-none d-lg-block">
      <Container className="wide">
        <div className="header-top">
          <div className="header-top__left">
            <div className="language-change change-dropdown">
              <span>{currentLanguage === "en" ? t("english") : t("macedonian")}</span>{" "}
              <IoIosArrowDown />
              <ul>
                <li>
                  <button onClick={() => changeLanguage("mk")}>
                    {t("macedonian")}
                  </button>
                </li>
                <li>
                  <button onClick={() => changeLanguage("en")}>
                    {t("english")}
                  </button>
                </li>
              </ul>
            </div>
            <span className="header-separator">|</span>
            <div className="currency-change change-dropdown">
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
            {/* Only show user's email & logout if user is fully logged in */}
            {showUserInfo ? (
              <>
                <span className="user-email">{user.email}</span>
                <span className="header-separator">|</span>
                <a
                  href="#"
                  className="signout-link"
                  onClick={handleLogout}
                >
                  {t("logout")}
                </a>
              </>
            ) : (
              <div className="signup-link">
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
                  <a href="https://x.com" target="_blank">
                    <FaXTwitter />
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com" target="_blank">
                    <IoLogoFacebook />
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com" target="_blank">
                    <IoLogoInstagram />
                  </a>
                </li>
                <li>
                  <a href="https://www.youtube.com" target="_blank">
                    <IoLogoYoutube />
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
