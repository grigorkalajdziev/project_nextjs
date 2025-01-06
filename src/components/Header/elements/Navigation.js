import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";
import { useLocalization } from "../../../context/LocalizationContext";

const Navigation = () => {
  const { t } = useLocalization();

  return (
    (<nav className="header-content__navigation space-pr--15 space-pl--15 d-none d-lg-block">
      <ul>
        <li>
          <Link href="/home/trending" legacyBehavior>
            {t("home")}
          </Link>
        </li>
        <li>
          <Link href="/shop/left-sidebar" legacyBehavior>
            {t("shop")}
          </Link>
          <IoIosArrowDown />
          <ul className="sub-menu sub-menu--mega sub-menu--mega--column-1">
            <li className="sub-menu--mega__title">
              <ul className="sub-menu--mega__list">
                <li>
                  <Link href="/other/checkout" legacyBehavior>
                    {t("checkout")}
                  </Link>
                </li>
                <li>
                  <Link href="/other/compare" legacyBehavior>
                    {t("compare")}
                  </Link>
                </li>
                <li>
                  <Link href="/other/my-account" legacyBehavior>
                    {t("my_account")}
                  </Link>
                </li>
                <li>
                  <Link href="/other/login-register" legacyBehavior>
                    {t("login_register")}
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </li>
        <li className="position-relative">
          <Link href="/other/about" legacyBehavior>
            {t("about_us")}
          </Link>
          <IoIosArrowDown />
          <ul className="sub-menu sub-menu--one-column">
            <li>
              <Link href="/other/contact" legacyBehavior>
                {t("contact_us")}
              </Link>
            </li>
            <li>
              <Link href="/other/faq" legacyBehavior>
                {t("faq")}
              </Link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>)
  );
};

export default Navigation;
