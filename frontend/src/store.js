import { createStore, compose, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import { cartReducer } from "./reducers/cartReducers";
import {
  productDetailsReducer,
  productListReducer,
} from "./reducers/productReducers";
import { userRegisterReducer, userSigninReducer } from "./reducers/userReducers";

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
  },
}; //
const reducer = combineReducers({
  //add reducer
  productList: productListReducer, //use product list reducer.
  productDetails: productDetailsReducer, //use product detail reducer.
  cart: cartReducer, //cart reducer
  userSignin: userSigninReducer,
  userRegister: userRegisterReducer,
});
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // define compose cho redux devtool
const store = createStore(
  reducer,
  initialState,
  composeEnhancer(applyMiddleware(thunk)) //add redux-thunk
);

export default store; //redux store, Return a list of product to frontend.
