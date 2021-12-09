import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import {
    isAdmin,
    isAuth,
    isSellerOrAdmin,
    mailgun,
    payOrderEmailTemplate,
} from '../utils.js';


const orderRouter = express.Router();
//admin get all order

orderRouter.get(
    '/',
    isAuth,
    isSellerOrAdmin,
    expressAsyncHandler(async (req, res) => {
        const seller = req.query.seller || '';
        const sellerFilter = seller ? { seller } : {};//only current seller can see order

        const orders = await Order.find({ ...sellerFilter, deleted: false }).populate(
            'user',
            'name'
        );//get user name of user, populate to get id of user 
        res.send(orders);//and load info from user collection and put name to order collection.  
    })
);
//route to return order of current user
orderRouter.get(
    '/mine',
    isAuth,
    expressAsyncHandler(async (req, res) => {//use middleware to check author user
        const orders = await Order.find({deleted: false, user: req.user._id });
        res.send(orders);
    })
);
orderRouter.get(
    '/summary',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const orders = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    numOrders: { $sum: 1 },
                    totalSales: { $sum: '$totalPrice' },
                },
            },
        ]);
        const users = await User.aggregate([
            {
                $group: {
                    _id: null,
                    numUsers: { $sum: 1 },
                },
            },
        ]);
        const dailyOrders = await Order.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    orders: { $sum: 1 },
                    sales: { $sum: '$totalPrice' },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        const productCategories = await Product.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                },
            },
        ]);
        res.send({ users, orders, dailyOrders, productCategories });
    })
);

orderRouter.post(
    '/',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        if (req.body.orderItems.length === 0) {
            res.status(400).send({ message: 'Cart is empty' });
        } else {
            const order = new Order({//create new order
                seller: req.body.orderItems[0].seller,
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
                //response message, create new order
                .send({ message: 'New Order Created', order: createdOrder });
        }
    })
);

//only author user can access to detail order
orderRouter.get(
    '/:id',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const order = await Order.findById(req.params.id); //get by id
        if (order) {
            res.send(order);
        } else {
            res.status(404).send({ message: 'Order Not Found' });
        }
    })
);

//update status of order, only access user can add payment
orderRouter.put(
    '/:id/pay',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const order = await Order.findById(req.params.id).populate(
            'user',
            'email name'
        );
        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.email_address,
            };
            console.log(order.orderItems.length);

            for (let i = 0; i < order.orderItems.length; i++) { //decrease the number of product in stock
                var product = await Product.findById(order.orderItems[i].product)
                if (product) {
                    product.countInStock = product.countInStock - order.orderItems[i].qty
                }
                await product.save()
            }
            const updatedOrder = await order.save(); //save order
            mailgun()
                .messages()//send an email
                .send(
                    {
                        from: 'E_COMMERCE <ecommerce@mg.yourdomain.com>',
                        to: `${order.user.name} <${order.user.email}>`,
                        subject: `New order ${order._id}`,
                        html: payOrderEmailTemplate(order),
                    },
                    (error, body) => {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log(body);
                        }
                    }
                );
            res.send({ message: 'Order Paid', order: updatedOrder });
        } else {
            res.status(404).send({ message: 'Order Not Found' });
        }
    })
);

//admin delete order
orderRouter.delete(
    '/:id',
    isAuth,
    isSellerOrAdmin,
    expressAsyncHandler(async (req, res) => {
        const order = await Order.findById(req.params.id);
        if (order) {//if exist, call del func, send 
            const deleteOrder = await order.delete();
            res.send({ message: 'Order Deleted', order: deleteOrder });
        } else {
            res.status(404).send({ message: 'Order Not Found' });
        }
    })
);

//admin change deliver status
orderRouter.put(
    '/:id/deliver',
    isAuth,
    isSellerOrAdmin,
    expressAsyncHandler(async (req, res) => {
        const order = await Order.findById(req.params.id);//find order by id
        if (order) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
            const updatedOrder = await order.save();
            res.send({ message: 'Order Delivered', order: updatedOrder });
        } else {
            res.status(404).send({ message: 'Order Not Found' });
        }
    })
);

export default orderRouter;
