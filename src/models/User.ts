import { Schema, model } from 'mongoose';
import Leaderboard from './Leaderboard';
import { USER_MODEL_NAME, LEADERBOARD_MODEL_NAME } from './constants';

type User = {
  _id?: Schema.Types.ObjectId;
  username: string;
  email: string;
  sub: string;
  avatar: string;
  leaderboards: Leaderboard[];
};

const userSchema = new Schema<User>({
  username: { required: true, type: String },
  email: { required: true, type: String },
  sub: { required: true, type: String, unique: true },
  avatar: { required: true, type: String },
  leaderboards: [{ type: Schema.Types.ObjectId, ref: LEADERBOARD_MODEL_NAME }],
});

const User = model<User>(USER_MODEL_NAME, userSchema);

export default User;
