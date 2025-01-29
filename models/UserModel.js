import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      maxlength: 70,
    },
    email: {
      type: String,
      required: false,
      unique: true,
      maxlength: 100,
    },
    password: {
      type: String,
      required: true,
      maxlength: 70,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
