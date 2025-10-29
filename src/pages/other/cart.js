import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import {
  addToCart,
  decreaseQuantity,
  deleteFromCart,
  deleteAllFromCart,
  cartItemStock,
} from "../../redux/actions/cartActions";
import { getDiscountPrice } from "../../lib/product";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { IoIosClose, IoMdCart } from "react-icons/io";
import { useLocalization } from "../../context/LocalizationContext";
import { ref, get } from "firebase/database";
import { auth, database } from "../api/register";

const Cart = ({
  cartItems,
  decreaseQuantity,
  addToCart,
  deleteFromCart,
  deleteAllFromCart,
}) => {
  const [quantityCount] = useState(1);
  const { addToast } = useToasts();
  const { t, currentLanguage } = useLocalization();
  const router = useRouter();
  const { userId, orderId, viewOrder } = router.query || {};

  // Order preview state
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [orderProducts, setOrderProducts] = useState([]);
  const [orderMeta, setOrderMeta] = useState(null);

  // Coupon states
  const [userCoupon, setUserCoupon] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponInput, setCouponInput] = useState("");

  // Totals state
  const [cartTotalPrice, setCartTotalPrice] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);

  // Fetch user coupon from Firebase
  useEffect(() => {
    const fetchUserCoupon = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      try {
        const snap = await get(ref(database, `users/${currentUser.uid}`));
        if (snap.exists()) {
          const data = snap.val();
          if (data.coupon) {
            const coupon = { code: data.coupon, discount: 5 };
            setUserCoupon(coupon);
            setCouponInput(coupon.code);
          }
        }
      } catch (err) {
        console.error("Error fetching user coupon:", err);
      }
    };

    fetchUserCoupon();
  }, []);

  // Remove body overflow class
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.querySelector("body")?.classList.remove("overflow-hidden");
    }
  }, []);

  // Determine if showing order (read-only)
  const showingOrder = viewOrder === "true" || viewOrder === true;
  const itemsToRender = showingOrder ? orderProducts : cartItems || [];

  // Recalculate totals whenever cartItems or appliedCoupon change
  useEffect(() => {
    let total = 0;
    itemsToRender.forEach((product) => {
      let priceNum = 0;

      if (showingOrder) {
        if (product.price && typeof product.price === "object") {
          priceNum =
            Number(currentLanguage === "mk" ? product.price.mk : product.price.en) || 0;
        } else {
          priceNum = Number(product.price) || 0;
        }
      } else {
        let basePrice = 0;
        if (product.price && typeof product.price === "object") {
          basePrice =
            Number(currentLanguage === "mk" ? product.price.mk : product.price.en) || 0;
        } else {
          basePrice = Number(product.price) || 0;
        }
        priceNum = Number(getDiscountPrice(basePrice, product.discount)) || 0;
      }

      const qty = Number(product.quantity ?? product.qty ?? 1) || 1;
      total += priceNum * qty;
    });

    let discount = appliedCoupon ? (total * Number(appliedCoupon.discount || 0)) / 100 : 0;
    let finalAmount = total - discount;

    setCartTotalPrice(total);
    setDiscountAmount(discount);
    setFinalTotal(finalAmount);
  }, [cartItems, appliedCoupon, currentLanguage, itemsToRender]);

  // Auto-remove coupon if total drops below threshold
  useEffect(() => {
    if (appliedCoupon) {
      const thresholdMk = 2999;
      const thresholdEn = 48.67;
      const minTotal = currentLanguage === "mk" ? thresholdMk : thresholdEn;
      const currentTotal = cartTotalPrice;

      if (currentTotal < minTotal) {
        setAppliedCoupon(null);
        try {
          sessionStorage.removeItem("appliedCoupon");
        } catch {}
        addToast(
          t("coupon_min_total") || `Cart total must exceed ${minTotal} ${t("currency")}`,
          { appearance: "warning", autoDismiss: true }
        );
      }
    }
  }, [cartItems, cartTotalPrice, currentLanguage, appliedCoupon, addToast, t]);

  // Apply coupon handler
  const handleApplyCoupon = (e) => {
    e?.preventDefault?.();

    if (!userCoupon && !couponInput.trim()) {
      addToast(t("invalid_coupon") || "No coupon available", {
        appearance: "error",
        autoDismiss: true,
      });
      return;
    }

    const minTotalMKD = 2999;
    const minTotalEUR = 48.67;
    const minTotal = currentLanguage === "mk" ? minTotalMKD : minTotalEUR;

    if (cartTotalPrice < minTotal) {
      addToast(
        t("coupon_min_total") || `Cart total must exceed ${minTotal} ${t("currency")}`,
        { appearance: "error", autoDismiss: true }
      );
      return;
    }

    if (couponInput.trim()) {
      if (
        userCoupon &&
        couponInput.trim().toLowerCase() === userCoupon.code.toLowerCase()
      ) {
        setAppliedCoupon(userCoupon);
        try {
          sessionStorage.setItem("appliedCoupon", JSON.stringify(userCoupon));
        } catch {}
        addToast(
          t("coupon_applied") || `Coupon applied: ${userCoupon.discount}% off`,
          { appearance: "success", autoDismiss: true }
        );
      } else {
        addToast(t("invalid_coupon") || "Invalid coupon code", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } else if (userCoupon) {
      setAppliedCoupon(userCoupon);
      try {
        sessionStorage.setItem("appliedCoupon", JSON.stringify(userCoupon));
      } catch {}
      addToast(
        t("coupon_applied") || `Coupon applied: ${userCoupon.discount}% off`,
        { appearance: "success", autoDismiss: true }
      );
    }
  };

  const handleAddToCart = (product) => {
    addToCart(
      product,
      addToast,
      quantityCount,
      product.selectedProductColor,
      product.selectedProductSize,
      t
    );
  };

  const safeNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };
  const format = (v) => safeNumber(v).toFixed(2);

  const currencyToShow = t("currency") || "€";

  return (
    <LayoutTwo>
      <BreadcrumbOne
        pageTitle={showingOrder ? t("order_preview") : t("cart_title")}
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-2.jpg"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link
              href="/home/trending"
              as={process.env.PUBLIC_URL + "/home/trending"}
            >
              {t("home")}
            </Link>
          </li>
          <li>{t("cart")}</li>
        </ul>
      </BreadcrumbOne>

      <div className="cart-content space-mt--r130 space-mb--r130">
        <Container>
          {loadingOrder ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : itemsToRender && itemsToRender.length >= 1 ? (
            <Row>
              <Col lg={12}>
                {/* CART TABLE */}
                <table className="cart-table">
                  <thead>
                    <tr>
                      <th className="product-name" colSpan={showingOrder ? "1" : "2"}>
                        {t("product")}
                      </th>
                      <th className="product-price">{t("price")}</th>
                      <th className="product-quantity">{t("quantity")}</th>
                      <th className="product-subtotal">{t("total")}</th>
                      <th className="product-remove"><span></span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemsToRender.map((product, i) => {
                      let priceNum = 0;
                      if (showingOrder) {
                        if (product.price && typeof product.price === "object") {
                          priceNum =
                            Number(currentLanguage === "mk" ? product.price.mk : product.price.en) || 0;
                        } else {
                          priceNum = Number(product.price) || 0;
                        }
                      } else {
                        let basePrice = 0;
                        if (product.price && typeof product.price === "object") {
                          basePrice =
                            Number(currentLanguage === "mk" ? product.price.mk : product.price.en) || 0;
                        } else {
                          basePrice = Number(product.price) || 0;
                        }
                        priceNum = Number(getDiscountPrice(basePrice, product.discount)) || 0;
                      }

                      const qty = Number(product.quantity ?? product.qty ?? 1) || 1;
                      const rowSubtotal = priceNum * qty;
                      const subtotalStr = safeNumber(rowSubtotal).toFixed(2);

                      const thumbRaw = Array.isArray(product.thumbImage)
                        ? product.thumbImage[0]
                        : product.thumbImage || product.image || "/assets/images/no-image.png";
                      const thumbSrc = process.env.PUBLIC_URL + thumbRaw;

                      return (
                        <tr key={product.id || i}>
                          {!showingOrder && (
                            <td className="product-thumbnail">
                              {product.slug ? (
                                <Link
                                  href={`/shop/product-basic/[slug]?slug=${product.slug}`}
                                  as={`${process.env.PUBLIC_URL}/shop/product-basic/${product.slug}`}
                                >
                                  <img src={thumbSrc} className="img-fluid" alt={product.name || ""} />
                                </Link>
                              ) : (
                                <img src={thumbSrc} className="img-fluid" alt={product.name || ""} />
                              )}
                            </td>
                          )}

                          <td className="product-name">
                            {product.slug ? (
                              <Link
                                href={`/shop/product-basic/[slug]?slug=${product.slug}`}
                                as={`${process.env.PUBLIC_URL}/shop/product-basic/${product.slug}`}
                              >
                                {product.name && (product.name[currentLanguage] || product.name)
                                  ? product.name[currentLanguage] || product.name
                                  : product.name}
                              </Link>
                            ) : product.name && (product.name[currentLanguage] || product.name) ? (
                              product.name[currentLanguage] || product.name
                            ) : (
                              product.name
                            )}
                          </td>

                          <td className="product-price">
                            <span className="price">
                              {currentLanguage === "mk"
                                ? `${safeNumber(priceNum).toFixed(2)} ${t("currency")}`
                                : `${t("currency")} ${safeNumber(priceNum).toFixed(2)}`}
                            </span>
                          </td>

                          <td className="product-quantity">
                            {showingOrder ? (
                              <div className="cart-plus-minus">
                                <input className="cart-plus-minus-box" type="text" value={qty} readOnly />
                              </div>
                            ) : (
                              <div className="cart-plus-minus">
                                <button
                                  className="dec qtybutton"
                                  onClick={() => decreaseQuantity(product, addToast, t)}
                                >
                                  -
                                </button>
                                <input className="cart-plus-minus-box" type="text" value={product.quantity} readOnly />
                                <button
                                  className="inc qtybutton"
                                  onClick={() => handleAddToCart(product)}
                                  disabled={
                                    product !== undefined &&
                                    product.quantity &&
                                    product.quantity >=
                                      cartItemStock(
                                        product,
                                        product.selectedProductColor,
                                        product.selectedProductSize
                                      )
                                  }
                                >
                                  +
                                </button>
                              </div>
                            )}
                          </td>

                          <td className="total-price">
                            <span className="price">
                              {currentLanguage === "mk"
                                ? `${subtotalStr} ${t("currency")}`
                                : `${t("currency")} ${subtotalStr}`}
                            </span>
                          </td>

                          <td className="product-remove">
                            {showingOrder ? null : (
                              <button onClick={() => deleteFromCart(product, addToast, t)}>
                                <IoIosClose />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Col>

              {!showingOrder && (
                <>
                  {/* COUPON & CLEAR CART */}
                  <Col lg={12} className="space-mb--r100">
                    <div className="cart-coupon-area space-pt--30 space-pb--30">
                      <Row className="align-items-center">
                        <Col lg={7} className="space-mb-mobile-only--30">
                          <div className="lezada-form coupon-form">
                            <form onSubmit={(e) => { e.preventDefault(); handleApplyCoupon(); }}>
                              <Row>
                                <Col md={7}>
                                  <input
                                    type="text"
                                    placeholder={t("enter_coupon_code")}
                                    value={couponInput}
                                    onChange={(e) => setCouponInput(e.target.value)}
                                  />
                                </Col>
                                <Col md={5}>
                                  <button type="submit" className="lezada-button lezada-button--medium">
                                    {t("apply_coupon")}
                                  </button>
                                </Col>
                              </Row>
                            </form>
                          </div>
                        </Col>
                        <Col lg={5} className="text-left text-lg-right">
                          <button
                            className="lezada-button lezada-button--medium"
                            onClick={() => deleteAllFromCart(addToast, t)}
                          >
                            {t("clear_cart")}
                          </button>
                        </Col>
                      </Row>
                    </div>
                  </Col>

                  {/* CART TOTALS */}
                  <Col lg={5} className="ml-auto">
                    <div className="cart-calculation-area">
                      <h2 className="space-mb--40">{t("cart_totals")}</h2>
                      <table className="cart-calculation-table space-mb--40">
                        <tbody>
                          <tr>
                            <th>{t("subtotal")}</th>
                            <td className="subtotal">
                              {currentLanguage === "mk"
                                ? `${format(cartTotalPrice)} ${currencyToShow}`
                                : `${currencyToShow} ${format(cartTotalPrice)}`}
                            </td>
                          </tr>

                          {appliedCoupon && (
                            <tr>
                              <th>{t("coupon_discount")}</th>
                              <td className="discount">
                                {currentLanguage === "mk"
                                  ? `-${format(discountAmount)} ${currencyToShow}`
                                  : `-${currencyToShow} ${format(discountAmount)}`}
                              </td>
                            </tr>
                          )}

                          <tr>
                            <th>{t("total")}</th>
                            <td className="total">
                              {currentLanguage === "mk"
                                ? `${format(finalTotal)} ${currencyToShow}`
                                : `${currencyToShow} ${format(finalTotal)}`}
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <div className="cart-calculation-button text-center">
                        <Link
                          href="/other/checkout"
                          as={process.env.PUBLIC_URL + "/other/checkout"}
                          className="lezada-button lezada-button--medium"
                        >
                          {t("proceed_to_checkout")}
                        </Link>
                      </div>
                    </div>
                  </Col>
                </>
              )}
            </Row>
          ) : (
            <Row>
              <Col>
                <div className="item-empty-area text-center">
                  <div className="item-empty-area__icon space-mb--30">
                    <IoMdCart />
                  </div>
                  <div className="item-empty-area__text">
                    <p className="space-mb--30">{t("no_items_in_cart")}</p>
                    <Link
                      href="/shop/left-sidebar"
                      as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                      className="lezada-button lezada-button--medium"
                    >
                      {t("shop_now")}
                    </Link>
                  </div>
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </LayoutTwo>
  );
};

const mapStateToProps = (state) => ({
  cartItems: state.cartData,
});

const mapDispatchToProps = (dispatch) => ({
  addToCart: (item, addToast, quantity, color, size, t) => {
    dispatch(addToCart(item, addToast, quantity, color, size, t));
  },
  decreaseQuantity: (item, addToast, t) => {
    dispatch(decreaseQuantity(item, addToast, t));
  },
  deleteFromCart: (item, addToast, t) => {
    dispatch(deleteFromCart(item, addToast, t));
  },
  deleteAllFromCart: (addToast, t) => {
    dispatch(deleteAllFromCart(addToast, t));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
