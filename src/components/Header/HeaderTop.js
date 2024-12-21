import { IoIosArrowDown, IoLogoFacebook, IoLogoInstagram, IoLogoYoutube } from "react-icons/io";
import { FaXTwitter } from "react-icons/fa6";
import { useLocalization } from "../../context/LocalizationContext";
import { Container } from "react-bootstrap";
import Link from "next/link";

const HeaderTop = () => {
  const { t, currentLanguage, changeLanguage } = useLocalization();

  return (
    <div className="header-top-area border-bottom--grey space-pt--10 space-pb--10 d-none d-lg-block">
      <Container className="wide">
        <div className="header-top">
          <div className="header-top__left">
            <div className="language-change change-dropdown">
              <span>{currentLanguage === 'en' ? t('english') : t('macedonian')}</span> <IoIosArrowDown />
              <ul>
                <li>
                  <button onClick={() => changeLanguage('en')}>{t('english')}</button>
                </li>
                <li>
                  <button onClick={() => changeLanguage('mk')}>{t('macedonian')}</button>
                </li>
              </ul>
            </div>
            <span className="header-separator">|</span>
            <div className="currency-change change-dropdown">
              <span>EUR</span> <IoIosArrowDown />
              <ul>
                <li>
                  <button>MKD</button>
                </li>
                <li>
                  <button>EUR</button>
                </li>
              </ul>
            </div>
            <span className="header-separator">|</span>
            <div className="order-online-text">
              {t('order_online_call')}
              <span className="number">(+389) 78/343-377</span>
            </div>
          </div>
          <div className="header-top__right">
            <div className="signup-link">
              <Link href="/other/login-register" as={process.env.PUBLIC_URL + "/other/login-register"}>
                <a>{t('signup_login')}</a>
              </Link>
            </div>
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