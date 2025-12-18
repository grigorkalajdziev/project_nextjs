import { Tooltip } from "react-tippy";
import { IoIosClose } from "react-icons/io";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useLocalization } from "../../../context/LocalizationContext"; 

const AboutOverlay = ({ activeStatus, getActiveStatus }) => {
  const { t } = useLocalization();

  return (
    <div className={`about-overlay ${activeStatus ? "active" : ""}`}>
      <div
        className="about-overlay__close"
        onClick={() => {
          getActiveStatus(false);
          document.querySelector("body").classList.remove("overflow-hidden");
        }}
      />
      <div className="about-overlay__content">
        <button
          className="about-overlay__close-icon"
          onClick={() => {
            getActiveStatus(false);
            document.querySelector("body").classList.remove("overflow-hidden");
          }}
        >
          <IoIosClose />
        </button>
        <div className="about-overlay__content-container d-flex flex-column justify-content-between h-100">
          <div className="about-overlay__widget-wrapper">
            <div className="about-widget">
              <h2 className="about-widget__title">{t("about_us_title")}</h2>
              <p>
              {t("about_us_description")}
              </p>
            </div>
          </div>
          <div className="about-overlay__contact-widget">
            <p className="email">
              <a href="mailto:makeupbykika@hotmail.com">makeupbykika@hotmail.com</a>
            </p>
            <p className="phone">(+389) 78 / 343 - 377</p>
            <div className="social-icons">
              <ul>
                <li>
                  <Tooltip
                    title="X"
                    position="top"
                    trigger="mouseenter"
                    animation="shift"
                    arrow={true}
                    duration={200}
                  >
                    <a href="https://www.x.com" target="_blank">
                      <FaXTwitter />
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
                    <a href="https://www.facebook.com/kristina.iloski" target="_blank">
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
                    <a href="https://www.instagram.com/kikamakeup_and_beautyacademy/" target="_blank">
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
                  </Tooltip>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutOverlay;
