import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../lib/logger';
import HttpError from '../helpers/http-error';
import { db } from '../configs/db';
import { User } from '@prisma/client';

/**
 * Verifies if the request is authenticated by checking the presence of a valid JSON Web Token in the request's cookies.
 * If the token is invalid, or if the user associated with the token is not found, an HTTP error is sent.
 * If the token is valid, the associated user is attached to the request object and the next middleware is called.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware in the stack.
 * @throws {HttpError} If the token is invalid, or if the user associated with the token is not found.
 */
async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return HttpError.unauthorized(res);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as User;

    if (!decoded) {
      return HttpError.unauthorized(res);
    }

    const user = await db.user.findFirst({
      omit: {
        password: true,
      },
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      return HttpError.notFound(res);
    }

    req.user = user;

    next();
  } catch (error) {
    logger.error(error);
    return HttpError.internalServerError(res, error);
  }
}

export { isAuthenticated };
