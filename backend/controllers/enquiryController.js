import { asyncHandler } from '../middleware/errorMiddleware.js';
import Enquiry from '../models/Enquiry.js';

// @desc    Submit new enquiry
// @route   POST /api/enquiries
// @access  Private
export const submitEnquiry = asyncHandler(async (req, res) => {
    const { subject, message } = req.body;

    const enquiry = new Enquiry({
        user: req.user._id,
        subject,
        message,
    });

    const createdEnquiry = await enquiry.save();
    res.status(201).json(createdEnquiry);
});

// @desc    Get user's enquiries
// @route   GET /api/enquiries/myenquiries
// @access  Private
export const getMyEnquiries = asyncHandler(async (req, res) => {
    const enquiries = await Enquiry.find({ user: req.user._id });
    res.json(enquiries);
});

// @desc    Get all enquiries
// @route   GET /api/enquiries
// @access  Private/Admin
export const getEnquiries = asyncHandler(async (req, res) => {
    const enquiries = await Enquiry.find({}).populate('user', 'id name email');
    res.json(enquiries);
});

// @desc    Reply to enquiry and update status
// @route   PUT /api/enquiries/:id/reply
// @access  Private/Admin
export const replyEnquiry = asyncHandler(async (req, res) => {
    const { reply, status } = req.body;
    const enquiry = await Enquiry.findById(req.params.id);

    if (enquiry) {
        enquiry.reply = reply || enquiry.reply;
        enquiry.status = status || enquiry.status;

        const updatedEnquiry = await enquiry.save();
        res.json(updatedEnquiry);
    } else {
        res.status(404);
        throw new Error('Enquiry not found');
    }
});
