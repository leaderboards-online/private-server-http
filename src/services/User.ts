import User from '../models/User';

class userService {
  async getBySub(sub: string) {
    return User.findOne({
      sub,
    });
  }

  async createUser(user: User) {
    return User.create(user);
  }
}

const UserService = new userService();

export default UserService;
