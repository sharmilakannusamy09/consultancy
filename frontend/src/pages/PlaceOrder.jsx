import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { CheckCircle, AlertTriangle } from 'lucide-react';

const PlaceOrder = () => {
    const navigate = useNavigate();
    const { cartItems, clearCart } = useCart();
    const { user } = useAuth();

    const [shippingAddress, setShippingAddress] = useState(null);
    const [goldRate, setGoldRate] = useState(null);
    const [error, setError] = useState(null);
    const [placing, setPlacing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        if (!user) navigate('/login');
        if (cartItems.length === 0) navigate('/cart');

        const addr = localStorage.getItem('shippingAddress');
        if (!addr) navigate('/shipping');
        else setShippingAddress(JSON.parse(addr));

        const fetchRate = async () => {
            const { data } = await axios.get('/api/goldrate');
            setGoldRate(data);
        };
        fetchRate();
    }, [navigate, user, cartItems]);

    // Calculate approximate items price to show preview
    const calculateItemPrice = (item) => {
        if (!goldRate) return 0;
        const ratePerGram = item.purity === '24K' ? goldRate.rate24k : goldRate.rate22k;
        return ((item.weight * ratePerGram) + item.makingCharges) * item.qty;
    };

    const itemsPrice = cartItems.reduce((acc, item) => acc + calculateItemPrice(item), 0);
    const taxPrice = Number((0.03 * itemsPrice).toFixed(2));
    const shippingPrice = itemsPrice > 50000 ? 0 : 500;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    const placeOrderHandler = async () => {
        setPlacing(true);
        setError(null);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const orderData = {
                orderItems: cartItems,
                shippingAddress,
                paymentMethod: 'Razorpay', // Mocking Razorpay
            };

            // 1. Create order in database
            const { data } = await axios.post('/api/orders', orderData, config);
            setOrderId(data._id);

            // 2. Load razorpay script
            const res = await loadRazorpay();
            if (!res) {
                throw new Error('Razorpay SDK failed to load. Are you online?');
            }

            // 3. Fetch Razorpay config key
            const { data: clientId } = await axios.get('/api/config/razorpay');

            // 4. Create razorpay order intent
            const { data: razorpayOrder } = await axios.post(`/api/orders/${data._id}/razorpay`, {}, config);

            // 5. Initialize Razorpay Checkout
            if (clientId === 'rzp_test_dummy') {
                // If using dummy key, simulate successful payment since real Razorpay UI won't open
                alert('Testing Mode: Simulating successful Razorpay payment with QR code...');
                const paymentResult = {
                    id: 'pay_dummy_12345',
                    status: 'COMPLETED',
                    update_time: new Date().toISOString(),
                    email_address: user.email
                };
                await axios.put(`/api/orders/${data._id}/pay`, paymentResult, config);
                clearCart();
                setSuccess(true);
                setPlacing(false);
                return;
            }

            const options = {
                key: clientId,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: "Shri Ganesh Jewellery",
                description: "Purchase Transaction",
                order_id: razorpayOrder.id,
                handler: async function (response) {
                    try {
                        const paymentResult = {
                            id: response.razorpay_payment_id,
                            status: 'COMPLETED',
                            update_time: new Date().toISOString(),
                            email_address: user.email
                        };
                        await axios.put(`/api/orders/${data._id}/pay`, paymentResult, config);
                        clearCart();
                        setSuccess(true);
                        setPlacing(false);
                    } catch (err) {
                        setError('Payment verification failed on server.');
                        setPlacing(false);
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                notes: {
                    address: shippingAddress.address
                },
                theme: {
                    color: "#d4af37" // Gold theme
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.on('payment.failed', function (response){
                setError(response.error.description);
                setPlacing(false);
            });
            paymentObject.open();

        } catch (err) {
            setError(err.response && err.response.data.message ? err.response.data.message : err.message);
            setPlacing(false);
        }
    };

    if (success) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="glass-panel p-12 text-center rounded-xl max-w-xl w-full">
                    <CheckCircle size={64} className="mx-auto text-green-500 mb-6" />
                    <h2 className="text-3xl font-serif text-gold-300 mb-4">Order Confirmed!</h2>
                    <p className="text-gold-200/80 mb-6 text-lg">Thank you, {user.name}. Your order has been placed successfully.</p>
                    <div className="bg-luxury-900 border border-gold-500/20 p-4 rounded-md mb-8 inline-block">
                        <span className="text-sm text-gold-200/50 block mb-1">Order Reference ID</span>
                        <span className="font-mono text-gold-100">{orderId}</span>
                    </div>
                    <div>
                        <Link to="/catalog" className="btn-gold px-8 mt-4">Continue Shopping</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8">
            <h1 className="text-4xl font-serif text-gold-300 mb-8 border-b border-gold-500/20 pb-4">Checkout</h1>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-md mb-8 flex items-center">
                    <AlertTriangle className="mr-3" /> {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Shipping Address */}
                    <div className="glass-panel p-6 rounded-xl border-gold-500/20">
                        <h2 className="text-2xl font-serif text-gold-100 border-b border-gold-500/10 pb-4 mb-4">Shipping Destination</h2>
                        <p className="text-gold-200/80 leading-relaxed font-light">
                            <strong>{user?.name}</strong> <br />
                            {shippingAddress?.address}, <br />
                            {shippingAddress?.city}, {shippingAddress?.postalCode}, <br />
                            {shippingAddress?.country}
                        </p>
                    </div>

                    {/* Order Items */}
                    <div className="glass-panel p-6 rounded-xl border-gold-500/20">
                        <h2 className="text-2xl font-serif text-gold-100 border-b border-gold-500/10 pb-4 mb-4">Order Items ({cartItems.length})</h2>
                        <div className="space-y-4 divide-y divide-gold-500/10">
                            {cartItems.map((item, index) => (
                                <div key={index} className="flex items-center gap-6 pt-4 first:pt-0">
                                    <img
                                        src={item.image || `https://source.unsplash.com/random/100x100/?jewellery,${item.category}`}
                                        alt={item.name}
                                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1599643478514-4a884f18db0d?auto=format&fit=crop&q=80&w=100"; }}
                                        className="w-16 h-16 object-cover rounded shadow-md"
                                    />
                                    <div className="flex flex-col md:flex-row md:items-center justify-between w-full">
                                        <div>
                                            <Link to={`/product/${item.product}`} className="text-gold-200 hover:text-gold-400 font-serif">
                                                {item.name}
                                            </Link>
                                            <div className="text-xs text-gold-200/50 mt-1">{item.weight}g • {item.purity}</div>
                                        </div>
                                        <div className="text-gold-100 font-bold mt-2 md:mt-0 text-right">
                                            {item.qty} × ₹{goldRate ? (calculateItemPrice(item) / item.qty).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '...'} <br />
                                            <span className="text-sm text-gold-300">= ₹{goldRate ? calculateItemPrice(item).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '...'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="glass-panel p-6 rounded-xl border-gold-500/30 sticky top-28 shadow-2xl">
                        <h2 className="text-2xl font-serif text-gold-300 mb-6 border-b border-gold-500/20 pb-4">Order Summary</h2>

                        <div className="space-y-4 text-sm font-light text-gold-100/90 divide-y divide-gold-500/10">
                            <div className="flex justify-between pb-2">
                                <span>Subtotal</span>
                                <span>₹{goldRate ? itemsPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '...'}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span>Taxes (3% GST)</span>
                                <span>₹{goldRate ? taxPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '...'}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span>Shipping & Insurance</span>
                                <span>{shippingPrice === 0 ? <span className="text-green-400">Complimentary</span> : `₹${shippingPrice}`}</span>
                            </div>
                            <div className="flex justify-between pt-4 pb-2 border-t-2 border-gold-500/30">
                                <span className="font-bold text-lg text-gold-200">Total</span>
                                <span className="font-bold text-2xl font-serif text-gold-400">
                                    ₹{goldRate ? totalPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '...'}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={placeOrderHandler}
                            disabled={placing || !goldRate}
                            className={`w-full mt-8 py-4 text-lg font-bold transition-all flex justify-center items-center ${placing ? 'bg-gold-800 text-gold-100 cursor-not-allowed' : 'btn-gold'}`}
                        >
                            {placing ? (
                                <><div className="w-5 h-5 border-2 border-luxury-900 border-t-transparent rounded-full animate-spin mr-2"></div> Confirming Securely...</>
                            ) : (
                                'Secure Payment with Razorpay'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrder;
