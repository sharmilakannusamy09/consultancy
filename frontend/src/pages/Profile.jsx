import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User as UserIcon, Package, Calendar } from 'lucide-react';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchUserData = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                const [ordersRes, apptsRes] = await Promise.all([
                    axios.get('/api/orders/myorders', config),
                    axios.get('/api/appointments/myappointments', config)
                ]);

                setOrders(ordersRes.data);
                setAppointments(apptsRes.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
            setLoading(false);
        };

        fetchUserData();
    }, [user, navigate]);

    if (!user) return null;

    return (
        <div className="py-8 max-w-5xl mx-auto space-y-8">
            <h1 className="text-4xl font-serif text-gold-300 mb-8 border-b border-gold-500/20 pb-4">My Profile</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* User Info Col */}
                <div className="md:col-span-1">
                    <div className="glass-panel p-6 rounded-xl border-gold-500/30 sticky top-28">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-luxury-800 rounded-full flex items-center justify-center border border-gold-500/50 mb-4 shadow-xl">
                                <UserIcon size={40} className="text-gold-300" />
                            </div>
                            <h2 className="text-2xl font-serif text-gold-100">{user.name}</h2>
                            <p className="text-gold-200/70 mb-6">{user.email}</p>

                            <div className="w-full space-y-3">
                                <button className="btn-outline-gold w-full text-sm py-2">Edit Profile</button>
                                <button onClick={() => { logout(); navigate('/'); }} className="w-full py-2 bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 rounded transition-colors text-sm">Sign Out</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders and Appointments Col */}
                <div className="md:col-span-2 space-y-8">

                    {/* Orders Section */}
                    <div className="glass-panel p-6 rounded-xl border-gold-500/20">
                        <div className="flex items-center gap-3 border-b border-gold-500/10 pb-4 mb-4">
                            <Package className="text-gold-400" />
                            <h3 className="text-2xl font-serif text-gold-100">Order History</h3>
                        </div>

                        {loading ? (
                            <p className="text-gold-200/50">Loading orders...</p>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gold-200/70 mb-4">You haven't placed any orders yet.</p>
                                <button onClick={() => navigate('/catalog')} className="btn-gold px-6">Explore Jewellery</button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map(order => (
                                    <div key={order._id} className="bg-luxury-800/50 p-4 rounded-lg border border-gold-500/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-gold-500/30 transition-colors">
                                        <div>
                                            <p className="text-xs text-gold-200/50 mb-1">Order #{order._id.substring(0, 8)}</p>
                                            <p className="font-semibold text-gold-100">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                                            <p className="text-sm text-gold-200/80">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            {!order.isDelivered && order.deliveryOtp && (
                                                <div className="mt-2 text-xs bg-luxury-900 border border-gold-500/30 px-2 py-1 rounded inline-block text-gold-300">
                                                    Delivery OTP: <span className="font-mono font-bold">{order.deliveryOtp}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-3 py-1 text-xs rounded-full border ${order.isDelivered ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-gold-500/10 border-gold-500/30 text-gold-400'}`}>
                                                {order.isDelivered ? 'Delivered' : 'Processing'}
                                            </span>
                                            <button className="block mt-2 text-sm text-gold-300 hover:text-gold-400 underline decoration-gold-500/30">View Details</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Appointments Section */}
                    <div className="glass-panel p-6 rounded-xl border-gold-500/20">
                        <div className="flex items-center gap-3 border-b border-gold-500/10 pb-4 mb-4">
                            <Calendar className="text-gold-400" />
                            <h3 className="text-2xl font-serif text-gold-100">Showroom Appointments</h3>
                        </div>

                        {loading ? (
                            <p className="text-gold-200/50">Loading appointments...</p>
                        ) : appointments.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gold-200/70 mb-4">You have no upcoming appointments.</p>
                                <button onClick={() => navigate('/book-appointment')} className="btn-outline-gold px-6">Book a Visit</button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {appointments.map(appt => (
                                    <div key={appt._id} className="bg-luxury-800/50 p-4 rounded-lg border border-gold-500/10 flex justify-between items-center hover:border-gold-500/30 transition-colors">
                                        <div>
                                            <p className="font-semibold text-gold-100">{new Date(appt.date).toLocaleDateString()}</p>
                                            <p className="text-sm text-gold-200/80">{appt.time}</p>
                                        </div>
                                        <span className={`px-3 py-1 text-xs rounded-full border ${appt.status === 'Confirmed' ? 'bg-green-500/10 border-green-500/30 text-green-400' : appt.status === 'Cancelled' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-gold-500/10 border-gold-500/30 text-gold-400'}`}>
                                            {appt.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;
