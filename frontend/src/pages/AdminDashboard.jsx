import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Users, Package, ShoppingCart, CalendarDays, MessageSquare, Edit, Trash2, Plus, X, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('orders');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [goldRate, setGoldRate] = useState({ rate22k: '', rate24k: '' });
    const [rateUpdating, setRateUpdating] = useState(false);

    // Order Filtering State
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Modals Data
    const [showProductModal, setShowProductModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({
        name: '', description: '', category: '', purity: '', weight: '', makingCharges: '', image: '', stock: ''
    });
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [currentEnquiry, setCurrentEnquiry] = useState(null);
    const [replyText, setReplyText] = useState('');

    useEffect(() => {
        if (!user || (!user.isAdmin)) {
            navigate('/login');
        }
    }, [navigate, user]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            setData([]); // Clear data before fetch
            if (activeTab === 'orders') {
                const res = await axios.get('/api/orders', config);
                setData(res.data);
            } else if (activeTab === 'products') {
                const res = await axios.get('/api/products?pageNumber=1&keyword=');
                setData(res.data.products);
            } else if (activeTab === 'users') {
                const res = await axios.get('/api/users', config);
                setData(res.data);
            } else if (activeTab === 'appointments') {
                const res = await axios.get('/api/appointments', config);
                setData(res.data);
            } else if (activeTab === 'enquiries') {
                const res = await axios.get('/api/enquiries', config);
                setData(res.data);
            } else if (activeTab === 'goldrate') {
                const res = await axios.get('/api/goldrate');
                setGoldRate({ rate22k: res.data.rate22k, rate24k: res.data.rate24k });
            }
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const filteredOrders = activeTab === 'orders' ? data.filter(order => {
        if (!startDate && !endDate) return true;
        const orderDate = new Date(order.createdAt);
        
        const start = startDate ? new Date(startDate) : new Date('2000-01-01');
        start.setHours(0, 0, 0, 0);
        
        const end = endDate ? new Date(endDate) : new Date('2100-01-01');
        end.setHours(23, 59, 59, 999);
        
        return orderDate >= start && orderDate <= end;
    }) : data;

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text("Order History Report", 14, 15);
        if (startDate || endDate) {
            doc.setFontSize(10);
            const startStr = startDate ? new Date(startDate).toLocaleDateString() : 'Beginning';
            const endStr = endDate ? new Date(endDate).toLocaleDateString() : 'Today';
            doc.text(`Filtered from: ${startStr} to ${endStr}`, 14, 22);
        }
        
        const tableColumn = ["Order ID", "User", "Date", "Total (Rs)", "Paid", "Delivered"];
        const tableRows = [];

        filteredOrders.forEach(order => {
            const orderData = [
                String(order._id).substring(0, 10) + '...',
                order.user?.name || 'Unknown',
                new Date(order.createdAt).toLocaleDateString(),
                order.totalPrice,
                order.isPaid ? 'Yes' : 'No',
                order.isDelivered ? 'Yes' : 'No'
            ];
            tableRows.push(orderData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: startDate || endDate ? 25 : 20,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [223, 153, 57] } // Gold-ish color for table header
        });

        doc.save(`order_report_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    useEffect(() => {
        if (user && user.isAdmin) fetchData();
    }, [activeTab, user]);

    const handleGoldRateUpdate = async (e) => {
        e.preventDefault();
        setRateUpdating(true);
        try {
            const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` } };
            await axios.put('/api/goldrate/override', { rate22k: Number(goldRate.rate22k), rate24k: Number(goldRate.rate24k) }, config);
            alert('Gold rate manually overridden successfully');
        } catch (err) {
            alert('Failed to update gold rate');
        }
        setRateUpdating(false);
    };

    const updateOrderStatus = async (id, status) => {
        if (status === 'Delivered') {
            const otp = window.prompt("Please enter the 6-digit Delivery OTP provided by the customer:");
            if (!otp) return; // Cancelled or empty

            try {
                const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` } };
                await axios.put(`/api/orders/${id}/deliver`, { otp }, config);
                fetchData();
                alert('Order marked as delivered successfully.');
            } catch (err) {
                console.error(err);
                alert(err.response?.data?.message || 'Failed to update order status. Incorrect OTP?');
            }
        }
    };

    const openProductModal = (product = null) => {
        setCurrentProduct(product || {
            name: '', description: '', category: '', purity: '', weight: '', makingCharges: '', image: '', stock: ''
        });
        setShowProductModal(true);
    };

    const saveProduct = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` } };
            if (currentProduct._id) {
                await axios.put(`/api/products/${currentProduct._id}`, currentProduct, config);
                alert('Product updated successfully');
            } else {
                await axios.post('/api/products', currentProduct, config);
                alert('Product created successfully');
            }
            setShowProductModal(false);
            fetchData();
        } catch (err) {
            console.error(err);
            alert('Failed to save product');
        }
    };

    const deleteProductItem = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`/api/products/${id}`, config);
                fetchData();
                alert('Product deleted');
            } catch (err) {
                console.error(err);
                alert('Failed to delete product');
            }
        }
    };

    const updateAppointmentStatus = async (id, status) => {
        try {
            const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` } };
            await axios.put(`/api/appointments/${id}/status`, { status }, config);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const openReplyModal = (enquiry) => {
        setCurrentEnquiry(enquiry);
        setReplyText(enquiry.reply || '');
        setShowReplyModal(true);
    };

    const sendReply = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` } };
            await axios.put(`/api/enquiries/${currentEnquiry._id}/reply`, { reply: replyText, status: 'Answered' }, config);
            setShowReplyModal(false);
            alert('Reply sent successfully');
            fetchData();
        } catch (err) {
            console.error(err);
            alert('Failed to send reply');
        }
    };

    if (!user || (!user.isAdmin)) return null;

    return (
        <div className="py-8">
            <h1 className="text-3xl font-serif text-gold-300 mb-8 border-b border-gold-500/20 pb-4">Admin Command Center</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="glass-panel p-4 rounded-xl space-y-2 border-gold-500/20">
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-gold-500/20 text-gold-400 font-bold border border-gold-500/30' : 'text-gold-100 hover:bg-white/5'}`}
                        >
                            <ShoppingCart className="mr-3" size={20} /> Manage Orders
                        </button>
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeTab === 'products' ? 'bg-gold-500/20 text-gold-400 font-bold border border-gold-500/30' : 'text-gold-100 hover:bg-white/5'}`}
                        >
                            <Package className="mr-3" size={20} /> Manage Products
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-gold-500/20 text-gold-400 font-bold border border-gold-500/30' : 'text-gold-100 hover:bg-white/5'}`}
                        >
                            <Users className="mr-3" size={20} /> Customers
                        </button>
                        <button
                            onClick={() => setActiveTab('appointments')}
                            className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeTab === 'appointments' ? 'bg-gold-500/20 text-gold-400 font-bold border border-gold-500/30' : 'text-gold-100 hover:bg-white/5'}`}
                        >
                            <CalendarDays className="mr-3" size={20} /> Appointments
                        </button>
                        <button
                            onClick={() => setActiveTab('enquiries')}
                            className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeTab === 'enquiries' ? 'bg-gold-500/20 text-gold-400 font-bold border border-gold-500/30' : 'text-gold-100 hover:bg-white/5'}`}
                        >
                            <MessageSquare className="mr-3" size={20} /> Customer Enquiries
                        </button>
                        <div className="h-px bg-gold-500/20 my-2"></div>
                        <button
                            onClick={() => setActiveTab('goldrate')}
                            className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeTab === 'goldrate' ? 'bg-gold-500/20 text-gold-400 font-bold border border-gold-500/30' : 'text-gold-100 hover:bg-white/5'}`}
                        >
                            <span className="text-xl font-serif mr-3">₹</span> Gold Rate Control
                        </button>
                    </div>
                </div>

                {/* Dashboard Content */}
                <div className="flex-1 glass-panel p-6 rounded-xl border-gold-500/20 relative min-h-[500px]">
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center text-gold-400">
                            <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            {/* Orders Tab */}
                            {activeTab === 'orders' && (
                                <div>
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-gold-500/10 pb-4">
                                        <h2 className="text-xl font-serif text-gold-300">Order Management</h2>
                                        <div className="flex flex-col sm:flex-row items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <label className="text-xs text-gold-200 uppercase tracking-widest font-semibold">Start:</label>
                                                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-luxury-900 border border-gold-500/30 rounded px-2 py-1.5 text-sm text-gold-50 focus:outline-none focus:border-gold-500 shadow-sm" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <label className="text-xs text-gold-200 uppercase tracking-widest font-semibold">End:</label>
                                                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-luxury-900 border border-gold-500/30 rounded px-2 py-1.5 text-sm text-gold-50 focus:outline-none focus:border-gold-500 shadow-sm" />
                                            </div>
                                            <button onClick={generatePDF} className="btn-gold flex items-center px-4 py-1.5 text-sm gap-2 shadow-lg">
                                                <Download size={16} /> Export PDF
                                            </button>
                                        </div>
                                    </div>
                                    <table className="w-full text-left text-sm text-gold-100">
                                        <thead className="text-xs text-gold-400 uppercase bg-luxury-800/80 border-b border-gold-500/20">
                                            <tr>
                                                <th className="px-4 py-3">Order ID</th>
                                                <th className="px-4 py-3">User</th>
                                                <th className="px-4 py-3">Date</th>
                                                <th className="px-4 py-3">Total (₹)</th>
                                                <th className="px-4 py-3">Paid</th>
                                                <th className="px-4 py-3">Delivered</th>
                                                <th className="px-4 py-3">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gold-500/10">
                                            {filteredOrders.map(order => (
                                                <tr key={order._id} className="hover:bg-white/5">
                                                    <td className="px-4 py-4">{order._id.substring(0, 10)}...</td>
                                                    <td className="px-4 py-4">{order.user?.name || 'Unknown'}</td>
                                                    <td className="px-4 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                                                    <td className="px-4 py-4 font-bold">₹{order.totalPrice}</td>
                                                    <td className="px-4 py-4">{order.isPaid ? 'Yes' : <span className="text-red-400">No</span>}</td>
                                                    <td className="px-4 py-4">{order.isDelivered ? 'Yes' : <span className="text-red-400">No</span>}</td>
                                                    <td className="px-4 py-4">
                                                        {!order.isDelivered && (
                                                            <button
                                                                onClick={() => updateOrderStatus(order._id, 'Delivered')}
                                                                className="text-xs bg-gold-600 hover:bg-gold-500 text-luxury-900 px-3 py-1 rounded font-bold transition-colors"
                                                            >
                                                                Mark Delivered
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Products Tab */}
                            {activeTab === 'products' && (
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-serif text-gold-300">Inventory Management</h2>
                                        <button onClick={() => openProductModal()} className="btn-gold flex items-center px-4 py-2 text-sm">
                                            <Plus size={16} className="mr-2" /> Add Product
                                        </button>
                                    </div>
                                    <table className="w-full text-left text-sm text-gold-100">
                                        <thead className="text-xs text-gold-400 uppercase bg-luxury-800/80 border-b border-gold-500/20">
                                            <tr>
                                                <th className="px-4 py-3">Image</th>
                                                <th className="px-4 py-3">Name</th>
                                                <th className="px-4 py-3">Category</th>
                                                <th className="px-4 py-3">Price (₹)</th>
                                                <th className="px-4 py-3">Stock</th>
                                                <th className="px-4 py-3">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gold-500/10">
                                            {data.map(item => (
                                                <tr key={item._id} className="hover:bg-white/5">
                                                    <td className="px-4 py-2"><img src={item.image} alt="product" className="h-10 w-10 object-cover rounded" /></td>
                                                    <td className="px-4 py-4">{item.name}</td>
                                                    <td className="px-4 py-4">{item.category}</td>
                                                    <td className="px-4 py-4">₹{Math.round(item.weight * (goldRate.rate22k || 6500) + item.makingCharges).toLocaleString()}</td>
                                                    <td className="px-4 py-4">{item.stock > 0 ? <span className="text-green-400 font-bold">{item.stock}</span> : <span className="text-red-400">Out of Stock</span>}</td>
                                                    <td className="px-4 py-4 flex gap-4">
                                                        <button onClick={() => openProductModal(item)} className="text-blue-400 hover:text-blue-300"><Edit size={18} /></button>
                                                        <button onClick={() => deleteProductItem(item._id)} className="text-red-400 hover:text-red-300"><Trash2 size={18} /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {data.length === 0 && (
                                                <tr><td colSpan="6" className="text-center py-8 text-gold-200/50">No products found. Add one above.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Users Tab */}
                            {activeTab === 'users' && (
                                <div>
                                    <h2 className="text-xl font-serif text-gold-300 mb-6">Customer Management</h2>
                                    <table className="w-full text-left text-sm text-gold-100">
                                        <thead className="text-xs text-gold-400 uppercase bg-luxury-800/80 border-b border-gold-500/20">
                                            <tr>
                                                <th className="px-4 py-3">Name</th>
                                                <th className="px-4 py-3">Email</th>
                                                <th className="px-4 py-3">Admin</th>
                                                <th className="px-4 py-3">Joined</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gold-500/10">
                                            {data.map(u => (
                                                <tr key={u._id} className="hover:bg-white/5">
                                                    <td className="px-4 py-4">{u.name}</td>
                                                    <td className="px-4 py-4">{u.email}</td>
                                                    <td className="px-4 py-4">{u.isAdmin ? <span className="text-green-400">Yes</span> : 'No'}</td>
                                                    <td className="px-4 py-4">{new Date(u.createdAt).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Appointments Tab */}
                            {activeTab === 'appointments' && (
                                <div>
                                    <h2 className="text-xl font-serif text-gold-300 mb-6">Appointment Scheduler</h2>
                                    <table className="w-full text-left text-sm text-gold-100">
                                        <thead className="text-xs text-gold-400 uppercase bg-luxury-800/80 border-b border-gold-500/20">
                                            <tr>
                                                <th className="px-4 py-3">User</th>
                                                <th className="px-4 py-3">Date</th>
                                                <th className="px-4 py-3">Time</th>
                                                <th className="px-4 py-3">Status</th>
                                                <th className="px-4 py-3">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gold-500/10">
                                            {data.map(apt => (
                                                <tr key={apt._id} className="hover:bg-white/5">
                                                    <td className="px-4 py-4">{apt.user?.name || apt.name}</td>
                                                    <td className="px-4 py-4">{new Date(apt.date).toLocaleDateString()}</td>
                                                    <td className="px-4 py-4 font-bold">{apt.time}</td>
                                                    <td className="px-4 py-4">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${apt.status === 'Pending' ? 'bg-orange-500/20 text-orange-400' : apt.status === 'Approved' ? 'bg-blue-500/20 text-blue-400' : apt.status === 'Completed' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                            {apt.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 flex gap-2">
                                                        {apt.status === 'Pending' && (
                                                            <>
                                                                <button onClick={() => updateAppointmentStatus(apt._id, 'Approved')} className="text-xs bg-blue-600/30 hover:bg-blue-600 text-blue-100 px-2 py-1 rounded font-semibold transition-colors border border-blue-500/30">Approve</button>
                                                                <button onClick={() => updateAppointmentStatus(apt._id, 'Rejected')} className="text-xs bg-red-600/30 hover:bg-red-600 text-red-100 px-2 py-1 rounded font-semibold transition-colors border border-red-500/30">Reject</button>
                                                            </>
                                                        )}
                                                        {apt.status === 'Approved' && (
                                                            <button onClick={() => updateAppointmentStatus(apt._id, 'Completed')} className="text-xs bg-green-600/30 hover:bg-green-600 text-green-100 px-2 py-1 rounded font-semibold transition-colors border border-green-500/30">Mark Complete</button>
                                                        )}
                                                        {(!['Pending', 'Approved'].includes(apt.status)) && (
                                                            <span className="text-xs text-gray-500">No Actions</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                            {data.length === 0 && (
                                                <tr><td colSpan="5" className="text-center py-8 text-gold-200/50">No appointments scheduled found.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Enquiries Tab */}
                            {activeTab === 'enquiries' && (
                                <div>
                                    <h2 className="text-xl font-serif text-gold-300 mb-6">Customer Enquiries</h2>
                                    <table className="w-full text-left text-sm text-gold-100">
                                        <thead className="text-xs text-gold-400 uppercase bg-luxury-800/80 border-b border-gold-500/20">
                                            <tr>
                                                <th className="px-4 py-3">Date</th>
                                                <th className="px-4 py-3">User</th>
                                                <th className="px-4 py-3">Subject</th>
                                                <th className="px-4 py-3">Status</th>
                                                <th className="px-4 py-3">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gold-500/10">
                                            {data.map(enq => (
                                                <tr key={enq._id} className="hover:bg-white/5">
                                                    <td className="px-4 py-4">{new Date(enq.createdAt).toLocaleDateString()}</td>
                                                    <td className="px-4 py-4">{enq.user?.name || 'Unknown'}</td>
                                                    <td className="px-4 py-4 font-medium">{enq.subject}</td>
                                                    <td className="px-4 py-4">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${enq.status === 'Open' ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'}`}>
                                                            {enq.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <button onClick={() => openReplyModal(enq)} className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-xs border border-blue-500/30 px-2 py-1 rounded bg-blue-500/10">
                                                            <MessageSquare size={14} /> {enq.status === 'Open' ? 'Reply' : 'View / Edit Reply'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {data.length === 0 && (
                                                <tr><td colSpan="5" className="text-center py-8 text-gold-200/50">No enquiries found.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Gold Rate Tab */}
                            {activeTab === 'goldrate' && (
                                <div className="max-w-md mx-auto mt-8">
                                    <h2 className="text-2xl font-serif text-gold-300 mb-6 text-center">Manual Gold Rate Override</h2>
                                    <p className="text-sm text-gold-200/60 text-center mb-8">
                                        The system fetches rates daily via MetalPrice API. Submitting this form will override today's fetched value. Only use this if the API is down or rates fluctuate heavily. Prices are per gram in INR (₹).
                                    </p>
                                    <form onSubmit={handleGoldRateUpdate} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gold-200 mb-2">22K Gold Rate (₹/g)</label>
                                            <input
                                                type="number"
                                                required
                                                step="0.01"
                                                value={goldRate.rate22k}
                                                onChange={(e) => setGoldRate({ ...goldRate, rate22k: e.target.value })}
                                                className="w-full px-4 py-2 bg-luxury-900 border border-gold-500/30 rounded-md focus:outline-none focus:ring-1 focus:ring-gold-500 text-gold-50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gold-200 mb-2">24K Gold Rate (₹/g)</label>
                                            <input
                                                type="number"
                                                required
                                                step="0.01"
                                                value={goldRate.rate24k}
                                                onChange={(e) => setGoldRate({ ...goldRate, rate24k: e.target.value })}
                                                className="w-full px-4 py-2 bg-luxury-900 border border-gold-500/30 rounded-md focus:outline-none focus:ring-1 focus:ring-gold-500 text-gold-50"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={rateUpdating}
                                            className="btn-gold w-full py-3"
                                        >
                                            {rateUpdating ? 'Overriding...' : 'Override Rate'}
                                        </button>
                                    </form>
                                </div>
                            )}

                        </div>
                    )}
                </div>
            </div>

            {/* Product Modal */}
            {showProductModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-luxury-900 border border-gold-500/30 rounded-xl p-6 w-full max-w-2xl my-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-serif text-gold-300">{currentProduct._id ? 'Edit Product' : 'Add New Product'}</h3>
                            <button onClick={() => setShowProductModal(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
                        </div>
                        <form onSubmit={saveProduct} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gold-200 mb-1">Name</label>
                                    <input type="text" required value={currentProduct.name} onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })} className="w-full px-3 py-2 bg-luxury-800 border border-gold-500/30 rounded text-white focus:outline-none focus:border-gold-500" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gold-200 mb-1">Category</label>
                                    <input type="text" required value={currentProduct.category} onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })} className="w-full px-3 py-2 bg-luxury-800 border border-gold-500/30 rounded text-white focus:outline-none focus:border-gold-500" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gold-200 mb-1">Purity</label>
                                    <select value={currentProduct.purity} onChange={(e) => setCurrentProduct({ ...currentProduct, purity: e.target.value })} className="w-full px-3 py-2 bg-luxury-800 border border-gold-500/30 rounded text-white focus:outline-none focus:border-gold-500" required>
                                        <option value="">Select Purity</option>
                                        <option value="22K">22K</option>
                                        <option value="24K">24K</option>
                                        <option value="18K">18K</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gold-200 mb-1">Weight (g)</label>
                                    <input type="number" required step="0.01" value={currentProduct.weight} onChange={(e) => setCurrentProduct({ ...currentProduct, weight: e.target.value })} className="w-full px-3 py-2 bg-luxury-800 border border-gold-500/30 rounded text-white focus:outline-none focus:border-gold-500" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gold-200 mb-1">Making Charges (₹)</label>
                                    <input type="number" required value={currentProduct.makingCharges} onChange={(e) => setCurrentProduct({ ...currentProduct, makingCharges: e.target.value })} className="w-full px-3 py-2 bg-luxury-800 border border-gold-500/30 rounded text-white focus:outline-none focus:border-gold-500" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gold-200 mb-1">Stock Amount</label>
                                    <input type="number" required value={currentProduct.stock} onChange={(e) => setCurrentProduct({ ...currentProduct, stock: e.target.value })} className="w-full px-3 py-2 bg-luxury-800 border border-gold-500/30 rounded text-white focus:outline-none focus:border-gold-500" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm text-gold-200 mb-1">Image URL</label>
                                    <input type="text" required value={currentProduct.image} onChange={(e) => setCurrentProduct({ ...currentProduct, image: e.target.value })} className="w-full px-3 py-2 bg-luxury-800 border border-gold-500/30 rounded text-white focus:outline-none focus:border-gold-500" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm text-gold-200 mb-1">Description</label>
                                    <textarea required value={currentProduct.description} onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })} className="w-full px-3 py-2 bg-luxury-800 border border-gold-500/30 rounded text-white h-24 focus:outline-none focus:border-gold-500"></textarea>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gold-500/20">
                                <button type="button" onClick={() => setShowProductModal(false)} className="px-4 py-2 border border-gold-500/30 text-gold-200 rounded hover:bg-gold-500/10 transition-colors">Cancel</button>
                                <button type="submit" className="btn-gold px-6 py-2">Save Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Reply Modal */}
            {showReplyModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-luxury-900 border border-gold-500/30 rounded-xl p-6 w-full max-w-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-serif text-gold-300">Reply to Enquiry</h3>
                            <button onClick={() => setShowReplyModal(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
                        </div>
                        <div className="mb-4 p-4 bg-white/5 rounded-lg border border-gold-500/10">
                            <p className="text-xs text-gold-400 mb-1 uppercase tracking-wider font-semibold">Subject</p>
                            <p className="text-sm text-white mb-3 font-medium">{currentEnquiry?.subject}</p>
                            <div className="h-px bg-gold-500/10 mb-3"></div>
                            <p className="text-xs text-gold-400 mb-1 uppercase tracking-wider font-semibold">Message</p>
                            <p className="text-sm text-gray-300 italic">"{currentEnquiry?.message}"</p>
                        </div>
                        <form onSubmit={sendReply}>
                            <div className="mb-4">
                                <label className="block text-sm text-gold-200 mb-2 font-medium">Your Reply</label>
                                <textarea required value={replyText} onChange={(e) => setReplyText(e.target.value)} className="w-full px-3 py-3 bg-luxury-800 border border-gold-500/30 rounded-lg text-white h-32 focus:outline-none focus:border-gold-500" placeholder="Type your response here..."></textarea>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-gold-500/20">
                                <button type="button" onClick={() => setShowReplyModal(false)} className="px-4 py-2 border border-gold-500/30 text-gold-200 rounded hover:bg-gold-500/10 transition-colors">Cancel</button>
                                <button type="submit" className="btn-gold px-6 py-2">Send Reply</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
