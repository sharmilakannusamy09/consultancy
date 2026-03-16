import express from 'express';
import {
    submitEnquiry,
    getMyEnquiries,
    getEnquiries,
    replyEnquiry
} from '../controllers/enquiryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, submitEnquiry).get(protect, admin, getEnquiries);
router.route('/myenquiries').get(protect, getMyEnquiries);
router.route('/:id/reply').put(protect, admin, replyEnquiry);

export default router;
