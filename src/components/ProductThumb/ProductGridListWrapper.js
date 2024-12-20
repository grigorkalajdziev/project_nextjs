import { Fragment, useState } from "react";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { getDiscountPrice } from "../../lib/product";
import { addToCart } from "../../redux/actions/cartActions";
import {
  addToWishlist,
  deleteFromWishlist
} from "../../redux/actions/wishlistActions";
import {
  addToCompare,
  deleteFromCompare
} from "../../redux/actions/compareActions";
import ProductGridList from "./ProductGridList";
import { useLocalization } from "../../context/LocalizationContext";

const ProductGridWrapper = ({
  products,
  bottomSpace,
  addToCart,
  addToWishlist,
  deleteFromWishlist,
  addToCompare,
  deleteFromCompare,
  cartItems,
  wishlistItems,
  compareItems
}) => {
  const { addToast } = useToasts();
  const { t } = useLocalization();

  return (
    <Fragment>
      {products &&
        products.map((product) => {
          const discountedPrice = getDiscountPrice(
            product.price,
            product.discount
          ).toFixed(2);
          const productPrice = product.price.toFixed(2);
          const cartItem = cartItems.filter(
            (cartItem) => cartItem.id === product.id
          )[0];
          const wishlistItem = wishlistItems.filter(
            (wishlistItem) => wishlistItem.id === product.id
          )[0];
          const compareItem = compareItems.filter(
            (compareItem) => compareItem.id === product.id
          )[0];
          
          const handleAddToCart = (item, addToast, quantityCount, selectedColor, selectedSize) => {
            addToCart(item, addToast, quantityCount, selectedColor, selectedSize, t);
          };

          const handleAddToWishlist = () => {
            addToWishlist(product, addToast, t); 
          }
          const handleDeleteToWishlist = () => {
            deleteFromWishlist(product, addToast, t); 
          }
          
          const handleAddToCompare = () => {
            addToCompare(product, addToast, t); 
          }
          const handleDeleteToCompare = () => {
            deleteFromCompare(product, addToast, t); 
          }

          return (
            <ProductGridList
              key={product.id}
              product={product}
              discountedPrice={discountedPrice}
              productPrice={productPrice}
              cartItem={cartItem}
              wishlistItem={wishlistItem}
              compareItem={compareItem}
              bottomSpace={bottomSpace}
              addToCart={handleAddToCart}
              addToWishlist={handleAddToWishlist}
              deleteFromWishlist={handleDeleteToWishlist}
              addToCompare={handleAddToCompare}
              deleteFromCompare={handleDeleteToCompare}
              addToast={addToast}
              cartItems={cartItems}
            />
          );
        })}
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    cartItems: state.cartData,
    wishlistItems: state.wishlistData,
    compareItems: state.compareData
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (
      item,
      addToast,
      quantityCount,
      selectedProductColor,
      selectedProductSize,
      t
    ) => {      
      dispatch(
        addToCart(
          item,
          addToast,
          quantityCount,
          selectedProductColor,
          selectedProductSize,
          t
        )
      );
    },
    addToWishlist: (item, addToast, t) => {
      dispatch(addToWishlist(item, addToast, t));
    },
    deleteFromWishlist: (item, addToast, t) => {
      dispatch(deleteFromWishlist(item, addToast, t));
    },
    addToCompare: (item, addToast, t) => {
      dispatch(addToCompare(item, addToast, t));
    },
    deleteFromCompare: (item, addToast, t) => {
      dispatch(deleteFromCompare(item, addToast, t));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductGridWrapper);
