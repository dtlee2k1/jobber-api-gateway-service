import { getCurrentUser, resendEmail } from '@gateway/controllers/auth/current-user';
import { refreshToken } from '@gateway/controllers/auth/refresh-token';
import authMiddleware from '@gateway/services/auth-middleware';
import { Router } from 'express';

const currentUserRouter = Router();

currentUserRouter.get('/auth/current-user', authMiddleware.checkAuthentication, getCurrentUser);

currentUserRouter.get('/auth/refresh-token/:username', authMiddleware.checkAuthentication, refreshToken);

currentUserRouter.post('/auth/resend-email', authMiddleware.checkAuthentication, resendEmail);

export default currentUserRouter;
