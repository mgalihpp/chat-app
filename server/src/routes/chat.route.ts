import { Router } from 'express';
import { isAuthenticated } from '../middleware/auth.middleware';
import { UserController } from '../controllers/user.controller';
import { MessageController } from '../controllers/message.controller';
import { upload } from '../lib/storage';
import { MessageValidator } from '../lib/validator/message-validator';

const router = Router();

router.get('/users', isAuthenticated, UserController.getAllUsers);
router.get('/:id', isAuthenticated, MessageController.getMessages);

router.post(
  '/send/:id',
  isAuthenticated,
  MessageValidator.validateMessage,
  upload.single('attachment'),
  MessageController.sendMessage
);

export default router;
