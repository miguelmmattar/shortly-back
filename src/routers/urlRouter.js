import express from 'express';
import urlController from '../controllers/urlController.js';
import urlMiddlewares from '../middlewares/urlMiddlewares.js';
import authMiddlewares from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.post('/urls/shorten', urlMiddlewares.urlSchema, authMiddlewares.isAuthorized, urlController.postURL);

export default router;