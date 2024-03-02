import { authService } from '@gateway/services/api/auth.service';
import { NextFunction, Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';

export async function signIn(req: Request, res: Response, _next: NextFunction) {
  const response = await authService.signIn(req.body);
  req.session = { jwt: response.data.token };
  res.status(StatusCodes.CREATED).send({
    message: response.data.message,
    user: response.data.user
  });
}
