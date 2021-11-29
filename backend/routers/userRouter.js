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
//sign up action
userRouter.post(
  '/register',
  expressAsyncHandler(async (req, res) => {
    const user = new User({
      name: req.body.name,//get data name
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),//hash pass using bcrypt lib
    });
    const createdUser = await user.save();
    res.send({//send data to backend
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      isAdmin: createdUser.isAdmin,
      token: generateToken(createdUser),//auto gen token
    });
  })
);

//api to return detail information of current user by id
userRouter.get('/:id', expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);//find id from urls
    if (user) {//if exist, send user
      res.send(user);
    } else {//if not, send message
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);
export default userRouter;
