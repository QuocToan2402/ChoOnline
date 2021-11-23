const {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
} = require("../constants/productConstants");

export const productListReducer = (
  //response products action
  state = { loading: true, products: [] }, //set default state
  
  action
) => {
  switch (action.type) {
    case PRODUCT_LIST_REQUEST: //get data, loading and render data, value from action.
      return { loading: true }; //return loading effect.
    case PRODUCT_LIST_SUCCESS:
      return { loading: false, products: action.payload }; //success, fetch data get from be.
    case PRODUCT_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state; //don't change state, load previous state.
  }
};
