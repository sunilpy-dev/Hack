import express from 'express';
import employeeController from '../controllers/employeeController.js';

const router = express.Router();

router.get('/', employeeController.getAll);

export default router;
