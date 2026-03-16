import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, AlertCircle, User, ShieldCheck } from 'lucide-react';

const Login = () => {
    const [loginRole, setLoginRole] = useState('user'); // 'user' or 'admin'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login, user } = useAuth();
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
        setIsSubmitting(true);
        setError('');

        const res = await login(email, password, loginRole);

        if (!res.success) {
            setError(res.message);
        }
        setIsSubmitting(false);
    };

    return (
        <div className="flex justify-center items-center min-h-[70vh]">
            <div className="glass-panel p-8 rounded-xl w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-serif text-gold-400">Welcome Back</h2>
                    <p className="text-gold-200/70 mt-2 text-sm">Sign in to access your luxury collection</p>
                </div>

                {/* Role Switcher Toggle */}
                <div className="flex w-full mb-8 bg-black/40 rounded-lg p-1 border border-gold-500/20">
                    <button
                        type="button"
                        onClick={() => { setLoginRole('user'); setError(''); }}
                        className={`flex-1 py-2 text-sm font-medium flex items-center justify-center gap-2 rounded-md transition-all duration-300 ${loginRole === 'user' ? 'bg-gold-500 text-luxury-900 shadow-lg' : 'text-gold-200/50 hover:text-gold-200'}`}
                    >
                        <User size={16} /> User
                    </button>
                    <button
                        type="button"
                        onClick={() => { setLoginRole('admin'); setError(''); }}
                        className={`flex-1 py-2 text-sm font-medium flex items-center justify-center gap-2 rounded-md transition-all duration-300 ${loginRole === 'admin' ? 'bg-gold-500 text-luxury-900 shadow-lg' : 'text-gold-200/50 hover:text-gold-200'}`}
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

                <form onSubmit={submitHandler} className="space-y-6">
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
                                placeholder={loginRole === 'admin' ? "admin@example.com" : "you@example.com"}
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

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-gold w-full flex justify-center py-2.5 mt-2"
                    >
                        {isSubmitting ? 'Signing in...' : `Sign In as ${loginRole === 'admin' ? 'Admin' : 'User'}`}
                    </button>

                </form>

                {loginRole === 'user' && (
                    <div className="mt-6 text-center text-sm text-gold-200/70 border-t border-gold-500/20 pt-6">
                        New to SHRI GANESH JEWELLS?{' '}
                        <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="text-gold-400 hover:text-gold-300 font-semibold transition-colors">
                            Create an account
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
