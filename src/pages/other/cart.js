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
  cartItemStock
} from "../../redux/actions/cartActions";
import { getDiscountPrice } from "../../lib/product";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { IoIosClose, IoMdCart } from "react-icons/io";
import { useLocalization } from "../../context/LocalizationContext";
import { getDatabase, ref, get } from "firebase/database";

const Cart = ({
  cartItems,
  decreaseQuantity,
  addToCart,
  deleteFromCart,
  deleteAllFromCart
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

        // Normalize products (your DB shape: { discount, id, name, price, quantity })
        const normalized = (data.products || []).map((p, i) => ({
          id: p.id ?? `${i + 1}`,
          name: p.name || p.title || `Item ${i + 1}`,
          price: p.price,
          quantity: Number(p.quantity ?? p.qty ?? 1),
          discount: p.discount ?? 0,          
        }));

        const meta = {
          orderNumber: data.orderNumber ?? null,
          date: data.date ?? null,
          reservationDate: data.reservationDate ?? null,
          reservationTime: data.reservationTime ?? null,
          status: data.status ?? null,
          total: data.total ?? null,
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
  }, [userId, orderId, viewOrder, addToast, t]);

  const handleAddToCart = (product) => {
    addToCart(
      product,
      addToast,
      quantityCount,
      product.selectedProductColor,
      product.selectedProductSize,
      t // Localization function used directly in addToast
    );
  };

  // Determine whether we are showing an order (read-only) or normal Redux cart
  const showingOrder = viewOrder === "true" || viewOrder === true;
  const itemsToRender = showingOrder ? orderProducts : cartItems;  

  // compute totals fresh each render
  let cartTotalPrice = 0;

  return (
    <LayoutTwo>
      {/* breadcrumb */}
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
                      // price handling: order items have numeric price, cart items may have localized price object
                      let priceNum = 0;
                      if (showingOrder) {                     
                      if (product.price && typeof product.price === "object") {
                        priceNum = currentLanguage === "mk"
                          ? parseFloat(product.price.mk || 0)
                          : parseFloat(product.price.en || 0);
                      } else {
                        priceNum = parseFloat(product.price || 0);
                      }
                    } else {                     
                      let basePrice = 0;
                      if (product.price && typeof product.price === "object") {
                        basePrice = currentLanguage === "mk"
                          ? parseFloat(product.price.mk || 0)
                          : parseFloat(product.price.en || 0);
                      } else {
                        basePrice = parseFloat(product.price || 0);
                      }
                      priceNum = parseFloat(getDiscountPrice(basePrice, product.discount));
                    }

                      const qty = product.quantity || product.qty || 1;
                      const subtotal = (priceNum * qty).toFixed(2);
                      cartTotalPrice += parseFloat(subtotal);

                      // thumbnail fallback: some order products may not have an array
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
                                ? `${priceNum.toFixed(2)} ${t("currency")}`
                                : `${t("currency")} ${priceNum.toFixed(2)}`}
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
                                ? `${subtotal} ${t("currency")}`
                                : `${t("currency")} ${subtotal}`}
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

              {/* If viewing an order, show back button and order summary instead of coupon/clear-cart */}
              {showingOrder ? (
                <Col lg={12} className="space-mb--r100 space-pt--30">
                  <Row className="align-items-center">
                    <Col lg={8}>
                      <Link href="/other/my-account" as={process.env.PUBLIC_URL + "/other/my-account"} className="lezada-button lezada-button--medium">
                        {t("back_to_account") || "Back to account"}
                      </Link>
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
                            <form>
                              <Row>
                                <Col md={7}>
                                  <input
                                    type="text"
                                    placeholder={t("enter_coupon_code")}
                                  />
                                </Col>
                                <Col md={5}>
                                  <button className="lezada-button lezada-button--medium">
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
                            ? `${cartTotalPrice.toFixed(2)} ${t("currency")}`
                            : `${t("currency")} ${cartTotalPrice.toFixed(2)}`}
                        </td>
                      </tr>
                      <tr>
                        <th>{t("total")}</th>
                        <td className="total">
                          {currentLanguage === 'mk'
                            ? `${cartTotalPrice.toFixed(2)} ${t("currency")}`
                            : `${t("currency")} ${cartTotalPrice.toFixed(2)}`}
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
    cartItems: state.cartData
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
