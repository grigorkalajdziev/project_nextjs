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
import { useState, useEffect } from "react";
import { auth } from "../../../pages/api/register"; // Import Firebase authentication
import { onAuthStateChanged, signOut } from "firebase/auth";

const MobileMenuWidgets = () => {
  const { t } = useLocalization();  
  const [user, setUser] = useState(null);

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
      setUser(null); // Update state to reflect logout
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="offcanvas-mobile-menu__widgets">
      <div className="contact-widget space-mb--30">
        <ul>
          <li>
            <IoMdPerson />
            {!user ? (
              <Link
                href="/other/login-register"
                as={process.env.PUBLIC_URL + "/other/login-register"}
              >
                <a>{t("signup_login")}</a>
              </Link>
            ) : (
              <a href="#" onClick={handleLogout}>{t("logout")}</a>
            )}
          </li>
          <li>
            <IoIosPhonePortrait />
            <a href="tel://12452456012">(+389) 78/343-377 </a>
          </li>
          <li>
            <IoMdMail />
            <a href="mailto:info@makeupbykika.com">info@makeupbykika.com</a>
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
    </div>
  );
};

export default MobileMenuWidgets;
