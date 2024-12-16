export const ADD_TO_WISHLIST = "ADD_TO_WISHLIST";
export const DELETE_FROM_WISHLIST = "DELETE_FROM_WISHLIST";
export const DELETE_ALL_FROM_WISHLIST = "DELETE_ALL_FROM_WISHLIST";

// add to wishlist
export const addToWishlist = (item, addToast, t) => {
  return dispatch => {
    if (addToast) {
      addToast(t("added_to_wishlist"), {
        appearance: "success",
        autoDismiss: true
      });
    }
    dispatch({ type: ADD_TO_WISHLIST, payload: item });
  };
};

// delete from wishlist
export const deleteFromWishlist = (item, addToast, t) => {
  return dispatch => {
    if (addToast) {
      addToast(t("removed_from_wishlist"), {
        appearance: "error",
        autoDismiss: true
      });
    }
    dispatch({ type: DELETE_FROM_WISHLIST, payload: item });
  };
};

//delete all from wishlist
export const deleteAllFromWishlist = (addToast, t) => {
  return dispatch => {
    if (addToast) {
      addToast(t("removed_all_from_wishlist"), {
        appearance: "error",
        autoDismiss: true
      });
    }
    dispatch({ type: DELETE_ALL_FROM_WISHLIST });
  };
};
