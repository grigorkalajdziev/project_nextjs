import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocalization } from "../../../context/LocalizationContext";
import { auth } from "../../../pages/api/register"; // Import Firebase authentication
import { onAuthStateChanged } from "firebase/auth";

const MobileMenuNav = ({ getActiveStatus }) => {
  const { t } = useLocalization();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  useEffect(() => {
    const offCanvasNav = document.querySelector("#offcanvas-mobile-menu__navigation");
    const offCanvasNavSubMenu = offCanvasNav.querySelectorAll(".mobile-sub-menu");
    const anchorLinks = offCanvasNav.querySelectorAll("a");

    for (let i = 0; i < offCanvasNavSubMenu.length; i++) {
      offCanvasNavSubMenu[i].insertAdjacentHTML(
        "beforebegin",
        "<span class='menu-expand'><i></i></span>"
      );
    }

    const menuExpand = offCanvasNav.querySelectorAll(".menu-expand");

    for (let i = 0; i < menuExpand.length; i++) {
      menuExpand[i].addEventListener("click", (e) => {
        sideMenuExpand(e);
      });
    }

    for (let i = 0; i < anchorLinks.length; i++) {
      anchorLinks[i].addEventListener("click", () => {
        getActiveStatus(false);
      });
    }
  }, []);

  const sideMenuExpand = (e) => {
    e.currentTarget.parentElement.classList.toggle("active");
  };

  return (
    (<nav className="offcanvas-mobile-menu__navigation" id="offcanvas-mobile-menu__navigation">
      <ul>
        <li className="menu-item-has-children">
          <Link href="/home/trending" as={process.env.PUBLIC_URL + "/home/trending"}>
            {t("home")}
          </Link>
        </li>

        <li className="menu-item-has-children">
          <Link href="/shop/left-sidebar" as={process.env.PUBLIC_URL + "/shop/left-sidebar"}>
            {t("shop")}
          </Link>
          <ul className="mobile-sub-menu">
            <li>
              <Link href="/other/checkout" as={process.env.PUBLIC_URL + "/other/checkout"}>
                {t("checkout")}
              </Link>
            </li>
            <li>
              <Link href="/other/compare" as={process.env.PUBLIC_URL + "/other/compare"}>
                {t("compare")}
              </Link>
            </li>
            {/* Show "My Account" only if user is logged in */}
            {user && (
              <li>
                <Link href="/other/my-account" as={process.env.PUBLIC_URL + "/other/my-account"}>
                  {t("my_account")}
                </Link>
              </li>
            )}
            {/* Show "Login/Register" only if user is NOT logged in */}
            {!user && (
              <li>
                <Link href="/other/login-register" as={process.env.PUBLIC_URL + "/other/login-register"}>
                  {t("login_register")}
                </Link>
              </li>
            )}
          </ul>
        </li>

        <li className="menu-item-has-children">
          <Link href="/other/about" as={process.env.PUBLIC_URL + "/other/about"}>
            {t("about_us")}
          </Link>
          <ul className="mobile-sub-menu">
            <li>
              <Link href="/other/contact" as={process.env.PUBLIC_URL + "/other/contact"}>
                {t("contact_us")}
              </Link>
            </li>
            <li>
              <Link href="/other/faq" as={process.env.PUBLIC_URL + "/other/faq"}>
                {t("faq")}
              </Link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>)
  );
};

export default MobileMenuNav;
