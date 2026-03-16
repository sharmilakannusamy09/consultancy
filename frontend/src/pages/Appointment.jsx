import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, MapPin, CheckCircle } from 'lucide-react';

const Appointment = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login?redirect=/book-appointment');
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

            await axios.post('/api/appointments', { name, phone, date, time, message }, config);

            setSuccess(true);
            setLoading(false);
        } catch (err) {
            setError(err.response && err.response.data.message ? err.response.data.message : err.message);
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="glass-panel text-center p-12 rounded-xl max-w-lg w-full">
                    <CheckCircle size={64} className="mx-auto text-gold-400 mb-6" />
                    <h2 className="text-3xl font-serif text-gold-100 mb-4">Request Received</h2>
                    <p className="text-gold-200/80 mb-8">
                        Your showroom visit request for {new Date(date).toLocaleDateString()} at {time} has been sent successfully. Our team will contact you to confirm.
                    </p>
                    <button onClick={() => navigate('/catalog')} className="btn-gold w-full py-3">Explore Collections While You Wait</button>
                </div>
            </div>
        );
    }

    return (
        <div className="py-12 flex flex-col items-center">

            <div className="text-center max-w-2xl mb-12">
                <h1 className="text-4xl font-serif text-gold-300 mb-4">Exclusive Showroom Visit</h1>
                <p className="text-gold-200/70 text-lg">
                    Experience our exquisite collections in person. Book a private consultation with our master jewelers in a luxurious setting.
                </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl max-w-lg w-full shadow-2xl border-gold-500/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Calendar size={200} />
                </div>

                {error && <div className="text-red-500 bg-red-500/10 p-4 border border-red-500/30 rounded mb-6">{error}</div>}

                <form onSubmit={submitHandler} className="relative z-10 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gold-200 mb-2">Full Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                            className="w-full px-4 py-3 bg-luxury-900 border border-gold-500/30 rounded-md focus:outline-none focus:ring-1 focus:ring-gold-500 text-gold-50 placeholder-gold-200/30"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gold-200 mb-2">Phone Number</label>
                        <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter your phone number"
                            className="w-full px-4 py-3 bg-luxury-900 border border-gold-500/30 rounded-md focus:outline-none focus:ring-1 focus:ring-gold-500 text-gold-50 placeholder-gold-200/30"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gold-200 mb-2">Preferred Date</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Calendar size={18} className="text-gold-500/50" />
                            </div>
                            <input
                                type="date"
                                required
                                value={date}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-luxury-900 border border-gold-500/30 rounded-md focus:outline-none focus:ring-1 focus:ring-gold-500 text-gold-50 placeholder-gold-200/30"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gold-200 mb-2">Preferred Time</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Clock size={18} className="text-gold-500/50" />
                            </div>
                            <select
                                required
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-luxury-900 border border-gold-500/30 rounded-md focus:outline-none focus:ring-1 focus:ring-gold-500 text-gold-50"
                            >
                                <option value="" disabled>Select a time slot</option>
                                <option value="10:00 AM">10:00 AM</option>
                                <option value="11:30 AM">11:30 AM</option>
                                <option value="02:00 PM">02:00 PM</option>
                                <option value="04:00 PM">04:00 PM</option>
                                <option value="06:00 PM">06:00 PM</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gold-200 mb-2">Message (Optional)</label>
                        <textarea
                            rows="2"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Any specific requests?"
                            className="w-full px-4 py-3 bg-luxury-900 border border-gold-500/30 rounded-md focus:outline-none focus:ring-1 focus:ring-gold-500 text-gold-50 placeholder-gold-200/30"
                        ></textarea>
                    </div>

                    <div className="bg-luxury-800/80 p-4 rounded border border-gold-500/10 flex gap-4 my-6">
                        <MapPin className="text-gold-500 flex-shrink-0 mt-1" size={20} />
                        <div>
                            <h4 className="text-gold-100 font-semibold text-sm">SHRI GANESH JEWELLS Flagship</h4>
                            <p className="text-gold-200/60 text-xs mt-1">
                                No 12 Luxury Avenue, <br />
                                Nariman Point, Mumbai 400021
                            </p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-gold w-full flex justify-center py-4 tracking-widest uppercase text-sm"
                    >
                        {loading ? 'Submitting Request...' : (user ? 'Request Appointment' : 'Login to Book')}
                    </button>
                    {!user && <p className="text-center text-xs text-gold-400 mt-2">You will be redirected to login</p>}
                </form>
            </div>
        </div>
    );
};

export default Appointment;
