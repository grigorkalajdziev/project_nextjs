import { useEffect } from "react";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import {
  addToWishlist,
  deleteFromWishlist,
  deleteAllFromWishlist
} from "../../redux/actions/wishlistActions";
import { addToCart } from "../../redux/actions/cartActions";
import { getDiscountPrice } from "../../lib/product";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { IoIosClose, IoIosHeartEmpty } from "react-icons/io";
import { useLocalization } from "../../context/LocalizationContext";

const Wishlist = ({
  wishlistItems,
  cartItems,
  addToCart,
  deleteFromWishlist,
  deleteAllFromWishlist
}) => {
  const { addToast } = useToasts();
  const { t, currentLanguage } = useLocalization();

  useEffect(() => {
    document.querySelector("body").classList.remove("overflow-hidden");
  });

  const handleAddToCart = (item, addToast, quantityCount, selectedColor, selectedSize) => {
    addToCart(item, addToast, quantityCount, selectedColor, selectedSize, t);
  };

  return (
    (<LayoutTwo>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle={t("wishlist_title")}
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-2.webp"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/home/trending" as={process.env.PUBLIC_URL + "/home/trending"}>
              {t("home")}
            </Link>
          </li>

          <li>{t("wishlist_title")}</li>
        </ul>
      </BreadcrumbOne>
      {/* wishlist content */}
      <div className="wishlist-content space-mt--r130 space-mb--r130">
        <Container>
          {wishlistItems && wishlistItems.length >= 1 ? (
            <Row>
              <Col lg={12}>
                {/* cart table */}
                <table className="cart-table">
                  <thead>
                    <tr>
                      <th className="product-name" colSpan="2">
                      {t("product")}
                      </th>
                      <th className="product-price">{t("price")}</th>
                      <th className="product-subtotal">&nbsp;</th>
                      <th className="product-remove">&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wishlistItems.map((product, i) => {
                      const productPrice = product.price[currentLanguage] || "00.00";
                      const discountedPrice = getDiscountPrice(
                        productPrice,
                        product.discount
                      ).toFixed(2);

                      const cartItem = cartItems.filter(
                        (item) => item.id === product.id
                      )[0];

                      return (
                        (<tr key={i}>
                          <td className="product-thumbnail">
                            <Link
                              href={`/shop/product-basic/[slug]?slug=${product.slug}`}
                              as={`${process.env.PUBLIC_URL}/shop/product-basic/${product.slug}`}
                            >

                              <img
                                src={
                                  process.env.PUBLIC_URL +
                                  product.thumbImage[0]
                                }
                                className="img-fluid"
                                alt=""
                              />

                            </Link>
                          </td>
                          <td className="product-name">
                            <Link
                              href={`/shop/product-basic/[slug]?slug=${product.slug}`}
                              as={`${process.env.PUBLIC_URL}/shop/product-basic/${product.slug}`}
                            >
                              {product.name[currentLanguage] || product.name["en"]}
                            </Link>
                            {product.selectedProductColor &&
                            product.selectedProductSize ? (
                              <div className="product-variation">
                                <span>{t("color")}: {product.selectedProductColor}</span>
                                <span>{t("size")}: {product.selectedProductSize}</span>
                              </div>
                            ) : (
                              ""
                            )}
                          </td>
                          <td className="product-price">
                            <span className="price">
                              
                              {currentLanguage === 'mk' 
                                ? `${discountedPrice} ${t("currency")}` 
                                : `${t("currency")} ${discountedPrice}`}                              
                              </span>
                          </td>
                          <td>
                            {product.affiliateLink ? (
                              <a
                                href={product.affiliateLink}
                                target="_blank"
                                className="lezada-button lezada-button--medium"
                              >
                                {t("buy_now")}
                              </a>
                            ) : product.variation &&
                              product.variation.length >= 1 ? (
                              <Link
                                href={`/shop/product-basic/[slug]?slug=${product.slug}`}
                                as={`${process.env.PUBLIC_URL}/shop/product-basic/${product.slug}`}
                                className="lezada-button lezada-button--medium">

                                {t("select_option")}

                              </Link>
                            ) : product.stock && product.stock > 0 ? (
                              <button
                              onClick={() =>
                                handleAddToCart(product, addToast, 1, product.selectedProductColor, product.selectedProductSize)
                              }
                                className={` lezada-button lezada-button--medium ${
                                  cartItem !== undefined &&
                                  cartItem.quantity > 0
                                    ? "active"
                                    : ""
                                } `}
                                disabled={
                                  cartItem !== undefined &&
                                  cartItem.quantity > 0
                                }
                                title={
                                  product !== undefined
                                    ? t("added_to_cart")
                                    : t("add_to_cart")
                                }
                              >
                                {cartItem !== undefined && cartItem.quantity > 0
                                  ? t("added")
                                  : t("add_to_cart")}
                              </button>
                            ) : (
                              <button
                                disabled
                                className="active lezada-button lezada-button--medium"
                              >
                                {t("out_of_stock")}
                              </button>
                            )}
                          </td>
                          <td className="product-remove">
                            <button
                              onClick={() =>
                                deleteFromWishlist(product, addToast, t)
                              }
                            >
                              <IoIosClose />
                            </button>
                          </td>
                        </tr>)
                      );
                    })}
                  </tbody>
                </table>
              </Col>
              <Col lg={12} className="space-mb--r100">
                <div className="cart-coupon-area space-pt--30 space-pb--30">
                  <Row className="align-items-center">
                    <Col lg={5} className="text-left text-lg-right ml-auto">
                      <button
                        className="lezada-button lezada-button--medium"
                        onClick={() => deleteAllFromWishlist(addToast, t)}
                      >
                        {t("clear_wishlist")}
                      </button>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col>
                <div className="item-empty-area text-center">
                  <div className="item-empty-area__icon space-mb--30">
                    <IoIosHeartEmpty />
                  </div>
                  <div className="item-empty-area__text">
                    <p className="space-mb--30">{t("no_items_found")}</p>
                    <Link
                      href="/shop/left-sidebar"
                      as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                      className="lezada-button lezada-button--medium">

                      {t("shop_now")}

                    </Link>
                  </div>
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </LayoutTwo>)
  );
};

const mapStateToProps = (state) => {
  return {
    wishlistItems: state.wishlistData,
    cartItems: state.cartData
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (item, addToast, quantityCount, selectedColor, selectedSize, t) => {
      dispatch(addToCart(item, addToast, quantityCount, selectedColor, selectedSize, t));
    },
    addToWishlist: (item, addToast, t) => {
      dispatch(addToWishlist(item, addToast, t));
    },
    deleteFromWishlist: (item, addToast, t) => {
      dispatch(deleteFromWishlist(item, addToast, t));
    },
    deleteAllFromWishlist: (addToast, t) => {
      dispatch(deleteAllFromWishlist(addToast, t));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Wishlist);
