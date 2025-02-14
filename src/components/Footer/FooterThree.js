import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { IoIosArrowRoundUp } from "react-icons/io";
import { animateScroll } from "react-scroll";
import { Tooltip } from "react-tippy";

const FooterThree = () => {
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
    <footer className="space-pt--100 space-pb--100 border-top--grey text-center">
      <Container>
        <Row>
          <Col lg={12}>
            {/*=======  footer navigation  =======*/}
            <nav className="footer-nav-container footer-nav-container--horizontal space-mb--50">
              <ul>
                <li>
                  <a href="#">ABOUT US</a>
                </li>
                <li>
                  <a href="#">STORE LOCATION</a>
                </li>
                <li>
                  <a href="#">CONTACT</a>
                </li>
                <li>
                  <a href="#">SUPPORT</a>
                </li>
                <li>
                  <a href="#">POLICY</a>
                </li>
                <li>
                  <a href="#">FAQS</a>
                </li>
              </ul>
            </nav>

            {/*=======  social icons  =======*/}
            <div className="footer-social-icons space-mb--50">
              <ul>
                <li>
                  <Tooltip
                    title="Twitter"
                    position="top"
                    trigger="mouseenter"
                    animation="shift"
                    arrow={true}
                    duration={200}
                  >
                    <a href="https://www.twitter.com" target="_blank">
                      <FaTwitter />
                    </a>
                  </Tooltip>
                </li>
                <li>
                  <Tooltip
                    title="Facebook"
                    position="top"
                    trigger="mouseenter"
                    animation="shift"
                    arrow={true}
                    duration={200}
                  >
                    <a href="https://www.facebook.com" target="_blank">
                      <FaFacebookF />
                    </a>
                  </Tooltip>
                </li>
                <li>
                  <Tooltip
                    title="Instagram"
                    position="top"
                    trigger="mouseenter"
                    animation="shift"
                    arrow={true}
                    duration={200}
                  >
                    <a href="https://www.instagram.com" target="_blank">
                      <FaInstagram />
                    </a>
                  </Tooltip>
                </li>
                <li>
                  <Tooltip
                    title="Youtube"
                    position="top"
                    trigger="mouseenter"
                    animation="shift"
                    arrow={true}
                    duration={200}
                  >
                    <a href="https://www.youtube.com" target="_blank">
                      <FaYoutube />
                    </a>
                  </Tooltip>
                </li>
              </ul>
            </div>

            {/*=======  copyright text  =======*/}
            <div className="footer-copyright-text">
              &copy; {new Date().getFullYear() + " "}
              <a href="https://www.kikamakeupandbeautyacademy.com" target="_blank">
              kikamakeupandbeautyacademy
              </a>
              . All Rights Reserved | <span>(+00) 123 567990</span> |
              makeupbykika@hotmail.com
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

export default FooterThree;
