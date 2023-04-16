import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from 'zod-express-middleware';
import UserService from '../services/User';
const userRouter = Router();

userRouter.post(
  '/signIn',
  validateRequest({
    body: z.object({
      username: z.string().min(1),
      email: z.string().min(1),
      avatar: z.string().min(1),
    }),
  }),
  async (req, res) => {
    try {
      const sub = req.auth?.payload.sub as string;
      const user = await (
        await UserService.getBySub(sub)
      )?.populate('leaderboards');
      if (user) {
        return res.status(200).json({ message: 'success', user });
      }
      const { email, username, avatar } = req.body;
      const newUser = await UserService.createUser({
        email,
        sub,
        username,
        avatar,
        leaderboards: [],
      });
      return res
        .status(201)
        .json({ message: 'User created succesfully!', user: newUser });
    } catch (e) {
      console.log({ e });
      return res
        .status(500)
        .json({ message: 'An Error occured while signing in!' });
    }
  }
);

export default userRouter;
