import express from "express";
//import { reset } from "nodemon"; //use nodemon to hot reload server
import data from "./data.js";
import mongoose from "mongoose";
import userRouter from "./routers/userRouter.js";
import productRouter from './routers/productRouter.js';

const app = express(); //create express server
//const URL = process.env.MONGODB_URL;

//connect to mongoDB
mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost/ECommerce", {
   useNewUrlParser: true, 
   useUnifiedTopology: true,
   //userCreateIndex: true 
}, err => {
   if(err) throw err;
   console.log('Connected to MongoDB!!!')
});


app.get("/", (req, res) => {
  res.send("Server is ready"); //return status of server
});
const port = process.env.PORT || 4000; //port envỉ or 5000, run at http://
app.listen(port, () => {
  console.log(`Server serve at http://localhost:${port}`);
});
app.use("/api/users", userRouter);
app.use('/api/products', productRouter);

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
