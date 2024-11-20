import { Router } from 'express';
import { AuthValidator } from '../lib/validator/auth-validator';
import { UserController } from '../controllers/user.controller';
import { isAuthenticated } from '../middleware/auth.middleware';

const router = Router();

router.post('/signup', AuthValidator.validateSignup, UserController.signup);
router.post('/signin', AuthValidator.validateSignin, UserController.signin);
router.post('/logout', UserController.logout);

router.get('/me', isAuthenticated, UserController.getCurrentUser);

router.put('/update', isAuthenticated, UserController.updateUser);

export default router;
