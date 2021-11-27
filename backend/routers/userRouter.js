import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import data from '../data.js';
import User from '../models/userModel.js';
import { generateToken } from '../utils.js';

const userRouter = express.Router();

userRouter.get(
  "/seed",
  //"/admin",
  expressAsyncHandler(async (req, res) => {
    await User.remove({});//remove data from db when reload
    //create new user
    const createdUsers = await User.insertMany(data.users);
    res.send({ createdUsers });
  })
);
//
userRouter.post(//
  '/signin',
  expressAsyncHandler(async (req, res) => {
    //ajax request to check user in database/.
    const user = await User.findOne({ email: req.body.email });
    if (user) {//if have user
      //decrypt and compare pass
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({//if true, send respond data
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),//generate by json web token
        });
        return;
      }
    }//password not correct, return message
    res.status(401).send({ message: 'Invalid email or password' });
  })
);
export default userRouter;
