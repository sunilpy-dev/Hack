import express from 'express';
import dashboardController from '../controllers/dashboardController.js';
import { requireAuth, requirePermission } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Enforce auth on all dashboard endpoints
router.use(requireAuth);

router.get('/stats', dashboardController.getStats);
router.get('/logs', requirePermission('activity.view'), dashboardController.getLogs);

export default router;
