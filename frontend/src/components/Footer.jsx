import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-luxury-900 border-t border-gold-500/20 text-gold-200 mt-20">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <span className="font-serif text-2xl font-bold bg-gradient-to-r from-gold-300 to-gold-600 bg-clip-text text-transparent">
                            SHRI GANESH JEWELLS
                        </span>
                        <p className="mt-4 text-sm max-w-md">
                            Experience the epitome of luxury and craftsmanship. We bring you handpicked exotic designs crafted with purity and love, directly from artisans worldwide.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gold-400 tracking-wider uppercase">Shop</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link to="/catalog?category=Rings" className="text-sm hover:text-gold-500 transition-colors">Rings</Link></li>
                            <li><Link to="/catalog?category=Necklaces" className="text-sm hover:text-gold-500 transition-colors">Necklaces</Link></li>
                            <li><Link to="/catalog?category=Bangles" className="text-sm hover:text-gold-500 transition-colors">Bangles</Link></li>
                            <li><Link to="/catalog?category=Earrings" className="text-sm hover:text-gold-500 transition-colors">Earrings</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gold-400 tracking-wider uppercase">Support</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link to="/contact" className="text-sm hover:text-gold-500 transition-colors">Contact Us</Link></li>
                            <li><Link to="/book-appointment" className="text-sm hover:text-gold-500 transition-colors">Book Appointment</Link></li>
                            <li><Link to="/gold-rate" className="text-sm hover:text-gold-500 transition-colors">Live Gold Rates</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-gold-500/10 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-xs text-gold-200/60">
                        &copy; {new Date().getFullYear()} SHRI GANESH JEWELLS. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0 text-xs text-gold-200/60">
                        <span>Terms of Service</span>
                        <span>Privacy Policy</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
