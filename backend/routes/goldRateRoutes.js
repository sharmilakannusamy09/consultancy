import express from 'express';
import { getLatestGoldRate, overrideGoldRate } from '../controllers/goldRateController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getLatestGoldRate);
router.route('/override').put(protect, admin, overrideGoldRate);

export default router;
