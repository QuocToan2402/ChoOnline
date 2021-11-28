import Axios from 'axios';
import { CART_EMPTY } from '../constants/cartConstants';
import {
    ORDER_CREATE_FAIL,
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_DETAILS_FAIL,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_PAY_FAIL,
    ORDER_PAY_REQUEST,
    ORDER_PAY_SUCCESS,
} from '../constants/orderConstants';

//action to create new order in backend
export const createOrder = (order) => async (dispatch, getState) => {
    dispatch({ type: ORDER_CREATE_REQUEST, payload: order });
    try {
        const { userSignin: { userInfo }, } = getState();//use redux get user info
        const { data } = await Axios.post('/api/orders', order, {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,//fetch token
            },
        });
        dispatch({ type: ORDER_CREATE_SUCCESS, payload: data.order });
        dispatch({ type: CART_EMPTY });
        localStorage.removeItem('cartItems');//empty carts after create new orders
    } catch (error) {
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};
//get order detail from backend
//get id from parameter url, and dispatch data
export const detailsOrder = (orderId) => async (dispatch, getState) => {
    dispatch({ type: ORDER_DETAILS_REQUEST, payload: orderId });
    const {
        userSignin: { userInfo },
    } = getState();
    try {//send ajax request
        const { data } = await Axios.get(`/api/orders/${orderId}`, {//
            headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data });//data is order
    } catch (error) {//catch error and show
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        dispatch({ type: ORDER_DETAILS_FAIL, payload: message });
    }
};
//pay order and send an request to api
export const payOrder = (order, paymentResult) => async (dispatch, getState) => {
    dispatch({ type: ORDER_PAY_REQUEST, payload: { order, paymentResult } });
    const {
        userSignin: { userInfo },//get user info from sign in
    } = getState();
    try {//send ajax request
        const { data } = Axios.put(`/api/orders/${order._id}/pay`, paymentResult, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: ORDER_PAY_SUCCESS, payload: data });
    } catch (error) {//catch error and show
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        dispatch({ type: ORDER_PAY_FAIL, payload: message });
    }
};