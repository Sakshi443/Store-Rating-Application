
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Store, Star, Search, ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import config from '../config';

interface GuestStore {
    id: number;
    name: string;
    address: string;
    rating: number;
    ratingCount: number;
}

const StoresPage = () => {
    const [stores, setStores] = useState<GuestStore[]>([]);
    const [filteredStores, setFilteredStores] = useState<GuestStore[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const res = await fetch(`${config.API_URL}/guest/stores`);
                if (res.ok) {
                    const data = await res.json();
                    setStores(data);
                    setFilteredStores(data);
                }
            } catch (error) {
                console.error("Failed to fetch stores", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStores();
    }, []);

    useEffect(() => {
        const filtered = stores.filter(store =>
            store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            store.address.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredStores(filtered);
    }, [searchTerm, stores]);

    return (
        <div className="min-h-screen w-full bg-slate-50 text-slate-900 selection:bg-rose-500/10">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-200/40 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-rose-200/40 rounded-full blur-[120px]" />
                <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] bg-amber-100/40 rounded-full blur-[100px]" />
            </div>

            {/* Navbar */}
            <nav className="relative z-50 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
                                <Store className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                                StoreRate
                            </span>
                        </Link>
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

            <main className="relative z-10 container mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div>
                        <Link to="/" className="inline-flex items-center text-sm text-slate-500 hover:text-rose-600 mb-4 transition-colors">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Home
                        </Link>
                        <h1 className="text-4xl font-bold text-slate-900">Browse Stores</h1>
                        <p className="text-slate-500 mt-2">Discover the best local businesses rated by our community.</p>
                    </div>

                    <div className="w-full md:w-96">
                        <Input
                            placeholder="Search stores or addresses..."
                            icon={Search}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white/80 backdrop-blur-sm border-slate-200"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-slate-500">Loading stores...</div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredStores.length > 0 ? (
                            filteredStores.map((store) => (
                                <div key={store.id} className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="h-12 w-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                            <Store className="h-6 w-6" />
                                        </div>
                                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded text-amber-700 font-bold text-sm border border-amber-100">
                                            <Star className="h-3 w-3 fill-current" />
                                            {store.rating}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{store.name}</h3>
                                    <p className="text-slate-500 text-sm mb-6 line-clamp-2 h-10">{store.address}</p>
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                        <span className="text-xs text-slate-400 font-medium">{store.ratingCount} reviews</span>
                                        <Link to="/login">
                                            <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800 text-xs shadow-md shadow-slate-900/10">
                                                Login to Rate
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center text-slate-500 bg-white/50 rounded-2xl border border-dashed border-slate-200">
                                No stores found matching your search.
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-slate-200 bg-white/80 backdrop-blur-xl py-8 mt-12">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-slate-500">
                        © 2024 Roxiler Systems. All rights reserved.
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="text-sm text-slate-500 hover:text-rose-600 transition-colors">Privacy</a>
                        <a href="#" className="text-sm text-slate-500 hover:text-rose-600 transition-colors">Terms</a>
                        <a href="#" className="text-sm text-slate-500 hover:text-rose-600 transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default StoresPage;
