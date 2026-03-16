import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Clock, Shield } from 'lucide-react';

const GoldRate = () => {
    const [goldRate, setGoldRate] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRate = async () => {
            try {
                const { data } = await axios.get('/api/goldrate');
                setGoldRate(data);
            } catch (error) {
                console.error("Failed to fetch gold rate", error);
            }
            setLoading(false);
        };
        fetchRate();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="w-10 h-10 border-4 border-gold-500/30 border-t-gold-400 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="py-12 max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-serif text-gold-300 mb-4">Live Gold Rates</h1>
                <p className="text-gold-200/70 text-lg">Transparent pricing based on real-time market data.</p>
                <div className="w-24 h-px bg-gold-500/40 mx-auto mt-6"></div>
            </div>

            {goldRate ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {/* 22K Gold Banner */}
                    <div className="glass-panel p-8 rounded-2xl border border-gold-500/30 shadow-[0_0_20px_rgba(223,153,57,0.1)] relative overflow-hidden group hover:border-gold-400 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                            <TrendingUp size={120} />
                        </div>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <h3 className="text-xl text-gold-200 uppercase tracking-widest font-semibold mb-1">Standard 22K Gold</h3>
                                <p className="text-gold-200/50 text-sm mb-6">Ideal for Traditional Jewellery</p>
                            </div>
                            <div>
                                <div className="text-5xl font-serif text-gold-300 mb-2">
                                    ₹{Math.round(goldRate.rate22k).toLocaleString('en-IN')}
                                </div>
                                <p className="text-gold-50/50 text-sm">Per 1 Gram / INR</p>
                            </div>
                        </div>
                    </div>

                    {/* 24K Gold Banner */}
                    <div className="glass-panel p-8 rounded-2xl border border-gold-500/30 shadow-[0_0_20px_rgba(223,153,57,0.1)] relative overflow-hidden group hover:border-gold-400 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                            <TrendingUp size={120} />
                        </div>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <h3 className="text-xl text-gold-200 uppercase tracking-widest font-semibold mb-1">Pure 24K Gold</h3>
                                <p className="text-gold-200/50 text-sm mb-6">Ideal for Investment & Coins</p>
                            </div>
                            <div>
                                <div className="text-5xl font-serif text-gold-300 mb-2">
                                    ₹{Math.round(goldRate.rate24k).toLocaleString('en-IN')}
                                </div>
                                <p className="text-gold-50/50 text-sm">Per 1 Gram / INR</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl">
                    Unable to load current gold rates. Please try again later.
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-luxury-800/50 p-6 rounded-xl border border-gold-500/10 flex items-start gap-4">
                    <Clock className="text-gold-500 flex-shrink-0" size={24} />
                    <div>
                        <h4 className="text-gold-100 font-semibold mb-2">Real-Time Updates</h4>
                        <p className="text-sm text-gold-200/70 leading-relaxed font-light">Our prices reflect live international market rates, ensuring you always get fair and transparent pricing on every purchase.</p>
                    </div>
                </div>
                <div className="bg-luxury-800/50 p-6 rounded-xl border border-gold-500/10 flex items-start gap-4">
                    <Shield className="text-gold-500 flex-shrink-0" size={24} />
                    <div>
                        <h4 className="text-gold-100 font-semibold mb-2">BIS Hallmarked</h4>
                        <p className="text-sm text-gold-200/70 leading-relaxed font-light">All our 22K gold jewellery is 100% BIS Hallmarked, guaranteeing purity and authenticity.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GoldRate;
