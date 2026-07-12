import express from 'express';
import maintenanceController from '../controllers/maintenanceController.js';

const router = express.Router();

router.route('/')
  .get(maintenanceController.getAll)
  .post(maintenanceController.create);

router.post('/generate', maintenanceController.generate);
router.put('/:id/move', maintenanceController.move);
router.get('/technicians', maintenanceController.getTechnicians);

export default router;
