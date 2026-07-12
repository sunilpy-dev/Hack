import express from 'express';
import authRoutes from './authRoutes.js';
import assetRoutes from './assetRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import employeeRoutes from './employeeRoutes.js';
import maintenanceRoutes from './maintenanceRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import auditRoutes from './auditRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/assets', assetRoutes);
router.use('/categories', categoryRoutes);
router.use('/employees', employeeRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/bookings', bookingRoutes);
router.use('/audits', auditRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
