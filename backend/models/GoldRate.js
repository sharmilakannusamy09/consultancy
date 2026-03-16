import mongoose from 'mongoose';

const goldRateSchema = new mongoose.Schema({
    date: { type: Date, required: true, unique: true },
    rate22k: { type: Number, required: true },
    rate24k: { type: Number, required: true },
    isManualOverride: { type: Boolean, default: false }
}, { timestamps: true });

const GoldRate = mongoose.model('GoldRate', goldRateSchema);
export default GoldRate;
