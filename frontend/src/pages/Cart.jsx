import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Trash2, ShoppingBag } from 'lucide-react';

const Cart = () => {
    const { cartItems, addToCart, removeFromCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [goldRate, setGoldRate] = useState(null);

    useEffect(() => {
        const fetchRate = async () => {
            try {
                const { data } = await axios.get('/api/goldrate');
                setGoldRate(data);
            } catch (error) {
                console.error('Error fetching gold rate', error);
            }
        };
        fetchRate();
    }, []);

    const checkoutHandler = () => {
        if (!user) {
            navigate('/login?redirect=/shipping');
        } else {
            navigate('/shipping');
        }
    };

    const calculateItemPrice = (item) => {
        if (!goldRate) return 0;
        const ratePerGram = item.purity === '24K' ? goldRate.rate24k : goldRate.rate22k;
        return ((item.weight * ratePerGram) + item.makingCharges) * item.qty;
    };

    const totalCalculatedPrice = cartItems.reduce((acc, item) => acc + calculateItemPrice(item), 0);

    return (
        <div className="py-8">
            <h1 className="text-4xl font-serif text-gold-300 mb-8 border-b border-gold-500/20 pb-4">Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <div className="glass-panel p-12 text-center rounded-xl">
                    <ShoppingBag size={48} className="mx-auto text-gold-500/50 mb-4" />
                    <h2 className="text-2xl font-serif text-gold-100 mb-4">Your cart is empty</h2>
                    <p className="text-gold-200/60 mb-8">Discover our exquisite collection to find your perfect match.</p>
                    <Link to="/catalog" className="btn-gold inline-block">
                        Go Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.product} className="glass-panel rounded-xl p-4 flex flex-col sm:flex-row items-center gap-6 border-gold-500/20 transition-all hover:bg-white/5">
                                <img
                                    src={item.image || `https://source.unsplash.com/random/200x200/?jewellery,${item.category}`}
                                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1599643478514-4a884f18db0d?auto=format&fit=crop&q=80&w=200"; }}
                                    alt={item.name}
                                    className="w-24 h-24 object-cover rounded-md"
                                />
                                <div className="flex-1 text-center sm:text-left">
                                    <Link to={`/product/${item.product}`} className="text-xl font-serif text-gold-100 hover:text-gold-400 pb-1">
                                        {item.name}
                                    </Link>
                                    <div className="text-sm text-gold-200/60 mt-1">
                                        {item.purity} • {item.weight}g
                                    </div>
                                    <div className="mt-2 text-gold-400 font-bold">
                                        ₹{goldRate ? calculateItemPrice(item).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : 'Calculating...'}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <select
                                        value={item.qty}
                                        onChange={(e) => addToCart(item, Number(e.target.value))}
                                        className="bg-luxury-900 border border-gold-500/30 text-gold-100 rounded-md p-2 focus:ring-1 focus:ring-gold-500"
                                    >
                                        {[...Array(item.stock).keys()].map((x) => (
                                            <option key={x + 1} value={x + 1}>
                                                Qty: {x + 1}
                                            </option>
                                        ))}
                                    </select>

                                    <button
                                        type="button"
                                        onClick={() => removeFromCart(item.product)}
                                        className="text-red-400 hover:text-red-300 p-2 bg-red-400/10 hover:bg-red-400/20 rounded-md transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="glass-panel p-6 rounded-xl border-gold-500/30 sticky top-28 shadow-2xl">
                            <h2 className="text-2xl font-serif text-gold-300 mb-6">Order Summary</h2>

                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between text-gold-100 border-b border-gold-500/10 pb-4">
                                    <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                                    <span className="font-bold font-serif text-lg">
                                        ₹{goldRate ? totalCalculatedPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '...'}
                                    </span>
                                </div>

                                <p className="text-xs text-gold-200/50 pt-2 text-center">
                                    Taxes & Shipping will be calculated at checkout based on actual location.
                                </p>
                            </div>

                            <button
                                onClick={checkoutHandler}
                                disabled={cartItems.length === 0 || !goldRate}
                                className="btn-gold w-full mt-8 py-3 text-lg"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
