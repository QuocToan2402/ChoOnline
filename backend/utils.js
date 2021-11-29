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

//middleware to author request
export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;//get authorization from header of request
  if (authorization) {//if exist, get token
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
    jwt.verify(//use jwt to decrypt token
      token,
      process.env.JWT_SECRET || 'somethingsecret',
      (err, decode) => {
        if (err) {//token invalid, 
          res.status(401).send({ message: 'Invalid Token' });//response
        } else {//token correct, decode user info
          req.user = decode;
          next();//after that, send user as a props of req to the next middleware
        }
      }
    );
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};

//middleware to check is admin
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid Admin Token ' });
  }
};