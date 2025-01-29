import jwt from 'jsonwebtoken';


export const authMiddleware = (req, res, next) => {

  const authHeader = req.headers.authorization;
 
  if (!authHeader) {
    throw new CustomError('Authorization header missing', 401);
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    throw new CustomError('Bearer token missing', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);


    req.user = {
      id: decoded.userId,
      username: decoded.username,
    };

    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    throw new CustomError('Invalid or expired token', 401);
  }
};
