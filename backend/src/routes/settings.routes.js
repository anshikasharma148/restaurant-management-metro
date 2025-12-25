import express from 'express';
import { getSettings, updateSettings } from '../controllers/settings.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getSettings);
router.put('/', authorize('admin'), updateSettings);

export default router;

