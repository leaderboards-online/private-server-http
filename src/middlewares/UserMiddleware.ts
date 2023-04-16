import { Handler } from 'express';
import UserService from '../services/User';

const UserMiddleware: Handler = async (req, res, next) => {
  try {
    const sub = req.auth?.payload.sub as string;
    const user = await UserService.getBySub(sub);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    req.user = user;
    next();
  } catch (e) {
    return res
      .status(500)
      .json({ message: 'An Error occured while validating User' });
  }
};

export default UserMiddleware;
