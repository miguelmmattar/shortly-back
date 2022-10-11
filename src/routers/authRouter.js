import express from 'express';
import authController from '../controllers/authController.js';
import authMiddlewares from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.post('/signup', authMiddlewares.signUpSchema, authMiddlewares.allowSignUp, authController.signUp);

export default router;