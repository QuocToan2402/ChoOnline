import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteOrder, listOrders } from '../actions/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { ORDER_DELETE_RESET } from '../constants/orderConstants';

export default function OrderListScreen(props) {
    //const { pageNumber = 1 } = useParams();
    const sellerMode = props.match.path.indexOf('/seller') >= 0;
    const orderList = useSelector((state) => state.orderList);
    const { loading, error, orders } = orderList;
    const orderDelete = useSelector((state) => state.orderDelete);
    const {
        loading: loadingDelete,
        error: errorDelete,
        success: successDelete,
    } = orderDelete;

    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch({ type: ORDER_DELETE_RESET });
        dispatch(listOrders({ seller: sellerMode ? userInfo._id : '' }));//if seller is true, put user empty, else put empty string
    }, [dispatch, sellerMode, successDelete, userInfo._id]);
    const deleteHandler = (order) => {
        if (window.confirm('Are you sure to delete?')) {
            dispatch(deleteOrder(order._id));
        }
    };
    return (
        <div>
            <h1>Đặt hàng</h1>
            {loadingDelete && <LoadingBox></LoadingBox>}
            {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>USER</th>
                            <th>NGÀY</th>
                            <th>TỔNG</th>
                            <th>THANH TOÁN</th>
                            <th>GIAO HÀNG</th>
                            <th>TÙY CHỌN</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.user.name}</td>
                                <td>{order.createdAt.substring(0, 10)}</td>
                                <td>{order.totalPrice.toFixed(2)}</td>
                                <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
                                <td>
                                    {order.isDelivered
                                        ? order.deliveredAt.substring(0, 10)
                                        : 'No'}
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        className="small editbtn"
                                        onClick={() => {
                                            props.history.push(`/order/${order._id}`);
                                        }}
                                    >
                                        CHI TIẾT
                                    </button>
                                    <button
                                        type="button"
                                        className="small Delbtn"
                                        onClick={() => deleteHandler(order)}
                                    >
                                        XÓA
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
