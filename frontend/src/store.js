import { createStore, compose, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import { productListReducer } from "./reducers/productReducers";

const initialState = {}; //
const reducer = combineReducers({
  //add reducer
  productList: productListReducer, //use product list reducer.
});
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // define compose cho redux devtool
const store = createStore(
  reducer,
  initialState,
  composeEnhancer(applyMiddleware(thunk)) //add redux-thunk
);

export default store; //redux store, Return a list of product to frontend.
