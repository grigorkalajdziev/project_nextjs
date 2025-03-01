// components/Navigation/index.js
import Link from "next/link";
import { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useLocalization } from "../../../context/LocalizationContext";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../pages/api/register"; // adjust the path if needed

const Navigation = () => {
  const { t } = useLocalization();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <nav className="header-content__navigation space-pr--15 space-pl--15 d-none d-lg-block">
      <ul>
        <li>
          <Link href="/home/trending" as={process.env.PUBLIC_URL + "/home/trending"}>
            {t("home")}
          </Link>
        </li>
        <li>
          <Link href="/shop/left-sidebar" as={process.env.PUBLIC_URL + "/shop/left-sidebar"}>
            {t("shop")}
          </Link>
          <IoIosArrowDown />
          <ul className="sub-menu sub-menu--mega sub-menu--mega--column-1">
            <li className="sub-menu--mega__title">
              <ul className="sub-menu--mega__list">
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
                {/* Show "My Account" only if logged in; otherwise show Login/Register */}
                {user ? (
                  <li>
                    <Link
                      href="/other/my-account"
                      as={process.env.PUBLIC_URL + "/other/my-account"}
                    >
                      {t("my_account")}
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link
                      href="/other/login-register"
                      as={process.env.PUBLIC_URL + "/other/login-register"}
                    >
                      {t("login_register")}
                    </Link>
                  </li>
                )}
              </ul>
            </li>
          </ul>
        </li>
        <li className="position-relative">
          <Link href="/other/about" as={process.env.PUBLIC_URL + "/other/about"}>
            {t("about_us")}
          </Link>
          <IoIosArrowDown />
          <ul className="sub-menu sub-menu--one-column">
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
    </nav>
  );
};

export default Navigation;
