import {
  IoIosPhonePortrait,
  IoMdMail,  
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoPinterest,
  IoMdPerson
} from "react-icons/io";
import { FaXTwitter } from "react-icons/fa6";
import { useLocalization } from "../../../context/LocalizationContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { auth } from "../../../pages/api/register"; // Import Firebase authentication
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useToasts } from "react-toast-notifications";

const MobileMenuWidgets = () => {
  const { t } = useLocalization();  
  const { addToast } = useToasts();
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

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
    (<div className="offcanvas-mobile-menu__widgets">
      <div className="contact-widget space-mb--30">
        <ul>
          <li>
            <IoMdPerson />
            {!user ? (
              <Link
                href="/other/login-register"
                as={process.env.PUBLIC_URL + "/other/login-register"}
              >
                {t("signup_login")}
              </Link>
            ) : (
              <a href="#" onClick={handleLogout}>{t("logout")}</a>
            )}
          </li>
          <li>
            <IoIosPhonePortrait />
            <a href="tel://+389 78 343 377">(+389) 78/343-377 </a>
          </li>
          <li>
            <IoMdMail />
            <a href="mailto:makeupbykika@hotmail.com" style={{ fontSize: '12px' }}>makeupbykika@hotmail.com</a>
          </li>
        </ul>
      </div>
      <div className="social-widget">
        <a href="https://www.twitter.com" target="_blank">
          <FaXTwitter />
        </a>
        <a href="https://www.instagram.com" target="_blank">
          <IoLogoInstagram />
        </a>
        <a href="https://www.facebook.com" target="_blank">
          <IoLogoFacebook />
        </a>
        <a href="https://www.pinterest.com" target="_blank">
          <IoLogoPinterest />
        </a>
      </div>
    </div>)
  );
};

export default MobileMenuWidgets;
