
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Shield, Store, Zap, Heart, TrendingUp, Info } from 'lucide-react';
import { Button } from '../components/Button';
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
                    setStores(data.slice(0, 6)); // Show top 6 newest
                }
            } catch (error) {
                console.error("Failed to fetch stores", error);
            }
        };
        fetchStores();
    }, []);

    return (
        <div className="min-h-screen w-full bg-slate-50 text-slate-900 selection:bg-rose-500/10">
            {/* Background Gradients - Light & Airy */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-200/40 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-rose-200/40 rounded-full blur-[120px]" />
                <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] bg-amber-100/40 rounded-full blur-[100px]" />
            </div>

            {/* Navbar */}
            <nav className="relative z-50 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
                            <Store className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                            StoreRate
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login">
                            <Button variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                                Sign In
                            </Button>
                        </Link>
                        <Link to="/signup">
                            <Button className="bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white border-none shadow-md shadow-rose-500/20 transition-all duration-300">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 pt-20 pb-32 overflow-hidden">
                <div className="container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl mx-auto space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-rose-600 text-sm font-medium mb-4 shadow-sm">
                            <Zap className="h-4 w-4" />
                            <span>Revolutionizing Store Discovery</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight text-slate-900">
                            Discover & Rate the <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500">
                                Best Local Stores
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                            Connect with millions of shoppers and store owners. Share your experiences, find hidden gems, and help businesses grow with transparent feedback.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                            <Link to="/signup">
                                <Button size="lg" className="h-14 px-8 text-lg bg-slate-900 text-white hover:bg-slate-800 border-0 hover:scale-105 transition-transform shadow-xl shadow-slate-900/10">
                                    Create Free Account
                                </Button>
                            </Link>
                            <Link to="/stores">
                                <Button size="lg" variant="secondary" className="h-14 px-8 text-lg bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm">
                                    Browse Stores
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Platform Overview (User Requested "Option") */}
            <section className="relative z-10 py-16 bg-white border-y border-slate-200">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                <Info className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Platform Overview</h2>
                        </div>
                        <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 prose prose-slate max-w-none">
                            <p className="text-lg text-slate-700 leading-relaxed mb-6">
                                <strong>StoreRate</strong> is a comprehensive web application designed to connect shoppers with local businesses.
                                Our platform facilitates transparent feedback through a robust 5-star rating system.
                            </p>
                            <ul className="grid md:grid-cols-2 gap-4 list-none pl-0">
                                <li className="flex gap-3 items-start p-4 bg-white rounded-xl border border-slate-200">
                                    <Star className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                                    <span className="text-slate-600">Submit ratings (1-5 stars) for registered stores.</span>
                                </li>
                                <li className="flex gap-3 items-start p-4 bg-white rounded-xl border border-slate-200">
                                    <Shield className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                                    <span className="text-slate-600">Single login system with secure role-based access control.</span>
                                </li>
                                <li className="flex gap-3 items-start p-4 bg-white rounded-xl border border-slate-200">
                                    <Heart className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                                    <span className="text-slate-600">Normal users can easily sign up and start rating.</span>
                                </li>
                                <li className="flex gap-3 items-start p-4 bg-white rounded-xl border border-slate-200">
                                    <Store className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                                    <span className="text-slate-600"><strong>Guest Access:</strong> Browsing stores and details is open to everyone. Login is required for rating.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Stores (Guest View) */}
            <section className="relative z-10 py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Featured Stores</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Browse some of our top-rated local businesses. Log in to view full details and submit your own ratings.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {stores.map((store) => (
                            <div key={store.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="h-12 w-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                        <Store className="h-6 w-6" />
                                    </div>
                                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded text-amber-700 font-bold text-sm">
                                        <Star className="h-3 w-3 fill-current" />
                                        {store.rating}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{store.name}</h3>
                                <p className="text-slate-500 text-sm mb-6 line-clamp-2">{store.address}</p>
                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <span className="text-xs text-slate-400">{store.ratingCount} reviews</span>
                                    <Link to="/login">
                                        <Button size="sm" variant="outline" className="text-xs">
                                            Login to Rate
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <Link to="/stores">
                            <Button variant="secondary">View All Stores & Start Rating</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="relative z-10 py-24 bg-white/50 border-y border-slate-200">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={Star}
                            title="Honest Ratings"
                            desc="Submit and view authentic 1-5 star ratings. Help the community make better choices."
                            color="text-amber-600"
                            bg="bg-amber-50"
                        />
                        <FeatureCard
                            icon={Shield}
                            title="Verified Owners"
                            desc="Store owners are verified to ensure legitimacy and trust within the platform."
                            color="text-rose-600"
                            bg="bg-rose-50"
                        />
                        <FeatureCard
                            icon={TrendingUp}
                            title="Real-time Analytics"
                            desc="Owners and Admins get powerful insights into store performance and user engagement."
                            color="text-indigo-600"
                            bg="bg-indigo-50"
                        />
                    </div>
                </div>
            </section>

            {/* Role Showcase */}
            <section className="relative z-10 py-32 overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-8"
                        >
                            <h2 className="text-4xl font-bold text-slate-900">Empowering Everyone</h2>
                            <div className="space-y-6">
                                <RoleItem
                                    title="For Shoppers"
                                    desc="Discover top-rated stores in your area. Read reviews and share your own experiences to help others."
                                    icon={Heart}
                                    color="bg-rose-100 text-rose-600"
                                />
                                <RoleItem
                                    title="For Store Owners"
                                    desc="Claim your business, manage your profile, and respond to customer feedback to build trust."
                                    icon={Store}
                                    color="bg-orange-100 text-orange-600"
                                />
                                <RoleItem
                                    title="For Administrators"
                                    desc="Maintain platform integrity with comprehensive tools for managing users and content."
                                    icon={Shield}
                                    color="bg-indigo-100 text-indigo-600"
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-rose-200 to-orange-200 rounded-full blur-[100px] opacity-60" />
                            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/50 aspect-square flex flex-col justify-center items-center text-center space-y-6 shadow-2xl shadow-rose-900/5">
                                <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
                                    <Star className="h-12 w-12 text-white fill-white" />
                                </div>
                                <div>
                                    <div className="text-5xl font-bold text-slate-900 mb-2">4.9/5</div>
                                    <div className="text-slate-500">Average Platform Rating</div>
                                </div>
                                <div className="flex -space-x-4 justify-center py-4">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-slate-200" />
                                    ))}
                                    <div className="h-10 w-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                                        +2k
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500">Join thousands of verified users today</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-slate-200 bg-white py-12">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 text-slate-600">
                        <div className="h-6 w-6 rounded bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center">
                            <Store className="h-3 w-3 text-white" />
                        </div>
                        <span className="font-semibold text-slate-900">StoreRate</span>
                    </div>
                    <div className="text-sm text-slate-500">
                        © 2024 Roxiler Systems. All rights reserved.
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="text-slate-500 hover:text-rose-600 transition-colors">Privacy</a>
                        <a href="#" className="text-slate-500 hover:text-rose-600 transition-colors">Terms</a>
                        <a href="#" className="text-slate-500 hover:text-rose-600 transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, desc, color, bg }: any) => (
    <div className="bg-white p-8 rounded-2xl border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
        <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-6 ${bg} ${color} group-hover:scale-110 transition-transform`}>
            <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold mb-3 text-slate-900">{title}</h3>
        <p className="text-slate-500 leading-relaxed">{desc}</p>
    </div>
);

const RoleItem = ({ title, desc, icon: Icon, color }: any) => (
    <div className="flex gap-4 group">
        <div className={`h-12 w-12 shrink-0 rounded-full flex items-center justify-center ${color} transition-colors`}>
            <Icon className="h-5 w-5" />
        </div>
        <div>
            <h4 className="text-lg font-semibold mb-2 text-slate-900">{title}</h4>
            <p className="text-slate-500">{desc}</p>
        </div>
    </div>
);

export default LandingPage;
