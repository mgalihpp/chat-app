import type { Request, Response, NextFunction } from 'express';
import z from 'zod';
import HttpError from '../../helpers/http-error';
import logger from '../logger';

export const messageSchema = z.object({
  text: z.string().min(1, 'Message is required'),
  senderId: z.string().min(1, 'Sender ID is required'),
  receiverId: z.string().min(1, 'Receiver ID is required'),
  attachment: z.optional(z.string()),
});

export type MessageSchema = z.infer<typeof messageSchema>;

export class MessageValidator {
  public static validateMessage = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // const result = messageSchema.safeParse(req.body);
    // if (!result.success) {
    //   const errors = result.error.errors;
    //   return HttpError.validationError(res, errors);
    // }
    next();
  };
}
