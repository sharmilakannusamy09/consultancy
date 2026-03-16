import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, goldRate }) => {
    return (
        <div className="glass-panel group rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_rgba(223,153,57,0.3)]">
            <Link to={`/product/${product._id}`}>
                <div className="relative aspect-square overflow-hidden bg-white/5">
                    {/* Placeholder for actual image: Using absolute URL or generic if not found */}
                    <img
                        src={product.image || `https://source.unsplash.com/random/400x400/?jewellery,${product.category}`}
                        alt={product.name}
                        onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1599643478514-4a884f18db0d?auto=format&fit=crop&q=80&w=400";
                        }}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-luxury-900/80 backdrop-blur-sm text-gold-300 text-xs font-bold px-3 py-1 rounded-full border border-gold-500/30">
                        {product.purity}
                    </div>
                </div>
            </Link>
            <div className="p-6">
                <div className="text-xs text-gold-200/60 uppercase tracking-widest mb-2 flex justify-between">
                    <span>{product.category}</span>
                    <span>{product.weight}g</span>
                </div>
                <Link to={`/product/${product._id}`}>
                    <h3 className="text-xl font-serif text-gold-100 mb-2 truncate group-hover:text-gold-400 transition-colors">
                        {product.name}
                    </h3>
                </Link>
                <div className="flex items-center justify-between mt-4 border-t border-gold-500/10 pt-4">
                    {goldRate ? (
                        <span className="text-lg font-serif text-gold-300">
                            ₹{Math.round((product.purity === '24K' ? goldRate.rate24k : goldRate.rate22k) * product.weight + product.makingCharges).toLocaleString('en-IN')}
                        </span>
                    ) : (
                        <span className="text-sm text-gold-200/50">View details for price</span>
                    )}
                    <Link to={`/product/${product._id}`} className="text-gold-400 text-sm font-semibold hover:text-gold-200 transition-colors flex items-center">
                        Explore &rarr;
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
