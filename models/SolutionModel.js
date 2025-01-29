import mongoose from 'mongoose';

const solutionSchema = new mongoose.Schema({
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem', 
    required: true,
  },
  code: {
    type: String,
    required: true, 
  },
  language: {
    type: String,
    enum: ['JavaScript', 'Python', 'C++', 'Java'], 
    default: 'Other',
  },
  timeComplexity: {
    type: String,
    required: true,
  },
  spaceComplexity: {
    type: String,
    required: true, 
  },
  youtubeLink: {
    type: String,
    validate: {
      validator: function (v) {
        return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(v);
      },
      message: props => `${props.value} is not a valid YouTube link!`
    },
    required: false, 
  },
  methodName: {
    type: String,
    required: true, 
  },
  note: {
    type: String,
    required: false,  
    trim: true,
  }
}, {
  timestamps: true, 
});

const Solution = mongoose.model('Solution', solutionSchema);

export default Solution;
