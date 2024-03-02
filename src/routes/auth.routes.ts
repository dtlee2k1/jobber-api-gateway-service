import { signIn } from '@gateway/controllers/auth/signin';
import { signUp } from '@gateway/controllers/auth/signup';
import { Router } from 'express';

const authRouter = Router();

authRouter.post('/auth/signup', signUp);

authRouter.post('/auth/signin', signIn);

export default authRouter;
