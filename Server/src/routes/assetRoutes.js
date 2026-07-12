import express from 'express';
import assetController from '../controllers/assetController.js';
import { requireAuth, requirePermission } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Enforce auth on all asset endpoints
router.use(requireAuth);

router.route('/')
  .get(assetController.getAll)
  .post(requirePermission('asset.create'), assetController.create);

router.route('/:id')
  .get(assetController.getById)
  .put(requirePermission('asset.update'), assetController.update)
  .delete(requirePermission('asset.update'), assetController.delete);

export default router;
