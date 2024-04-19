import mongoose from 'mongoose';

interface DocumentResult<T> {
  _doc: T;
}
export interface IUser extends DocumentResult<IUser> {
  username: string;
  email: string;
  password: string;
  isAdmin?: boolean;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const UserModel = mongoose.model('User', UserSchema);

export { UserModel };
