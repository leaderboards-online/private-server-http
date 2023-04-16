import Leaderboard from '../models/Leaderboard';

class leaderboardService {
  async create(data: Leaderboard) {
    return await Leaderboard.create(data);
  }
  async findByUid(uid: string) {
    return await Leaderboard.findOne({ uid });
  }
}

const LeaderboardService = new leaderboardService();

export default LeaderboardService;
