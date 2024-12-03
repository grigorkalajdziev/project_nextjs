import { Fragment } from "react";
import { LightgalleryProvider, LightgalleryItem } from "react-lightgallery";
import { IoMdExpand, IoIosHeartEmpty } from "react-icons/io";
import { Tooltip } from "react-tippy";

const ImageGallerySticky = ({
  product,
  wishlistItem,
  addToast,
  addToWishlist,
  deleteFromWishlist
}) => {
  return (
    <Fragment>
      <div className="product-large-image-wrapper space-mb--n10">
        {/* floating badges */}
        <div className="product-large-image-wrapper__floating-badges">
          {product.discount && product.discount > 0 ? (
            <span className="onsale">-{product.discount}%</span>
          ) : (
            ""
          )}
          {product.new ? <span className="hot">New</span> : ""}
          {product.stock === 0 ? <span className="out-of-stock">out</span> : ""}
        </div>

        {/* wishlist button */}
        <div className="product-details-button-wrapper">
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
              className=""
              onClick={
                wishlistItem !== undefined
                  ? () => deleteFromWishlist(product, addToast)
                  : () => addToWishlist(product, addToast)
              }
              className={`wishlist-icon ${
                wishlistItem !== undefined ? "active" : ""
              }`}
            >
              <IoIosHeartEmpty />
            </button>
          </Tooltip>
        </div>
        <LightgalleryProvider>
          {product.image &&
            product.image.map((image, i) => {
              return (
                <div key={i}>
                  <LightgalleryItem
                    group="any"
                    src={process.env.PUBLIC_URL + image}
                  >
                    <Tooltip
                      title="Click to enlarge"
                      position="left"
                      trigger="mouseenter"
                      animation="shift"
                      arrow={true}
                      duration={200}
                    >
                      <button className="enlarge-icon">
                        <IoMdExpand />
                      </button>
                    </Tooltip>
                  </LightgalleryItem>
                  <div className="single-image space-mb--10">
                    <img
                      src={process.env.PUBLIC_URL + image}
                      className="img-fluid"
                      alt=""
                    />
                  </div>
                </div>
              );
            })}
        </LightgalleryProvider>
      </div>
    </Fragment>
  );
};

export default ImageGallerySticky;
