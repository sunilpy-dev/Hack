import express from 'express';
import categoryController from '../controllers/categoryController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', categoryController.getAll);

export default router;
