import express from 'express';
import {
  getSalesSummary,
  getTopItems,
  getCategorySales,
  getDashboardStats,
} from '../controllers/reports.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/sales', authorize('admin', 'manager'), getSalesSummary);
router.get('/top-items', authorize('admin', 'manager'), getTopItems);
router.get('/category-sales', authorize('admin', 'manager'), getCategorySales);
router.get('/dashboard', getDashboardStats);

export default router;

