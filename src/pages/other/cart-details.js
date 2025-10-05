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

const Cart = ({ cartItems, decreaseQuantity, addToCart, deleteFromCart, deleteAllFromCart }) => {
  const { addToast } = useToasts();
  const { t, currentLanguage } = useLocalization();
  const router = useRouter();
  const { userId, orderId, viewOrder } = router.query || {};

  const [loadingOrder, setLoadingOrder] = useState(false);
  const [orderProducts, setOrderProducts] = useState([]);
  const [orderMeta, setOrderMeta] = useState(null);

  // Note: coupon and clear UI removed per request - we keep functions in case used elsewhere
  const [quantityCount] = useState(1);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.querySelector("body")?.classList.remove("overflow-hidden");
    }
  }, []);

  const showingOrder = viewOrder === "true" || viewOrder === true;
  const itemsToRender = showingOrder ? orderProducts : cartItems || [];

  // Fetch order from Firebase when in viewOrder mode
  useEffect(() => {
    if (!showingOrder || !userId || !orderId) return;

    let mounted = true;
    setLoadingOrder(true);

    const parseMoney = (v) => {
      if (v == null) return 0;
      const cleaned = String(v).trim().replace(/\s/g, "").replace(/,/g, ".");
      const num = parseFloat(cleaned.replace(/[^0-9.\-]+/g, ""));
      return Number.isFinite(num) ? num : 0;
    };

    const loadOrder = async () => {
      try {
        const db = getDatabase();
        const snap = await get(ref(db, `orders/${userId}/${orderId}`));
        if (!snap.exists()) {
          addToast(t("order_not_found") || "Order not found", { appearance: "error", autoDismiss: true });
          if (mounted) {
            setOrderProducts([]);
            setOrderMeta(null);
          }
          return;
        }

        const data = snap.val();

        const normalizedProducts = (data.products || []).map((p, i) => {
          const priceObj = p.price ?? p.prices ?? null;

          const numericEn =
            priceObj && typeof priceObj === "object" && priceObj.en != null
              ? parseMoney(priceObj.en)
              : parseMoney(p.price) || 0;

          const numericMk =
            priceObj && typeof priceObj === "object" && priceObj.mk != null
              ? parseMoney(priceObj.mk)
              : parseMoney(p.price) || 0;

          const quantity = Number(p.quantity ?? p.qty ?? 1) || 1;

          return {
            id: p.id ?? `${i + 1}`,
            name: p.name ?? p.title ?? `Item ${i + 1}`,
            price: p.price,
            numericEn,
            numericMk,
            quantity,
            discount: Number(p.discount ?? 0) || 0,
            thumbImage: p.thumbImage ?? p.image ?? null,
            slug: p.slug ?? null,
          };
        });

        const computedSubtotalEn = normalizedProducts.reduce((acc, it) => {
          const perPrice = Number(getDiscountPrice(it.numericEn, it.discount)) || it.numericEn;
          return acc + perPrice * it.quantity;
        }, 0);

        const computedSubtotalMk = normalizedProducts.reduce((acc, it) => {
          const perPrice = Number(getDiscountPrice(it.numericMk, it.discount)) || it.numericMk;
          return acc + perPrice * it.quantity;
        }, 0);

        const storedSubtotalMk = data.subtotal != null ? parseMoney(data.subtotal) : null;
        const storedDiscountMk = data.discount != null ? parseMoney(data.discount) : null;
        const storedTotalMk = data.total != null ? parseMoney(data.total) : null;

        const conversionRate =
          computedSubtotalEn > 0 && computedSubtotalMk > 0
            ? computedSubtotalMk / computedSubtotalEn
            : null;

        const subtotalEn = conversionRate && storedSubtotalMk != null
          ? storedSubtotalMk / conversionRate
          : computedSubtotalEn;

        let discountEn = 0;
        if (conversionRate && storedDiscountMk != null) {
          discountEn = storedDiscountMk / conversionRate;
        } else if (conversionRate && storedSubtotalMk != null && storedTotalMk != null) {
          discountEn = (storedSubtotalMk - storedTotalMk) / conversionRate;
        } else {
          if (storedTotalMk != null && conversionRate) {
            discountEn = subtotalEn - (storedTotalMk / conversionRate);
          } else {
            discountEn = 0;
          }
        }
        if (!Number.isFinite(discountEn)) discountEn = 0;

        let totalEn = null;
        if (conversionRate && storedTotalMk != null) {
          totalEn = storedTotalMk / conversionRate;
        } else {
          totalEn = subtotalEn - discountEn;
        }
        if (!Number.isFinite(totalEn)) totalEn = subtotalEn - discountEn;

        const meta = {
          orderNumber: data.orderNumber ?? null,
          date: data.date ?? null,
          reservationDate: data.reservationDate ?? null,
          reservationTime: data.reservationTime ?? null,
          status: data.status ?? null,
          subtotalMk: storedSubtotalMk ?? computedSubtotalMk,
          discountMk: storedDiscountMk ?? 0,
          totalMk: storedTotalMk ?? (computedSubtotalMk - (storedDiscountMk ?? 0)),
          subtotalEn,
          discountEn,
          totalEn,
          displayCurrencyEn: "€",
          displayCurrencyMk: t("currency") || "ден",
          paymentMethod: data.paymentMethod ?? null,
          paymentText: data.paymentText ?? null,
          customer: data.customer ?? null,
          createdAt: data.createdAt ?? null,
        };

        if (!mounted) return;
        setOrderProducts(normalizedProducts);
        setOrderMeta(meta);
      } catch (err) {
        console.error("Error loading order from Firebase:", err);
        addToast(err.message || "Error loading order", { appearance: "error", autoDismiss: true });
        if (mounted) {
          setOrderProducts([]);
          setOrderMeta(null);
        }
      } finally {
        if (mounted) setLoadingOrder(false);
      }
    };

    loadOrder();

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

  // ---------- totals calculation ----------
  const safeNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };
  const format = (v) => safeNumber(v).toFixed(2);

  let cartTotalPrice = 0;
  itemsToRender.forEach((product) => {
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
    cartTotalPrice += priceNum * qty;
  });

  const displaySubtotal = showingOrder
    ? (currentLanguage === "mk" ? safeNumber(orderMeta?.subtotalMk ?? cartTotalPrice) : safeNumber(orderMeta?.subtotalEn ?? cartTotalPrice))
    : cartTotalPrice;

  const displayDiscount = showingOrder ? (currentLanguage === "mk" ? safeNumber(orderMeta?.discountMk ?? 0) : safeNumber(orderMeta?.discountEn ?? 0)) : 0;

  const displayTotal = showingOrder
    ? (currentLanguage === "mk" ? safeNumber(orderMeta?.totalMk ?? (displaySubtotal - displayDiscount)) : safeNumber(orderMeta?.totalEn ?? (displaySubtotal - displayDiscount)))
    : cartTotalPrice;

  const currencyToShow = showingOrder
    ? (currentLanguage === "mk" ? (orderMeta?.displayCurrencyMk || t("currency")) : (orderMeta?.displayCurrencyEn || "€"))
    : (currentLanguage === "mk" ? t("currency") : "€");

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
                                ? `${safeNumber(priceNum).toFixed(2)} ${currencyToShow}`
                                : `${currencyToShow} ${safeNumber(priceNum).toFixed(2)}`}
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
                                ? `${subtotalStr} ${currencyToShow}`
                                : `${currencyToShow} ${subtotalStr}`}
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

              {/* Back buttons + totals */}
              <Col lg={12} className="space-mb--r100 space-pt--30">
                <Row className="align-items-center">
                  <Col lg={8}>
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                      <Link href="/other/my-account" as={process.env.PUBLIC_URL + "/other/my-account"} className="lezada-button lezada-button--medium" style={{ marginBottom: "20px" }} >
                        {t("back_to_account") || "Back to account"}
                      </Link>

                      <Link href="/home/trending" as={process.env.PUBLIC_URL + "/home/trending"} className="lezada-button lezada-button--medium" style={{ marginBottom: "20px" }} >
                        {t("back_home") || "Back to home"}
                      </Link>
                    </div>
                  </Col>
                  <Col lg={4} className="text-right">
                    <div className="cart-calculation-area">
                      <h2 className="space-mb--40">{t("cart_totals")}</h2>
                      <table className="cart-calculation-table space-mb--40">
                        <tbody>
                          <tr>
                            <th>{t("subtotal")}</th>
                            <td className="subtotal">
                              {currentLanguage === 'mk'
                                ? `${format(displaySubtotal)} ${currencyToShow}`
                                : `${currencyToShow} ${format(displaySubtotal)}`}
                            </td>
                          </tr>

                          {/* We removed coupon UI; discount shown only if order preview contains it */}
                          {displayDiscount > 0 && (
                            <tr>
                              <th>{t("coupon_discount")}</th>
                              <td className="discount">
                                {currentLanguage === 'mk'
                                  ? `-${format(displayDiscount)} ${currencyToShow}`
                                  : `-${currencyToShow} ${format(displayDiscount)}`}
                              </td>
                            </tr>
                          )}

                          <tr>
                            <th>{t("total")}</th>
                            <td className="total">
                              {currentLanguage === 'mk'
                                ? `${format(displayTotal)} ${currencyToShow}`
                                : `${currencyToShow} ${format(displayTotal)}`}
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
