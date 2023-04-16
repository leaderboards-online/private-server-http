import { Router } from 'express';
import userRouter from './UserRouter';
import AuthMiddleware from '../middlewares/AuthMiddleware';
import leaderboardRouter from './LeaderboardRouter';
import participantRouter from './ParticipantRouter';

const routes = Router();

routes.use('/user', AuthMiddleware, userRouter);
routes.use('/leaderboard', leaderboardRouter);
routes.use('/participant', participantRouter);
export default routes;
