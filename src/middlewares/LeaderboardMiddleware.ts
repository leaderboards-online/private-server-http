import { Handler } from 'express';
import Leaderboard from '../models/Leaderboard';

const LeaderboardMiddleware: Handler = async (req, res, next) => {
  try {
    const { leaderboardId } = req.params;
    const leaderboard = await Leaderboard.findOne({ uid: leaderboardId });
    if (!leaderboard) {
      return res.status(404).json({ message: 'leaderboard not found' });
    }
    console.log(leaderboard.creator, req.user.id);

    if (String(leaderboard.creator) !== req.user.id) {
      return res
        .status(401)
        .json({ message: 'unauthorized to perform that action' });
    }
    req.leaderboard = leaderboard;
    next();
  } catch (e) {
    return res
      .status(500)
      .json({ message: 'An Error occured while validating User' });
  }
};

export default LeaderboardMiddleware;
