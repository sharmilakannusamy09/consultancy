import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: {
        type: String,
        required: true,
        enum: ['Rings', 'Necklaces', 'Bangles', 'Earrings']
    },
    purity: {
        type: String,
        required: true,
        enum: ['22K', '24K']
    },
    weight: { type: Number, required: true }, // in grams
    makingCharges: { type: Number, required: true }, // percentage or flat rate - let's assume flat rate in INR
    image: { type: String, required: true }, // URL to image
    stock: { type: Number, required: true, default: 0 },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
