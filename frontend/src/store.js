import { createStore, compose, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import { cartReducer } from "./reducers/cartReducers";
import {
  orderCreateReducer,
  orderDeleteReducer,
  orderDeliverReducer,
  orderDetailsReducer,
  orderListReducer,
  orderMineListReducer,
  orderPayReducer
} from "./reducers/orderReducers";
import {
  productCategoryListReducer,
  productCreateReducer,
  productDeleteReducer,
  productDetailsReducer,
  productListReducer,
  productReviewCreateReducer,
  productUpdateReducer,
} from "./reducers/productReducers";
import { userDeleteReducer, userDetailsReducer, userListReducer, userRegisterReducer, userSigninReducer, userUpdateProfileReducer, userUpdateReducer } from "./reducers/userReducers";

const initialState = {
  //check user exist
  userSignin: {
    userInfo: localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null,
  },
  //check cart from local
  cart: {
    cartItems: localStorage.getItem("cartItems") //get cartItems from localStorage by ID
      ? JSON.parse(localStorage.getItem("cartItems")) //convert from array to json
      : [],
    shippingAddress: localStorage.getItem('shippingAddress')//check shippingaddress from local
      ? JSON.parse(localStorage.getItem('shippingAddress'))//if exist convert to json
      : {},//else, return null and user fill shipping input 
    paymentMethod: 'PayPal',//set initial value, default is paypal
  },

}; //
const reducer = combineReducers({
  //add reducer
  productList: productListReducer, //use product list reducer.
  productDetails: productDetailsReducer, //use product detail reducer.
  cart: cartReducer, //cart reducer
  userSignin: userSigninReducer,
  userRegister: userRegisterReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  orderMineList: orderMineListReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  productDelete: productDeleteReducer,
  orderList: orderListReducer,
  orderDelete: orderDeleteReducer,
  orderDeliver: orderDeliverReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,
  productCategoryList: productCategoryListReducer,
  productReviewCreate: productReviewCreateReducer,


});
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // define compose cho redux devtool
const store = createStore(
  reducer,
  initialState,
  composeEnhancer(applyMiddleware(thunk)) //add redux-thunk
);

export default store; //redux store, Return a list of product to frontend.
