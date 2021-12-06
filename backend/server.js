import express from "express";
//import { reset } from "nodemon"; //use nodemon to hot reload server
import data from "./data.js";
import mongoose from "mongoose";
import userRouter from "./routers/userRouter.js";
import productRouter from './routers/productRouter.js';
import dotenv from 'dotenv';
import orderRouter from "./routers/orderRouter.js";
import uploadRouter from "./routers/uploadRouter.js";
import path from 'path';


dotenv.config();

const app = express(); //create express server
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//const URL = process.env.MONGODB_URL;

//connect to mongoDB
mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost/ECommerce", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  //userCreateIndex: true 
}, err => {
  if (err) throw err;
  console.log('Connected to MongoDB!!!')
});
app.use('/api/uploads', uploadRouter);
app.use("/api/users", userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.get('/api/config/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');//'sb' is meaning sandbox
});
app.get('/api/config/google', (req, res) => {
  res.send(process.env.GOOGLE_API_KEY || '');
});
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));//set file into upload folder

app.get("/", (req, res) => {
  res.send("Server is ready"); //return status of server
});
const port = process.env.PORT || 5000; //port envỉ or 5000, run at http://
app.listen(port, () => {
  console.log(`Server serve at http://localhost:${port}`);
});

/*
//get list product
app.get("/api/products", (req, res) => {
  //get array of product
  res.send(data.products);
});

//get detail product by ID
app.get("/api/products/:id", (req, res) => {
  const product = data.products.find((x) => x._id === req.params.id);
  if (product) {
    //if product exist response product to frontend to render
    res.send(product);
  } else {
    // if not exist - id not true, render message 404
    res.status(404).send({ message: "Product Not Found!" });
  }
});
//user*/

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message }); //return error
});
