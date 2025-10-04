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
import { getDatabase, ref, get } from "firebase/database";
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

  // Order preview state (when viewing an order from Firebase)
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [orderProducts, setOrderProducts] = useState([]);
  const [orderMeta, setOrderMeta] = useState(null);

  // coupon states
  const [userCoupon, setUserCoupon] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponInput, setCouponInput] = useState("");

  // fetch coupon for logged in user and autofill coupon input
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
            setCouponInput(coupon.code); // autofill input so user can click Apply
          }
        }
      } catch (err) {
        console.error("Error fetching user coupon:", err);
      }
    };

    fetchUserCoupon();
  }, []);

  // ensure body overflow class removed once
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.querySelector("body")?.classList.remove("overflow-hidden");
    }
  }, []);

  useEffect(() => {
  const shouldViewOrder = viewOrder === "true" || viewOrder === true;
  if (!shouldViewOrder || !userId || !orderId) return;

  let mounted = true;
  setLoadingOrder(true);

  const parseMoney = (v) => {
    if (v == null) return 0;
    const s = String(v).trim();
    const cleaned = s.replace(/\s/g, "").replace(/,/g, "."); // "32,51" => "32.51"
    const num = parseFloat(cleaned.replace(/[^0-9.\-]+/g, ""));
    return Number.isFinite(num) ? num : 0;
  };

  const loadOrderFromFirebase = async () => {
    try {
      const db = getDatabase();
      const snap = await get(ref(db, `orders/${userId}/${orderId}`));
      if (!snap.exists()) {
        addToast(t("order_not_found") || "Order not found", {
          appearance: "error",
          autoDismiss: true,
        });
        if (mounted) {
          setOrderProducts([]);
          setOrderMeta(null);
        }
        return;
      }

      const data = snap.val();

      // Normalize product list with numericEn (EUR) and numericMk (MKD)
      const normalized = (data.products || []).map((p, i) => {
        const priceObj = p.price ?? p.prices ?? null;

        const numericEn =
          priceObj && typeof priceObj === "object" && priceObj.en != null
            ? parseMoney(priceObj.en)
            : parseMoney(p.price) || 0;

        const numericMk =
          priceObj && typeof priceObj === "object" && priceObj.mk != null
            ? parseMoney(priceObj.mk)
            : parseMoney(p.price) || 0;

        const qty = Number(p.quantity ?? p.qty ?? 1) || 1;

        return {
          id: p.id ?? `${i + 1}`,
          name: p.name ?? p.title ?? `Item ${i + 1}`,
          price: p.price,
          numericEn,
          numericMk,
          quantity: qty,
          discount: Number(p.discount ?? 0) || 0,
          thumbImage: p.thumbImage ?? p.image ?? null,
          slug: p.slug ?? null,
        };
      });

      // Compute reliable subtotals in both currencies (respect product discounts)
      const computedSubtotalEn = normalized.reduce((acc, it) => {
        const perPrice = Number(getDiscountPrice(it.numericEn, it.discount)) || it.numericEn;
        return acc + perPrice * it.quantity;
      }, 0);

      const computedSubtotalMk = normalized.reduce((acc, it) => {
        const perPrice = Number(getDiscountPrice(it.numericMk, it.discount)) || it.numericMk;
        return acc + perPrice * it.quantity;
      }, 0);

      // Parse stored meta values (your DB stores subtotal/total in MKD strings)
      const storedSubtotalMk = data.subtotal != null ? parseMoney(data.subtotal) : null;
      const storedDiscountMk = data.discount != null ? parseMoney(data.discount) : null;
      const storedTotalMk = data.total != null ? parseMoney(data.total) : null;

      // Compute conversion rate MKD per EUR from computed rows if possible
      const conversionRate =
        computedSubtotalEn > 0 && computedSubtotalMk > 0
          ? computedSubtotalMk / computedSubtotalEn
          : null;

      // Convert stored MKD -> EUR when we can, otherwise fallback to computed EN sums
      const subtotalEn = conversionRate && storedSubtotalMk != null
        ? storedSubtotalMk / conversionRate
        : computedSubtotalEn;

      // Discount: prefer stored discount converted, else derive from storedSubtotal/storedTotal, else 0
      let discountEn = 0;
      if (conversionRate && storedDiscountMk != null) {
        discountEn = storedDiscountMk / conversionRate;
      } else if (conversionRate && storedSubtotalMk != null && storedTotalMk != null) {
        discountEn = (storedSubtotalMk - storedTotalMk) / conversionRate;
      } else {
        // no stored discount, maybe storedTotal exists: derive discount from computedSubtotalEn vs storedTotalMk
        if (storedTotalMk != null && conversionRate) {
          discountEn = subtotalEn - (storedTotalMk / conversionRate);
        } else {
          discountEn = 0;
        }
      }
      if (!Number.isFinite(discountEn)) discountEn = 0;

      // Total in EN
      let totalEn = null;
      if (conversionRate && storedTotalMk != null) {
        totalEn = storedTotalMk / conversionRate;
      } else {
        totalEn = subtotalEn - discountEn;
      }
      if (!Number.isFinite(totalEn)) totalEn = subtotalEn - discountEn;

      // Build meta: keep original MK values and computed EN values
      const meta = {
        orderNumber: data.orderNumber ?? null,
        date: data.date ?? null,
        reservationDate: data.reservationDate ?? null,
        reservationTime: data.reservationTime ?? null,
        status: data.status ?? null,
        // stored MK values for debugging
        subtotalMk: storedSubtotalMk ?? computedSubtotalMk,
        discountMk: storedDiscountMk ?? 0,
        totalMk: storedTotalMk ?? (computedSubtotalMk - (storedDiscountMk ?? 0)),
        // computed / converted EUR values for display when language is EN
        subtotalEn,
        discountEn,
        totalEn,
        // currency display values
        displayCurrencyEn: "€",
        displayCurrencyMk: t("currency") || "ден",
        paymentMethod: data.paymentMethod ?? null,
        paymentText: data.paymentText ?? null,
        customer: data.customer ?? null,
        createdAt: data.createdAt ?? null,
      };

      if (!mounted) return;
      setOrderProducts(normalized);
      setOrderMeta(meta);
    } catch (err) {
      console.error("Error loading order from Firebase:", err);
      addToast(err.message || "Error loading order", {
        appearance: "error",
        autoDismiss: true,
      });
      if (mounted) {
        setOrderProducts([]);
        setOrderMeta(null);
      }
    } finally {
      if (mounted) setLoadingOrder(false);
    }
  };

  loadOrderFromFirebase();

  return () => {
    mounted = false;
  };
}, [userId, orderId, viewOrder, addToast, t, currentLanguage]);


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

  // Determine whether we are showing an order (read-only) or normal Redux cart
  const showingOrder = viewOrder === "true" || viewOrder === true;
  const itemsToRender = showingOrder ? orderProducts : cartItems || [];

  // ---------- totals calculation (single source of truth) ----------
  // compute totals fresh each render (robust numeric parsing)
  let cartTotalPrice = 0;
  itemsToRender.forEach((product) => {
    // priceNum extraction must handle both order items and store items,
    // and both numeric price or object with mk/en.
    let priceNum = 0;

    if (showingOrder) {
      if (product.price && typeof product.price === "object") {
        const raw = currentLanguage === "mk" ? product.price.mk : product.price.en;
        priceNum = Number(raw) || 0;
      } else {
        priceNum = Number(product.price) || 0;
      }
    } else {
      let basePrice = 0;
      if (product.price && typeof product.price === "object") {
        basePrice = Number(currentLanguage === "mk" ? product.price.mk : product.price.en) || 0;
      } else {
        basePrice = Number(product.price) || 0;
      }
      priceNum = Number(getDiscountPrice(basePrice, product.discount)) || 0;
    }

    const qty = Number(product.quantity ?? product.qty ?? 1) || 1;
    cartTotalPrice += priceNum * qty;
  });

  // Apply coupon discount ONLY when user clicks (appliedCoupon)
  let discountAmount = 0;
  let finalTotal = cartTotalPrice;
  if (appliedCoupon) {
    discountAmount = (cartTotalPrice * Number(appliedCoupon.discount || 0)) / 100;
    finalTotal = cartTotalPrice - discountAmount;
  }

  // Helper to format safely
const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};
  const format = (v) => safeNumber(v).toFixed(2);

  // If we're showing an order, prefer orderMeta values (if present), otherwise fallback to computed ones
const displaySubtotal = showingOrder
  ? (currentLanguage === "mk"
      ? safeNumber(orderMeta?.subtotalMk ?? orderMeta?.totalMk ?? cartTotalPrice)
      : safeNumber(orderMeta?.subtotalEn ?? cartTotalPrice))
  : cartTotalPrice;

const displayDiscount = showingOrder
  ? (currentLanguage === "mk"
      ? safeNumber(orderMeta?.discountMk ?? 0)
      : safeNumber(orderMeta?.discountEn ?? 0))
  : discountAmount;

const displayTotal = showingOrder
  ? (currentLanguage === "mk"
      ? safeNumber(orderMeta?.totalMk ?? (displaySubtotal - displayDiscount))
      : safeNumber(orderMeta?.totalEn ?? (displaySubtotal - displayDiscount)))
  : finalTotal;

const currencyToShow = showingOrder
  ? (currentLanguage === "mk" ? (orderMeta?.displayCurrencyMk || t("currency")) : (orderMeta?.displayCurrencyEn || "€"))
  : t("currency") || "€";

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
    } else {
      // no input: attempt to apply the stored coupon
      if (userCoupon) {
        setAppliedCoupon(userCoupon);
        try {
          sessionStorage.setItem("appliedCoupon", JSON.stringify(userCoupon));
        } catch {}
        addToast(
          t("coupon_applied") || `Coupon applied: ${userCoupon.discount}% off`,
          { appearance: "success", autoDismiss: true }
        );
      }
    }
  };

  return (
    <LayoutTwo>
      <BreadcrumbOne
        pageTitle={showingOrder ? (t("order_preview") || "Order preview") : t("cart_title")}
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-2.jpg"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/home/trending" as={process.env.PUBLIC_URL + "/home/trending"}>
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
                          priceNum = Number(currentLanguage === "mk" ? product.price.mk : product.price.en) || 0;
                        } else {
                          priceNum = Number(product.price) || 0;
                        }
                      } else {
                        let basePrice = 0;
                        if (product.price && typeof product.price === "object") {
                          basePrice = Number(currentLanguage === "mk" ? product.price.mk : product.price.en) || 0;
                        } else {
                          basePrice = Number(product.price) || 0;
                        }
                        priceNum = Number(getDiscountPrice(basePrice, product.discount)) || 0;
                      }

                      const qty = Number(product.quantity ?? product.qty ?? 1) || 1;
                      const rowSubtotal = priceNum * qty;
                      const subtotalStr = safeNumber(rowSubtotal).toFixed(2);

                      const thumbRaw = Array.isArray(product.thumbImage) ? product.thumbImage[0] : product.thumbImage || product.image || "/assets/images/no-image.png";
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
                                  <img
                                    src={thumbSrc}
                                    className="img-fluid"
                                    alt={product.name || ""}
                                  />
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
                                {product.name && (product.name[currentLanguage] || product.name) ? (product.name[currentLanguage] || product.name) : product.name}
                              </Link>
                            ) : (
                              product.name && (product.name[currentLanguage] || product.name) ? (product.name[currentLanguage] || product.name) : product.name
                            )}
                          </td>

                          <td className="product-price">
                            <span className="price">
                              {currentLanguage === 'mk'
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
                                <input
                                  className="cart-plus-minus-box"
                                  type="text"
                                  value={product.quantity}
                                  readOnly
                                />
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
                              {currentLanguage === 'mk'
                                ? `${subtotalStr} ${t("currency")}`
                                : `${t("currency")} ${subtotalStr}`}
                            </span>
                          </td>

                          <td className="product-remove">
                            {showingOrder ? null : (
                              <button
                                onClick={() => deleteFromCart(product, addToast, t)}
                              >
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

              {showingOrder ? (
                <Col lg={12} className="space-mb--r100 space-pt--30">
                  <Row className="align-items-center">
                    <Col lg={8}>
                      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                        <Link href="/other/my-account" as={process.env.PUBLIC_URL + "/other/my-account"} className="lezada-button lezada-button--medium">
                          {t("back_to_account") || "Back to account"}
                        </Link>

                        <Link href="/home/trending" as={process.env.PUBLIC_URL + "/home/trending"} className="lezada-button lezada-button--medium">
                          {t("back_home") || "Back to home"}
                        </Link>
                      </div>
                    </Col>
                    <Col lg={4} className="text-right">
                      {/* Optionally show order summary/meta here */}
                    </Col>
                  </Row>
                </Col>
              ) : (
                <>
                  <Col lg={12} className="space-mb--r100">
                    <div className="cart-coupon-area space-pt--30 space-pb--30">
                      <Row className="align-items-center">
                        <Col lg={7} className="space-mb-mobile-only--30">
                          <div className="lezada-form coupon-form">
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleApplyCoupon();
                              }}
                            >
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
                </>
              )}

              <Col lg={5} className="ml-auto">
                <div className="cart-calculation-area">
                  <h2 className="space-mb--40">{t("cart_totals")}</h2>
                  <table className="cart-calculation-table space-mb--40">
                    <tbody>
                      <tr>
                        <th>{t("subtotal")}</th>
                        <td className="subtotal">
                          {currentLanguage === 'mk'
                            ? `${format(displaySubtotal)} ${t("currency")}`
                            : `${t("currency")} ${format(displaySubtotal)}`}
                        </td>
                      </tr>

                      { (showingOrder ? displayDiscount > 0 : appliedCoupon) && (
                        <tr>
                          <th>{t("coupon_discount")}</th>
                          <td className="discount">
                            {currentLanguage === 'mk'
                              ? `-${format(displayDiscount)} ${t("currency")}`
                              : `-${t("currency")} ${format(displayDiscount)}`}
                          </td>
                        </tr>
                      )}

                      <tr>
                        <th>{t("total")}</th>
                        <td className="total">
                          {currentLanguage === 'mk'
                            ? `${format(displayTotal)} ${t("currency")}`
                            : `${t("currency")} ${format(displayTotal)}`}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  {!showingOrder && (
                    <div className="cart-calculation-button text-center">
                      <Link
                        href="/other/checkout"
                        as={process.env.PUBLIC_URL + "/other/checkout"}
                        className="lezada-button lezada-button--medium"
                      >
                        {t("proceed_to_checkout")}
                      </Link>
                    </div>
                  )}
                </div>
              </Col>
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
    </LayoutTwo>
  );
};

const mapStateToProps = (state) => {
  return {
    cartItems: state.cartData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
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
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
