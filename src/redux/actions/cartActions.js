export const LOAD_CART = "LOAD_CART";
export const CLEAR_CART = "CLEAR_CART";
export const ADD_TO_CART = "ADD_TO_CART";
export const DECREASE_QUANTITY = "DECREASE_QUANTITY";
export const DELETE_FROM_CART = "DELETE_FROM_CART";
export const DELETE_ALL_FROM_CART = "DELETE_ALL_FROM_CART";

export const loadCart = (uid) => ({
  type: LOAD_CART,
  payload: JSON.parse(localStorage.getItem(`cart_${uid}`) || "[]"),
  meta: { uid }
});

export const clearCart = () => ({
  type: CLEAR_CART
});

//add to cart
export const addToCart = (
  item,
  addToast,
  quantityCount,
  selectedProductColor,
  selectedProductSize,
  t,
  uid
) => { 

  return dispatch => {
    if (addToast) {
      addToast(t("added_to_cart"), { appearance: "success", autoDismiss: true });
    }
    dispatch({
      type: ADD_TO_CART,
      payload: {
        ...item,
        quantity: quantityCount,
        selectedProductColor: selectedProductColor
          ? selectedProductColor
          : item.selectedProductColor
          ? item.selectedProductColor
          : null,
        selectedProductSize: selectedProductSize
          ? selectedProductSize
          : item.selectedProductSize
          ? item.selectedProductSize
          : null
      }
    });
  };
};
//decrease from cart
export const decreaseQuantity = (item, addToast, t, uid) => {
  return dispatch => {
    if (addToast) {
      addToast(t("item_decremented_from_cart"), {
        appearance: "warning",
        autoDismiss: true
      });
    }
    dispatch({ type: DECREASE_QUANTITY, payload: item, meta: { uid } });
  };
};
//delete from cart
export const deleteFromCart = (item, addToast, t, uid) => {
  return dispatch => {
    if (addToast) {
      addToast(t("removed_from_cart"), { appearance: "error", autoDismiss: true });
    }
    dispatch({ type: DELETE_FROM_CART, payload: item, meta: { uid } });
  };
};
//delete all from cart
export const deleteAllFromCart = (addToast, t, uid) => {
  return dispatch => {
    if (addToast) {
      addToast(t("removed_all_from_cart"), {
        appearance: "error",
        autoDismiss: true
      });
    }
    dispatch({ type: DELETE_ALL_FROM_CART, meta: { uid } });
  };
};

// get stock of cart item
export const cartItemStock = (item, color, size) => {
  if (item.stock) {
    return item.stock;
  } else {
    return item.variation
      .filter(single => single.color === color)[0]
      .size.filter(single => single.name === size)[0].stock;
  }
};
