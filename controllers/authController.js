import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel.js';
import RefreshTokenModel from '../models/RefreshTokenModel.js';
import dotenv from 'dotenv';
import CustomError from '../utils/CustomError.js';

dotenv.config();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export const signUp = async (req, res, next) => {
  const { email, password } = req.body;

  const username = email.split('@')[0];

  try {
    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      throw new CustomError('Username or email already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();


    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res,next) => {
  const { identifier, password } = req.body;
  console.log(req.body);

  try {

    const user = await UserModel.findOne({
      $or: [
        { username: identifier },
        { email: identifier }
      ]
    });

    if (!user) {
      throw new CustomError('User not found', 404);
    }



    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new CustomError('Invalid password', 401);
    }


    const accessToken = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );


    const refreshToken = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );


    const existingRefreshToken = await RefreshTokenModel.findOne({ userId: user._id });
    if (existingRefreshToken) {
      await RefreshTokenModel.updateOne({ userId: user._id }, { refreshToken });
    } else {
      const newRefreshToken = new RefreshTokenModel({ userId: user._id, refreshToken });
      await newRefreshToken.save();
    }


    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      // sameSite: 'None',
      maxAge: 604800000,
      path: '/',
    });



    // Send response
    res.status(200).json({
      accessToken,
      user
    });
  } catch (error) {
    next(error)
  }
};

export const logout = async (req, res, next) => {
  console.log('LOGOUT');
  try {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new CustomError('No refresh token provided', 400);
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const userId = decoded.userId;
    console.log(userId);
    await RefreshTokenModel.deleteOne({ userId });


    res.clearCookie('refreshToken', {
      httpOnly: true,
      path: '/',
    });


    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new CustomError('Invalid or expired refresh token', 401));
    }

    next(error);
  }
};


export const refreshAccessToken = async (req, res) => {
 
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    
    return res.status(401).json({ message: 'Refresh token not provided' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const userId = decoded.userId;

    const storedToken = await RefreshTokenModel.findOne({ userId });
    console.log('stored token=', storedToken);
    if (!storedToken) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const accessToken = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' } // Adjust expiry as needed
    );

    const newRefreshToken = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Update refresh token in the database
    await RefreshTokenModel.updateOne(
      { userId },
      { refreshToken: newRefreshToken }
    );

    // Send new refresh token as an HTTP-only cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    console.log(accessToken);
    res.status(200).json({ accessToken, user });
  } catch (error) {
    console.error(error);
    res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};

