import express from 'express';
import auditController from '../controllers/auditController.js';

const router = express.Router();

router.get('/', auditController.getAll);
router.get('/discrepancies', auditController.getDiscrepancies);
router.get('/discrepancy-count', auditController.getDiscrepancyCount);

export default router;
