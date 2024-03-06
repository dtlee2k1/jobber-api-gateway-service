import { authService } from '@gateway/services/api/auth.service';
import { NextFunction, Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';

export async function createSeedUsers(req: Request, res: Response, _next: NextFunction) {
  const response = await authService.seedingData(req.params.count);
  res.status(StatusCodes.OK).send({
    message: response.data.message
  });
}
