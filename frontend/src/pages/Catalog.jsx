import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Filter, Search } from 'lucide-react';

const Catalog = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [goldRate, setGoldRate] = useState(null);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const categoryParam = queryParams.get('category') || '';

    const [category, setCategory] = useState(categoryParam);
    const [keyword, setKeyword] = useState('');
    const [purity, setPurity] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let url = `/api/products?keyword=${keyword}&category=${category}&purity=${purity}`;
                const { data } = await axios.get(url);
                setProducts(data.products);

                try {
                    const { data: currentRate } = await axios.get('/api/goldrate');
                    setGoldRate(currentRate);
                } catch (rateErr) {
                    console.log('Could not fetch gold rate for catalog', rateErr);
                }

                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchProducts();
    }, [keyword, category, purity]);

    return (
        <div className="py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-serif text-gold-300">Our Collection</h1>
                <p className="text-gold-200/60 mt-4 max-w-2xl mx-auto">Explore our masterfully crafted jewellery piece by piece.</p>
            </div>

            {/* Filters Bar */}
            <div className="glass-panel p-4 rounded-lg mb-10 flex flex-col md:flex-row gap-6 items-center justify-between border-gold-500/20">
                <div className="flex-1 w-full relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-500/50" size={20} />
                    <input
                        type="text"
                        placeholder="Search exquisite designs..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-luxury-900 border border-gold-500/30 rounded-md focus:outline-none focus:ring-1 focus:ring-gold-500 text-gold-50 placeholder-gold-200/30"
                    />
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="flex-1 bg-luxury-900 border border-gold-500/30 text-gold-200 px-4 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-gold-500"
                    >
                        <option value="">All Categories</option>
                        <option value="Rings">Rings</option>
                        <option value="Necklaces">Necklaces</option>
                        <option value="Bangles">Bangles</option>
                        <option value="Earrings">Earrings</option>
                    </select>

                    <select
                        value={purity}
                        onChange={(e) => setPurity(e.target.value)}
                        className="flex-1 bg-luxury-900 border border-gold-500/30 text-gold-200 px-4 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-gold-500"
                    >
                        <option value="">All Purity</option>
                        <option value="22K">22K Gold</option>
                        <option value="24K">24K Gold</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center text-gold-400 py-20 flex justify-center items-center gap-3">
                    <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
                    Loading collection...
                </div>
            ) : error ? (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-md text-center">{error}</div>
            ) : products.length === 0 ? (
                <div className="text-center text-gold-200/60 py-20 bg-luxury-800 rounded-xl border border-gold-500/10">
                    No masterpieces found matching your exact criteria.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} goldRate={goldRate} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Catalog;
