import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoIosArrowRoundUp } from "react-icons/io";
import { animateScroll } from "react-scroll";
import { SubscribeEmailTwo } from "../Newsletter";
import { useLocalization } from "../../context/LocalizationContext";

const FooterTwo = ({ footerBgClass }) => {
  const { t } = useLocalization();
  const [scroll, setScroll] = useState(0);
  const [top, setTop] = useState(0);

  useEffect(() => {
    setTop(100);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    animateScroll.scrollToTop();
  };

  const handleScroll = () => {
    setScroll(window.scrollY);
  };
  return (
    <footer
      className={`space-pt--100 space-pb--50 ${
        footerBgClass ? footerBgClass : "bg-color--grey"
      }`}
    >
      <Container className="wide">
        <Row>
          <Col className="footer-single-widget space-mb--50">
            {/* logo */}
            <div className="logo space-mb--35">
              <img
                src={
                  process.env.PUBLIC_URL + footerBgClass ===
                  "bg-color--blue-two"
                    ? "/assets/images/logo-alt.png"
                    : "/assets/images/logo.svg"
                }
                className="img-fluid"
                alt=""
              />
            </div>

            {/*=======  copyright text  =======*/}
            <div className="footer-single-widget__copyright">
              &copy; {new Date().getFullYear() + " "}
              <a href="https://www.kikamakeupandbeautyacademy.com" target="_blank">
              {t("brand_name")}
              </a>
              <span>{t("all_rights_reserved")}</span>
            </div>
          </Col>

          <Col className="footer-single-widget space-mb--50">
            <h5 className="footer-single-widget__title">{t("about")}</h5>
            <nav className="footer-single-widget__nav">
              <ul>
                <li>
                  <a href="#">{t("about_us")}</a>
                </li>
                <li>
                  <a href="#">{t("store_location")}</a>
                </li>
                <li>
                  <a href="#">{t("contact")}</a>
                </li>
                <li>
                  <a href="#">{t("orders_tracking")}</a>
                </li>
              </ul>
            </nav>
          </Col>

          <Col className="footer-single-widget space-mb--50">
            <h5 className="footer-single-widget__title">{t("useful_links")}</h5>
            <nav className="footer-single-widget__nav">
              <ul>
                <li>
                  <a href="#">{t("returns")}</a>
                </li>
                <li>
                  <a href="#">{t("support_policy")}</a>
                </li>
                <li>
                  <a href="#">{t("size_guide")}</a>
                </li>
                <li>
                  <a href="#">{t("faqs")}</a>
                </li>
              </ul>
            </nav>
          </Col>

          <Col className="footer-single-widget space-mb--50">
            <h5 className="footer-single-widget__title">{t("follow_us")}</h5>
            <nav className="footer-single-widget__nav footer-single-widget__nav--social">
              <ul>
                <li>
                  <a href="https://www.x.com">
                    <FaXTwitter /> X (Twitter)
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com">
                    <FaFacebookF /> Facebook
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com">
                    <FaInstagram /> Instagram
                  </a>
                </li>
                <li>
                  <a href="https://www.youtube.com">
                    <FaYoutube /> Youtube
                  </a>
                </li>
              </ul>
            </nav>
          </Col>

          <Col className="footer-single-widget space-mb--50">
            <div className="footer-subscribe-widget">
              <h2 className="footer-subscribe-widget__title">{t("subscribe")}.</h2>
              <p className="footer-subscribe-widget__subtitle">
              {t("subscribe_message")}
              </p>
              {/* email subscription */}
              <SubscribeEmailTwo mailchimpUrl="https://kikamakeupandbeautyacademy.us16.list-manage.com/subscribe/post?u=28d8488f5b8e2382946ca9989&amp;id=98a58955d0" />
            </div>
          </Col>
        </Row>
      </Container>
      <button
        className={`scroll-top ${scroll > top ? "show" : ""}`}
        onClick={() => scrollToTop()}
      >
        <IoIosArrowRoundUp />
      </button>
    </footer>
  );
};

export default FooterTwo;
