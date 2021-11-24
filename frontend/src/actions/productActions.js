import Axios from "axios";
import {
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
} from "../constants/productConstants";

export const listProducts = () => async (dispatch) => {
  // return function
  dispatch({
    type: PRODUCT_LIST_REQUEST,
  });
  try {
    //fetch data from backend
    const { data } = await Axios.get("/api/products"); //sending ajax to get list products, dùng axios
    dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data }); //success, return data, change state of redux, update screen
  } catch (error) {
    dispatch({ type: PRODUCT_LIST_FAIL, payload: error.message }); //false, return message.
  }
};
//get detail product by ID, same get list products
export const detailsProduct = (productId) => async (dispatch) => {
  dispatch({ type: PRODUCT_DETAILS_REQUEST, payload: productId });
  try {
    const { data } = await Axios.get(`/api/products/${productId}`); //axios return a promise, so must to use await
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message //have error, render message
          ? error.response.data.message
          : error.message,
    });
  }
};
