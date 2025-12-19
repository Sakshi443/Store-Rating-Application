
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
        <div className="min-h-screen w-full bg-white text-black selection:bg-[#FFDA1A] selection:text-black font-sans">
            {/* Navbar */}
            <nav className="relative z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="h-10 w-10 bg-[#111] flex items-center justify-center transition-transform group-hover:scale-105">
                                <span className="text-[#FFDA1A] font-bold text-xl">S</span>
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-[#111]">
                                StoreRate.
                            </span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login">
                            <Button variant="ghost" className="text-gray-500 hover:text-black font-bold">
                                Sign In
                            </Button>
                        </Link>
                        <Link to="/signup">
                            <Button className="bg-[#FFDA1A] text-black hover:bg-[#e6c417] font-bold rounded-full px-6 shadow-lg shadow-[#FFDA1A]/20 transition-all hover:-translate-y-0.5">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 container mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
                    <div className="space-y-4">
                        <Link to="/" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-black transition-colors group">
                            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            Back to Home
                        </Link>
                        <h1 className="text-5xl md:text-6xl font-black text-[#111] tracking-tight">Browse Stores.</h1>
                        <p className="text-xl text-gray-500 font-medium max-w-lg">Discover the best local businesses rated by our community.</p>
                    </div>

                    <div className="w-full md:w-96">
                        <Input
                            placeholder="Search stores or addresses..."
                            icon={Search}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-gray-50 border-gray-200 focus:bg-white focus:border-black h-12"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-gray-400 font-bold animate-pulse">Loading stores...</div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredStores.length > 0 ? (
                            filteredStores.map((store) => (
                                <div key={store.id} className="bg-white group rounded-none border-2 border-transparent hover:border-black transition-all duration-300 p-8 flex flex-col h-full hover:shadow-[8px_8px_0px_rgba(0,0,0,1)]">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="h-14 w-14 bg-gray-50 flex items-center justify-center text-black group-hover:bg-[#FFDA1A] transition-colors duration-300">
                                            <Store className="h-6 w-6" />
                                        </div>
                                        <div className="flex items-center gap-1 bg-black text-white px-3 py-1 text-sm font-bold">
                                            <Star className="h-3 w-3 fill-[#FFDA1A] text-[#FFDA1A]" />
                                            {store.rating}
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black text-[#111] mb-3 leading-tight group-hover:underline decoration-2 underline-offset-4">{store.name}</h3>
                                    <p className="text-gray-500 font-medium mb-8 line-clamp-2 flex-grow">{store.address}</p>
                                    <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-auto">
                                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{store.ratingCount} reviews</span>
                                        <Link to="/login">
                                            <Button size="sm" variant="ghost" className="text-black font-bold p-0 hover:bg-transparent hover:underline decoration-2 underline-offset-4">
                                                Rate this store
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-24 text-center text-gray-400 bg-gray-50 border border-dashed border-gray-200">
                                <Store className="mx-auto h-12 w-12 opacity-20 mb-4" />
                                <p className="text-lg font-bold">No stores found matching your search.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-[#111] text-white py-12 mt-24">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-white flex items-center justify-center">
                            <span className="text-black font-bold">S</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight">StoreRate.</span>
                    </div>
                    <div className="flex gap-8 text-sm font-bold text-gray-400">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Contact Support</a>
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                        © 2025 StoreRate Inc.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default StoresPage;
