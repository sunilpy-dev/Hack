import express from 'express';
import auditController from '../controllers/auditController.js';
import { requireAuth, requirePermission } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Enforce auth on all audit endpoints
router.use(requireAuth);

router.get('/', requirePermission('report.view'), auditController.getAll);
router.get('/discrepancies', requirePermission('report.view'), auditController.getDiscrepancies);
router.get('/discrepancy-count', auditController.getDiscrepancyCount);

export default router;
