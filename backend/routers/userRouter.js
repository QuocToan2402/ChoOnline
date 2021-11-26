import express from "express";
import expressAsyncHandler from "express-async-handler";
import data from "../data.js";
import User from "../models/userModel.js";

const userRouter = express.Router();

userRouter.get(
  "/seed",
  //"/admin",
  expressAsyncHandler(async (req, res) => {
    // await User.remove({});//remove data from db when reload
    //create new user
    const createdUsers = await User.insertMany(data.users);
    res.send({ createdUsers });
  })
);
export default userRouter;
