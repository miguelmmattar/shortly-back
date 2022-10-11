import express from 'express';
import urlController from '../controllers/urlController.js';
import urlMiddlewares from '../middlewares/urlMiddlewares.js';
import authMiddlewares from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.post('/urls/shorten', urlMiddlewares.urlSchema, authMiddlewares.isAuthorized, urlController.postURL);
router.get('/urls/:id', urlMiddlewares.hasURL, urlController.getURL);
router.get('/urls/open/:shortUrl', urlMiddlewares.hasURL, urlController.visitURL);
router.delete('/urls/:id', urlMiddlewares.hasURL, authMiddlewares.isAuthorized, urlMiddlewares.allowDelete, urlController.deleteURL);

export default router;