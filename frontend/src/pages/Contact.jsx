import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Send } from 'lucide-react';

const Contact = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!user) {
            navigate('/login?redirect=/contact');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            await axios.post('/api/enquiries', { subject, message }, config);

            setSuccess(true);
            setLoading(false);
            setSubject('');
            setMessage('');
            setTimeout(() => setSuccess(false), 5000); // hide success after 5s
        } catch (err) {
            setError(err.response && err.response.data.message ? err.response.data.message : err.message);
            setLoading(false);
        }
    };

    return (
        <div className="py-12 max-w-4xl mx-auto">
            <h1 className="text-4xl font-serif text-gold-300 mb-8 text-center border-b border-gold-500/20 pb-4">Contact & Enquiries</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <h2 className="text-2xl font-serif text-gold-100 mb-6">Reach Out to Us</h2>
                    <p className="text-gold-200/70 mb-8 font-light leading-relaxed">
                        Have a specific design in mind? Or need help tracking a custom order? Our dedicated artisans and customer support team are here to assist you round the clock.
                    </p>

                    <div className="space-y-6 text-sm text-gold-200/80">
                        <div>
                            <strong className="text-gold-400 block mb-1">Customer Service Email:</strong>
                            support@aurajewels.com
                        </div>
                        <div>
                            <strong className="text-gold-400 block mb-1">Concierge Line:</strong>
                            +91 1800-444-AURA (Mon-Sat, 9 AM - 6 PM)
                        </div>
                        <div>
                            <strong className="text-gold-400 block mb-1">Flagship Store:</strong>
                            No 12 Luxury Avenue, Nariman Point, Mumbai
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-8 rounded-xl border border-gold-500/20">
                    <h2 className="text-xl font-serif text-gold-100 mb-6 flex items-center">
                        <MessageSquare className="mr-3 text-gold-500" size={24} /> Send a Message
                    </h2>

                    {error && <div className="text-red-500 bg-red-500/10 p-3 rounded mb-4 text-sm border border-red-500/30">{error}</div>}
                    {success && <div className="text-green-500 bg-green-500/10 p-3 rounded mb-4 text-sm border border-green-500/30">Enquiry submitted successfully. We will get back to you shortly.</div>}

                    <form onSubmit={submitHandler} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gold-200 mb-2">Subject</label>
                            <input
                                type="text"
                                required
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full px-4 py-2 bg-luxury-900 border border-gold-500/30 rounded-md focus:outline-none focus:ring-1 focus:ring-gold-500 text-gold-50"
                                placeholder="Custom Ring Design Enquiry"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gold-200 mb-2">Message</label>
                            <textarea
                                required
                                rows="5"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full px-4 py-3 bg-luxury-900 border border-gold-500/30 rounded-md focus:outline-none focus:ring-1 focus:ring-gold-500 text-gold-50"
                                placeholder="Details about your enquiry..."
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 mt-4 flex justify-center items-center font-bold tracking-wider ${loading ? 'bg-gold-800 text-gold-200 cursor-not-allowed' : 'btn-gold'}`}
                        >
                            {loading ? 'Sending...' : <><Send size={18} className="mr-2" /> Submit Enquiry</>}
                        </button>
                    </form>
                    {!user && <p className="text-center text-xs text-gold-500/70 mt-4">You will be prompted to login.</p>}
                </div>
            </div>
        </div>
    );
};

export default Contact;
