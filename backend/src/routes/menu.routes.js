import express from 'express';
import {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/menu.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = express.Router();

// Public routes (menu items and categories)
router.get('/items', getMenuItems);
router.get('/items/:id', getMenuItem);
router.get('/categories', getCategories);

// Protected routes
router.use(protect);

// Menu items - Manager and Admin can create/update, only Admin can delete
router.post('/items', authorize('admin', 'manager'), createMenuItem);
router.put('/items/:id', authorize('admin', 'manager'), updateMenuItem);
router.delete('/items/:id', authorize('admin'), deleteMenuItem);

// Categories - Manager and Admin can create/update, only Admin can delete
router.post('/categories', authorize('admin', 'manager'), createCategory);
router.put('/categories/:id', authorize('admin', 'manager'), updateCategory);
router.delete('/categories/:id', authorize('admin'), deleteCategory);

export default router;

