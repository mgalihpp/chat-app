import { Router } from 'express';
import { AuthValidator } from '../lib/validator/auth-validator';
import { AuthController } from '../controllers/auth.controller';
import { isAuthenticated } from '../middleware/auth.middleware';
import { upload } from '../lib/storage';

const router = Router();

router.post('/signup', AuthValidator.validateSignup, AuthController.signup);
router.post('/signin', AuthValidator.validateSignin, AuthController.signin);
router.post('/logout', AuthController.logout);

router.get('/me', isAuthenticated, AuthController.getCurrentUser);

router.put(
  '/update',
  isAuthenticated,
  upload.single('avatar'),
  AuthController.updateUser
);

export default router;
