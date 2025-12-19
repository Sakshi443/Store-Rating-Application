
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Shield, Store, LayoutGrid, User, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import config from '../config';

interface GuestStore {
    id: number;
    name: string;
    address: string;
    rating: number;
    ratingCount: number;
}

const LandingPage = () => {
    const [stores, setStores] = useState<GuestStore[]>([]);

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const res = await fetch(`${config.API_URL}/guest/stores`);
                if (res.ok) {
                    const data = await res.json();
                    setStores(data.slice(0, 3)); // Show top 3 for the big cards
                }
            } catch (error) {
                console.error("Failed to fetch stores", error);
            }
        };
        fetchStores();
    }, []);

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-[#FFDA1A] selection:text-black">
            {/* Navbar - Sticky & Minimal */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="h-8 w-8 bg-[#0058A3] rounded-full flex items-center justify-center">
                            <span className="text-[#FFDA1A] font-bold text-lg">S</span>
                        </div>
                        <span className="text-xl font-extrabold tracking-tight">StoreRate.</span>
                    </Link>

                    <div className="flex items-center gap-4 md:gap-8">
                        <Link to="/login" className="hidden md:block text-sm font-bold hover:text-gray-600 transition-colors">
                            Log in
                        </Link>
                        <Link to="/signup" className="hidden md:block text-sm font-bold hover:text-gray-600 transition-colors">
                            Sign up
                        </Link>
                        <Link to="/stores">
                            <button className="bg-black hover:bg-gray-800 text-white text-sm font-bold px-6 py-3 rounded-full transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                                Browse stores <span className="bg-[#FFDA1A] text-black rounded-full p-0.5"><ArrowRight size={12} strokeWidth={3} /></span>
                            </button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section - Refined & Attractive */}
            <section className="pt-28 pb-12 px-6 lg:pt-36 lg:pb-24 bg-[#F5F5F5] overflow-hidden">
                <div className="container mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center"
                    >
                        <div className="space-y-8 z-10">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-[#111]">
                                Rate Real. <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0058A3] to-[#004080]">Shop Better.</span>
                            </h1>
                            <p className="text-lg md:text-xl font-medium text-gray-600 max-w-lg leading-relaxed">
                                The transparent platform connecting shoppers with the best local businesses. trusted by thousands of verified users.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link to="/stores">
                                    <button className="bg-[#FFDA1A] text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-[#e6c417] transition-all hover:-translate-y-1 shadow-lg shadow-[#FFDA1A]/20 flex items-center gap-2">
                                        Explore Stores <ArrowRight size={18} strokeWidth={2.5} />
                                    </button>
                                </Link>
                                <Link to="/signup">
                                    <button className="px-8 py-4 rounded-full font-bold text-lg bg-white border border-gray-200 hover:border-black hover:shadow-md transition-all text-gray-900">
                                        Join Free
                                    </button>
                                </Link>
                            </div>

                            {/* Trust Badge */}
                            <div className="flex items-center gap-4 pt-4">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-10 w-10 rounded-full border-2 border-[#F5F5F5] bg-gray-300" />
                                    ))}
                                    <div className="h-10 w-10 rounded-full border-2 border-[#F5F5F5] bg-black text-white flex items-center justify-center text-xs font-bold">2k+</div>
                                </div>
                                <div className="text-sm font-semibold text-gray-500">
                                    Joined the community
                                </div>
                            </div>
                        </div>

                        {/* Hero Graphic - Modern composition */}
                        <div className="relative">
                            <div className="relative h-[400px] lg:h-[500px] w-full bg-white rounded-3xl overflow-hidden shadow-2xl shadow-gray-200/50 flex items-center justify-center group hover:scale-[1.02] transition-transform duration-500">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <LayoutGrid size={200} />
                                </div>
                                <Star size={180} className="text-[#FFDA1A] rotate-12 drop-shadow-2xl" strokeWidth={0} fill="#FFDA1A" />
                                <motion.div
                                    animate={{ y: [0, -20, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute bottom-12 left-8 bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4 max-w-xs"
                                >
                                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                        <Shield size={24} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">100% Verified</div>
                                        <div className="text-xs text-gray-500">Authentic reviews only</div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section - Compact & Clean */}
            <section className="py-20 px-6">
                <div className="container mx-auto space-y-24">
                    {/* Feature 1 */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1 relative">
                            <div className="bg-[#FFDA1A]/10 rounded-3xl p-8 lg:p-12 relative overflow-hidden group">
                                <Star className="w-32 h-32 text-[#FFDA1A] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 group-hover:scale-110 transition-transform duration-500" />
                                <div className="relative z-10 bg-white rounded-2xl p-6 shadow-xl border border-gray-100 space-y-4 max-w-sm mx-auto transform group-hover:-translate-y-2 transition-transform duration-300">
                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} className="fill-[#FFDA1A] text-[#FFDA1A]" />)}
                                        </div>
                                        <span className="text-xs font-bold text-gray-400">Just now</span>
                                    </div>
                                    <p className="text-gray-600 text-sm font-medium leading-relaxed">
                                        "Found the best vintage store in downtown! The reviews were spot on. Highly recommended."
                                    </p>
                                    <div className="flex items-center gap-3 pt-2">
                                        <div className="h-8 w-8 bg-gray-200 rounded-full" />
                                        <div className="text-sm font-bold">Sarah Jenkins</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2 space-y-6">
                            <div className="inline-flex items-center gap-2 bg-black/5 text-black px-4 py-1.5 rounded-full text-sm font-bold">
                                <User size={14} /> For Shoppers
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#111]">Your voice matters.</h2>
                            <p className="text-lg text-gray-500 leading-relaxed">
                                Share your experiences with 1-5 star ratings. Help your neighbors find the best spots and avoid the rest.
                            </p>
                            <ul className="space-y-3 pt-2">
                                {['Verified Reviews', 'Transparent History', 'Community Trust'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 font-medium text-gray-700">
                                        <div className="h-1.5 w-1.5 bg-[#0058A3] rounded-full" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 bg-[#0058A3]/10 text-[#0058A3] px-4 py-1.5 rounded-full text-sm font-bold">
                                <TrendingUp size={14} /> For Owners
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#111]">Grow with feedback.</h2>
                            <p className="text-lg text-gray-500 leading-relaxed">
                                Claim your business page, respond to customers, and use real-time analytics to improve your service.
                            </p>
                            <div className="pt-4">
                                <Link to="/signup" className="inline-flex items-center font-bold text-[#0058A3] hover:underline decoration-2 underline-offset-4 gap-2 group">
                                    Register your business <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                        <div className="bg-[#F5F5F5] rounded-3xl p-8 lg:p-12 relative group overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#F5F5F5] to-gray-200" />
                            <div className="relative z-10 grid grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 transform translate-y-8 group-hover:translate-y-6 transition-transform duration-500">
                                    <div className="text-3xl font-black text-[#111] mb-1">4.8</div>
                                    <div className="text-xs text-gray-500 font-medium">Average Rating</div>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 transform group-hover:-translate-y-2 transition-transform duration-500 delay-100">
                                    <div className="text-3xl font-black text-[#0058A3] mb-1">+24%</div>
                                    <div className="text-xs text-gray-500 font-medium">Customer Visits</div>
                                </div>
                                <div className="col-span-2 bg-[#111] p-4 rounded-xl shadow-lg transform group-hover:scale-[1.02] transition-transform duration-500 delay-200">
                                    <div className="flex justify-between items-center text-white mb-2">
                                        <span className="text-xs font-bold text-gray-400">Total Reviews</span>
                                        <Star size={14} className="fill-[#FFDA1A] text-[#FFDA1A]" />
                                    </div>
                                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full w-[80%] bg-[#FFDA1A] rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Stores Grid - Attractive Dark Mode */}
            <section className="py-20 px-6 bg-[#111] overflow-hidden">
                <div className="container mx-auto">
                    <div className="flex flex-wrap justify-between items-end mb-12 gap-8">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">Fresh <span className="text-[#FFDA1A]">Finds.</span></h2>
                            <p className="text-gray-400 text-lg">Top rated spots this week.</p>
                        </div>
                        <Link to="/stores">
                            <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-full font-bold transition-all text-sm backdrop-blur-sm">
                                View all stores
                            </button>
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stores.length > 0 ? stores.map((store, i) => (
                            <motion.div
                                key={store.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-[#1A1A1A] hover:bg-[#222] border border-white/5 p-6 rounded-2xl group cursor-pointer transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#FFDA1A]/5"
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <div className="h-12 w-12 bg-[#0058A3] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#0058A3]/20 group-hover:scale-110 transition-transform">
                                        <Store className="h-6 w-6" />
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-[#FFDA1A] text-black px-3 py-1 rounded-full text-sm font-bold shadow-lg shadow-[#FFDA1A]/10">
                                        <Star className="h-3.5 w-3.5 fill-black" strokeWidth={0} />
                                        {store.rating}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#FFDA1A] transition-colors line-clamp-1">{store.name}</h3>
                                <p className="text-gray-400 text-sm mb-6 line-clamp-2 h-10">{store.address}</p>
                                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                    <span className="text-xs font-medium text-gray-500">{store.ratingCount} reviews</span>
                                    <Link to="/login" className="text-sm font-bold text-white group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                        Rate <ArrowRight className="h-3 w-3" />
                                    </Link>
                                </div>
                            </motion.div>
                        )) : (
                            // Loading/Empty State placeholders
                            [1, 2, 3].map((_, i) => (
                                <div key={i} className="bg-[#1A1A1A] h-64 rounded-2xl animate-pulse border border-white/5" />
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Footer Pre-Section - Yellow Punch */}
            <section className="py-24 px-6 bg-[#FFDA1A] text-black relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="container mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-none">
                                START <br /> RATING.
                            </h2>
                            <p className="text-xl font-medium max-w-md">
                                Join 50,000+ users making their communities better, one review at a time.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
                            <Link to="/signup" className="w-full sm:w-auto">
                                <button className="w-full sm:w-auto bg-black text-white px-8 py-5 rounded-full font-bold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-2xl shadow-black/10">
                                    Create Free Account <ArrowRight size={20} />
                                </button>
                            </Link>
                            <Link to="/stores" className="w-full sm:w-auto">
                                <button className="w-full sm:w-auto bg-white/40 backdrop-blur-md border border-black/10 text-black px-8 py-5 rounded-full font-bold text-lg hover:bg-white/60 transition-colors">
                                    View Directory
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer - Clean & Simple */}
            <footer className="py-12 bg-white text-gray-500 text-sm border-t border-gray-100">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 bg-black text-[#FFDA1A] rounded-full flex items-center justify-center font-bold text-xs">S</div>
                        <span className="font-bold text-black">StoreRate.</span>
                    </div>
                    <div className="flex gap-8 font-medium">
                        <a href="#" className="hover:text-black transition-colors">Privacy</a>
                        <a href="#" className="hover:text-black transition-colors">Terms</a>
                        <a href="#" className="hover:text-black transition-colors">Twitter</a>
                    </div>
                    <p>© 2024 Roxiler Systems.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
