import express from 'express';
import maintenanceController from '../controllers/maintenanceController.js';
import { requireAuth, requirePermission } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Enforce auth on all maintenance endpoints
router.use(requireAuth);

router.route('/')
  .get(maintenanceController.getAll)
  .post(requirePermission('maintenance.create'), maintenanceController.create);

router.post('/generate', requirePermission('maintenance.assign'), maintenanceController.generate);
router.put('/:id/move', requirePermission('maintenance.close'), maintenanceController.move);
router.get('/technicians', maintenanceController.getTechnicians);

export default router;
