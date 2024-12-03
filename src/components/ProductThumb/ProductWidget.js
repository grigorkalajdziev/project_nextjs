import { Fragment } from "react";
import Link from "next/link";
import { ProductRating } from "../Product";

const ProductWidget = ({
  product,
  discountedPrice,
  productPrice,
  cartItem,
  addToCart,
  addToast,
  sliderClass
}) => {
  return (
    <div
      className={`single-widget-product-wrapper ${
        sliderClass ? sliderClass : ""
      }`}
    >
      <div className="single-widget-product">
        <div className="single-widget-product__image">
          <Link
            href={`/shop/product-basic/[slug]?slug=${product.slug}`}
            as={process.env.PUBLIC_URL + "/shop/product-basic/" + product.slug}
          >
            <a className="image-wrap">
              <img
                src={process.env.PUBLIC_URL + product.thumbImage[0]}
                className="img-fluid"
                alt={product.name}
              />
            </a>
          </Link>
        </div>
        <div className="single-widget-product__content">
          <div className="single-widget-product__content__top">
            <h3 className="product-title space-mb--10">
              <Link
                href={`/shop/product-basic/[slug]?slug=${product.slug}`}
                as={
                  process.env.PUBLIC_URL + "/shop/product-basic/" + product.slug
                }
              >
                <a>{product.name}</a>
              </Link>
            </h3>
            <div className="price space-mb--10">
              {product.discount > 0 ? (
                <Fragment>
                  <span className="main-price discounted">${productPrice}</span>
                  <span className="discounted-price">${discountedPrice}</span>
                </Fragment>
              ) : (
                <span className="main-price">${productPrice}</span>
              )}
            </div>
            <div className="rating">
              <ProductRating ratingValue={product.rating} />
            </div>
          </div>
          <div className="single-widget-product__content__bottom">
            {/* add to cart */}
            {product.affiliateLink ? (
              <a
                href={product.affiliateLink}
                target="_blank"
                className="cart-btn"
              >
                Buy now
              </a>
            ) : product.variation && product.variation.length >= 1 ? (
              <Link
                href={`/shop/product-basic/[slug]?slug=${product.slug}`}
                as={
                  process.env.PUBLIC_URL + "/shop/product-basic/" + product.slug
                }
              >
                <a className="cart-btn">Select Option</a>
              </Link>
            ) : product.stock && product.stock > 0 ? (
              <button
                onClick={() => addToCart(product, addToast)}
                disabled={
                  cartItem !== undefined && cartItem.quantity >= cartItem.stock
                }
                className="cart-btn"
              >
                {cartItem !== undefined ? "Added to cart" : "Add to cart"}
              </button>
            ) : (
              <button disabled className="cart-btn">
                Out of Stock
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductWidget;
