import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { IoIosArrowRoundUp } from "react-icons/io";
import { animateScroll } from "react-scroll";
import { SubscribeEmailTwo } from "../Newsletter";

const FooterFour = () => {
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
    <footer className="bg-color--grey space-pt--100 space-pb--30">
      <Container className="wide">
        <Row>
          <Col className="footer-single-widget footer-single-widget--style2 space-mb--50">
            <p className="footer-email">
              <a href="mailto:contact@lezada.com">contact@lezada.com</a>
            </p>
            <p className="footer-phone">(+88) 123 4566 6868</p>
            <div className="store-icons space-mb--m20">
              <a href="#">
                <img
                  src={process.env.PUBLIC_URL + "/assets/images/icon/play.png"}
                  className="img-fluid space-mr--20 space-mb--20"
                  alt=""
                />
              </a>
              <a href="#">
                <img
                  src={process.env.PUBLIC_URL + "/assets/images/icon/app.png"}
                  className="img-fluid space-mb--20"
                  alt=""
                />
              </a>
            </div>
          </Col>

          <Col className="footer-single-widget footer-single-widget--style2 space-mb--50">
            <nav className="footer-single-widget__nav">
              <ul>
                <li>
                  <a href="#">About us</a>
                </li>
                <li>
                  <a href="#">Store location</a>
                </li>
                <li>
                  <a href="#">Contact</a>
                </li>
                <li>
                  <a href="#">Orders tracking</a>
                </li>
              </ul>
            </nav>
          </Col>

          <Col className="footer-single-widget footer-single-widget--style2 space-mb--50">
            <nav className="footer-single-widget__nav">
              <ul>
                <li>
                  <a href="#">Returns</a>
                </li>
                <li>
                  <a href="#">Support Policy</a>
                </li>
                <li>
                  <a href="#">Size guide</a>
                </li>
                <li>
                  <a href="#">FAQs</a>
                </li>
              </ul>
            </nav>
          </Col>

          <Col className="footer-single-widget footer-single-widget--style2 space-mb--50">
            <nav className="footer-single-widget__nav footer-single-widget__nav--social">
              <ul>
                <li>
                  <a href="https://www.twitter.com">
                    <FaTwitter /> Twitter
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

          <Col className="footer-single-widget footer-single-widget--style2 space-mb--50">
            <div className="footer-subscribe-widget">
              <h2 className="footer-subscribe-widget__title">Newsletter.</h2>
              <p className="footer-subscribe-widget__subtitle">
                Subscribe to our newsletter to receive news on update.
              </p>
              {/* email subscription */}
              <SubscribeEmailTwo mailchimpUrl="https://devitems.us11.list-manage.com/subscribe/post?u=6bbb9b6f5827bd842d9640c82&amp;id=05d85f18ef" />
            </div>
          </Col>
        </Row>
        <Row className="align-items-center space-mb--m30">
          <Col md={4}>
            <div className="copyright-text space-mb--30">
              <p>
                &copy; 2020 lezada.
                <span className="d-block space-mt--10">
                  All Rights Reserved
                </span>
              </p>
            </div>
          </Col>
          <Col md={4}>
            <div className="logo text-left text-md-center space-mb--30">
              <img
                src={process.env.PUBLIC_URL + "/assets/images/logo.png"}
                className="img-fluid"
                alt=""
              />
            </div>
          </Col>
          <Col md={4}>
            <div className="payment-icon text-left text-md-right space-mb--30">
              <img
                src={process.env.PUBLIC_URL + "/assets/images/icon/pay.png"}
                className="img-fluid"
                alt=""
              />
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

export default FooterFour;
