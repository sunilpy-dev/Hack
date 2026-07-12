import express from 'express';
import authController from '../controllers/authController.js';
import authMiddleware, { requireAuth, requirePermission } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/login', authController.login);

// Routes requiring authentication
router.post('/change-password', requireAuth, authController.changePassword);
router.post('/create-employee', requireAuth, requirePermission('employee.create'), authController.createEmployee);
router.get('/me', requireAuth, authController.me);

export default router;
