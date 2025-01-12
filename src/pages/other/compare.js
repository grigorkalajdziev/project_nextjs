import { Fragment } from "react";
import Link from "next/link";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { Container, Row, Col } from "react-bootstrap";
import { IoIosShuffle, IoIosTrash } from "react-icons/io";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { deleteFromCompare } from "../../redux/actions/compareActions";
import { addToCart } from "../../redux/actions/cartActions";
import { ProductRating } from "../../components/Product";
import { getDiscountPrice } from "../../lib/product";
import { useLocalization } from "../../context/LocalizationContext";

const Compare = ({ cartItems, compareItems, addToCart, deleteFromCompare }) => {
  const { addToast } = useToasts();
  const { t, currentLanguage } = useLocalization();

  const handleAddToCart = (item, addToast, quantityCount, selectedColor, selectedSize) => {
    addToCart(item, addToast, quantityCount, selectedColor, selectedSize, t);
  };

  return (
    <LayoutTwo>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle={t("compare_page_title")}
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-1.png"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>{t("home")}</a>
            </Link>
          </li>

          <li>{t("compare")}</li>
        </ul>
      </BreadcrumbOne>
      <div className="compare-area space-mt--r130 space-mb--r130">
        <Container>
          <Row>
            <Col>
              {compareItems && compareItems.length >= 1 ? (
                <div className="row">
                  <div className="col-lg-12">
                    <div className="compare-page-content">
                      <div className="compare-table table-responsive">
                        <table className="table table-bordered mb-0">
                          <tbody>
                            <tr>
                              <th className="title-column">{t("product_info")}</th>
                              {compareItems.map((product, i) => {
                                const cartItem = cartItems.filter(
                                  (item) => item.id === product.id
                                )[0];
                                return (
                                  <td className="product-image-title" key={i}>
                                    <div className="compare-remove">
                                      <button
                                        onClick={() =>
                                          deleteFromCompare(product, addToast, t)
                                        }
                                        aria-label={t("remove_product")}
                                      >
                                        <IoIosTrash />
                                      </button>
                                    </div>
                                    <Link
                                      href={`/shop/product-basic/[slug]?slug=${product.slug}`}
                                      as={`${process.env.PUBLIC_URL}/shop/product-basic/${product.slug}`}
                                    >
                                      <a className="image">
                                        <img
                                          className="img-fluid"
                                          src={
                                            process.env.PUBLIC_URL +
                                            product.thumbImage[0]
                                          }
                                          alt=""
                                        />
                                      </a>
                                    </Link>
                                    <div className="product-title">
                                      <Link
                                        href={`/shop/product-basic/[slug]?slug=${product.slug}`}
                                        as={`${process.env.PUBLIC_URL}/shop/product-basic/${product.slug}`}
                                      >
                                        <a>{product.name[currentLanguage] || product.name["en"]}</a>
                                      </Link>
                                    </div>
                                    <div className="compare-btn">
                                      {product.affiliateLink ? (
                                        <a
                                          href={product.affiliateLink}
                                          target="_blank"
                                          className="lezada-button lezada-button--primary"
                                        >
                                          {t("buy_now")}
                                        </a>
                                      ) : product.variation &&
                                        product.variation.length >= 1 ? (
                                        <Link
                                          href={`/shop/product-basic/[slug]?slug=${product.slug}`}
                                          as={`${process.env.PUBLIC_URL}/shop/product-basic/${product.slug}`}
                                        >
                                          <a className="lezada-button lezada-button--primary">
                                            {t("select_option")}
                                          </a>
                                        </Link>
                                      ) : product.stock && product.stock > 0 ? (
                                        <button
                                        onClick={() =>
                                          handleAddToCart(product, addToast, 1, product.selectedProductColor, product.selectedProductSize)
                                        }
                                          className={`lezada-button lezada-button--primary
                                            ${
                                              cartItem !== undefined &&
                                              cartItem.quantity > 0
                                                ? "active"
                                                : ""
                                            }
                                          `}
                                          disabled={
                                            cartItem !== undefined &&
                                            cartItem.quantity > 0
                                          }
                                        >
                                          {cartItem !== undefined &&
                                          cartItem.quantity > 0
                                            ? t("added")
                                            : t("add_to_cart")}
                                        </button>
                                      ) : (
                                        <button
                                          disabled
                                          className="active lezada-button lezada-button--primary"
                                        >
                                          {t("out_of_stock")}
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                );
                              })}
                            </tr>
                            <tr>
                              <th className="title-column">{t("price")}</th>
                              {compareItems.map((product, key) => {
                                const discountedPrice = getDiscountPrice(
                                  product.price,
                                  product.discount
                                ).toFixed(2);

                                const productPrice = product.price.toFixed(2);
                                return (
                                  <td className="product-price" key={key}>
                                    {product.discount > 0 ? (
                                      <Fragment>
                                        <span className="main-price discounted">
                                        {currentLanguage === 'mk' 
                                          ? `${productPrice} ${t("currency")}` 
                                          : `${t("currency")} ${productPrice}`}                                        
                                        </span>
                                        <span className="main-price">
                                        {currentLanguage === 'mk' 
                                          ? `${discountedPrice} ${t("currency")}` 
                                          : `${t("currency")} ${discountedPrice}`}                                         
                                        </span>
                                      </Fragment>
                                    ) : (
                                      <span className="main-price">
                                        {currentLanguage === 'mk' 
                                          ? `${productPrice} ${t("currency")}` 
                                          : `${t("currency")} ${productPrice}`}                                        
                                      </span>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>

                            <tr>
                              <th className="title-column">{t("description")}</th>
                              {compareItems.map((product, i) => {
                                return (
                                  <td className="product-desc" key={i}>
                                    <p>
                                      {product.shortDescription
                                        ? product.shortDescription
                                        : t("not_available")}
                                    </p>
                                  </td>
                                );
                              })}
                            </tr>

                            <tr>
                              <th className="title-column">{t("rating")}</th>
                              {compareItems.map((product, key) => {
                                return (
                                  <td className="product-rating" key={key}>
                                    <ProductRating
                                      ratingValue={product.rating}
                                    />
                                  </td>
                                );
                              })}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Row>
                  <Col>
                    <div className="item-empty-area text-center">
                      <div className="item-empty-area__icon space-mb--30">
                        <IoIosShuffle />
                      </div>
                      <div className="item-empty-area__text">
                        <p className="space-mb--30">{t("no_items_to_compare")}</p>
                        <Link
                          href="/shop/left-sidebar"
                          as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                        >
                          <a className="lezada-button lezada-button--medium">
                            {t("add_items")}
                          </a>
                        </Link>
                      </div>
                    </div>
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </LayoutTwo>
  );
};

const mapStateToProps = (state) => {
  return {
    cartItems: state.cartData,
    compareItems: state.compareData
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (item, addToast, quantityCount, selectedColor, selectedSize, t) => {
      dispatch(addToCart(item, addToast, quantityCount, selectedColor, selectedSize, t));
    },

    deleteFromCompare: (item, addToast, t) => {
      dispatch(deleteFromCompare(item, addToast, t));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Compare);
