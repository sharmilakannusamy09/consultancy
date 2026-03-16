import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, User, Menu, LogOut, ChevronDown } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartItems } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="glass-panel sticky top-0 z-50 text-gold-50 w-full rounded-b-xl border-b border-gold-500/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                            <span className="font-serif text-2xl font-bold bg-gradient-to-r from-gold-300 via-gold-400 to-gold-600 bg-clip-text text-transparent">
                                SHRI GANESH JEWELLS
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:flex space-x-8 items-center">
                        <Link to="/" className="text-gold-200 hover:text-gold-400 transition-colors">Home</Link>
                        <Link to="/catalog" className="text-gold-200 hover:text-gold-400 transition-colors">Jewellery</Link>
                        <Link to="/gold-rate" className="text-gold-200 hover:text-gold-400 transition-colors">Gold Rate</Link>
                        <Link to="/book-appointment" className="text-gold-200 hover:text-gold-400 transition-colors">Appointments</Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/cart" className="relative text-gold-200 hover:text-gold-400 transition-colors">
                            <ShoppingBag size={24} />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-gold-600 text-luxury-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartItems.reduce((a, c) => a + c.qty, 0)}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="relative group">
                                <button className="flex items-center space-x-1 text-gold-200 hover:text-gold-400 transition-colors focus:outline-none">
                                    <User size={24} />
                                    <span>{user.name.split(' ')[0]}</span>
                                    <ChevronDown size={16} />
                                </button>
                                <div className="absolute right-0 mt-2 w-48 glass-panel rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col py-2 border-gold-500/20 z-50">
                                    <Link to="/profile" className="px-4 py-2 text-sm text-gold-100 hover:bg-gold-500/10">Profile</Link>
                                    <Link to="/orders" className="px-4 py-2 text-sm text-gold-100 hover:bg-gold-500/10">My Orders</Link>
                                    {user.isAdmin && (
                                        <Link to="/admin" className="px-4 py-2 text-sm text-gold-400 font-bold hover:bg-gold-500/10 border-t border-gold-500/20 mt-1 pt-2">Admin Dashboard</Link>
                                    )}
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gold-500/10 mt-1 border-t border-gray-700/50 pt-2 flex items-center gap-2">
                                        <LogOut size={14} /> Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="btn-gold hidden md:block text-sm">Sign In</Link>
                        )}
                    </div>

                    <div className="flex md:hidden items-center space-x-4">
                        <Link to="/cart" className="relative text-gold-200">
                            <ShoppingBag size={24} />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-gold-600 text-luxury-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartItems.length}
                                </span>
                            )}
                        </Link>
                        <button className="text-gold-200 hover:text-gold-400">
                            <Menu size={28} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
