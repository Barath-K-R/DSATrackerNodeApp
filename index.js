import express from 'express';
import { connectDb } from './config/dbConnection.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import { globalErrorHandler } from './middleware/errorHandler.js';
import CustomError from './utils/CustomError.js';
import { authMiddleware } from './middleware/authMiddleware.js'

import problemRoutes from './routes/problemRoutes.js';
import solutionRouter from './routes/solutionRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

process.on('uncaughtException', (err) => {
    console.log(err.name, err.message);
    console.log('Uncaught Exception occured! Shutting down...');
    process.exit(1);
})

const app = express();

connectDb();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));


app.get('/', (req, res) => {
    res.send("Hello, DSA Tracker App!");
});

app.use('/api/problems', problemRoutes);
app.use('/api/solutions', solutionRouter);
app.use('/api/auth', authRoutes);

app.all('*', (req, res, next) => {
    const err = new CustomError(`Can't find ${req.originalUrl} on the server!`, 404);
    next(err);
});
app.use(globalErrorHandler);


const PORT = 5000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    console.log('Unhandled rejection occured! Shutting down...');

    server.close(() => {
        process.exit(1);
    })
})

