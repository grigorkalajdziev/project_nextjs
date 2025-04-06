"use client";

import { useState, useEffect } from "react";
import { getDatabase, push, ref, get, set } from "firebase/database";
import Link from "next/link";
import { auth } from "../api/register";
import { useToasts } from "react-toast-notifications";
import { Container, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { getDiscountPrice } from "../../lib/product";
import { IoMdCash } from "react-icons/io";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { useLocalization } from "../../context/LocalizationContext";
import { useRouter } from "next/router"; 
import { deleteAllFromCart } from "../../redux/actions/cartActions";
import PayPalPayment from "../../components/Payments/PayPalPayment";

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  return `${day}-${month}-${year}`;
};

const Checkout = ({ cartItems, deleteAllFromCart }) => {
  const { t, currentLanguage } = useLocalization();
  const { addToast } = useToasts();
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPayPalModal, setShowPayPalModal] = useState(false);  

  const conversionRateMKDToEUR = 61.5;

  const currency = "EUR";

  const [billingInfo, setBillingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    zip: "",
  });  

  let cartTotalPrice = 0;

  const generateOrderNumber = (length = 8) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let orderNumber = "";
    for (let i = 0; i < length; i++) {
      orderNumber += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return orderNumber;
  };

  const handlePlaceOrder = async () => {    
    if (!auth.currentUser) {
      addToast(t("please_log_in_to_place_order"), {
        appearance: "error",
        autoDismiss: true,
      });
      return;
    }

    if (!selectedPaymentMethod) {
      addToast(t("please_select_payment_method"), {
        appearance: "error",
        autoDismiss: true,
      });
      return;
    }
    
    // Validate acceptance of terms and conditions
    if (!acceptedTerms) {
      addToast(t("please_accept_terms"), {
        appearance: "error",
        autoDismiss: true,
      });
      return;
    }

    if (selectedPaymentMethod === "payment_paypal") {
      setShowPayPalModal(true);
      return;
    }

    const orderData = {
      orderNumber: generateOrderNumber(8),
      date: formatDate(new Date()),
      status: "pending",
      paymentMethod: selectedPaymentMethod,
      total: cartItems.reduce((total, product) => {
        const productPrice = product.price[currentLanguage] || "00.00";
        const discountedPrice = getDiscountPrice(productPrice, product.discount);
        return total + discountedPrice * product.quantity;
      }, 0).toFixed(2),
      products: cartItems.map((product) => ({
        id: product.id,
        name: product.name[currentLanguage] || product.name["en"],
        quantity: product.quantity,
        price: product.price[currentLanguage],
        discount: product.discount,
      })),
    };

    try {
      const db = getDatabase();      
      const ordersRef = ref(db, `orders/${auth.currentUser.uid}`);
      
      const newOrderRef = push(ordersRef);
      await set(newOrderRef, orderData);

      addToast(t("order_placed_successfully"), {
        appearance: "success",
        autoDismiss: true,
      });

      deleteAllFromCart(addToast, t);

      router.push("/other/my-account");      
    } catch (error) {
      console.error("Error placing order:", error);
      addToast(error.message, { appearance: "error", autoDismiss: true });
    }
  };

  const handlePayPalSuccess = async (details) => {
    // You can process the order data here with PayPal details
    // For example, you could store the transaction ID and order details in your database
    addToast(t("order_placed_successfully"), {
      appearance: "success",
      autoDismiss: true,
    });

    // Now clear the cart and redirect
    deleteAllFromCart(addToast, t);
    setShowPayPalModal(false);
    router.push("/other/my-account");
  };
  
  useEffect(() => {
    document.querySelector("body").classList.remove("overflow-hidden");
  }, []);
  
  useEffect(() => {
    const fetchBillingInfo = async () => {
      if (!auth.currentUser) {
        console.error("User is not authenticated");
        return;
      }
      const db = getDatabase();
      const userId = auth.currentUser.uid;
      const userRef = ref(db, `users/${userId}`);
  
      try {
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setBillingInfo({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
            phone: userData.billingInfo?.phone || "",
            address1: userData.billingInfo?.address || "",
            city: userData.billingInfo?.city || "",
            zip: userData.billingInfo?.zipCode || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchBillingInfo();
  }, []);

  const handleClose = () => {    
    setShowPayPalModal(false);
  };

  return (
    <LayoutTwo>
      <BreadcrumbOne
        pageTitle={t("checkout_title")}
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-1.png"
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
          <li>{t("checkout_title")}</li>
        </ul>
      </BreadcrumbOne>
      <div className="checkout-area space-mt--r130 space-mb--r130">
        <Container>
          {cartItems && cartItems.length >= 1 ? (
            <Row>
              <Col>
                <div className="lezada-form">
                  <form className="checkout-form">
                    <div className="row row-40">
                      <div className="col-lg-7 space-mb--20">
                        {/* Billing Address */}
                        <div id="billing-form" className="space-mb--40">
                          <h4 className="checkout-title">
                            {t("billing_address")}
                          </h4>
                          <div className="row">
                            <div className="col-md-6 col-12 space-mb--20">
                              <label>{t("first_name_label")}*</label>
                              <input
                                type="text"
                                value={billingInfo.firstName}
                                onChange={(e) =>
                                  setBillingInfo({
                                    ...billingInfo,
                                    firstName: e.target.value,
                                  })
                                }
                                placeholder={t("first_name_placeholder")}
                              />
                            </div>
                            <div className="col-md-6 col-12 space-mb--20">
                              <label>{t("last_name_label")}*</label>
                              <input
                                type="text"
                                value={billingInfo.lastName}
                                onChange={(e) =>
                                  setBillingInfo({
                                    ...billingInfo,
                                    lastName: e.target.value,
                                  })
                                }
                                placeholder={t("last_name_placeholder")}
                              />
                            </div>
                            <div className="col-md-6 col-12 space-mb--20">
                              <label>{t("email_label")}*</label>
                              <input
                                type="email"
                                value={billingInfo.email}
                                disabled
                                placeholder={t("email_placeholder")}
                              />
                            </div>
                            <div className="col-md-6 col-12 space-mb--20">
                              <label>{t("phone_label")}*</label>
                              <input
                                type="text"
                                value={billingInfo.phone}
                                onChange={(e) =>
                                  setBillingInfo({
                                    ...billingInfo,
                                    phone: e.target.value,
                                  })
                                }
                                placeholder={t("phone_placeholder")}
                              />
                            </div>
                            <div className="col-12 space-mb--20">
                              <label>{t("company_label")}</label>
                              <input
                                type="text"
                                placeholder={t("company_placeholder")}
                              />
                            </div>
                            <div className="col-12 space-mb--20">
                              <label>{t("address_label")}*</label>
                              <input
                                type="text"
                                value={billingInfo.address1}
                                onChange={(e) =>
                                  setBillingInfo({
                                    ...billingInfo,
                                    address1: e.target.value,
                                  })
                                }
                                placeholder={t("address_line1_placeholder")}
                              />
                              <input
                                type="text"
                                placeholder={t("address_line2_placeholder")}
                              />
                            </div>
                            <div className="col-md-6 col-12 space-mb--20">
                              <label>{t("country_label")}*</label>
                              <select>
                                <option>{t("country_bangladesh")}</option>
                                <option>{t("country_china")}</option>
                                <option>{t("country_australia")}</option>
                                <option>{t("country_india")}</option>
                                <option>{t("country_japan")}</option>
                              </select>
                            </div>
                            <div className="col-md-6 col-12 space-mb--20">
                              <label>{t("city_label")}*</label>
                              <input
                                type="text"
                                value={billingInfo.city}
                                onChange={(e) =>
                                  setBillingInfo({
                                    ...billingInfo,
                                    city: e.target.value,
                                  })
                                }
                                placeholder={t("city_placeholder")}
                              />
                            </div>
                            <div className="col-md-6 col-12 space-mb--20">
                              <label>{t("state_label")}*</label>
                              <input
                                type="text"
                                placeholder={t("state_placeholder")}
                              />
                            </div>
                            <div className="col-md-6 col-12 space-mb--20">
                              <label>{t("zip_label")}*</label>
                              <input
                                type="text"
                                value={billingInfo.zip}
                                onChange={(e) =>
                                  setBillingInfo({
                                    ...billingInfo,
                                    zip: e.target.value,
                                  })
                                }
                                placeholder={t("zip_placeholder")}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-5">
                        <div className="row">
                          {/* Cart Total */}
                          <div className="col-12 space-mb--50">
                            <h4 className="checkout-title">
                              {t("cart_total")}
                            </h4>
                            <div className="checkout-cart-total">
                              <h4>
                                {t("product_label")}{" "}
                                <span>{t("total_label")}</span>
                              </h4>
                              <ul>
                                {cartItems.map((product, i) => {
                                  const productPrice =
                                    product.price[currentLanguage] || "00.00";
                                  const discountedPrice = getDiscountPrice(
                                    productPrice,
                                    product.discount
                                  ).toFixed(2);
                                  cartTotalPrice +=
                                    discountedPrice * product.quantity;
                                  return (
                                    <li key={i}>
                                      {product.name[currentLanguage] ||
                                        product.name["en"]}{" "}
                                      X {product.quantity}{" "}
                                      <span>
                                        {currentLanguage === "mk"
                                          ? `${discountedPrice} ${t(
                                              "currency"
                                            )}`
                                          : `${t(
                                              "currency"
                                            )} ${discountedPrice}`}
                                      </span>
                                    </li>
                                  );
                                })}
                              </ul>
                              <p>
                                {t("subtotal_label")}{" "}
                                <span>
                                  {currentLanguage === "mk"
                                    ? `${cartTotalPrice.toFixed(2)} ${t(
                                        "currency"
                                      )}`
                                    : `${t("currency")} ${cartTotalPrice.toFixed(
                                        2
                                      )}`}
                                </span>
                              </p>
                              <p>
                                {t("shipping_fee_label")}{" "}
                                <span>
                                  {currentLanguage === "mk"
                                    ? `00.00 ${t("currency")}`
                                    : `${t("currency")} 00.00`}
                                </span>
                              </p>
                              <h4>
                                {t("grand_total_label")}{" "}
                                <span>
                                  {currentLanguage === "mk"
                                    ? `${cartTotalPrice.toFixed(2)} ${t(
                                        "currency"
                                      )}`
                                    : `${t("currency")} ${cartTotalPrice.toFixed(
                                        2
                                      )}`}
                                </span>
                              </h4>
                            </div>
                          </div>
                          {/* Payment Method */}
                          <div className="col-12">
                            <h4 className="checkout-title">
                              {t("payment_method")}
                            </h4>
                            <div className="checkout-payment-method">
                              {/* <div className="single-method">
                                <input
                                  type="radio"
                                  id="payment_check"
                                  name="payment-method"                                  
                                  value="payment_check"
                                  onChange={(e) =>
                                    setSelectedPaymentMethod(e.target.value)
                                  }
                                />
                                <label htmlFor="payment_check">
                                  {t("payment_check")}
                                </label>
                              </div> */}
                              <div className="single-method">
                                <input
                                  type="radio"
                                  id="payment_bank"
                                  name="payment-method"
                                  value="payment_bank"
                                  onChange={(e) =>
                                    setSelectedPaymentMethod(e.target.value)
                                  }
                                />
                                <label htmlFor="payment_bank">
                                  {t("payment_bank")}
                                </label>
                              </div>
                              <div className="single-method">
                                <input
                                  type="radio"
                                  id="payment_cash"
                                  name="payment-method"
                                  value="payment_cash"
                                  onChange={(e) =>
                                    setSelectedPaymentMethod(e.target.value)
                                  }
                                />
                                <label htmlFor="payment_cash">
                                  {t("payment_cash")}
                                </label>
                              </div>
                              <div className="single-method">
                                <input
                                  type="radio"
                                  id="payment_paypal"
                                  name="payment-method"
                                  value="payment_paypal"
                                  onChange={(e) =>
                                    setSelectedPaymentMethod(e.target.value)
                                  }
                                />
                                <label htmlFor="payment_paypal">
                                  {t("payment_paypal")}
                                </label>
                              </div>
                              {/* <div className="single-method">
                                <input
                                  type="radio"
                                  id="payment_payoneer"
                                  name="payment-method"
                                  value="payment_payoneer"                                 
                                />
                                <label htmlFor="payment_payoneer">
                                  {t("payment_payoneer")}
                                </label>
                              </div> */}
                              <div className="single-method">
                                <input 
                                  type="checkbox" 
                                  id="accept_terms" 
                                  checked={acceptedTerms}
                                  onChange={(e) =>
                                    setAcceptedTerms(e.target.checked)
                                  }
                                  />
                                <label htmlFor="accept_terms">
                                  {t("accept_terms_label")}
                                </label>
                              </div>
                            </div>
                            <button type="button" onClick={handlePlaceOrder} className="lezada-button lezada-button--medium space-mt--20">
                              {t("place_order")}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col>
                <div className="item-empty-area text-center">
                  <div className="item-empty-area__icon space-mb--30">
                    <IoMdCash />
                  </div>
                  <div className="item-empty-area__text">
                    <p className="space-mb--30">{t("cart_empty_message")}</p>
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
      {showPayPalModal && (
        <div className="paypal-modal-overlay">
          <div className="paypal-modal-content">            
            <PayPalPayment  amount={
          currentLanguage === "mk"
            ? (cartTotalPrice / conversionRateMKDToEUR).toFixed(2) // convert MKD to EUR
            : cartTotalPrice.toFixed(2) // already in EUR
          }  
        currency={currency} onSuccess={handlePayPalSuccess} onClose={handleClose} />            
          </div>
        </div>
      )}
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
    deleteAllFromCart: (addToast, t) => {
      dispatch(deleteAllFromCart(addToast, t));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
