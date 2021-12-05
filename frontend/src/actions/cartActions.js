import Axios from "axios";
import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_SAVE_PAYMENT_METHOD, CART_SAVE_SHIPPING_ADDRESS } from "../constants/cartConstants";

export const addToCart = (productId, qty) => async (dispatch, getState) => {
  //async function, sending ajax request to server.
  //request redux store to add product to cart
  const { data } = await Axios.get(`/api/products/${productId}`);
  dispatch({
    type: CART_ADD_ITEM, //type of this action, import from constants
    payload: {
      //load data
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
      product: data._id, //get pro ID from data
      seller: data.seller,
      qty, //quantity
    },
  });
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

export const removeFromCart = (productId) => (dispatch, getState) => {
  dispatch({ type: CART_REMOVE_ITEM, payload: productId }); //dispatch remove action, remove by ID
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems)); //get cart from local, prase data to json
};

//action to save shipping address info
export const saveShippingAddress = (data) => (dispatch) => {
  dispatch({ type: CART_SAVE_SHIPPING_ADDRESS, payload: data });//saving address
  localStorage.setItem('shippingAddress', JSON.stringify(data));//set item to local
};
//action to save payment method info
export const savePaymentMethod = (data) => (dispatch) => {
  dispatch({ type: CART_SAVE_PAYMENT_METHOD, payload: data });//saving selection
};