import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    reply: { type: String },
    status: {
        type: String,
        required: true,
        enum: ['Open', 'Answered', 'Closed'],
        default: 'Open'
    }
}, { timestamps: true });

const Enquiry = mongoose.model('Enquiry', enquirySchema);
export default Enquiry;
