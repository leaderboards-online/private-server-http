import { AuthResult } from 'express-oauth2-jwt-bearer';
import User from './models/User';
import { Document, Schema, Types } from 'mongoose';
import Leaderboard from './models/Leaderboard';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      MONGO_URI: string;
      AUTH0_DOMAIN: string;
      AUTH0_AUDIENCE: string;
    }
  }

  namespace Express {
    interface Request {
      user: Document<unknown, {}, User> &
        Omit<
          User &
            Required<{
              _id: Schema.Types.ObjectId;
            }>,
          never
        >;
      leaderboard: Document<unknown, {}, Leaderboard> &
        Omit<
          Leaderboard &
            Required<{
              _id: string;
            }>,
          never
        >;
    }
  }
}

export {};
