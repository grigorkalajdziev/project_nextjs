import { Fragment } from "react";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { getDiscountPrice } from "../../lib/product";
import { addToCart } from "../../redux/actions/cartActions";
import ProductWidget from "./ProductWidget";

const ProductWidgetWrapper = ({
  products,
  bottomSpace,
  addToCart,
  cartItems,
  sliderClass
}) => {
  const { addToast } = useToasts();
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

          return (
            <ProductWidget
              key={product.id}
              product={product}
              discountedPrice={discountedPrice}
              productPrice={productPrice}
              cartItem={cartItem}
              bottomSpace={bottomSpace}
              addToCart={addToCart}
              addToast={addToast}
              sliderClass={sliderClass}
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
      selectedProductSize
    ) => {
      dispatch(
        addToCart(
          item,
          addToast,
          quantityCount,
          selectedProductColor,
          selectedProductSize
        )
      );
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductWidgetWrapper);
