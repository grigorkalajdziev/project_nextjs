import Link from "next/link";
import { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import {
  IoIosHome,
  IoIosBriefcase,
  IoIosCash,
  IoIosGitCompare,
  IoMdPerson,
  IoMdLogIn,
  IoIosInformationCircleOutline,
  IoIosCall,
  IoIosHelpCircleOutline
} from "react-icons/io";
import { useLocalization } from "../../../context/LocalizationContext";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../pages/api/register";

const Navigation = () => {
  const { t } = useLocalization();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // bigger icon size
  const iconSize = 24;

  return (
    <nav className="header-content__navigation space-pr--15 space-pl--15 d-none d-lg-block">
      <ul>
        {/* HOME (ICON ONLY) */}
        <li>
          <Link href="/home/trending" className="home-icon">
            <IoIosHome size={iconSize} title={t("home")} />
          </Link>
        </li>

        {/* SHOP */}
        <li>
          <Link href="/shop/left-sidebar">            
            {t("shop")}
          </Link>
          <IoIosArrowDown size={iconSize} />

          <ul className="sub-menu sub-menu--mega sub-menu--mega--column-1">
            <li className="sub-menu--mega__title">
              <ul className="sub-menu--mega__list">
                <li>
                  <Link href="/other/checkout">
                    <IoIosCash size={iconSize} className="me-1" />
                    {t("checkout")}
                  </Link>
                </li>

                <li>
                  <Link href="/other/compare">
                    <IoIosGitCompare size={iconSize} className="me-1" />
                    {t("compare")}
                  </Link>
                </li>

                {user ? (
                  <li>
                    <Link href="/other/my-account">
                      <IoMdPerson size={iconSize} className="me-1" />
                      {t("my_account")}
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link href="/other/login-register">
                      <IoMdLogIn size={iconSize} className="me-1" />
                      {t("login_register")}
                    </Link>
                  </li>
                )}
              </ul>
            </li>
          </ul>
        </li>

        {/* ABOUT */}
        <li className="position-relative">
          <Link href="/other/about">            
            {t("about_us")}
          </Link>
          <IoIosArrowDown size={iconSize} />

          <ul className="sub-menu sub-menu--one-column">
            <li>
              <Link href="/other/contact">
                <IoIosCall size={iconSize} className="me-1" />
                {t("contact_us")}
              </Link>
            </li>

            <li>
              <Link href="/other/faq">
                <IoIosHelpCircleOutline size={iconSize} className="me-1" />
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
