import { useState, useEffect } from "react";
import { getDatabase, ref, get } from "firebase/database";
import Link from "next/link";
import { auth } from "../api/register";
import { Container, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { getDiscountPrice } from "../../lib/product";
import { IoMdCash } from "react-icons/io";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { useLocalization } from "../../context/LocalizationContext";

const Checkout = ({ cartItems }) => {
  const { t, currentLanguage } = useLocalization();
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

  useEffect(() => {
    document.querySelector("body").classList.remove("overflow-hidden");
  });

  useEffect(() => {
    const fetchBillingInfo = async () => {
      const db = getDatabase();
      const userId = auth.currentUser?.uid; // Replace with the actual authenticated user ID
      const userRef = ref(db, `users/${userId}`);
  
      try {
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          
          // Set all the necessary information to the state
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
    (<LayoutTwo>
      {/* breadcrumb */}
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
                                    : `${t(
                                        "currency"
                                      )} ${cartTotalPrice.toFixed(2)}`}
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
                                    : `${t(
                                        "currency"
                                      )} ${cartTotalPrice.toFixed(2)}`}
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
                                  id="payment_check"
                                  name="payment-method"
                                  defaultValue="check"
                                />
                                <label htmlFor="payment_check">
                                  {t("payment_check")}
                                </label>
                              </div>
                              <div className="single-method">
                                <input
                                  type="radio"
                                  id="payment_bank"
                                  name="payment-method"
                                  defaultValue="bank"
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
                                  defaultValue="cash"
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
                                  defaultValue="paypal"
                                />
                                <label htmlFor="payment_paypal">
                                  {t("payment_paypal")}
                                </label>
                              </div>
                              <div className="single-method">
                                <input
                                  type="radio"
                                  id="payment_payoneer"
                                  name="payment-method"
                                  defaultValue="payoneer"
                                />
                                <label htmlFor="payment_payoneer">
                                  {t("payment_payoneer")}
                                </label>
                              </div>
                              <div className="single-method">
                                <input type="checkbox" id="accept_terms" />
                                <label htmlFor="accept_terms">
                                  {t("accept_terms_label")}
                                </label>
                              </div>
                            </div>
                            <button className="lezada-button lezada-button--medium space-mt--20">
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
    cartItems: state.cartData,
  };
};

export default connect(mapStateToProps)(Checkout);
