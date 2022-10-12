import express from 'express';
import usersController from '../controllers/usersController.js';
import usersMiddlewares from '../middlewares/usersMiddlewares.js';
import authMiddlewares from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/users/me', authMiddlewares.isAuthorized, usersMiddlewares.isUser, usersController.getUser);


export default router;