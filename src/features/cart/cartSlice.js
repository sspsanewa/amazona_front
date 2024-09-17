import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: localStorage.getItem('cartItems') ?
    JSON.parse(localStorage.getItem('cartItems')) :
    [],
  shippingAddress: localStorage.getItem('shippingAddress') ?
    JSON.parse(localStorage.getItem('shippingAddress')) :
    [],
  paymentMethod: localStorage.getItem('paymentMethod')
    ? localStorage.getItem('paymentMethod')
    : '',

};

console.log('initial state', initialState);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {


      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        // Update item quantity with the one passed in payload
        existItem.qty = item.qty;
      } else {
        // Add the new item to the cart
        state.cartItems.push(item);
      }

      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      console.log('action', state, action);
      // Remove item from the cart
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload
      );
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    saveShippingAddress: (state, action) => {
      // When the user signs in, save the user info
      state.shippingAddress = action.payload;

      // Persist user information in localStorage
      localStorage.setItem('shippingAddress', JSON.stringify(state.shippingAddress));
    },
    resetCart: (state) => {
      // Clear the cart items
      state.cartItems = [];
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    savePaymentMethod: (state, action) => {
      // When the user signs in, save the user info
      state.paymentMethod = action.payload;

      // Persist user information in localStorage
      localStorage.setItem('paymentMethod', JSON.stringify(state.paymentMethod));
    },

  },
});

export const { addToCart, removeFromCart, saveShippingAddress, resetCart, savePaymentMethod } = cartSlice.actions;

export default cartSlice.reducer;
