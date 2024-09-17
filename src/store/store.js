import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";  // Import the cart reducer
import authReducer from "../features/auth/authSlice";  // Import the auth reducer

const store = configureStore({
  reducer: {
    cart: cartReducer,  // Add the cart reducer
    auth: authReducer,  // Add the auth reducer to manage sign-in state
  },
});

export default store;
