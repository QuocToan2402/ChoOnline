import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import Product from '../models/productModel.js';
import { isAdmin, isAuth, isSellerOrAdmin } from '../middleware.js';
import User from '../models/userModel.js';

const productRouter = express.Router();

productRouter.get( // get all products and filter
  '/',
  expressAsyncHandler(async (req, res) => {
    const pageSize = 5;
    const page = Number(req.query.pageNumber) || 1;
    const name = req.query.name || '';
    const category = req.query.category || '';
    const seller = req.query.seller || '';
    const order = req.query.order || '';
    //get min and max from url
    const min =
      req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
    const max =
      req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
    const rating =
      req.query.rating && Number(req.query.rating) !== 0
        ? Number(req.query.rating)
        : 0;
    //some character match
    const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {};
    const sellerFilter = seller ? { seller } : {};//filter by seller, if exist return seller, else turn empty string
    const categoryFilter = category ? { category } : {};
    //if min and max exist, 
    const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
    //get rating number
    const ratingFilter = rating ? { rating: { $gte: rating } } : {};
    const sortOrder =
      order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
          ? { price: -1 }
          : order === 'toprated'
            ? { rating: -1 }
            : { _id: -1 };
    const count = await Product.count({
      ...sellerFilter,//add seller page
      ...nameFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    const products = await Product.find({
      ...sellerFilter,
      ...nameFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
      deleted: false 
    })
      .populate('seller', 'seller.name seller.logo')//add seller page
      .sort(sortOrder)
      .skip(pageSize * (page - 1))//go to next page, total pages
      .limit(pageSize);//define page size, limit product
    res.send({ products, page, pages: Math.ceil(count / pageSize) });//sending product,
  })
);

productRouter.get( //get all product from database
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category');
    res.send(categories);
  })
);

productRouter.get( //get product from data.js
  '/seed',
  expressAsyncHandler(async (req, res) => {
    // await Product.remove({});
    const seller = await User.findOne({ isSeller: true });//find the first seller
    if (seller) {//if seller exist, insert all new test product to seller current(admin)
      const products = data.products.map((product) => ({
        ...product,
        seller: seller._id,
      }));
      const createdProducts = await Product.insertMany(products);
      res.send({ createdProducts });
    } else {
      res
        .status(500)
        .send({ message: 'Hiện không có seller nào. first run /api/users/seed' });
    }
  })
);

productRouter.get( //get product by productId
  '/:id',
  expressAsyncHandler(async (req, res) => {
    //const product = await Product.findById(req.params.id);
    const product = await Product.findById(req.params.id).populate(
      'seller',
      'seller.name seller.logo seller.rating seller.numReviews'
    );
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

productRouter.post( // add product
  '/',
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = new Product({ //create a new product
      name: 'New name ' + Date.now(),
      seller: req.user._id,
      image: '/images/p1.jpg',
      price: 0,
      category: 'New category',
      brand: 'New brand',
      countInStock: 0,
      rating: 0,
      numReviews: 0,
      description: 'Description',
    });
    const createdProduct = await product.save();
    res.send({ message: 'Product Created', product: createdProduct });
  })
);
productRouter.put( //update product
  '/:id',
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
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
      const updatedProduct = await product.save();
      res.send({ message: 'Product Updated', product: updatedProduct });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

productRouter.delete( //delete product
  '/:id',
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      const deleteProduct = await product.delete();
      res.send({ message: 'Product Deleted', product: deleteProduct });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

//create new review
productRouter.post(
  '/:id/reviews',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId); // get by productId
    if (product) {
      if (product.reviews.find((x) => x.name === req.user.name)) {
        return res
          .status(400)
          .send({ message: 'Bạn đã nhận xét cho sản phẩm này!' });//every user can review 1 product 1 time.
      }
      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      product.reviews.push(review); // push comment
      product.numReviews = product.reviews.length;
      product.rating = product.reviews.reduce((a, c) => c.rating + a, 0) / product.reviews.length; //calculate rating
      const updatedProduct = await product.save(); // update product
      res.status(201).send({
        message: 'Review Created',
        review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
      });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

export default productRouter;
