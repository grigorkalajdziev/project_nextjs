import { useState, useEffect, Fragment } from "react";
import { IoIosHeartEmpty, IoIosShuffle } from "react-icons/io";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Link from "next/link";
import { useRouter } from "next/router";
import { ProductRating } from "../Product";
import { getProductCartQuantity } from "../../lib/product";
import { useLocalization } from "../../context/LocalizationContext";
import { database, ref, get, auth } from "../../pages/api/register";
import { onAuthStateChanged } from "firebase/auth";

const ProductDescription = ({
  product,
  productPrice,
  discountedPrice,
  cartItems,
  wishlistItem,
  compareItem,
  addToast,
  addToCart,
  addToWishlist,
  deleteFromWishlist,
  addToCompare,
  deleteFromCompare,
}) => {
  const { t, currentLanguage } = useLocalization();
  const router = useRouter();
  const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== "undefined"
      ? window.location.origin
      : "https://kikamakeupandbeautyacademy.com");
  const [selectedProductColor, setSelectedProductColor] = useState(
    product.variation ? product.variation[0].color : ""
  );
  const [selectedProductSize, setSelectedProductSize] = useState(
    product.variation ? product.variation[0].size[0].name : ""
  );
  const [productStock, setProductStock] = useState(
    product.variation ? product.variation[0].size[0].stock : product.stock
  );
  const [quantityCount, setQuantityCount] = useState(1);

  const [averageRating, setAverageRating] = useState(product.rating || 0);
  const [reviewCount, setReviewCount] = useState(product.ratingCount || 0);

  const canonicalProductUrl = `${SITE_URL}/shop/product-basic/${product.slug}`;

  const img = product.image?.[0] || product.thumbImage?.[0];
  const imageUrl = img
    ? img.startsWith("http")
      ? img
      : `${SITE_URL}${img}`
    : `${SITE_URL}/assets/images/default-product.png`;

  const shareText = product.name[currentLanguage] || product.name.en;

  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalProductUrl)}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(canonicalProductUrl)}`;

  const facebookShareImageUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageUrl)}`;
  const twitterShareImageUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(imageUrl)}`;

  const productCartQty = getProductCartQuantity(
    cartItems,
    product,
    selectedProductColor,
    selectedProductSize
  );

  const calculateAverageRating = (reviews) => {
    const keys = Object.keys(reviews);
    if (keys.length === 0) return 0;
    const total = keys.reduce((acc, key) => acc + reviews[key].rating, 0);
    return total / keys.length;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const fetchReviews = async () => {
          try {
            const reviewsRef = ref(
              database,
              "productReviews/" + product.id + "/reviews"
            );
            const snapshot = await get(reviewsRef);
            if (snapshot.exists()) {
              const reviewsData = snapshot.val();
              const avg = calculateAverageRating(reviewsData);
              setAverageRating(avg);
              setReviewCount(Object.keys(reviewsData).length);
            } else {
              setAverageRating(0);
              setReviewCount(0);
            }
          } catch (error) {
            console.error("Error fetching reviews:", error);
          }
        };

        fetchReviews();
      } else {
        // Not logged in, do not fetch reviews (or clear them)
        setAverageRating(0);
        setReviewCount(0);
      }
    });
  }, [product.id]);

  return (
    <div className="product-content">
      {averageRating > 0 ? (
        <div className="product-content__rating-wrap d-block d-sm-flex space-mb--20">
          <div className="product-content__rating space-mr--20">
            <ProductRating ratingValue={averageRating} />
          </div>
          <div className="product-content__rating-count">
            <a href="#">
              ( {reviewCount} {t("customer_reviews")} )
            </a>
          </div>
        </div>
      ) : (
        ""
      )}
      <h2 className="product-content__title space-mb--20">
        {product.name[currentLanguage] || product.name["en"]}
      </h2>
      <div className="product-content__price space-mb--20">
        {product.discount > 0 ? (
          <Fragment>
            <span className="main-price discounted">
              {currentLanguage === "mk"
                ? `${productPrice} ${t("currency")}`
                : `${t("currency")} ${productPrice}`}
            </span>
            <span className="main-price">
              {currentLanguage === "mk"
                ? `${discountedPrice} ${t("currency")}`
                : `${t("currency")} ${discountedPrice}`}
            </span>
          </Fragment>
        ) : (
          <span className="main-price">
            {currentLanguage === "mk"
              ? `${productPrice} ${t("currency")}`
              : `${t("currency")} ${productPrice}`}
          </span>
        )}
      </div>
      <div className="product-content__description space-mb--30">
        <p>{product.shortDescription[currentLanguage]}</p>
      </div>
      {product.variation ? (
        <div className="product-content__size-color">
          {/*<div className="product-content__size space-mb--20">
           <div className="product-content__size__title">{t("size")}</div>
            <div className="product-content__size__content">
              {product.variation &&
                product.variation.map((single) => {
                  return single.color === selectedProductColor
                    ? single.size.map((singleSize, i) => {
                        return (
                          <Fragment key={i}>
                            <input
                              type="radio"
                              value={singleSize.name}
                              checked={
                                singleSize.name === selectedProductSize
                                  ? "checked"
                                  : ""
                              }
                              id={singleSize.name}
                              onChange={() => {
                                setSelectedProductSize(singleSize.name);
                                setProductStock(singleSize.stock);
                                setQuantityCount(1);
                              }}
                            />
                            <label htmlFor={singleSize.name}>
                              {singleSize.name}
                            </label>
                          </Fragment>
                        );
                      })
                    : "";
                })}
            </div> 
          </div>
          <div className="product-content__color space-mb--20">
           {/* <div className="product-content__color__title">{t("color")}</div>
             <div className="product-content__color__content">
              {product.variation.map((single, i) => {
                return (
                  <Fragment key={i}>
                    <input
                      type="radio"
                      value={single.color}
                      name="product-color"
                      id={single.color}
                      checked={
                        single.color === selectedProductColor ? "checked" : ""
                      }
                      onChange={() => {
                        setSelectedProductColor(single.color);
                        setSelectedProductSize(single.size[0].name);
                        setProductStock(single.size[0].stock);
                        setQuantityCount(1);
                      }}
                    />
                    <label
                      htmlFor={single.color}
                      style={{ backgroundColor: single.colorCode }}
                    ></label>
                  </Fragment>
                );
              })}
            </div> 
          </div>*/}
        </div>
      ) : (
        ""
      )}
      {product.affiliateLink ? (
        <div className="product-content__quality">
          <div className="product-content__cart btn-hover">
            <a
              href={product.affiliateLink}
              rel="noopener noreferrer"
              target="_blank"
              className="lezada-button lezada-button--medium"
            >
              {t("buy_now")}
            </a>
          </div>
        </div>
      ) : (
        <Fragment>
          <div className="product-content__quantity space-mb--40">
            <div className="product-content__quantity__title">
              {t("quantity")}
            </div>
            <div className="cart-plus-minus">
              <button
                onClick={() =>
                  setQuantityCount(quantityCount > 1 ? quantityCount - 1 : 1)
                }
                className="qtybutton"
              >
                -
              </button>
              <input
                className="cart-plus-minus-box"
                type="text"
                value={quantityCount}
                readOnly
              />
              <button
                onClick={() =>
                  setQuantityCount(
                    quantityCount < productStock - productCartQty
                      ? quantityCount + 1
                      : quantityCount
                  )
                }
                className="qtybutton"
              >
                +
              </button>
            </div>
          </div>

          <div className="product-content__button-wrapper d-flex align-items-center">
            {productStock && productStock > 0 ? (
              <button
                onClick={() =>
                  addToCart(
                    product,
                    addToast,
                    quantityCount,
                    selectedProductColor,
                    selectedProductSize
                  )
                }
                disabled={productCartQty >= productStock}
                className="lezada-button lezada-button--medium product-content__cart space-mr--10"
              >
                {t("add_to_cart")}
              </button>
            ) : (
              <button
                className="lezada-button lezada-button--medium product-content__ofs space-mr--10"
                disabled
              >
                {t("out_of_stock")}
              </button>
            )}

            <button
              className={`product-content__wishlist space-mr--10 ${
                wishlistItem !== undefined ? "active" : ""
              }`}
              title={
                wishlistItem !== undefined
                  ? t("added_to_wishlist")
                  : t("add_to_wishlist")
              }
              onClick={
                wishlistItem !== undefined
                  ? () => deleteFromWishlist(product, addToast)
                  : () => addToWishlist(product, addToast)
              }
            >
              <IoIosHeartEmpty />
            </button>

            <button
              className={`product-content__compare space-mr--10 ${
                compareItem !== undefined ? "active" : ""
              }`}
              title={
                compareItem !== undefined
                  ? t("added_to_compare")
                  : t("add_to_compare")
              }
              onClick={
                compareItem !== undefined
                  ? () => deleteFromCompare(product, addToast)
                  : () => addToCompare(product, addToast)
              }
            >
              <IoIosShuffle />
            </button>
          </div>

          <div className="product-content__other-info space-mt--50">
            <table>
              <tbody>
                <tr className="single-info">
                  <td className="title">{t("sku")}: </td>
                  <td className="value">{product.sku}</td>
                </tr>
                <tr className="single-info">
                  <td className="title">{t("categories")}: </td>
                  <td className="value">
                    {product.category &&
                      product.category.map((item, index, arr) => {
                        return (
                          <Link
                            href="/shop/left-sidebar"
                            as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                            key={index}
                          >
                            {item + (index !== arr.length - 1 ? ", " : "")}
                          </Link>
                        );
                      })}
                  </td>
                </tr>
                <tr className="single-info">
                  <td className="title">{t("tags")}: </td>
                  <td className="value">
                    {product.tag &&
                      product.tag.map((item, index, arr) => {
                        return (
                          <Link
                            href="/shop/left-sidebar"
                            as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                            key={index}
                          >
                            {item + (index !== arr.length - 1 ? ", " : "")}
                          </Link>
                        );
                      })}
                  </td>
                </tr>
                <tr className="single-info">
                  <td className="title">{t("share")}: </td>
                  <td className="value">
                    <ul className="social-icons">
                      {/* X / Twitter */}
                      <li>
                        <a
                          href={twitterShareImageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={t("share_on_twitter")}
                        >
                          <FaXTwitter />
                        </a>
                      </li>

                      {/* Facebook */}
                      <li>
                        <a
                          href={facebookShareImageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={t("share_on_facebook")}
                        >
                          <FaFacebookF />
                        </a>
                      </li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default ProductDescription;
