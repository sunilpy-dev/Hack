import express from 'express';
import bookingController from '../controllers/bookingController.js';

const router = express.Router();

router.route('/')
  .get(bookingController.getAll)
  .post(bookingController.create);

router.get('/resources', bookingController.getResources);
router.get('/space-utilization', bookingController.getSpaceUtilization);

export default router;
