import express from 'express';
import bookingController from '../controllers/bookingController.js';
import { requireAuth, requirePermission } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Enforce auth on all booking endpoints
router.use(requireAuth);

router.route('/')
  .get(bookingController.getAll)
  .post(requirePermission('booking.create'), bookingController.create);

router.get('/resources', bookingController.getResources);
router.get('/space-utilization', bookingController.getSpaceUtilization);

export default router;
