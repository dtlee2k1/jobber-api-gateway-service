import { signUp } from '@gateway/controllers/auth/signup';
import { Router } from 'express';

const authRouter = Router();

authRouter.post('/auth/signup', signUp);

export default authRouter;
