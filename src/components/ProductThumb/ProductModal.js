import { useState, Fragment } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import { IoIosHeartEmpty, IoIosShuffle } from "react-icons/io";
import Swiper from "react-id-swiper";
import CustomScroll from "react-custom-scroll";
import { getProductCartQuantity } from "../../lib/product";
import { ProductRating } from "../Product";
import { useLocalization } from "../../context/LocalizationContext";

const ProductModal = (props) => {
  const { t, currentLanguage } = useLocalization();

  const {
    product,
    discountedprice,
    productprice,
    cartitems,
    wishlistitem,
    compareitem,
    addtocart,
    addtowishlist,
    deletefromwishlist,
    addtocompare,
    deletefromcompare,
    addtoast,
    show,
    onHide,
  } = props;

  // Initialize variation selections if applicable
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

  const productCartQty = getProductCartQuantity(
    cartitems,
    product,
    selectedProductColor,
    selectedProductSize
  );

  const gallerySwiperParams = {
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  };

  return (
    <Modal show={show} onHide={onHide} className="product-quickview" centered>
      {/* Modal Header */}
      <Modal.Header closeButton />

      {/* Modal Body */}
      <Modal.Body>
        <Row>
          {/* Left Column: Product Images */}
          <Col md={5} sm={12}>
            <div className="product-quickview__image-wrapper">
              <Swiper {...gallerySwiperParams}>
                {product.image &&
                  product.image.map((single, key) => (
                    <div key={key}>
                      <div className="single-image">
                        <img
                          src={process.env.PUBLIC_URL + single}
                          className="img-fluid"
                          alt=""
                        />
                      </div>
                    </div>
                  ))}
              </Swiper>
            </div>
          </Col>

          {/* Right Column: Product Content */}
          <Col md={7} sm={12}>
            <CustomScroll allowOuterScroll={true}>
              <div className="product-quickview__content">
                {/* Product Title */}
                <h2 className="product-quickview__title space-mb--20">
                  {product.name[currentLanguage] || product.name["en"]}
                </h2>

                {/* Price Section */}
                <div className="product-quickview__price space-mb--20">
                  {product.discount > 0 ? (
                    <Fragment>
                      <span className="main-price discounted">
                        {currentLanguage === "mk"
                          ? `${productprice} ${t("currency")}`
                          : `${t("currency")} ${productprice}`}
                      </span>
                      <span className="main-price">
                        {currentLanguage === "mk"
                          ? `${discountedprice} ${t("currency")}`
                          : `${t("currency")} ${discountedprice}`}
                      </span>
                    </Fragment>
                  ) : (
                    <span className="main-price">
                      {currentLanguage === "mk"
                        ? `${productprice} ${t("currency")}`
                        : `${t("currency")} ${productprice}`}
                    </span>
                  )}
                </div>

                {/* Rating Section */}
                {product.rating && product.rating > 0 && (
                  <div className="product-quickview__rating-wrap space-mb--20">
                    <div className="product-quickview__rating">
                      <ProductRating ratingValue={product.rating} />
                    </div>
                  </div>
                )}

                {/* Product Description */}
                <div className="product-quickview__description space-mb--30">
                  <p>{product.shortDescription[currentLanguage]}</p>
                </div>

                {/* Variation Options (Commented Out) */}
                {/*
                {product.variation ? (
                  <div className="product-quickview__size-color">
                    // Variation selection code...
                  </div>
                ) : (
                  ""
                )}
                */}

                {/* Affiliate Link or Purchase Options */}
                {product.affiliateLink ? (
                  <div className="product-quickview__quality">
                    <div className="product-quickview__cart btn-hover">
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
                    {/* Quantity Selector */}
                    <div className="product-quickview__quantity space-mb--20">
                      <div className="product-quickview__quantity__title">
                        {t("quantity")}
                      </div>
                      <div className="cart-plus-minus">
                        <button
                          onClick={() =>
                            setQuantityCount(
                              quantityCount > 1 ? quantityCount - 1 : 1
                            )
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

                    {/* Action Buttons */}
                    <div className="product-quickview__button-wrapper d-flex align-items-center">
                      {productStock && productStock > 0 ? (
                        <button
                          onClick={() =>
                            addtocart(
                              product,
                              addtoast,
                              quantityCount,
                              selectedProductColor,
                              selectedProductSize
                            )
                          }
                          disabled={productCartQty >= productStock}
                          className="lezada-button lezada-button--medium product-quickview__cart space-mr--10"
                        >
                          {t("add_to_cart")}
                        </button>
                      ) : (
                        <button
                          className="lezada-button lezada-button--medium product-quickview__ofs space-mr--10"
                          disabled
                        >
                          {t("out_of_stock")}
                        </button>
                      )}

                      <button
                        className={`product-quickview__wishlist space-mr--10 ${
                          wishlistitem !== undefined ? "active" : ""
                        }`}
                        title={
                          wishlistitem !== undefined
                            ? t("added_to_wishlist")
                            : t("add_to_wishlist")
                        }
                        onClick={
                          wishlistitem !== undefined
                            ? () => deletefromwishlist(product, addtoast, t)
                            : () => addtowishlist(product, addtoast, t)
                        }
                      >
                        <IoIosHeartEmpty />
                      </button>

                      <button
                        className={`product-quickview__compare space-mr--10 ${
                          compareitem !== undefined ? "active" : ""
                        }`}
                        title={
                          compareitem !== undefined
                            ? t("added_to_compare")
                            : t("add_to_compare")
                        }
                        onClick={
                          compareitem !== undefined
                            ? () => deletefromcompare(product, addtoast, t)
                            : () => addtocompare(product, addtoast, t)
                        }
                      >
                        <IoIosShuffle />
                      </button>
                    </div>
                  </Fragment>
                )}
              </div>
            </CustomScroll>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default ProductModal;
