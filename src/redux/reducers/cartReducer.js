// src/reducers/cartReducer.js
import { v4 as uuidv4 } from "uuid";
import {
  LOAD_CART,
  CLEAR_CART,
  ADD_TO_CART,
  DECREASE_QUANTITY,
  DELETE_FROM_CART,
  DELETE_ALL_FROM_CART
} from "../actions/cartActions";

const initState = [];

const cartReducer = (state = initState, action) => {
  const cartItems = state;
  const product = action.payload;
  const uid = action.meta?.uid;
  let next;

  // LOAD_CART
  if (action.type === LOAD_CART) {
    return action.payload;
  }

  // CLEAR_CART
  if (action.type === CLEAR_CART) {
    return [];
  }

  // ADD_TO_CART
  if (action.type === ADD_TO_CART) {
    if (product.variation === undefined) {
      const existing = cartItems.find(i => i.id === product.id);
      if (!existing) {
        next = [
          ...cartItems,
          { ...product, quantity: product.quantity || 1, cartItemId: uuidv4() }
        ];
      } else {
        next = cartItems.map(i =>
          i.cartItemId === existing.cartItemId
            ? { ...i, quantity: i.quantity + (product.quantity || 1) }
            : i
        );
      }
    } else {
      const existing = cartItems.find(
        i =>
          i.id === product.id &&
          i.selectedProductColor === product.selectedProductColor &&
          i.selectedProductSize === product.selectedProductSize
      );
      if (!existing) {
        next = [
          ...cartItems,
          { ...product, quantity: product.quantity || 1, cartItemId: uuidv4() }
        ];
      } else {
        next = cartItems.map(i =>
          i.cartItemId === existing.cartItemId
            ? {
                ...i,
                quantity: i.quantity + (product.quantity || 1),
                selectedProductColor: product.selectedProductColor,
                selectedProductSize: product.selectedProductSize
              }
            : i
        );
      }
    }
  }

  // DECREASE_QUANTITY
  if (action.type === DECREASE_QUANTITY) {
    if (product.quantity === 1) {
      next = cartItems.filter(i => i.cartItemId !== product.cartItemId);
    } else {
      next = cartItems.map(i =>
        i.cartItemId === product.cartItemId
          ? { ...i, quantity: i.quantity - 1 }
          : i
      );
    }
  }

  // DELETE_FROM_CART
  if (action.type === DELETE_FROM_CART) {
    next = cartItems.filter(i => i.cartItemId !== product.cartItemId);
  }

  // DELETE_ALL_FROM_CART
  if (action.type === DELETE_ALL_FROM_CART) {
    next = [];
  }

  // If no matching action, return current state
  if (next === undefined) {
    return state;
  }

  // Persist per-user if uid available
  if (uid && Array.isArray(next)) {
    localStorage.setItem(`cart_${uid}`, JSON.stringify(next));
  }

  return next;
};

export default cartReducer;
