import Problem from '../models/ProblemModel.js';
import Solution from '../models/SolutionModel.js';
import asyncErrorHandler from '../utils/asyncErrorHandler.js';
import CustomError from '../utils/CustomError.js';

export const addSolution = asyncErrorHandler(async (req, res) => {
  const { code, problemName, language, timeComplexity, spaceComplexity, youtubeLink, methodName, note } = req.body;

  if (!methodName || !problemName || !code || !timeComplexity || !spaceComplexity || !youtubeLink) {
    throw new CustomError('Missing required parameters', 400);
  }

  const problem = await Problem.findOne({ name: problemName });
  if (!problem) {
    throw new CustomError('Problem not found', 404);
  }

  const problemId = problem._id;
  const newSolution = new Solution({
    problemId,
    code,
    language,
    timeComplexity,
    spaceComplexity,
    youtubeLink,
    methodName,
    note,
  });

  await newSolution.save();
  res.status(201).json({ message: 'Solution added successfully', solution: newSolution });
});

export const deleteSolution = asyncErrorHandler(async (req, res) => {
  const { solutionId } = req.params;

  if (!solutionId) {
    throw new CustomError('solutionId was missing in URL parameter', 400);
  }

  const deletedSolution = await Solution.deleteOne({ _id: solutionId });
  if (deletedSolution.deletedCount === 0) {
    throw new CustomError('Solution not found', 404);
  }

  res.status(200).json({ message: 'Solution deleted successfully' });
});

export const getSolutionsByProblemName = asyncErrorHandler(async (req, res) => {
  const { problemName } = req.query;

  if (!problemName) {
    throw new CustomError('Problem name is required', 400);
  }

  const problem = await Problem.findOne({ name: problemName });
  if (!problem) {
    throw new CustomError('Problem not found', 404);
  }

  const solutions = await Solution.find({ problemId: problem._id });
  res.status(200).json({ solutions });
});
