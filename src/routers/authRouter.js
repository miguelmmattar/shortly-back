import express from 'express';
import authController from '../controllers/authController.js';
import authMiddlewares from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.post('/signup', authMiddlewares.authSchema, authMiddlewares.allowSignUp, authController.signUp);
router.post('/signin', authMiddlewares.authSchema, authMiddlewares.allowSignIn, authController.signIn);

export default router;