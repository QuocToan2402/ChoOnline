import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listOrderMine } from '../actions/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

//get order list of current user
export default function OrderHistoryScreen(props) {
    //use redux store
    const orderMineList = useSelector((state) => state.orderMineList);
    const { loading, error, orders } = orderMineList;//from order list, get result
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(listOrderMine());
    }, [dispatch]);
    return (
        <div>
            <h1>Lịch sử giao dịch</h1>
            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
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
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
