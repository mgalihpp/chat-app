import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import HttpError from '../../helpers/http-error';

export const signupSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .refine(
      (val) => {
        const passwordRegex = new RegExp(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})'
        );
        return passwordRegex.test(val);
      },
      {
        message:
          'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
      }
    ),
  avatar: z.string().optional(),
});

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type AuthSchema = z.infer<typeof signupSchema>;

export class AuthValidator {
  public static validateSignin = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const result = signinSchema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.errors;
      return HttpError.validationError(res, errors);
    }
    next();
  };

  public static validateSignup = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const result = signupSchema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.errors;
      return HttpError.validationError(res, errors);
    }
    next();
  };
}
