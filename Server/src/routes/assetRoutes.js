import express from 'express';
import assetController from '../controllers/assetController.js';

const router = express.Router();

router.route('/')
  .get(assetController.getAll)
  .post(assetController.create);

router.route('/:id')
  .get(assetController.getById)
  .put(assetController.update)
  .delete(assetController.delete);

export default router;
