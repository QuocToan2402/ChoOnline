import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import Product from '../models/productModel.js';

const productRouter = express.Router();

//get list all product
productRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.send(products);  //get array of product

  })
);

//create product
productRouter.get(
  '/seed',
  expressAsyncHandler(async (req, res) => {
    // await Product.remove({});//remove all product
    const createdProducts = await Product.insertMany(data.products);
    res.send({ createdProducts });
  })
);

//get product by id
productRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {    //if product exist response product to frontend to render

      res.send(product);
    } else {    // if not exist - id not true, render message 404
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

export default productRouter;
