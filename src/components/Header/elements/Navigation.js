import Link from "next/link";
import { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useLocalization } from "../../../context/LocalizationContext";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../pages/api/register";

const Navigation = () => {
  const { t } = useLocalization();
  const [user, setUser] = useState(null);

  useEffect(() => {    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <nav className="header-content__navigation space-pr--15 space-pl--15 d-none d-lg-block">
      <ul>
        <li>
          <Link href="/home/trending" as={process.env.PUBLIC_URL + "/home/trending"}>
            <a>{t("home")}</a>
          </Link>
        </li>
        <li>
          <Link href="/shop/left-sidebar" as={process.env.PUBLIC_URL + "/shop/left-sidebar"}>
            <a>{t("shop")}</a>
          </Link>
          <IoIosArrowDown />
          <ul className="sub-menu sub-menu--mega sub-menu--mega--column-1">
            <li className="sub-menu--mega__title">
              <ul className="sub-menu--mega__list">
                <li>
                  <Link href="/other/checkout" as={process.env.PUBLIC_URL + "/other/checkout"}>
                    <a>{t("checkout")}</a>
                  </Link>
                </li>
                <li>
                  <Link href="/other/compare" as={process.env.PUBLIC_URL + "/other/compare"}>
                    <a>{t("compare")}</a>
                  </Link>
                </li>
                {/* Show 'My Account' only if the user is logged in */}
                {user && (
                  <li>
                    <Link href="/other/my-account" as={process.env.PUBLIC_URL + "/other/my-account"}>
                      <a>{t("my_account")}</a>
                    </Link>
                  </li>
                )}
                {/* Show 'Login/Register' only if the user is NOT logged in */}
                {!user && (
                  <li>
                    <Link href="/other/login-register" as={process.env.PUBLIC_URL + "/other/login-register"}>
                      <a>{t("login_register")}</a>
                    </Link>
                  </li>
                )}
              </ul>
            </li>
          </ul>
        </li>
        <li className="position-relative">
          <Link href="/other/about" as={process.env.PUBLIC_URL + "/other/about"}>
            <a>{t("about_us")}</a>
          </Link>
          <IoIosArrowDown />
          <ul className="sub-menu sub-menu--one-column">
            <li>
              <Link href="/other/contact" as={process.env.PUBLIC_URL + "/other/contact"}>
                <a>{t("contact_us")}</a>
              </Link>
            </li>
            <li>
              <Link href="/other/faq" as={process.env.PUBLIC_URL + "/other/faq"}>
                <a>{t("faq")}</a>
              </Link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
