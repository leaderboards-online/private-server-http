import { Router } from 'express';
import UserMiddleware from '../middlewares/UserMiddleware';
import { validateRequest } from 'zod-express-middleware';
import { z } from 'zod';
import Leaderboard from '../models/Leaderboard';
import Participant from '../models/Participant';
import AuthMiddleware from '../middlewares/AuthMiddleware';
import LeaderboardMiddleware from '../middlewares/LeaderboardMiddleware';
import { randomUUID } from 'crypto';

const leaderboardRouter = Router();

leaderboardRouter.post(
  '/',
  AuthMiddleware,
  UserMiddleware,
  validateRequest({
    body: z.object({
      name: z.string().min(1),
    }),
  }),
  async (req, res) => {
    try {
      const user = req.user;
      if (user.leaderboards.length > 0) {
        return res.status(409).json({
          message: 'cannot create more than one leaderboard in the alpha',
        });
      }

      const leaderboard = new Leaderboard({
        creator: user.id,
        name: req.body.name,
        participants: [],
        uid: randomUUID(),
      });
      const particpants = await Participant.create([
        { name: 'Arth', leaderboard: leaderboard.id, points: 0 },
      ]);
      leaderboard.participants = particpants;
      await leaderboard.save();
      user.leaderboards.push(leaderboard.id);
      await user.save();
      return res.status(201).json({ message: 'success', leaderboard });
    } catch (e) {
      return res
        .status(500)
        .json({ message: 'An Error occured while creating the leaderboard' });
    }
  }
);

leaderboardRouter.get('/', AuthMiddleware, UserMiddleware, async (req, res) => {
  try {
    const leaderboards = await Leaderboard.find({
      _id: {
        $in: req.user.leaderboards,
      },
    });
    return res.json({ message: 'success', leaderboards });
  } catch (e) {
    return res
      .json(500)
      .json({ message: 'An Error occured while fetching the leaderboards' });
  }
});

leaderboardRouter.get(
  '/preview/:uid',
  validateRequest({ params: z.object({ uid: z.string() }) }),
  async (req, res) => {
    try {
      const leaderboard = await Leaderboard.findOne({
        uid: req.params.uid,
      })
        .populate({
          path: 'participants',
          options: { sort: { points: -1 }, lean: true },
        })
        .exec();
      return res.json({ leaderboard, message: 'success' });
    } catch (e) {
      return res
        .status(500)
        .json({ message: 'An Error occured while fetching the preview' });
    }
  }
);

leaderboardRouter.delete(
  '/:leaderboardId',
  AuthMiddleware,
  UserMiddleware,
  validateRequest({ params: z.object({ leaderboardId: z.string() }) }),
  LeaderboardMiddleware,
  async (req, res) => {
    try {
      await Leaderboard.deleteOne({ uid: req.leaderboard.uid });
      req.user.leaderboards.splice(
        req.user.leaderboards.findIndex((lb) => lb._id === req.leaderboard._id),
        1
      );
      await req.user.save();
      return res.json({ message: 'success' });
    } catch (e) {
      return res
        .json(500)
        .json({ message: 'An error occurred while deleting the leaderboard' });
    }
  }
);

leaderboardRouter.get(
  '/:leaderboardId',
  AuthMiddleware,
  UserMiddleware,
  validateRequest({
    params: z.object({ leaderboardId: z.string() }),
  }),
  LeaderboardMiddleware,
  async (req, res) => {
    try {
      res.json({ leaderboard: req.leaderboard, message: 'success' });
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
