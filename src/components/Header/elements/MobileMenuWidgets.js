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

const MobileMenuWidgets = () => {
  const { t } = useLocalization();  
  return (
    (<div className="offcanvas-mobile-menu__widgets">
      <div className="contact-widget space-mb--30">
        <ul>
          <li>
            <IoMdPerson />
            <Link
              href="/other/login-register"
              as={process.env.PUBLIC_URL + "/other/login-register"}
            >
              {t('signup_login')}
            </Link>
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
    </div>)
  );
};

export default MobileMenuWidgets;
