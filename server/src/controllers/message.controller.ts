import type { Request, Response } from 'express';
import logger from '../lib/logger';
import HttpError from '../helpers/http-error';
import { MessageSchema } from '../lib/validator/message-validator';
import { db } from '../configs/db';
import SocketServer from '../lib/socket';
import httpResponse from '../helpers/http-response';

export class MessageController {
  public static async sendMessage(req: Request, res: Response) {
    try {
      const { receiverId, senderId, text } = req.body as MessageSchema;

      if (!text.length || !senderId || !receiverId) {
        return HttpError.validationError(res, [
          {
            message: 'Message, senderId, and receiverId are required',
            code: 'too_small',
            minimum: 1,
            inclusive: true,
            exact: false,
            path: ['text', 'senderId', 'receiverId'],
            type: 'string',
          },
        ]);
      }

      const file = req.file;

      const newMessage = await db.message.create({
        data: {
          senderId: parseInt(senderId),
          receiverId: parseInt(receiverId),
          text,
          files: file ? `${process.env.BASEURL}/${file.path}` : null,
        },
      });

      const receiverSocketId = SocketServer.getReceiverSocketId(receiverId);

      if (receiverSocketId) {
        logger.info(`Sending message to receiver: ${receiverSocketId}`);
        SocketServer.io.to(receiverSocketId).emit('newMessage', newMessage);
      }

      return httpResponse.success(res, null);
    } catch (error) {
      logger.error(error);
      return HttpError.internalServerError(res, error);
    }
  }

  public static async getMessages(req: Request, res: Response) {
    try {
      const { id: userToChatId } = req.params;

      const messages = await db.message.findMany({
        where: {
          OR: [
            { senderId: parseInt(userToChatId), receiverId: req.user?.id },
            { senderId: req.user?.id, receiverId: parseInt(userToChatId) },
          ],
        },
      });

      return httpResponse.success(res, messages);
    } catch (error) {
      logger.error(error);
      return HttpError.internalServerError(res, error);
    }
  }
}
