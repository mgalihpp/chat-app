import type { Request, Response } from 'express';
import logger from '../lib/logger';
import HttpError from '../helpers/http-error';
import { db } from '../configs/db';
import httpResponse from '../helpers/http-response';
import HttpStatus from 'http-status-codes';

/** @class Class for handling user related operations. */
export class UserController {
  /**
   * Retrieves a list of all users except the authenticated user.
   * @param req - The request object containing the authenticated user.
   * @param res - The response object to send the list of users.
   * @returns A response object with the list of users and a success message, or an error response if a server error occurs.
   * @throws {HttpError} If a server error occurs.
   */
  public static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await db.user.findMany({
        omit: {
          password: false,
        },
        where: {
          id: {
            not: req.user?.id,
          },
        },
      });

      return httpResponse.success(
        res,
        users,
        HttpStatus.OK,
        'Users fetched successfully'
      );
    } catch (error) {
      logger.error(error);
      return HttpError.internalServerError(res, error);
    }
  }
}
