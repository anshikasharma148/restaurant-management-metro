import express from 'express';
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  updateOrder,
  deleteOrder,
} from '../controllers/orders.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getOrders).post(authorize('admin', 'manager', 'cashier'), createOrder);
router.route('/:id').get(getOrder).put(authorize('admin', 'manager'), updateOrder).delete(authorize('admin'), deleteOrder);
router.route('/:id/status').put(authorize('admin', 'manager', 'kitchen'), updateOrderStatus);

export default router;

