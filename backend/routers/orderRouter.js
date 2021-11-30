import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import { isAdmin, isAuth } from '../utils.js';

const orderRouter = express.Router();
//admin get all order
orderRouter.get('/', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'name');//get user name of user, populate to get id of user 
    //and load info from user collection and put name to order collection.  
    res.send(orders);
})
);


//route to return order of current user
orderRouter.get(
    '/mine',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const orders = await Order.find({ user: req.user._id });
        res.send(orders);
    })
);

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

//update status of order, only access user can add payment
orderRouter.put('/:id/pay', isAuth, expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);//find by id get from url
    if (order) {//if have order
        //set info of order
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            //info from paypal
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };
        const updatedOrder = await order.save();//update info
        res.send({ message: 'Order Paid', order: updatedOrder });
    } else {
        //send error
        res.status(404).send({ message: 'Order Not Found' });
    }
})
);
//admin delete order
orderRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {//if exist, call del func, send 
        const deleteOrder = await order.remove();
        res.send({ message: 'Order Deleted', order: deleteOrder });
    } else {
        res.status(404).send({ message: 'Order Not Found' });
    }
})
);
//admin change deliver status

orderRouter.put('/:id/deliver',isAuth,isAdmin,expressAsyncHandler(async (req, res) => {
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
