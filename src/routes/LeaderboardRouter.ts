import { Router } from 'express';
import UserMiddleware from '../middlewares/UserMiddleware';
import { validateRequest } from 'zod-express-middleware';
import { z } from 'zod';
import LeaderboardService from '../services/Leaderboard';
import Leaderboard from '../models/Leaderboard';
import Participant from '../models/Participant';
import AuthMiddleware from '../middlewares/AuthMiddleware';
import LeaderboardMiddleware from '../middlewares/LeaderboardMiddleware';

const leaderboardRouter = Router();

leaderboardRouter.post(
  '/',
  AuthMiddleware,
  validateRequest({
    body: z.object({
      name: z.string().min(1),
    }),
  }),
  UserMiddleware,
  async (req, res) => {
    try {
      const user = req.user;
      if (user.leaderboards.length > 0) {
        return res.status(409).json({
          message: 'cannot create more than one leaderboard in the alpha',
        });
      }
      const leaderboard = new Leaderboard({
        creator: user._id,
        name: req.body.name,
        participants: [],
      });
      const particpants = await Participant.create([
        { name: 'Arth', leaderboard: leaderboard._id, points: 0 },
      ]);
      leaderboard.participants = particpants;
      await leaderboard.save();
      user.leaderboards.push(leaderboard);
      await user.save();
      return res.status(201).json({ message: 'success', leaderboard });
    } catch (e) {
      return res
        .status(500)
        .json({ message: 'An Error occured while creating the leaderboard' });
    }
  }
);

leaderboardRouter.get(
  '/:uid',
  validateRequest({
    params: z.object({ uid: z.string() }),
  }),
  async (req, res) => {
    try {
      const leaderboardUid = req.params.uid;
      const leaderboard = await LeaderboardService.findByUid(leaderboardUid);
      if (!leaderboard) {
        return res.status(404).json({ message: 'leaderboard not found' });
      }
      res.json({ leaderboard, message: 'success' });
    } catch (e) {
      return res
        .status(500)
        .json({ message: 'An Error occured while finding the leaderboard' });
    }
  }
);

leaderboardRouter.put(
  '/:leaderboardId/name',
  AuthMiddleware,
  UserMiddleware,
  validateRequest({
    body: z.object({ name: z.string() }),
    params: z.object({ leaderboardId: z.string() }),
  }),
  LeaderboardMiddleware,
  async (req, res) => {
    try {
      req.leaderboard.name = req.body.name;
      await req.leaderboard.save();
      return res.json({
        message: 'succesfully updated leadrboard name',
        leaderboard: req.leaderboard,
      });
    } catch (e) {
      return res
        .status(500)
        .json({ message: 'An error occurred while updating leaderboard name' });
    }
  }
);

export default leaderboardRouter;
