import { asyncHandler } from '../middleware/errorMiddleware.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import GoldRate from '../models/GoldRate.js';
import Razorpay from 'razorpay';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    }

    // Calculate prices dynamically based on latest gold rate to prevent tampering
    const rate = await GoldRate.findOne({}).sort({ date: -1 });
    if (!rate) {
        res.status(500);
        throw new Error('Server Error: Gold rate not configured');
    }

    const calculatedItems = [];
    let itemsPrice = 0;

    for (const item of orderItems) {
        const product = await Product.findById(item.product);
        if (!product) {
            res.status(404);
            throw new Error(`Product not found: ${item.product}`);
        }

        // Calculate single item price
        const goldRatePerGram = product.purity === '24K' ? rate.rate24k : rate.rate22k;
        const basePrice = product.weight * goldRatePerGram;
        const makingCharge = product.makingCharges; // flat rate for simplicity as per model
        const singlePrice = basePrice + makingCharge;

        const lineItemPrice = singlePrice * item.qty;
        itemsPrice += lineItemPrice;

        calculatedItems.push({
            name: product.name,
            qty: item.qty,
            image: product.image,
            price: singlePrice, // Store unit price calculated at checkout
            product: product._id
        });
    }

    // Let's assume a GST of 3% on Jewellery
    const taxPrice = Number((0.03 * itemsPrice).toFixed(2));

    // Free shipping if > 50000 INR, else 500 INR
    const shippingPrice = itemsPrice > 50000 ? 0 : 500;

    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    // Generate 6 digit Delivery OTP
    const deliveryOtp = Math.floor(100000 + Math.random() * 900000).toString();

    const order = new Order({
        orderItems: calculatedItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        deliveryOtp
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email'
    );

    if (order) {
        // Check if admin or the user who created the order
        if (req.user.isAdmin || order.user._id.equals(req.user._id)) {
            res.json(order);
        } else {
            res.status(401);
            throw new Error('Not authorized to view this order');
        }
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        // Payment result from Razorpay typically
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        if (!req.body.otp || req.body.otp !== order.deliveryOtp) {
            res.status(400);
            throw new Error('Invalid Delivery OTP');
        }

        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
});

// @desc    Create Razorpay order
// @route   POST /api/orders/:id/razorpay
// @access  Private
export const createRazorpayOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        // If dummy key is used, mock the Razorpay response
        if (process.env.RAZORPAY_KEY_ID === 'rzp_test_dummy') {
            res.json({
                id: `order_dummy_${Date.now()}`,
                amount: Math.round(order.totalPrice * 100),
                currency: 'INR',
            });
            return;
        }

        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: Math.round(order.totalPrice * 100), // amount in the smallest currency unit (paise)
            currency: 'INR',
            receipt: `receipt_order_${order._id}`,
        };

        const razorpayOrder = await instance.orders.create(options);

        res.json(razorpayOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});
