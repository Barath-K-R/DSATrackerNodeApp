import mongoose from 'mongoose';
import ProblemType from './ProblemType.js';

const problemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  isFavourite: {
    type: Boolean,
    default: false,
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ProblemType,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
}, {
  timestamps: true,
});

const Problem = mongoose.model('Problem', problemSchema);

export default Problem;
