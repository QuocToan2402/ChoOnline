import jwt from 'jsonwebtoken';

//generate token
export const generateToken = (user) => {
  return jwt.sign(//
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET || 'somethingsecret',//jwt key to encrypt token, read need to use dotenv lib
    //if don't have env, use key.
    {
      expiresIn: '30d',//exp 30day
    }
  );
};
