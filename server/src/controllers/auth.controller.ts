import type { Request, Response } from 'express';
import HttpError from '../helpers/http-error';
import logger from '../lib/logger';
import { AuthSchema } from '../lib/validator/auth-validator';
import { db } from '../configs/db';
import { generateToken } from '../lib/utils';
import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import httpResponse from '../helpers/http-response';
import HttpStatus from 'http-status-codes';

/**
 * @class Class for handling user related operations.
 */
export class AuthController {
  /**
   * Handles user registration.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A response object with the newly created user object, or an error response if the user already exists.
   * @throws {HttpError} If the user already exists.
   * @throws {HttpError} If a server error occurs.
   */
  public static async signup(req: Request, res: Response) {
    try {
      const { email, password, username } = req.body as AuthSchema;

      const isEmailExits = await AuthController.isUserEmailTaken(email);
      const isUsernameExits = await AuthController.isUsernameTaken(username);

      if (isEmailExits) {
        return HttpError.badRequest(res, 'Email already exists');
      }

      if (isUsernameExits) {
        return HttpError.badRequest(res, 'Username already exists');
      }

      const newUser = await AuthController.createUser({
        email,
        password,
        username,
      });

      generateToken(String(newUser.id), res);

      logger.info(`New user created: ${newUser.id}`);
      return httpResponse.success(res, null, HttpStatus.CREATED);
    } catch (error) {
      logger.error(error);
      return HttpError.internalServerError(res, error);
    }
  }

  public static async signin(req: Request, res: Response) {
    try {
      const { email, password } = req.body as AuthSchema;

      const user = await db.user.findFirst({ where: { email } });

      if (!user) {
        return HttpError.notFound(res, 'User not found');
      }

      // Compare password
      const isPasswordMatch = await AuthController.comparePassword(
        password,
        user.password
      );

      if (!isPasswordMatch) {
        logger.info(`Invalid credentials for user: ${user.id}`);
        return HttpError.badRequest(res, 'Invalid credentials');
      }

      generateToken(String(user.id), res);

      logger.info(`Attempted login for user: ${user.id}`);
      return httpResponse.success(res, null);
    } catch (error) {
      logger.error(error);
      return HttpError.internalServerError(res, error);
    }
  }

  /**
   * Handles user profile update.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A response object with a success message, or an error response if the user is not found.
   * @throws {HttpError} If the user is not found.
   * @throws {HttpError} If a server error occurs.
   */
  public static async updateUser(req: Request, res: Response) {
    try {
      const { username } = req.body as AuthSchema;

      let avatarPath: string | null = null;

      if (req.file) {
        avatarPath = req.file.path;
      }

      const user = await db.user.findFirst({
        where: {
          id: req.user?.id,
        },
      });

      if (!user) {
        return HttpError.notFound(res, 'User not found');
      }

      if (username !== user.username) {
        await db.user.update({
          where: {
            id: user.id,
          },
          data: {
            username,
          },
        });
      } else if (username === user.username) {
        await db.user.update({
          where: {
            id: user.id,
          },
          data: {
            avatar: `${process.env.BASEURL}/${avatarPath}`,
          },
        });
      } else {
        await db.user.update({
          where: {
            id: user.id,
          },
          data: {
            username,
            avatar: `${process.env.BASEURL}/${avatarPath}`,
          },
        });
      }

      return httpResponse.success(
        res,
        null,
        HttpStatus.OK,
        'Update profile successfully'
      );
    } catch (error) {
      logger.error(error);
      return HttpError.internalServerError(res, error);
    }
  }

  /**
   * Logs the user out of the application by clearing the token cookie.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @returns A successful response if the logout was successful, or an error response if an error occurs.
   */
  public static logout(req: Request, res: Response) {
    try {
      res.clearCookie('token');
      return httpResponse.success(res, null);
    } catch (error) {
      logger.error(error);
      return HttpError.internalServerError(res, error);
    }
  }

  public static getCurrentUser(req: Request, res: Response) {
    try {
      return httpResponse.success(res, req.user);
    } catch (error) {
      logger.error(error);
      return HttpError.internalServerError(res, error);
    }
  }

  /**
   * Checks if a user with the given email already exists.
   * @param email - The email address to check.
   * @returns A boolean indicating whether the email exists or not.
   */
  private static async isUserEmailTaken(email: string): Promise<boolean> {
    const user = await db.user.findFirst({ where: { email } });
    logger.info(`Searching email: ${email} and got result: ${user?.email}`);
    return !!user;
  }

  /**
   * Checks if a user with the given username already exists.
   * @param username - The username to check.
   * @returns A boolean indicating whether the username exists or not.
   */
  private static async isUsernameTaken(username: string): Promise<boolean> {
    const existingUser = await db.user.findFirst({ where: { username } });
    logger.info(
      `Searching username: ${username} and got result: ${existingUser?.username}`
    );
    return !!existingUser;
  }

  private static async comparePassword(
    password: string,
    hashedPassword: string
  ) {
    return await bcrypt.compare(password, hashedPassword);
  }

  /**
   * Creates a new user with the given email, password, and username.
   * @param {AuthSchema} { email, password, username } - The user data.
   * @returns The newly created user object.
   */
  private static async createUser({
    email,
    password,
    username,
  }: AuthSchema): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);

    return await db.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        avatar: `https://avatar.vercel.sh/${username}`,
      },
    });
  }
}
