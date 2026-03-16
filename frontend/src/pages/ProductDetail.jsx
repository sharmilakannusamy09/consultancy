import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Star, ShieldCheck, BadgeDollarSign, PlayCircle, Image as ImageIcon } from 'lucide-react';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState({});
    const [goldRate, setGoldRate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('2d'); // '2d' or '360'

    useEffect(() => {
        const fetchProductAndRate = async () => {
            try {
                const { data: productData } = await axios.get(`/api/products/${id}`);
                setProduct(productData);

                // Fetch daily gold rate to calculate dynamic price
                const { data: rateData } = await axios.get('/api/goldrate');
                setGoldRate(rateData);

                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchProductAndRate();
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product, 1);
        navigate('/cart');
    };

    let calculatedPrice = 0;
    if (product.weight && goldRate) {
        const ratePerGram = product.purity === '24K' ? goldRate.rate24k : goldRate.rate22k;
        calculatedPrice = (product.weight * ratePerGram) + product.makingCharges;
    }

    if (loading) return (
        <div className="flex justify-center items-center h-screen space-x-3 text-gold-400">
            <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xl font-serif">Revealing masterpiece...</span>
        </div>
    );

    if (error) return <div className="text-center text-red-500 mt-20">{error}</div>;

    return (
        <div className="py-12">
            <button onClick={() => navigate(-1)} className="text-gold-400 hover:text-gold-200 mb-8 font-semibold flex items-center transition-colors">
                &larr; Back to Collection
            </button>

            <div className="glass-panel rounded-2xl overflow-hidden p-6 md:p-12 border-gold-500/20 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">

                    {/* Image Section */}
                    <div className="relative group rounded-xl overflow-hidden bg-luxury-900 border border-gold-500/20 shadow-xl flex flex-col h-[500px] md:h-[600px]">
                        
                        {/* View Mode Toggle Controls */}
                        <div className="absolute top-4 right-4 z-20 flex gap-2 bg-luxury-900/80 backdrop-blur-md p-1 rounded-full border border-gold-500/30 shadow-lg">
                            <button 
                                onClick={() => setViewMode('2d')}
                                className={`p-2 rounded-full transition-colors flex items-center justify-center ${viewMode === '2d' ? 'bg-gold-500 text-luxury-900' : 'text-gold-300 hover:bg-luxury-700'}`}
                                title="Standard View"
                            >
                                <ImageIcon size={18} />
                            </button>
                            <button 
                                onClick={() => setViewMode('360')}
                                className={`p-2 rounded-full transition-colors flex items-center justify-center ${viewMode === '360' ? 'bg-gold-500 text-luxury-900' : 'text-gold-300 hover:bg-luxury-700'}`}
                                title="360° View"
                            >
                                <PlayCircle size={18} />
                            </button>
                        </div>

                        {/* Purity Badge */}
                        <div className="absolute top-4 left-4 z-20 bg-luxury-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-gold-500/30 text-gold-300 font-bold text-sm flex items-center shadow-lg pointer-events-none">
                            <Star size={16} className="mr-2 text-gold-500" fill="currentColor" />
                            {product.purity} Pure
                        </div>

                        {/* Image Viewer Area */}
                        <div className="relative w-full h-full flex items-center justify-center bg-black">
                            {viewMode === '2d' ? (
                                <img
                                    src={product.image || `https://source.unsplash.com/random/800x800/?jewellery,${product.category}`}
                                    alt={product.name}
                                    onError={(e) => {
                                        e.target.src = "https://images.unsplash.com/photo-1599643478514-4a884f18db0d?auto=format&fit=crop&q=80&w=800";
                                    }}
                                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" // changed to object-contain so it doesn't get cut off
                                />
                            ) : (
                                <div className="w-full h-full relative">
                                    <model-viewer
                                        src={`/api/products/proxy-glb?url=${encodeURIComponent(product.view360 || 'https://triverse-public.triverse.ai/tasks/2026/03/15/a271e80b-e858-44de-84b3-c784f69529de_texture/output_mesh_0.glb')}`}
                                        alt={product.name}
                                        camera-controls
                                        auto-rotate
                                        shadow-intensity="1"
                                        environment-image="neutral"
                                        style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
                                    >
                                    </model-viewer>
                                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm border border-gold-500/30 text-gold-200 px-4 py-1.5 rounded-full text-xs font-light tracking-widest uppercase pointer-events-none text-center">
                                        Drag to Interact
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="flex flex-col justify-center">
                        <div className="text-gold-500 tracking-widest uppercase text-sm mb-2 font-semibold">{product.category}</div>
                        <h1 className="text-4xl lg:text-5xl font-serif text-gold-50 mb-6 drop-shadow-md">{product.name}</h1>

                        <p className="text-gold-100/70 text-lg mb-8 leading-relaxed font-light">
                            {product.description}
                        </p>

                        <div className="bg-luxury-800/50 p-6 rounded-xl border border-gold-500/10 mb-8 divide-y divide-gold-500/10">
                            <div className="flex justify-between py-3">
                                <span className="text-gold-200/60">Gross Weight</span>
                                <span className="text-gold-100 font-semibold">{product.weight} g</span>
                            </div>
                            <div className="flex justify-between py-3">
                                <span className="text-gold-200/60">Purity</span>
                                <span className="text-gold-100 font-semibold">{product.purity}</span>
                            </div>
                            <div className="flex justify-between py-3">
                                <span className="text-gold-200/60 flex items-center"><BadgeDollarSign size={16} className="mr-2" /> Making Charges</span>
                                <span className="text-gold-100 font-semibold">₹{product.makingCharges.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between py-4 mt-2 bg-gradient-to-r from-gold-500/10 to-transparent -mx-6 px-6 relative">
                                <span className="text-gold-300 font-bold text-xl">Current Value</span>
                                <span className="text-3xl font-serif text-gold-400 font-bold">
                                    ₹{calculatedPrice ? calculatedPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : 'Calculating...'}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className={`flex-1 py-4 rounded-md font-bold text-lg flex justify-center items-center transition-all ${product.stock > 0
                                    ? 'btn-gold'
                                    : 'bg-gray-600 text-gray-400 cursor-not-allowed border border-gray-500'
                                    }`}
                            >
                                <ShoppingBag className="mr-2" />
                                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                        </div>

                        <div className="mt-8 flex items-center text-sm text-gold-200/60 border-t border-gold-500/20 pt-6">
                            <ShieldCheck size={20} className="text-gold-500 mr-2" />
                            100% Certified Original. Insured Shipping globally.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
