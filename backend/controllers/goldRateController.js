import { asyncHandler } from '../middleware/errorMiddleware.js';
import GoldRate from '../models/GoldRate.js';

// @desc    Get today's gold rate
// @route   GET /api/goldrate
// @access  Public
export const getLatestGoldRate = asyncHandler(async (req, res) => {
    // Get the most recent gold rate
    const rate = await GoldRate.findOne({}).sort({ date: -1 });

    if (rate) {
        res.json(rate);
    } else {
        res.status(404);
        throw new Error('Gold rate not found');
    }
});

// @desc    Manually override gold rate
// @route   PUT /api/goldrate/override
// @access  Private/Admin
export const overrideGoldRate = asyncHandler(async (req, res) => {
    const { rate22k, rate24k } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const rate = await GoldRate.findOneAndUpdate(
        { date: today },
        {
            date: today,
            rate22k,
            rate24k,
            isManualOverride: true
        },
        { upsert: true, new: true }
    );

    res.json(rate);
});
