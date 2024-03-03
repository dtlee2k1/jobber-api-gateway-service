import { changePassword, forgotPassword, resetPassword } from '@gateway/controllers/auth/password';
import { signIn } from '@gateway/controllers/auth/signin';
import { signUp } from '@gateway/controllers/auth/signup';
import { updateVerifyToken } from '@gateway/controllers/auth/verify-email';
import { Router } from 'express';

const authRouter = Router();

authRouter.post('/auth/signup', signUp);

authRouter.post('/auth/signin', signIn);

authRouter.put('/auth/verify-email', updateVerifyToken);

authRouter.put('/auth/forgot-password', forgotPassword);

authRouter.put('/auth//reset-password/:token', resetPassword);

authRouter.put('/change-password', changePassword);

export default authRouter;
