import express from 'express';
import {
  processPayment,
  getPayments,
  getPayment,
  getPaymentByOrder,
} from '../controllers/payments.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', authorize('admin', 'manager', 'cashier'), processPayment);
router.get('/', getPayments);
router.get('/:id', getPayment);
router.get('/order/:orderId', getPaymentByOrder);

export default router;

