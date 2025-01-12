import Link from "next/link";
import { IoIosClose } from "react-icons/io";
import CustomScroll from "react-custom-scroll";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { getDiscountPrice } from "../../../lib/product";
import { deleteFromWishlist } from "../../../redux/actions/wishlistActions";
import { useLocalization } from "../../../context/LocalizationContext"; // Import localization hook

const WishlistOverlay = ({
  activeStatus,
  getActiveStatus,
  wishlistItems,
  deleteFromWishlist
}) => {
  const { addToast } = useToasts();
  const { t, currentLanguage } = useLocalization(); // Use localization hook
  
  return (
    <div className={`wishlist-overlay ${activeStatus ? "active" : ""}`}>
      <div
        className="wishlist-overlay__close"
        onClick={() => {
          getActiveStatus(false);
          document.querySelector("body").classList.remove("overflow-hidden");
        }}
      />
      <div className="wishlist-overlay__content">
        {/*=======  close icon  =======*/}
        <button
          className="wishlist-overlay__close-icon"
          onClick={() => {
            getActiveStatus(false);
            document.querySelector("body").classList.remove("overflow-hidden");
          }}
        >
          <IoIosClose />
        </button>
        {/*=======  offcanvas wishlist content container  =======*/}
        <div className="wishlist-overlay__content-container">
          <h3 className="wishlist-title">{t("wishlist_title")}</h3>
          {wishlistItems.length >= 1 ? (
            <div className="wishlist-product-wrapper">
              <div className="wishlist-product-container">
                <CustomScroll allowOuterScroll={true}>
                  {wishlistItems.map((product, i) => {
                    const discountedPrice = getDiscountPrice(
                      product.price,
                      product.discount
                    ).toFixed(2);
                    return (
                      <div className="single-wishlist-product" key={i}>
                        <span className="wishlist-close-icon">
                          <button
                            onClick={() =>
                              deleteFromWishlist(product, addToast, t)
                            }
                          >
                            <IoIosClose />
                          </button>
                        </span>
                        <div className="image">
                          <Link
                            href={`/shop/product-basic/[slug]?slug=${product.slug}`}
                            as={`${process.env.PUBLIC_URL}/shop/product-basic/${product.slug}`}
                          >
                            <a>
                              <img
                                src={
                                  process.env.PUBLIC_URL + product.thumbImage[0]
                                }
                                className="img-fluid"
                                alt=""
                              />
                            </a>
                          </Link>
                        </div>
                        <div className="content">
                          <h5>
                            <Link
                              href={`/shop/product-basic/[slug]?slug=${product.slug}`}
                              as={`${process.env.PUBLIC_URL}/shop/product-basic/${product.slug}`}
                            >
                              <a>{product.name[currentLanguage] || product.name["en"]}</a>
                            </Link>
                          </h5>
                          <p>
                            <span className="discounted-price">
                            {currentLanguage === 'mk' 
                                          ? `${discountedPrice} ${t("currency")}` 
                                          : `${t("currency")} ${discountedPrice}`}                             
                            </span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </CustomScroll>
              </div>
              {/*=======  wishlist buttons  =======*/}
              <div className="wishlist-buttons">
                <Link
                  href="/other/wishlist"
                  as={process.env.PUBLIC_URL + "/other/wishlist"}
                >
                  <a>{t("view_wishlist")}</a>
                </Link>
              </div>
            </div>
          ) : (
            t("no_items_in_wishlist")
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    wishlistItems: state.wishlistData
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteFromWishlist: (item, addToast, t) => {
      dispatch(deleteFromWishlist(item, addToast, t));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WishlistOverlay);
