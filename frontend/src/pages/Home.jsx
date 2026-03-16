import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { PanoViewer } from "@egjs/react-view360";
import { X, PlayCircle } from 'lucide-react';

const Home = () => {
    const [goldRate, setGoldRate] = useState(null);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    
    // 360 View State
    const [is360ModalOpen, setIs360ModalOpen] = useState(false);
    const [current360Image, setCurrent360Image] = useState(null);
    const [current360Title, setCurrent360Title] = useState("");

    const open360View = (e, img, title) => {
        e.preventDefault(); // Prevent navigating the link
        setCurrent360Image(img);
        setCurrent360Title(title);
        setIs360ModalOpen(true);
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    };

    const close360View = () => {
        setIs360ModalOpen(false);
        setCurrent360Image(null);
        document.body.style.overflow = 'auto';
    };

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const { data: rateData } = await axios.get('/api/goldrate');
                setGoldRate(rateData);

                const { data: productsData } = await axios.get('/api/products?pageNumber=1');
                setFeaturedProducts(productsData.products.slice(0, 8)); // Get first 8
            } catch (error) {
                console.error("Error fetching home data", error);
            }
        };
        fetchHomeData();
    }, []);

    return (
        <div className="space-y-24">
            {/* Hero Section */}
            <section className="relative h-[70vh] rounded-3xl overflow-hidden shadow-2xl group flex items-center justify-center border border-gold-500/20">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1515562141207-7a8efbf34707?auto=format&fit=crop&q=80&w=1920"
                        className="w-full h-full object-cover opacity-60 mix-blend-overlay transition-transform duration-[20s] group-hover:scale-110"
                        alt="Luxury Jewellery Focus"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-luxury-900 via-luxury-900/60 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-luxury-900/80 via-transparent to-luxury-900/80"></div>
                </div>

                <div className="relative z-10 text-center max-w-5xl px-4 flex flex-col items-center justify-center h-full pt-16">
                    <h2 className="text-gold-400 tracking-[0.4em] text-xs md:text-sm uppercase mb-4 opacity-90 animate-fade-in font-semibold">Welcome To</h2>
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-400 to-gold-600 mb-6 drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] tracking-tight">
                        SHRI GANESH <br className="hidden md:block"/> JEWELLS
                    </h1>
                    <p className="text-xl md:text-2xl text-gold-100/90 mb-10 max-w-3xl mx-auto font-light tracking-wide shadow-black drop-shadow-lg">
                        Timeless Brilliance, Crafted for You.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/catalog" className="btn-gold px-8 py-4 text-base tracking-wider uppercase">
                            Explore Collection
                        </Link>
                        <Link to="/book-appointment" className="btn-outline-gold px-8 py-4 text-base tracking-wider uppercase bg-luxury-900/50 backdrop-blur-md">
                            Book a Showroom Visit
                        </Link>
                    </div>
                </div>
            </section>

            {/* Live Gold Rate Banner */}
            {goldRate && (
                <section className="bg-luxury-900 border border-gold-500/20 rounded-2xl p-8 shadow-[0_0_15px_rgba(223,153,57,0.15)] flex flex-col md:flex-row items-center justify-around gap-6">
                    <div className="text-center">
                        <h3 className="text-gold-200 uppercase tracking-widest text-sm font-semibold mb-2">Live Gold Rate</h3>
                        <p className="text-gold-50/50 text-xs">Per 1 Gram / INR</p>
                    </div>
                    <div className="w-px h-16 bg-gold-500/20 hidden md:block"></div>
                    <div className="text-center">
                        <span className="text-3xl font-serif text-gold-300">₹{Math.round(goldRate.rate22k).toLocaleString('en-IN')}</span>
                        <p className="text-gold-400 mt-1 uppercase tracking-widest text-xs">22K Gold</p>
                    </div>
                    <div className="w-px h-16 bg-gold-500/20 hidden md:block"></div>
                    <div className="text-center">
                        <span className="text-3xl font-serif text-gold-300">₹{Math.round(goldRate.rate24k).toLocaleString('en-IN')}</span>
                        <p className="text-gold-400 mt-1 uppercase tracking-widest text-xs">24K Gold</p>
                    </div>
                </section>
            )}

            {/* Exclusive Offers Section */}
            <section className="py-6">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gold-500/30 group bg-luxury-900 flex flex-col md:flex-row items-stretch min-h-[400px]">
                    <div className="md:w-1/2 relative overflow-hidden">
                        <img 
                            src="https://mir-s3-cdn-cf.behance.net/projects/404/6163f8198971475.Y3JvcCwxMzQyLDEwNTAsMjksMA.jpg" 
                            alt="Exclusive Festive Offers" 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-luxury-900/40 to-luxury-900 md:opacity-100 opacity-60"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-luxury-900 via-transparent to-transparent md:hidden block"></div>
                    </div>
                    <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center items-start relative z-10 bg-luxury-900/80 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none -mt-10 md:mt-0 rounded-t-3xl md:rounded-t-none">
                        <h3 className="text-gold-400 uppercase tracking-widest text-sm font-semibold mb-3 flex items-center gap-2">
                            <span className="w-8 h-px bg-gold-400"></span> Special Promotion
                        </h3>
                        <h2 className="text-4xl md:text-5xl font-serif text-gold-100 mb-6 leading-tight">
                            The Grand <br className="hidden md:block"/><span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-600">Festive Sale</span>
                        </h2>
                        <p className="text-gold-100/80 mb-8 max-w-md font-light leading-relaxed">
                            Discover unparalleled craftsmanship with exclusive offers on our new arrival collections. Enjoy 0% deduction on old gold exchange and special making charges.
                        </p>
                        <Link to="/catalog" className="btn-gold px-8 py-3 text-sm tracking-widest uppercase flex items-center gap-2 group/btn">
                            Claim Offer <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Interactive Catalog Section */}
            <section className="py-12">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-serif text-gold-300">Interactive Catalog</h2>
                    <p className="text-gold-200/70 mt-4 max-w-2xl mx-auto font-light">Immerse yourself in our meticulously crafted collections.</p>
                    <div className="w-24 h-px bg-gold-500/40 mx-auto mt-6"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                    <div className="md:col-span-2 relative rounded-3xl overflow-hidden group border border-gold-500/20 shadow-2xl">
                        <img src="https://images.unsplash.com/photo-1599643477874-32d2f78da776?q=80&w=2000" alt="Bridal Collection" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-luxury-900 via-luxury-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
                        <div className="absolute inset-0 p-8 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <h3 className="text-3xl font-serif text-gold-100 mb-2">The Bridal Suite</h3>
                            <p className="text-gold-50/70 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">Exquisite masterpieces for your momentous day.</p>
                            <Link to="/catalog?category=Bridal" className="text-gold-400 uppercase tracking-widest text-sm font-semibold flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200 hover:text-gold-300">
                                View Collection <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </div>
                    </div>
                    
                    <div className="relative rounded-3xl overflow-hidden group border border-gold-500/20 shadow-xl">
                        <img src="https://images.unsplash.com/photo-1629224316810-9d8805b95e76?q=80&w=1000" alt="Minimalist Elegance" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-luxury-900 via-luxury-900/30 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-500"></div>
                        <div className="absolute inset-0 p-8 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <h3 className="text-2xl font-serif text-gold-100 mb-2">Daily Elegance</h3>
                            <Link to="/catalog?category=Everyday" className="text-gold-400 uppercase tracking-widest text-sm font-semibold flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 hover:text-gold-300">
                                View Collection <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </div>
                    </div>
                    
                    <div className="relative rounded-3xl overflow-hidden group border border-gold-500/20 shadow-xl">
                        <img src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000" alt="Men's Collection" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-luxury-900 via-luxury-900/30 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-500"></div>
                        <div className="absolute inset-0 p-8 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <h3 className="text-2xl font-serif text-gold-100 mb-2">Gentlemen's Edit</h3>
                             <Link to="/catalog?category=Mens" className="text-gold-400 uppercase tracking-widest text-sm font-semibold flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 hover:text-gold-300">
                                View Collection <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </div>
                    </div>

                    <div className="md:col-span-2 relative rounded-3xl overflow-hidden group border border-gold-500/20 shadow-2xl">
                        <img src="https://images.unsplash.com/photo-1573408301145-b98c3e1e2d27?q=80&w=2000" alt="High Jewellery" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-luxury-900 via-luxury-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
                        <div className="absolute inset-0 p-8 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <h3 className="text-3xl font-serif text-gold-100 mb-2">High Jewellery</h3>
                             <p className="text-gold-50/70 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">Rare gems and extraordinary craftsmanship.</p>
                            <Link to="/catalog?category=HighJewellery" className="text-gold-400 uppercase tracking-widest text-sm font-semibold flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200 hover:text-gold-300">
                                View Collection <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Explore Collections */}
            <section className="py-12">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif text-gold-300">Explore Collections</h2>
                    <div className="w-24 h-px bg-gold-500/40 mx-auto mt-6"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { title: 'Exquisite Rings', img: 'https://images.unsplash.com/photo-1605100804763-247f673f224e?q=80&w=1000', link: '/catalog?category=Rings', view360: 'https://raw.githubusercontent.com/naver/egjs-view360/master/demo/assets/equi.jpg' }, 
                        { title: 'Statement Necklaces', img: 'https://images.unsplash.com/photo-1599643478524-fb66f7f1bc8f?q=80&w=1000', link: '/catalog?category=Necklaces', view360: 'https://raw.githubusercontent.com/naver/egjs-view360/master/demo/assets/equi.jpg' },
                        { title: 'Elegant Bangles', img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000', link: '/catalog?category=Bangles', view360: 'https://raw.githubusercontent.com/naver/egjs-view360/master/demo/assets/equi.jpg' },
                        { title: 'Radiant Earrings', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000', link: '/catalog?category=Earrings', view360: 'https://raw.githubusercontent.com/naver/egjs-view360/master/demo/assets/equi.jpg' }
                    ].map((cat, idx) => (
                        <div key={idx} className="relative h-96 rounded-2xl overflow-hidden border border-gold-500/20 group">
                            <Link to={cat.link} className="block w-full h-full">
                                <img src={cat.img} alt={cat.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-luxury-900 via-luxury-900/20 to-transparent"></div>
                            </Link>
                            
                            {/* Overlay Controls */}
                            <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col items-start justify-end pointer-events-none">
                                <h3 className="text-2xl font-serif text-gold-100 group-hover:text-gold-400 transition-colors drop-shadow-md z-10 pointer-events-auto">
                                    <Link to={cat.link}>{cat.title}</Link>
                                </h3>
                                <div className="h-px bg-gold-500/0 group-hover:bg-gold-500/50 w-0 group-hover:w-full transition-all duration-500 mt-4 mb-4 z-10"></div>
                                
                                <button 
                                    onClick={(e) => open360View(e, cat.view360, cat.title)}
                                    className="pointer-events-auto flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-gold-200 bg-luxury-900/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gold-500/30 hover:bg-gold-500 hover:text-luxury-900 transition-all opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 duration-300"
                                >
                                    <PlayCircle size={16} />
                                    360° View
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            {featuredProducts.length > 0 && (
                <section className="py-12">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-serif text-gold-300">Featured Masterpieces</h2>
                        <div className="w-24 h-px bg-gold-500/40 mx-auto mt-6"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product._id} product={product} goldRate={goldRate} />
                        ))}
                    </div>
                </section>
            )}

            {/* Testimonials */}
            <section className="py-12 bg-luxury-900/50 border-y border-gold-500/10 -mx-4 px-4 sm:-mx-8 sm:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif text-gold-300">Client Testimonials</h2>
                    <div className="w-24 h-px bg-gold-500/40 mx-auto mt-6"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {[
                        { name: "Priya Sharma", text: "The craftsmanship of my bridal set was beyond my imagination. Truly exquisite." },
                        { name: "Ananya Desai", text: "Exceptional service and transparent pricing. I loved their detailed catalogue." },
                        { name: "Rashi Kapoor", text: "Booked a showroom visit and was blown away by the personalized luxury experience." }
                    ].map((review, i) => (
                        <div key={i} className="glass-panel p-8 text-center rounded-2xl border border-gold-500/20">
                            <div className="text-gold-500 text-4xl mb-4">"</div>
                            <p className="text-gold-100/80 italic mb-6">"{review.text}"</p>
                            <h4 className="text-gold-300 uppercase tracking-widest text-sm font-semibold">- {review.name}</h4>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact Preview Section */}
            <section className="py-12 text-center max-w-4xl mx-auto">
                <h2 className="text-3xl font-serif text-gold-300 mb-6">Need Assistance?</h2>
                <p className="text-gold-200/70 mb-8 max-w-2xl mx-auto">Our master jewelers and advisors are here to help you select the perfect piece to celebrate life's most precious moments.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                    <Link to="/contact" className="btn-gold px-8 py-3">Contact Us</Link>
                    <p className="text-gold-400 mt-3 sm:mt-0 px-8 py-3 bg-luxury-800 rounded-md border border-gold-500/20 shadow-md">Toll Free: 1800-456-7890</p>
                </div>
            </section>

            {/* 360 View Modal */}
            {is360ModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
                    <div className="relative w-full max-w-5xl bg-luxury-900 border border-gold-500/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[80vh]">
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 border-b border-gold-500/20 bg-luxury-800/50">
                            <h3 className="text-xl font-serif text-gold-300 flex items-center gap-2">
                                <PlayCircle size={20} className="text-gold-500" />
                                360° Interactive View: {current360Title}
                            </h3>
                            <button 
                                onClick={close360View}
                                className="text-gold-200/50 hover:text-gold-400 transition-colors p-1"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        {/* Viewer Body */}
                        <div className="relative flex-grow w-full bg-black/50">
                            <PanoViewer
                                className="w-full h-full"
                                style={{ width: '100%', height: '100%', display: 'block' }}
                                image={current360Image}
                                imageType="equirectangular"
                            />
                            
                            {/* Instructions Overlay */}
                            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm border border-gold-500/30 text-gold-200 px-6 py-2 rounded-full text-sm font-light tracking-widest uppercase pointer-events-none text-center">
                                Drag to Rotate
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
