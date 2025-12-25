import express from 'express';
import {
  getTables,
  getTable,
  createTable,
  updateTable,
  updateTableStatus,
  deleteTable,
} from '../controllers/tables.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getTables);
router.get('/:id', getTable);
router.put('/:id/status', updateTableStatus);

// Admin only routes
router.post('/', authorize('admin'), createTable);
router.put('/:id', authorize('admin'), updateTable);
router.delete('/:id', authorize('admin'), deleteTable);

export default router;

