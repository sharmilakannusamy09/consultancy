import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, AlertCircle, ShieldCheck, KeyRound } from 'lucide-react';

const Register = () => {
    const [registerRole, setRegisterRole] = useState('user'); // 'user' or 'admin'
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [secretToken, setSecretToken] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const redirect = location.search ? location.search.split('=')[1] : '/';

    useEffect(() => {
        if (user) {
            navigate(redirect);
        }
    }, [navigate, user, redirect]);

    const submitHandler = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsSubmitting(true);
        setError('');

        const res = await register(name, email, password, registerRole === 'admin' ? secretToken : '');

        if (!res.success) {
            setError(res.message);
        }
        setIsSubmitting(false);
    };

    return (
        <div className="flex justify-center items-center py-10">
            <div className="glass-panel p-8 rounded-xl w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-serif text-gold-400">Create Account</h2>
                    <p className="text-gold-200/70 mt-2 text-sm">Join the exclusive world of SHRI GANESH JEWELLS</p>
                </div>

                {/* Role Switcher Toggle */}
                <div className="flex w-full mb-8 bg-black/40 rounded-lg p-1 border border-gold-500/20">
                    <button
                        type="button"
                        onClick={() => { setRegisterRole('user'); setError(''); }}
                        className={`flex-1 py-2 text-sm font-medium flex items-center justify-center gap-2 rounded-md transition-all duration-300 ${registerRole === 'user' ? 'bg-gold-500 text-luxury-900 shadow-lg' : 'text-gold-200/50 hover:text-gold-200'}`}
                    >
                        <User size={16} /> User
                    </button>
                    <button
                        type="button"
                        onClick={() => { setRegisterRole('admin'); setError(''); }}
                        className={`flex-1 py-2 text-sm font-medium flex items-center justify-center gap-2 rounded-md transition-all duration-300 ${registerRole === 'admin' ? 'bg-gold-500 text-luxury-900 shadow-lg' : 'text-gold-200/50 hover:text-gold-200'}`}
                    >
                        <ShieldCheck size={16} /> Admin
                    </button>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-md mb-6 flex items-center text-sm">
                        <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                        <span className="leading-tight">{error}</span>
                    </div>
                )}

                <form onSubmit={submitHandler} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gold-200 mb-2">Full Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User size={18} className="text-gold-500/50" />
                            </div>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-luxury-900 border border-gold-500/30 rounded-md focus:outline-none focus:ring-1 focus:ring-gold-500 text-gold-50 placeholder-gold-200/30 transition-shadow"
                                placeholder={registerRole === 'admin' ? "Admin Name" : "John Doe"}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gold-200 mb-2">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail size={18} className="text-gold-500/50" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-luxury-900 border border-gold-500/30 rounded-md focus:outline-none focus:ring-1 focus:ring-gold-500 text-gold-50 placeholder-gold-200/30 transition-shadow"
                                placeholder={registerRole === 'admin' ? "admin@example.com" : "you@example.com"}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gold-200 mb-2">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock size={18} className="text-gold-500/50" />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-luxury-900 border border-gold-500/30 rounded-md focus:outline-none focus:ring-1 focus:ring-gold-500 text-gold-50 placeholder-gold-200/30 transition-shadow"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gold-200 mb-2">Confirm Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock size={18} className="text-gold-500/50" />
                            </div>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-luxury-900 border border-gold-500/30 rounded-md focus:outline-none focus:ring-1 focus:ring-gold-500 text-gold-50 placeholder-gold-200/30 transition-shadow"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {registerRole === 'admin' && (
                        <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-md">
                            <label className="block text-sm font-bold text-orange-400 mb-2">Admin Secret Code</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <KeyRound size={18} className="text-orange-500/50" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={secretToken}
                                    onChange={(e) => setSecretToken(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-luxury-900 border border-orange-500/50 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-gold-50 placeholder-orange-200/30 transition-shadow"
                                    placeholder="Enter authorization code"
                                />
                            </div>
                            <p className="text-xs text-orange-200/60 mt-2">You must provide the master secret to register as an administrator.</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full flex justify-center py-2.5 mt-4 font-bold rounded-md transition-all ${registerRole === 'admin' ? 'bg-orange-600 hover:bg-orange-500 text-white' : 'btn-gold'}`}
                    >
                        {isSubmitting ? 'Creating Account...' : (registerRole === 'admin' ? 'Register as Admin' : 'Register')}
                    </button>

                </form>

                <div className="mt-6 text-center text-sm text-gold-200/70 border-t border-gold-500/20 pt-6">
                    Already have an account?{' '}
                    <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className="text-gold-400 hover:text-gold-300 font-semibold transition-colors">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
