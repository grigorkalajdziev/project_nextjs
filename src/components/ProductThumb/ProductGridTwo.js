import { Fragment, useState } from "react";
import { Col } from "react-bootstrap";
import Link from "next/link";
import { IoIosHeartEmpty, IoIosShuffle, IoIosSearch } from "react-icons/io";
import { Tooltip } from "react-tippy";
import ProductModal from "./ProductModal";

const ProductGridTwo = ({
  product,
  discountedPrice,
  productPrice,
  cartItem,
  wishlistItem,
  compareItem,
  bottomSpace,
  addToCart,
  addToWishlist,
  deleteFromWishlist,
  addToCompare,
  deleteFromCompare,
  addToast,
  cartItems
}) => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <Fragment>
      <Col lg={3} md={6} className={bottomSpace ? bottomSpace : ""}>
        <div className="product-grid product-grid--absolute-content">
          {/*=======  single product image  =======*/}
          <div className="product-grid__image">
            <Link
              href={`/shop/product-basic/[slug]?slug=${product.slug}`}
              as={
                process.env.PUBLIC_URL + "/shop/product-basic/" + product.slug
              }
            >
              <a className="image-wrap">
                <img
                  src={process.env.PUBLIC_URL + product.thumbImage[0]}
                  className="img-fluid"
                  alt={product.name}
                />
                {product.thumbImage.length > 1 ? (
                  <img
                    src={process.env.PUBLIC_URL + product.thumbImage[1]}
                    className="img-fluid"
                    alt={product.name}
                  />
                ) : (
                  ""
                )}
              </a>
            </Link>
            <div className="product-grid__floating-badges">
              {product.discount && product.discount > 0 ? (
                <span className="onsale">-{product.discount}%</span>
              ) : (
                ""
              )}
              {product.new ? <span className="hot">New</span> : ""}
              {product.stock === 0 ? (
                <span className="out-of-stock">out</span>
              ) : (
                ""
              )}
            </div>
            <div className="product-grid__floating-icons">
              {/* add to wishlist */}
              <Tooltip
                title={
                  wishlistItem !== undefined
                    ? "Added to wishlist"
                    : "Add to wishlist"
                }
                position="left"
                trigger="mouseenter"
                animation="shift"
                arrow={true}
                duration={200}
              >
                <button
                  onClick={
                    wishlistItem !== undefined
                      ? () => deleteFromWishlist(product, addToast)
                      : () => addToWishlist(product, addToast)
                  }
                  className={wishlistItem !== undefined ? "active" : ""}
                >
                  <IoIosHeartEmpty />
                </button>
              </Tooltip>

              {/* add to compare */}
              <Tooltip
                title={
                  compareItem !== undefined
                    ? "Added to compare"
                    : "Add to compare"
                }
                position="left"
                trigger="mouseenter"
                animation="shift"
                arrow={true}
                duration={200}
              >
                <button
                  onClick={
                    compareItem !== undefined
                      ? () => deleteFromCompare(product, addToast)
                      : () => addToCompare(product, addToast)
                  }
                  className={compareItem !== undefined ? "active" : ""}
                >
                  <IoIosShuffle />
                </button>
              </Tooltip>

              {/* quick view */}
              <Tooltip
                title="Quick view"
                position="left"
                trigger="mouseenter"
                animation="shift"
                arrow={true}
                duration={200}
              >
                <button
                  onClick={() => setModalShow(true)}
                  className="d-none d-lg-block"
                >
                  <IoIosSearch />
                </button>
              </Tooltip>
            </div>
          </div>

          {/*=======  single product content  =======*/}
          <div className="product-grid__content">
            <div className="title">
              <h3>
                <Link
                  href={`/shop/product-basic/[slug]?slug=${product.slug}`}
                  as={
                    process.env.PUBLIC_URL +
                    "/shop/product-basic/" +
                    product.slug
                  }
                >
                  <a>{product.name}</a>
                </Link>
              </h3>
              {/* add to cart */}
              {product.affiliateLink ? (
                <a href={product.affiliateLink} target="_blank">
                  Buy now
                </a>
              ) : product.variation && product.variation.length >= 1 ? (
                <Link
                  href={`/shop/product-basic/[slug]?slug=${product.slug}`}
                  as={
                    process.env.PUBLIC_URL +
                    "/shop/product-basic/" +
                    product.slug
                  }
                >
                  <a>Select Option</a>
                </Link>
              ) : product.stock && product.stock > 0 ? (
                <button
                  onClick={() => addToCart(product, addToast)}
                  disabled={
                    cartItem !== undefined &&
                    cartItem.quantity >= cartItem.stock
                  }
                >
                  {cartItem !== undefined ? "Added to cart" : "Add to cart"}
                </button>
              ) : (
                <button disabled>Out of Stock</button>
              )}
            </div>
            <div className="price">
              {product.discount > 0 ? (
                <Fragment>
                  <span className="main-price discounted">${productPrice}</span>
                  <span className="discounted-price">${discountedPrice}</span>
                </Fragment>
              ) : (
                <span className="main-price">${productPrice}</span>
              )}
            </div>
          </div>
        </div>
      </Col>
      {/* product modal */}
      <ProductModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        product={product}
        discountedprice={discountedPrice}
        productprice={productPrice}
        cartitems={cartItems}
        cartitem={cartItem}
        wishlistitem={wishlistItem}
        compareitem={compareItem}
        addtocart={addToCart}
        addtowishlist={addToWishlist}
        deletefromwishlist={deleteFromWishlist}
        addtocompare={addToCompare}
        deletefromcompare={deleteFromCompare}
        addtoast={addToast}
      />
    </Fragment>
  );
};

export default ProductGridTwo;
