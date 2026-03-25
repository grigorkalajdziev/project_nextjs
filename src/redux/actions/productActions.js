import { database, ref, get } from "../../pages/api/register";

export const FETCH_PRODUCTS_SUCCESS = "FETCH_PRODUCTS_SUCCESS";

const fetchProductsSuccess = (products) => ({
  type: FETCH_PRODUCTS_SUCCESS,
  payload: products,
});

export const fetchProducts = () => {
  return async (dispatch) => {
    const snapshot = await get(ref(database, "products"));
    if (snapshot.exists()) {
      const data = snapshot.val();
      const products = Array.isArray(data) ? data : Object.values(data);
      dispatch(fetchProductsSuccess(products));
    }
  };
};