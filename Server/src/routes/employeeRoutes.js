import express from 'express';
import employeeController from '../controllers/employeeController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', employeeController.getAll);
router.get('/departments', employeeController.getDepartments);

export default router;
