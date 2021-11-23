import Axios from "axios";
import {
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
