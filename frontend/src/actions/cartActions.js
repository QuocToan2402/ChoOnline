import Axios from "axios";
import { CART_ADD_ITEM } from "../constants/cartConstants";

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
      qty, //quantity
    },
  });
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};
