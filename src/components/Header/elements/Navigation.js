import Link from "next/link";
import { useLocalization } from "../../../context/LocalizationContext";
import { IoIosHome } from "react-icons/io";

const Navigation = () => {
  const { t } = useLocalization();

  const iconSize = 22;

  return (
    <nav className="header-content__navigation one-line-nav space-pr--15 space-pl--15 d-none d-lg-block">
      <ul className="one-line-nav__list">
        {/* HOME ICON */}
        <li className="one-line-nav__item">
          <Link href="/home/trending" className="one-line-nav__link" aria-label={t("home")}>
            <IoIosHome size={iconSize} />
          </Link>
        </li>
   
        <li className="one-line-nav__item">
          <Link href="/shop/left-sidebar" className="one-line-nav__link">
            {t("shop")}
          </Link>
        </li>

        <li className="one-line-nav__item">
          <Link href={{ pathname: "/shop/left-sidebar", query: { category: "makeup" }, }} className="one-line-nav__link">
            {t("makeup")}
          </Link>
        </li>

        <li className="one-line-nav__item">
          <Link href={{ pathname: "/shop/left-sidebar", query: { category: "pedicure" }, }} className="one-line-nav__link">
            {t("pedicure")}
          </Link>
        </li>

        <li className="one-line-nav__item">
          <Link href={{ pathname: "/shop/left-sidebar", query: { category: "waxing" }, }} className="one-line-nav__link">
            {t("waxing")}
          </Link>
        </li>

        <li className="one-line-nav__item">
          <Link href={{ pathname: "/shop/left-sidebar", query: { category: "extras" }, }} className="one-line-nav__link">
            {t("extras")}
          </Link>
        </li>

         <li className="one-line-nav__item">
          <Link href={{ pathname: "/shop/left-sidebar", query: { category: "training" }, }} className="one-line-nav__link">
            {t("training")}
          </Link>
        </li>

        <li className="one-line-nav__item">
          <Link href="/other/compare" className="one-line-nav__link">
            {t("compare")}
          </Link>
        </li>

        <li className="one-line-nav__item">
          <Link href="/other/checkout" className="one-line-nav__link">
            {t("checkout")}
          </Link>
        </li>       

        <li className="one-line-nav__item">
          <Link href="/other/about" className="one-line-nav__link">
            {t("about_us")}
          </Link>
        </li>

        <li className="one-line-nav__item">
          <Link href="/other/contact" className="one-line-nav__link">
            {t("contact_us")}
          </Link>
        </li>

        <li className="one-line-nav__item">
          <Link href="/other/login-register" className="one-line-nav__link">
            {t("login_register")}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
