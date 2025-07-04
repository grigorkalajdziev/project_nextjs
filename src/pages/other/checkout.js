"use client";

import { useState, useEffect } from "react";
import { getDatabase, push, ref, get, set } from "firebase/database";
import Link from "next/link";
import { auth } from "../api/register";
import { useToasts } from "react-toast-notifications";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import { getDiscountPrice } from "../../lib/product";
import { IoMdCash } from "react-icons/io";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { useLocalization } from "../../context/LocalizationContext";
import { useRouter } from "next/router";
import { deleteAllFromCart } from "../../redux/actions/cartActions";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  LocalizationProvider,
  DatePicker,  
} from "@mui/x-date-pickers";
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import TextField from "@mui/material/TextField";

import enLocale from "date-fns/locale/en-US";
import mkLocale from "date-fns/locale/mk";

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  return `${day}-${month}-${year}`;
};

const today = new Date().toISOString().split("T")[0];

const Checkout = ({ cartItems, deleteAllFromCart }) => {
  const { t, currentLanguage } = useLocalization();
  const { addToast } = useToasts();
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [reservationDateTime, setReservationDateTime] = useState(new Date());
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const localeMap = {
    en: enLocale,
    mk: mkLocale,
  };

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
    setIsPlacingOrder(true);
    if (!auth.currentUser) {
      addToast(t("please_log_in_to_place_order"), {
        appearance: "error",
        autoDismiss: true,
      });
      setIsPlacingOrder(false);
      return;
    }

    if (!selectedPaymentMethod) {
      addToast(t("please_select_payment_method"), {
        appearance: "error",
        autoDismiss: true,
      });
      setIsPlacingOrder(false);
      return;
    }

    // Validate acceptance of terms and conditions
    if (!acceptedTerms) {
      addToast(t("please_accept_terms"), {
        appearance: "error",
        autoDismiss: true,
      });
      setIsPlacingOrder(false);
      return;
    }

    const totalMKD = cartItems
      .reduce((total, product) => {
        const priceMKD = parseFloat(product.price["mk"] || "0");
        const discounted = getDiscountPrice(priceMKD, product.discount);
        return total + discounted * product.quantity;
      }, 0)
      .toFixed(2);

    const reservationDate = reservationDateTime.toISOString().split("T")[0];
    const reservationTime = reservationDateTime.toTimeString().slice(0, 5);

    const orderData = {
      orderNumber: generateOrderNumber(8),
      date: formatDate(new Date()),
      createdAt: Date.now(),
      status: "pending",
      paymentMethod: selectedPaymentMethod,
      paymentText: t(selectedPaymentMethod),
      total: totalMKD,
      products: cartItems.map((product) => ({
        id: product.id,
        name: product.name[currentLanguage] || product.name["en"],
        quantity: product.quantity,
        price: product.price[currentLanguage],
        discount: product.discount,
      })),
      reservationDate: reservationDate,
      reservationTime: reservationTime,
      customer: {
        email: billingInfo.email,
        phone: billingInfo.phone || "",
        address: billingInfo.address1 || "",
        state: billingInfo.state || "",
        city: billingInfo.city || "",
        postalCode: billingInfo.zip || "",
      },
    };

    try {
      const db = getDatabase();
      const ordersRef = ref(db, `orders/${auth.currentUser.uid}`);

      const newOrderRef = push(ordersRef);
      await set(newOrderRef, orderData);

      const translatedPaymentMethod = t(orderData.paymentMethod);

      const emailData = {
        to: auth.currentUser.email,
        from: "reservation@kikamakeupandbeautyacademy.com",
        orderID: orderData.orderNumber,
        reservationDate: orderData.reservationDate,
        reservationTime: orderData.reservationTime,
        customerName:
          billingInfo.firstName && billingInfo.lastName
            ? `${billingInfo.firstName} ${billingInfo.lastName}`
            : auth.currentUser.email,
        customerEmail: auth.currentUser.email,
        paymentMethod: orderData.paymentMethod,
        paymentText: translatedPaymentMethod,
        total: orderData.total,
        products: orderData.products,
        customerPhone: orderData.customer.phone,
        customerAddress: orderData.customer.address,
        customerState: orderData.customer.state,
        customerCity: orderData.customer.city,
        customerPostalCode: orderData.customer.postalCode,
        language: currentLanguage,
      };

      // Send the email
      const response = await fetch("/api/sendReservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to send reservation email to customer:", errorText);
      } else {
        console.log("Reservation email sent to customer");
      }

      const emailToAdmins = {
        to: ["grigorkalajdziev@gmail.com", "makeupbykika@hotmail.com"], // Kika's email addresses
        from: "reservation@kikamakeupandbeautyacademy.com", // Your company email
        subject: `New Reservation: Order ${orderData.orderNumber}`,
        orderID: orderData.orderNumber,
        reservationDate: orderData.reservationDate,
        reservationTime: orderData.reservationTime,
        customerName:
          billingInfo.firstName && billingInfo.lastName
            ? `${billingInfo.firstName} ${billingInfo.lastName}`
            : auth.currentUser.email,
        customerEmail: auth.currentUser.email,
        paymentMethod: orderData.paymentMethod,
        paymentText: translatedPaymentMethod,
        total: orderData.total,
        products: orderData.products,
        customerPhone: orderData.customer.phone, 
        customerAddress: orderData.customer.address, 
        customerState: orderData.customer.state, 
        customerCity: orderData.customer.city, 
        customerPostalCode: orderData.customer.postalCode,
        language: currentLanguage,
      };

      const responseKika = await fetch("/api/send-reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailToAdmins),
      });     

      if (!responseKika.ok) {
        console.error("Failed to send email to Kika");
      } else {
        console.log("Email sent to Kika");
      }

      addToast(t("order_placed_successfully"), {
        appearance: "success",
        autoDismiss: true,
      });

      deleteAllFromCart(addToast, t);
      setIsPlacingOrder(false);
      router.push("/other/my-account");
    } catch (error) {
      console.error("Error placing order:", error);
      addToast(error.message, { appearance: "error", autoDismiss: true });
    } finally {
    setIsPlacingOrder(false);
    }
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
                            {/* Reservation Title */}
                            <div className="col-12 space-mb--20">
                              <h4 className="checkout-title">
                                {t("reservation_datetime_title")}
                              </h4>
                              <p className="checkout-description small">
                                {t("reservation_datetime_description")}
                              </p>
                            </div>

                            {/* Date Picker */}
                            <div className="col-md-6 col-12 space-mb--20">
                              <LocalizationProvider
                                dateAdapter={AdapterDateFns}
                                adapterLocale={
                                  localeMap[currentLanguage] || enLocale
                                }
                              >
                                <DatePicker
                                  label={t("reservation_date_label")}
                                  value={reservationDateTime}
                                  localeText={{                                    
                                    toolbarTitle: t('choose_date'),
                                    cancelButtonLabel: t('cancel'),
                                    okButtonLabel: t('ok'),
                                  }}
                                  onChange={(date) => {
                                    if (!date) return;
                                    // preserve time portion
                                    setReservationDateTime((prev) => {
                                      const d = new Date(date);
                                      d.setHours(
                                        prev.getHours(),
                                        prev.getMinutes()
                                      );
                                      return d;
                                    });
                                  }}
                                  renderInput={(params) => (
                                    <TextField {...params} fullWidth />
                                  )}
                                  slotProps={{ textField: { fullWidth: true } }}
                                  minDate={new Date()}
                                />
                              </LocalizationProvider>
                            </div>

                            {/* Analog Time Picker */}
                            <div className="col-md-6 col-12 space-mb--20">
                              <LocalizationProvider
                                dateAdapter={AdapterDateFns}
                                adapterLocale={
                                  localeMap[currentLanguage] || enLocale
                                }
                                localeText={{
                                  timePickerToolbarTitle: t('choose_time'), 
                                  cancelButtonLabel: t('cancel'),
                                  okButtonLabel: t('ok'),
                                }}
                              >
                                <MobileTimePicker
                                    label={t("reservation_time_label")}
                                    value={reservationDateTime}
                                    onChange={(time) => {
                                      if (!time) return;
                                      setReservationDateTime(prev => {
                                        const d = new Date(prev);
                                        d.setHours(time.getHours(), time.getMinutes());
                                        return d;                                        
                                      });                                      
                                    }}
                                    slotProps={{ textField: { fullWidth: true } }}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                  />
                              </LocalizationProvider>
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
                            <button
                              type="button"
                              onClick={handlePlaceOrder}
                              className="lezada-button lezada-button--medium space-mt--20"
                              disabled={isPlacingOrder}
                            >
                              {isPlacingOrder ? (
                              <Spinner
                                animation="border"
                                role="status"
                                size="sm"
                                style={{ display: "block", margin: "0 auto" }}
                              >
                                <span className="visually-hidden">Loading...</span>
                              </Spinner>
                            ) : (
                              t("place_order")
                            )}
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
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
