import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import data from '../data.js';
import User from '../models/userModel.js';
import { generateToken, isAdmin, isAuth } from '../utils.js';

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

userRouter.put('/profile', isAuth, expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);//get uset from database by id
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {//if user fill pass, hash and save
      user.password = bcrypt.hashSync(req.body.password, 8);
    }
    const updatedUser = await user.save();
    //send user info back to frontend.
    res.send({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser),//update re-generate token again
    });
  }
})
);

//admin get all user in collection
userRouter.get('/', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const users = await User.find({});
  res.send(users);
})
);
//admin remove normal user
userRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);//find by id get from url
  if (user) {
    if (user.email === 'admin@example.com') {
      res.status(400).send({ message: 'Can Not Delete Admin User' });
      return;
    }
    const deleteUser = await user.remove();
    res.send({ message: 'User Deleted', user: deleteUser });
  } else {
    res.status(404).send({ message: 'User Not Found' });
  }
})
);

userRouter.put('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isSeller = req.body.isSeller || user.isSeller;
      user.isAdmin = req.body.isAdmin || user.isAdmin;
      const updatedUser = await user.save();
      res.send({ message: 'User Updated', user: updatedUser });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

export default userRouter;
