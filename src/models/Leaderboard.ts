import { Schema, model } from 'mongoose';
import {
  LEADERBOARD_MODEL_NAME,
  PARTICIPANT_MODEL_NAME,
  USER_MODEL_NAME,
} from './constants';
import { randomUUID } from 'crypto';
import Participant from './Participant';
import { ChangeStreamDocument } from 'mongodb';

type Leaderboard = {
  _id?: string;
  creator: Schema.Types.ObjectId;
  name: string;
  uid?: string;
  participants: Participant[];
};

export const leaderboardSchema = new Schema<Leaderboard>({
  creator: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: USER_MODEL_NAME,
  },
  name: { type: String, required: true },
  uid: { type: String, default: randomUUID() },
  participants: [{ type: Schema.Types.ObjectId, ref: PARTICIPANT_MODEL_NAME }],
});

const Leaderboard = model<Leaderboard>(
  LEADERBOARD_MODEL_NAME,
  leaderboardSchema
);

Leaderboard.watch().on(
  'change',
  async (change: ChangeStreamDocument<Leaderboard>) => {
    if (change.operationType === 'delete') {
      await Participant.deleteMany({
        leaderboard: change.documentKey._id,
      });
    }
  }
);

export default Leaderboard;
