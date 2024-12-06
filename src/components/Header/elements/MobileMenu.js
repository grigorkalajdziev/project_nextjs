import { IoIosClose } from "react-icons/io";
import MobileMenuSearch from "./MobileMenuSearch";
import MobileMenuNav from "./MobileMenuNav";
import MobileMenuWidgets from "./MobileMenuWidgets";
import { useLocalization } from "../../../context/LocalizationContext";

const MobileMenu = ({ activeStatus, getActiveStatus }) => {
  const { changeLanguage, currentLanguage, t } = useLocalization();

  return (
    <div className={`offcanvas-mobile-menu ${activeStatus ? "active" : ""}`}>
      <div
        className="offcanvas-mobile-menu__overlay-close"
        onClick={() => getActiveStatus(false)}
      />
      <div className="offcanvas-mobile-menu__wrapper">
        <button
          className="offcanvas-mobile-menu__close"
          onClick={() => getActiveStatus(false)}
        >
          <IoIosClose />
        </button>
        <div className="offcanvas-mobile-menu__content-wrapper">
          <div className="offcanvas-mobile-menu__content">
            {/* mobile search */}
            <MobileMenuSearch />

            {/* mobile nav menu */}
            <MobileMenuNav getActiveStatus={getActiveStatus} />

            <div className="offcanvas-mobile-menu__middle">
              <div className="lang-curr-style space-mb--20">
                <span className="title">{t("choose_language")}</span>
                <select value={currentLanguage}
                  onChange={(e) => changeLanguage(e.target.value)}>
                  <option value="en">{t("english")}</option>
                  <option value="mk">{t("macedonian")}</option>                  
                </select>
              </div>
              <div className="lang-curr-style">
                <span className="title">{t("choose_currency")}</span>
                <select>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>

            {/* mobile widgets */}
            <MobileMenuWidgets />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
