import { createSlice } from "@reduxjs/toolkit";
import { resetCart } from "../cart/cartSlice";

const initialState = {
    userInfo: localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo'))
        : null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        signIn: (state, action) => {
            // When the user signs in, save the user info
            state.userInfo = action.payload;

            // Persist user information in localStorage
            localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
        },


    },
});

export const signOut = () => (dispatch) => {
    // Clear the user's information
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');

    // Dispatch the resetCart action to clear the cart items
    dispatch(resetCart());

    // Dispatch any other necessary actions for user logout
    dispatch(authSlice.actions.signIn(null)); // Or clear user state here
};

export const { signIn } = authSlice.actions;

export default authSlice.reducer;
