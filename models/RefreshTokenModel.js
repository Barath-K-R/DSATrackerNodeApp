import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 60 * 24 * 30, 
    },
  },
  {
    timestamps: true,
  }
);

const RefreshTokenModel = mongoose.model('RefreshToken', refreshTokenSchema);

export default RefreshTokenModel;
