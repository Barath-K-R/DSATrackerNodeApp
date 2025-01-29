import express from 'express'
import * as problemController from '../controllers/problemController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const problemRoutes = express.Router();

problemRoutes.post('/', authMiddleware, problemController.createProblem)
problemRoutes.delete('/:id', authMiddleware, problemController.deleteProblem);
problemRoutes.get('/user/:userId', authMiddleware, problemController.getAllProblems)
problemRoutes.post('/type', authMiddleware, problemController.createProblemType);
problemRoutes.get('/user/:userId/type', authMiddleware, problemController.getAllProblemTypes);

problemRoutes.get('/user/:userId/stats', authMiddleware, problemController.getProblemStats)
problemRoutes.patch('/move', authMiddleware, problemController.moveProblem);
problemRoutes.patch('/:id/favourite', authMiddleware, problemController.updateIsFavourite);
problemRoutes.patch('/:id/completed', authMiddleware, problemController.updateIsCompleted);




export default problemRoutes;