import { Router } from 'express';
import UserMiddleware from '../middlewares/UserMiddleware';
import { validateRequest } from 'zod-express-middleware';
import { z } from 'zod';
import Participant from '../models/Participant';
import LeaderboardMiddleware from '../middlewares/LeaderboardMiddleware';
import AuthMiddleware from '../middlewares/AuthMiddleware';
import LeaderboardService from '../services/Leaderboard';

const participantRouter = Router();

participantRouter.post(
  '/:leaderboardId',
  AuthMiddleware,
  UserMiddleware,
  validateRequest({
    body: z.object({
      name: z.string(),
      points: z.number(),
    }),
    params: z.object({ leaderboardId: z.string() }),
  }),
  LeaderboardMiddleware,
  async (req, res) => {
    try {
      const leaderboard = req.leaderboard;
      if (leaderboard.participants.length > 20) {
        return res.status(400).json({
          message: 'limit of 20 participants per board for the alpha ;)',
        });
      }
      const { name, points } = req.body;
      const newParticpant = await Participant.create({
        leaderboard: leaderboard._id,
        name,
        points,
      });
      leaderboard.participants.push(newParticpant);
      await leaderboard.save();
      return res
        .status(201)
        .json({ message: 'success', participant: newParticpant });
    } catch (e) {
      return res
        .status(500)
        .json({ message: 'An Error occured while adding the participant' });
    }
  }
);

participantRouter.delete(
  '/:leaderboardId/:participantId',
  AuthMiddleware,
  UserMiddleware,
  validateRequest({
    params: z.object({ leaderboardId: z.string(), participantId: z.string() }),
  }),
  LeaderboardMiddleware,
  async (req, res) => {
    try {
      const { participantId } = req.params;
      await Participant.findByIdAndRemove(participantId);
      req.leaderboard.participants.splice(
        req.leaderboard.participants.findIndex(
          (participant) => participant._id === participantId
        )
      );
      await req.leaderboard.save();
      return res
        .status(200)
        .json({ message: 'deleted participant succesfully' });
    } catch (e) {
      return res
        .status(500)
        .json({ message: 'An error occurred while deleting the participant' });
    }
  }
);

participantRouter.put(
  '/:leaderboardId/:participantId',
  AuthMiddleware,
  UserMiddleware,
  validateRequest({
    params: z.object({ leaderboardId: z.string(), participantId: z.string() }),
    body: z.object({
      amount: z.number(),
      type: z.enum(['increment', 'decrement']),
    }),
  }),
  LeaderboardMiddleware,
  async (req, res) => {
    try {
      const { participantId } = req.params;
      const participant = await Participant.findById(participantId);
      if (!participant) {
        return res.status(404).json({ message: 'participant not found' });
      }
      const { amount, type } = req.body;
      switch (type) {
        case 'increment':
          participant.points += amount;
          break;
        case 'decrement':
          participant.points -= amount;
          break;
      }
      await participant.save();
      return res.status(200).json({
        message: 'participant score updated succesfully!',
        participant,
      });
    } catch (e) {
      res.status(500).json({
        message: 'An error occurred while updating the points for participant',
      });
    }
  }
);

participantRouter.get(
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
      const participants = await Participant.find({
        _id: {
          $in: leaderboard.participants,
        },
      });
      res.json({ participants, message: 'success' });
    } catch (e) {
      return res
        .status(500)
        .json({ message: 'An Error occured while fetching participants' });
    }
  }
);

export default participantRouter;
