import { useEffect } from "react";
import Link from "next/link";
import { useLocalization } from "../../../context/LocalizationContext";

const MobileMenuNav = ({ getActiveStatus }) => {
  const { t } = useLocalization();

  useEffect(() => {
    const offCanvasNav = document.querySelector(
      "#offcanvas-mobile-menu__navigation"
    );
    const offCanvasNavSubMenu = offCanvasNav.querySelectorAll(
      ".mobile-sub-menu"
    );
    const anchorLinks = offCanvasNav.querySelectorAll("a");

    for (let i = 0; i < offCanvasNavSubMenu.length; i++) {
      offCanvasNavSubMenu[i].insertAdjacentHTML(
        "beforebegin",
        "<span class='menu-expand'><i></i></span>"
      );
    }

    const menuExpand = offCanvasNav.querySelectorAll(".menu-expand");
    const numMenuExpand = menuExpand.length;

    for (let i = 0; i < numMenuExpand; i++) {
      menuExpand[i].addEventListener("click", (e) => {
        sideMenuExpand(e);
      });
    }

    for (let i = 0; i < anchorLinks.length; i++) {
      anchorLinks[i].addEventListener("click", () => {
        getActiveStatus(false);
      });
    }
  });

  const sideMenuExpand = (e) => {
    e.currentTarget.parentElement.classList.toggle("active");
  };
  return (
    <nav
      className="offcanvas-mobile-menu__navigation"
      id="offcanvas-mobile-menu__navigation"
    >
      <ul>
        <li className="menu-item-has-children">
          <Link href="/home/trending" as={process.env.PUBLIC_URL + "/home/trending"}>
            <a>{t('home')}</a>
          </Link>
        </li>

        <li className="menu-item-has-children">
          <Link
            href="/shop/left-sidebar"
            as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
          >
            <a>{t('shop')}</a>
          </Link>
          <ul className="mobile-sub-menu">
            <li>
              <Link
                href="/other/checkout"
                as={process.env.PUBLIC_URL + "/other/checkout"}
              >
                <a>{t('checkout')}</a>
              </Link>
            </li>
            <li>
              <Link
                href="/other/compare"
                as={process.env.PUBLIC_URL + "/other/compare"}
              >
                <a>{t("compare")}</a>
              </Link>
            </li>
            <li>
              <Link
                href="/other/my-account"
                as={process.env.PUBLIC_URL + "/other/my-account"}
              >
                <a>{t('my_account')}</a>
              </Link>
            </li>
            <li>
              <Link
                href="/other/login-register"
                as={process.env.PUBLIC_URL + "/other/login-register"}
              >
                <a>{t('login_register')}</a>
              </Link>
            </li>
          </ul>
        </li>
        <li className="menu-item-has-children">
          <Link href="/other/about" as={process.env.PUBLIC_URL + "/other/about"}>
            <a>{t('about_us')}</a>
          </Link>
          <ul className="mobile-sub-menu">
            <li>
              <Link
                href="/other/contact"
                as={process.env.PUBLIC_URL + "/other/contact"} >
                <a>{t('contact_us')}</a>
              </Link>
            </li>
            <li>
              <Link
                href="/other/faq"
                as={process.env.PUBLIC_URL + "/other/faq"}
              >
                <a>{t('faq')}</a>
              </Link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default MobileMenuNav;
