import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Shipping = () => {
    const navigate = useNavigate();

    const [address, setAddress] = useState(localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')).address : '');
    const [city, setCity] = useState(localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')).city : '');
    const [postalCode, setPostalCode] = useState(localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')).postalCode : '');
    const [country, setCountry] = useState(localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')).country : '');

    const submitHandler = (e) => {
        e.preventDefault();
        localStorage.setItem('shippingAddress', JSON.stringify({ address, city, postalCode, country }));
        navigate('/placeorder');
    };

    return (
        <div className="flex justify-center py-12">
            <div className="glass-panel p-8 rounded-xl w-full max-w-lg border-gold-500/20">
                <h2 className="text-3xl font-serif text-gold-300 mb-8 text-center border-b border-gold-500/20 pb-4">Shipping Details</h2>

                <form onSubmit={submitHandler} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gold-200 mb-2">Street Address</label>
                        <input
                            type="text"
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full px-4 py-2 bg-luxury-900 border border-gold-500/30 rounded-md focus:outline-none focus:ring-1 focus:ring-gold-500 text-gold-50"
                            placeholder="123 Luxury Lane"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gold-200 mb-2">City</label>
                        <input
                            type="text"
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full px-4 py-2 bg-luxury-900 border border-gold-500/30 rounded-md focus:outline-none focus:ring-1 focus:ring-gold-500 text-gold-50"
                            placeholder="Mumbai"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gold-200 mb-2">Postal Code</label>
                        <input
                            type="text"
                            required
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            className="w-full px-4 py-2 bg-luxury-900 border border-gold-500/30 rounded-md focus:outline-none focus:ring-1 focus:ring-gold-500 text-gold-50"
                            placeholder="400001"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gold-200 mb-2">Country</label>
                        <input
                            type="text"
                            required
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full px-4 py-2 bg-luxury-900 border border-gold-500/30 rounded-md focus:outline-none focus:ring-1 focus:ring-gold-500 text-gold-50"
                            placeholder="India"
                        />
                    </div>

                    <button type="submit" className="btn-gold w-full py-3 mt-6">
                        Continue to Payment
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Shipping;
