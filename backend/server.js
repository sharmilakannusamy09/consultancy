import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import goldRateRoutes from './routes/goldRateRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import { scheduleGoldRateFetch, fetchGoldRate } from './services/goldRateService.js';

dotenv.config();

// Connect Database
connectDB();

// Start cron job
scheduleGoldRateFetch();
// Also fetch immediately on startup
fetchGoldRate();

const app = express();

// Middleware
app.use(cors({
    origin: [
        "https://jewellery.vercel.app",
        "http://localhost:5173",
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/goldrate', goldRateRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/enquiries', enquiryRoutes);

app.get('/api/config/razorpay', (req, res) => res.send(process.env.RAZORPAY_KEY_ID));

// Basic route
app.get('/', (req, res) => {
    res.send('Jewellery API is running...');
});

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
