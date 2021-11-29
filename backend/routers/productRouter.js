import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import Product from '../models/productModel.js';
import { isAdmin, isAuth } from '../utils.js';

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
//create new product, only user is admin logged can use this function
productRouter.post('/', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const product = new Product({
      name: 'samle name' + Date.now(),
      image: '/images/p1.jpg',
      price: 0,
      category: 'sample category',
      brand: 'sample brand',
      countInStock: 0,
      rating: 0,
      numReviews: 0,
      description: 'sample description',
    });
    const createdProduct = await product.save();
    //send result data to front end
    res.send({ message: 'Product Created', product: createdProduct });//meaning payload: data.product in action
  })
);
//get product id from parameter url
productRouter.put('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      product.name = req.body.name;
      product.price = req.body.price;
      product.image = req.body.image;
      product.category = req.body.category;
      product.brand = req.body.brand;
      product.countInStock = req.body.countInStock;
      product.description = req.body.description;
      const updatedProduct = await product.save();//save func
      //update for frontend
      res.send({ message: 'Product Updated', product: updatedProduct });
    } else {//if not exist, render message
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

productRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {//if have product
      const deleteProduct = await product.remove();//remove product
      res.send({ message: 'Product Deleted', product: deleteProduct });//return to frontend
    } else {
      res.status(404).send({ message: 'Product Not Found!' });
    }
  })
);
export default productRouter;
