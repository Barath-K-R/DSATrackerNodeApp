import mongoose from 'mongoose';

const problemTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
});

const ProblemType = mongoose.model('ProblemType', problemTypeSchema);

export default ProblemType;
