import Link from "next/link";
import { IoIosClose } from "react-icons/io";
import CustomScroll from "react-custom-scroll";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { getDiscountPrice } from "../../../lib/product";
import { deleteFromCart } from "../../../redux/actions/cartActions";
import { useLocalization } from "../../../context/LocalizationContext";

const CartOverlay = ({
  activeStatus,
  getActiveStatus,
  cartItems,
  deleteFromCart
}) => {
  let cartTotalPrice = 0;
  const { addToast } = useToasts();
  const { t, currentLanguage } = useLocalization();

  return (
    (<div className={`cart-overlay ${activeStatus ? "active" : ""}`}>
      <div
        className="cart-overlay__close"
        onClick={() => {
          getActiveStatus(false);
          document.querySelector("body").classList.remove("overflow-hidden");
        }}
      />
      <div className="cart-overlay__content">
        <button
          className="cart-overlay__close-icon"
          onClick={() => {
            getActiveStatus(false);
            document.querySelector("body").classList.remove("overflow-hidden");
          }}
        >
          <IoIosClose />
        </button>
        <div className="cart-overlay__content-container">
          <h3 className="cart-title">{t("cart_title")}</h3>
          {cartItems.length >= 1 ? (
            <div className="cart-product-wrapper">
              <div className="cart-product-container">
                <CustomScroll allowOuterScroll={true}>
                  {cartItems.map((product, i) => {
                    const discountedPrice = getDiscountPrice(
                      product.price,
                      product.discount
                    ).toFixed(2);

                    cartTotalPrice += discountedPrice * product.quantity;

                    return (
                      (<div className="single-cart-product" key={i}>
                        <span className="cart-close-icon">
                          <button
                            onClick={() => deleteFromCart(product, addToast, t)}
                          >
                            <IoIosClose />
                          </button>
                        </span>
                        <div className="image">
                          <Link href={`/shop/product-basic/${product.slug}`} legacyBehavior>
                            <img
                              src={
                                process.env.PUBLIC_URL + product.thumbImage[0]
                              }
                              className="img-fluid"
                              alt=""
                            />
                          </Link>
                        </div>
                        <div className="content">
                          <h5>
                            <Link href={`/shop/product-basic/${product.slug}`} legacyBehavior>
                              {product.name[currentLanguage] || product.name["en"]}
                            </Link>
                          </h5>
                          {product.selectedProductColor &&
                          product.selectedProductSize ? (
                            <div className="cart-item-variation">
                              <span>
                                {t("color")}: {product.selectedProductColor}
                              </span>
                              <span>
                                {t("size")}: {product.selectedProductSize}
                              </span>
                            </div>
                          ) : null}
                          <p>
                            <span className="cart-count">
                              {product.quantity} x{" "}
                            </span>
                            <span className="discounted-price">
                              {t("currency")}{discountedPrice}
                            </span>
                          </p>
                        </div>
                      </div>)
                    );
                  })}
                </CustomScroll>
              </div>
              <p className="cart-subtotal">
                <span className="subtotal-title">{t("subtotal")}</span>
                <span className="subtotal-amount">
                  {t("currency")}{cartTotalPrice.toFixed(2)}
                </span>
              </p>
              <div className="cart-buttons">
                <Link href="/other/cart" legacyBehavior>
                  {t("view_cart")}
                </Link>
                <Link href="/other/checkout" legacyBehavior>
                  {t("checkout")}
                </Link>
              </div>
              <p className="free-shipping-text">{t("free_shipping_text")}</p>
            </div>
          ) : (
            t("no_items_found_in_cart")
          )}
        </div>
      </div>
    </div>)
  );
};

const mapStateToProps = (state) => {
  return {
    cartItems: state.cartData
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteFromCart: (item, addToast, t) => {
      dispatch(deleteFromCart(item, addToast, t));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CartOverlay);
