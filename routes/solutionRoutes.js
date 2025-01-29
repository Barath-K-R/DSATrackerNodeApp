import express from 'express'
import * as solutionController from '../controllers/solutionController.js'
import { authMiddleware } from '../middleware/authMiddleware.js';

const solutionRouter=express.Router();

solutionRouter.get('/',authMiddleware, solutionController.getSolutionsByProblemName);
solutionRouter.post('/',authMiddleware, solutionController.addSolution);
solutionRouter.delete('/:solutionId',authMiddleware,solutionController.deleteSolution)

export default solutionRouter;