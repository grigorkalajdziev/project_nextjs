import { useState, useEffect, Fragment } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";
import { connect } from "react-redux";
import {
  IoIosSearch,
  IoMdPerson,
  IoIosHeartEmpty,
  IoIosCart,
  IoIosMenu
} from "react-icons/io";
import NavigationOverlay from "./elements/NavigationOverlay";
import SearchOverlay from "./elements/SearchOverlay";
import CartOverlay from "./elements/CartOverlay";
import WishlistOverlay from "./elements/WishlistOverlay";
import MobileMenu from "./elements/MobileMenu";

const HeaderFour = ({ cartItems, wishlistItems }) => {
  const [scroll, setScroll] = useState(0);
  const [headerTop, setHeaderTop] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [offCanvasNavigationActive, setOffCanvasNavigationActive] = useState(
    false
  );
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
        className={`transparent-style white-content ${
          scroll > headerTop ? "is-sticky" : ""
        }`}
      >
        <Container className="wide">
          <Row className="header-content align-items-center space-pt--30 space-pb--30">
            <Col>
              <div className="header-content__logo d-flex align-items-center">
                <button
                  onClick={() => {
                    setOffCanvasNavigationActive(true);
                  }}
                  className="d-none d-lg-block"
                >
                  <IoIosMenu />
                </button>
                <Link href="/" as={process.env.PUBLIC_URL + "/"}>

                  <img
                    src={process.env.PUBLIC_URL + "/assets/images/logo.svg"}
                    className="img-fluid dark-logo"
                    alt=""
                  />
                  <img
                    src={
                      process.env.PUBLIC_URL + "/assets/images/logo-alt.png"
                    }
                    className="img-fluid white-logo"
                    alt=""
                  />

                </Link>
              </div>
            </Col>

            <Col>
              {/* icons */}
              <div className="header-content__icons text-right">
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
                  {/* <li>
                    <Link
                      href="/other/login-register"
                      as={process.env.PUBLIC_URL + "/other/login-register"}
                    >
                      <a>
                        <IoMdPerson />
                      </a>
                    </Link>
                  </li> */}
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
                    <button onClick={() => setOffCanvasMobileMenuActive(true)}>
                      <IoIosMenu />
                    </button>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </header>
      {/* navigation overlay */}
      <NavigationOverlay
        activeStatus={offCanvasNavigationActive}
        getActiveStatus={setOffCanvasNavigationActive}
      />
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

export default connect(mapStateToProps)(HeaderFour);
