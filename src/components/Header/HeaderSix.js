import { useState, useEffect, Fragment } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";
import { connect } from "react-redux";
import {
  IoIosSearch,
  IoMdPerson,
  IoIosHeartEmpty,
  IoIosCart,
  IoIosMenu,
  IoIosArrowDown
} from "react-icons/io";
import Navigation from "./elements/Navigation";
import AboutOverlay from "./elements/AboutOverlay";
import SearchOverlay from "./elements/SearchOverlay";
import CartOverlay from "./elements/CartOverlay";
import WishlistOverlay from "./elements/WishlistOverlay";
import MobileMenu from "./elements/MobileMenu";

const HeaderSix = ({ aboutOverlay, cartItems, wishlistItems }) => {
  const [scroll, setScroll] = useState(0);
  const [headerTop, setHeaderTop] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [offCanvasAboutActive, setOffCanvasAboutActive] = useState(false);
  const [offCanvasSearchActive, setOffCanvasSearchActive] = useState(false);
  const [offCanvasCartActive, setOffCanvasCartActive] = useState(false);
  const [offCanvasWishlistActive, setOffCanvasWishlistActive] = useState(false);
  const [offCanvasMobileMenuActive, setOffCanvasMobileMenuActive] = useState(
    false
  );

  useEffect(() => {
    const header = document.querySelector("header");
    setHeaderTop(header.offsetTop);
    setHeaderHeight(header.offsetHeight);
    window.addEventListener("scroll", handleScroll);
    scroll > headerTop
      ? (document.body.style.paddingTop = `${headerHeight}px`)
      : (document.body.style.paddingTop = 0);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    setScroll(window.scrollY);
  };

  return (
    (<Fragment>
      <header
        className={`topbar-shadow ${scroll > headerTop ? "is-sticky" : ""}`}
      >
        <div className="multilevel-header">
          <Container>
            <Row className="multilevel-header__top">
              <Col lg={4} className="d-none d-lg-block">
                <div className="d-flex">
                  <div className="language-change change-dropdown">
                    <span>English</span> <IoIosArrowDown />
                    <ul>
                      <li>
                        <button>English</button>
                      </li>
                      <li>
                        <button>Deustch</button>
                      </li>
                    </ul>
                  </div>
                  <span className="header-separator">|</span>
                  <div className="currency-change change-dropdown">
                    <span>USD</span> <IoIosArrowDown />
                    <ul>
                      <li>
                        <button>USD</button>
                      </li>
                      <li>
                        <button>EUR</button>
                      </li>
                    </ul>
                  </div>
                </div>
              </Col>
              <Col xs={6} lg={4} className="text-left text-lg-center">
                {/* logo */}
                <div className="header-content__logo">
                  <Link href="/" as={process.env.PUBLIC_URL + "/"}>

                    <img
                      src={process.env.PUBLIC_URL + "/assets/images/logo.svg"}
                      className="img-fluid"
                      alt=""
                    />

                  </Link>
                </div>
              </Col>
              <Col xs={6} lg={4} className="text-right">
                <div className="header-content__icons">
                  <ul className="d-none d-lg-block">
                    <li>
                      <button
                        onClick={() => {
                          setOffCanvasSearchActive(true);
                          document
                            .querySelector("body")
                            .classList.add("overflow-hidden");
                        }}
                      >
                        <IoIosSearch />
                      </button>
                    </li>
                    <li>
                      <Link
                        href="/other/login-register"
                        as={process.env.PUBLIC_URL + "/other/login-register"}
                      >

                        <IoMdPerson />

                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setOffCanvasWishlistActive(true);
                          document
                            .querySelector("body")
                            .classList.add("overflow-hidden");
                        }}
                      >
                        <IoIosHeartEmpty />
                        {wishlistItems.length >= 1 ? (
                          <span className="count">
                            {wishlistItems.length ? wishlistItems.length : ""}
                          </span>
                        ) : (
                          ""
                        )}
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setOffCanvasCartActive(true);
                          document
                            .querySelector("body")
                            .classList.add("overflow-hidden");
                        }}
                      >
                        <IoIosCart />
                        {cartItems.length >= 1 ? (
                          <span className="count">
                            {cartItems.length ? cartItems.length : ""}
                          </span>
                        ) : (
                          ""
                        )}
                      </button>
                    </li>
                  </ul>

                  <ul className="d-block d-lg-none">
                    <li>
                      <Link
                        href="/other/wishlist"
                        as={process.env.PUBLIC_URL + "/other/wishlist"}
                      >

                        <IoIosHeartEmpty />
                        {wishlistItems.length >= 1 ? (
                          <span className="count">
                            {wishlistItems.length ? wishlistItems.length : ""}
                          </span>
                        ) : (
                          ""
                        )}

                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/other/cart"
                        as={process.env.PUBLIC_URL + "/other/cart"}
                      >

                        <IoIosCart />
                        {cartItems.length >= 1 ? (
                          <span className="count">
                            {cartItems.length ? cartItems.length : ""}
                          </span>
                        ) : (
                          ""
                        )}

                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => setOffCanvasMobileMenuActive(true)}
                      >
                        <IoIosMenu />
                      </button>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
            <Row className="multilevel-header__bottom">
              <Col
                lg={12}
                className="text-center d-none d-lg-block space-mt--40"
              >
                {/* navigation */}
                <Navigation />
              </Col>
            </Row>
          </Container>
        </div>
      </header>
      {/* about overlay */}
      {aboutOverlay === false ? (
        ""
      ) : (
        <AboutOverlay
          activeStatus={offCanvasAboutActive}
          getActiveStatus={setOffCanvasAboutActive}
        />
      )}
      {/* search overlay */}
      <SearchOverlay
        activeStatus={offCanvasSearchActive}
        getActiveStatus={setOffCanvasSearchActive}
      />
      {/* cart overlay */}
      <CartOverlay
        activeStatus={offCanvasCartActive}
        getActiveStatus={setOffCanvasCartActive}
      />
      {/* wishlist overlay */}
      <WishlistOverlay
        activeStatus={offCanvasWishlistActive}
        getActiveStatus={setOffCanvasWishlistActive}
      />
      {/* Mobile Menu */}
      <MobileMenu
        activeStatus={offCanvasMobileMenuActive}
        getActiveStatus={setOffCanvasMobileMenuActive}
      />
    </Fragment>)
  );
};

const mapStateToProps = (state) => {
  return {
    cartItems: state.cartData,
    wishlistItems: state.wishlistData
  };
};

export default connect(mapStateToProps)(HeaderSix);
