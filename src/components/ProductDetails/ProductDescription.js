import { useState, Fragment } from "react";
import { IoIosHeartEmpty, IoIosShuffle } from "react-icons/io";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import Link from "next/link";
import { ProductRating } from "../Product";
import { getProductCartQuantity } from "../../lib/product";

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
  deleteFromCompare
}) => {
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
    cartItems,
    product,
    selectedProductColor,
    selectedProductSize
  );

  return (
    <div className="product-content">
      {product.rating && product.rating > 0 ? (
        <div className="product-content__rating-wrap d-block d-sm-flex space-mb--20">
          <div className="product-content__rating space-mr--20">
            <ProductRating ratingValue={product.rating} />
          </div>
          <div className="product-content__rating-count">
            <a href="#">( {product.ratingCount} customer reviews )</a>
          </div>
        </div>
      ) : (
        ""
      )}
      <h2 className="product-content__title space-mb--20">{product.name}</h2>
      <div className="product-content__price space-mb--20">
        {product.discount > 0 ? (
          <Fragment>
            <span className="main-price discounted">${productPrice}</span>
            <span className="main-price">${discountedPrice}</span>
          </Fragment>
        ) : (
          <span className="main-price">${productPrice} </span>
        )}
      </div>
      <div className="product-content__description space-mb--30">
        <p>{product.shortDescription}</p>
      </div>

      {product.variation ? (
        <div className="product-content__size-color">
          <div className="product-content__size space-mb--20">
            <div className="product-content__size__title">Size</div>
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
            <div className="product-content__color__title">Color</div>
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
          </div>
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
              Buy Now
            </a>
          </div>
        </div>
      ) : (
        <Fragment>
          <div className="product-content__quantity space-mb--40">
            <div className="product-content__quantity__title">Quantity</div>
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
                Add To Cart
              </button>
            ) : (
              <button
                className="lezada-button lezada-button--medium product-content__ofs space-mr--10"
                disabled
              >
                Out of Stock
              </button>
            )}

            <button
              className={`product-content__wishlist space-mr--10 ${
                wishlistItem !== undefined ? "active" : ""
              }`}
              title={
                wishlistItem !== undefined
                  ? "Added to wishlist"
                  : "Add to wishlist"
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
                  ? "Added to compare"
                  : "Add to compare"
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
                  <td className="title">SKU: </td>
                  <td className="value">{product.sku}</td>
                </tr>
                <tr className="single-info">
                  <td className="title">Categories: </td>
                  <td className="value">
                    {product.category &&
                      product.category.map((item, index, arr) => {
                        return (
                          <Link
                            href="/shop/left-sidebar"
                            as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                            key={index}
                          >
                            <a>
                              {item + (index !== arr.length - 1 ? ", " : "")}
                            </a>
                          </Link>
                        );
                      })}
                  </td>
                </tr>
                <tr className="single-info">
                  <td className="title">Tags: </td>
                  <td className="value">
                    {product.tag &&
                      product.tag.map((item, index, arr) => {
                        return (
                          <Link
                            href="/shop/left-sidebar"
                            as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                            key={index}
                          >
                            <a>
                              {item + (index !== arr.length - 1 ? ", " : "")}
                            </a>
                          </Link>
                        );
                      })}
                  </td>
                </tr>
                <tr className="single-info">
                  <td className="title">Share on: </td>
                  <td className="value">
                    <ul className="social-icons">
                      <li>
                        <a href="https://www.twitter.com">
                          <FaTwitter />
                        </a>
                      </li>
                      <li>
                        <a href="https://www.facebook.com">
                          <FaFacebookF />
                        </a>
                      </li>
                      <li>
                        <a href="https://www.instagram.com">
                          <FaInstagram />
                        </a>
                      </li>
                      <li>
                        <a href="https://www.youtube.com">
                          <FaYoutube />
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
