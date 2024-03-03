import { authService } from '@gateway/services/api/auth.service';
import { NextFunction, Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';

export async function getCurrentUser(_req: Request, res: Response, _next: NextFunction) {
  const response = await authService.getCurrentUser();
  res.status(StatusCodes.OK).send({
    message: response.data.message,
    user: response.data.user
  });
}

export async function resendEmail(req: Request, res: Response, _next: NextFunction) {
  const response = await authService.reSendEmail(req.body);
  res.status(StatusCodes.OK).send({
    message: response.data.message,
    user: response.data.user
  });
}
