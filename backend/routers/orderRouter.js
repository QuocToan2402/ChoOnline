import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import { isAuth } from '../utils.js';

const orderRouter = express.Router();

orderRouter.post('/', isAuth, expressAsyncHandler(async (req, res) => {//use middleware to check author user
    if (req.body.orderItems.length === 0) {
        res.status(400).send({ message: 'Cart is empty' });
    } else {
        const order = new Order({//create new order
            orderItems: req.body.orderItems,
            shippingAddress: req.body.shippingAddress,
            paymentMethod: req.body.paymentMethod,
            itemsPrice: req.body.itemsPrice,
            shippingPrice: req.body.shippingPrice,
            taxPrice: req.body.taxPrice,
            totalPrice: req.body.totalPrice,
            user: req.user._id,//get user id from middleware to save in new obj
        });
        const createdOrder = await order.save();
        res
            .status(201)
            .send({ message: 'New Order Created', order: createdOrder });//response message, create new order
    }
})
);
//only author user can access to detail order
orderRouter.get('/:id', isAuth, expressAsyncHandler(async (req, res) => {
        const order = await Order.findById(req.params.id);//order id
        if (order) {
            res.send(order);
        } else {
            res.status(404).send({ message: 'Order Not Found' });
        }
    })
);
export default orderRouter;
