import { Schema, model } from 'mongoose';
import { LEADERBOARD_MODEL_NAME, PARTICIPANT_MODEL_NAME } from './constants';

type Participant = {
  _id?: string;
  name: string;
  points: number;
  leaderboard: Schema.Types.ObjectId;
  avatar: string;
};

const participantSchema = new Schema<Participant>({
  name: { required: true, type: String },
  leaderboard: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: LEADERBOARD_MODEL_NAME,
  },
  points: {
    type: Number,
    default: 0,
  },
  avatar: { required: true, type: String },
});

const Participant = model(PARTICIPANT_MODEL_NAME, participantSchema);
export default Participant;
