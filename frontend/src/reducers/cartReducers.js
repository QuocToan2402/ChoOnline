import { CART_ADD_ITEM } from "../constants/cartConstants";

export const cartReducer = (state = { cartItems: [] }, action) => {
  //
  switch (action.type) {
    case CART_ADD_ITEM:
      const item = action.payload; //get item from payload action
      const existItem = state.cartItems.find((x) => x.product === item.product); //if item already have in cart
      if (existItem) {
        //if exist
        return {
          //not change other properies
          ...state,
          //replace new item and update, update compare item, don't change other
          cartItems: state.cartItems.map((x) =>
            x.product === existItem.product ? item : x
          ),
        };
      } else {
        //dont change other item and add new item in cart, concat item to cartItems
        return { ...state, cartItems: [...state.cartItems, item] };
      }
    default:
      return state; //default is empty array
  }
};
