import { useEffect, useState } from 'react';
import config from '../config';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { StarRating } from '../components/StarRating';
import { Activity, CreditCard, Users, Search, Lock, Star } from 'lucide-react';
import { validatePassword } from '../lib/validation';

interface UserStats {
    totalReviewsGiven: number;
    averageRatingGiven: number;
    memberSince: string;
}

interface Store {
    id: number;
    name: string;
    address: string;
    email: string;
    rating: number; // Average rating
    myRating: number; // User's rating
    ratingCount: number;
}

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<UserStats | null>(null);
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Change Password State
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchData = async () => {
        try {
            const [statsRes, storesRes] = await Promise.all([
                fetch(`${config.API_URL}/stats/user`, { headers }),
                fetch(`${config.API_URL}/public/stores`, { headers })
            ]);

            if (statsRes.ok) setStats(await statsRes.json());
            if (storesRes.ok) setStores(await storesRes.json());
        } catch (error) {
            console.error("Failed to fetch user data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRatingChange = async (storeId: number, newRating: number) => {
        try {
            const res = await fetch(`${config.API_URL}/ratings`, {
                method: 'POST',
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify({ storeId, score: newRating })
            });

            if (res.ok) {
                // Optimistic update or refetch
                fetchData();
            }
        } catch (error) {
            console.error("Failed to submit rating", error);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        const passwordErrorMsg = validatePassword(passwordData.newPassword);
        if (passwordErrorMsg) {
            setPasswordError(passwordErrorMsg);
            return;
        }

        try {
            const res = await fetch(`${config.API_URL}/auth/password`, {
                method: 'PUT',
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify(passwordData)
            });
            const data = await res.json();
            if (res.ok) {
                setPasswordSuccess('Password updated successfully');
                setPasswordData({ currentPassword: '', newPassword: '' });
                setTimeout(() => setShowPasswordModal(false), 2000);
            } else {
                setPasswordError(data.message || 'Failed to update password');
            }
        } catch (error) {
            setPasswordError('An error occurred');
        }
    };

    const filteredStores = stores.filter(store =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-black p-8 font-medium">Loading dashboard...</div>;


    const statData = [
        {
            title: "Reviews Given",
            value: stats?.totalReviewsGiven || 0,
            description: "Your total contributions",
            icon: Star,
        },
        {
            title: "Avg Rating Given",
            value: stats?.averageRatingGiven || 0,
            description: "Your rating habits",
            icon: Activity,
        },
        {
            title: "Account Status",
            value: "Active",
            description: "Verified Account",
            icon: Users,
        },
        {
            title: "Member Since",
            value: stats?.memberSince ? new Date(stats.memberSince).toLocaleDateString() : "-",
            description: "Join date",
            icon: CreditCard,
        },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-4xl font-black tracking-tight text-[#111]">My Dashboard.</h2>
                    <p className="text-gray-500 font-medium mt-2">
                        Welcome back, <span className="text-black font-bold">{user?.name || user?.email}</span>!
                    </p>
                </div>
                <Button variant="secondary" onClick={() => setShowPasswordModal(true)} className="bg-white border text-black hover:bg-gray-50 border-gray-200">
                    <Lock className="mr-2 h-4 w-4" /> Change Password
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {statData.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index} className="border-gray-200 bg-white shadow-sm hover:shadow-md transition-all">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                                    {stat.title}
                                </CardTitle>
                                <Icon className="h-4 w-4 text-black" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black text-[#111]">{stat.value}</div>
                                <p className="text-xs text-gray-500 font-medium mt-1">{stat.description}</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Stores Section */}
            <Card className="border-gray-200 bg-white shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Registered Stores</CardTitle>
                    <CardDescription className="text-gray-500">
                        Browse stores and submit your ratings.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 w-full sm:max-w-sm">
                        <Input
                            placeholder="Search stores by name or address..."
                            icon={Search}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-gray-50 border-gray-200"
                        />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredStores.map(store => (
                            <div key={store.id} className="rounded-xl border border-gray-200 p-6 bg-white hover:border-black transition-all group">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h4 className="font-bold text-lg text-[#111] leading-tight group-hover:underline decoration-2 underline-offset-4">{store.name}</h4>
                                        <p className="text-sm text-gray-500 font-medium mt-1">{store.address}</p>
                                    </div>
                                    <div className="flex items-center text-black text-sm font-bold bg-[#FFDA1A] px-2 py-1">
                                        <span className="mr-1">{store.rating}</span>
                                        <span className="text-black/60 font-medium text-xs">({store.ratingCount})</span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Your Rating</span>
                                        <StarRating
                                            rating={store.myRating}
                                            onRatingChange={(score) => handleRatingChange(store.id, score)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {filteredStores.length === 0 && (
                            <div className="col-span-full py-12 text-center text-gray-400 border border-dashed border-gray-200 rounded-lg">
                                <Search className="mx-auto h-8 w-8 opacity-20 mb-2" />
                                No stores found matching your search.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Change Password Modal */}
            <Modal
                isOpen={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
                title="Change Password"
            >
                <form onSubmit={handleChangePassword} className="space-y-4">
                    {passwordError && <div className="text-red-600 text-sm bg-red-50 p-3 rounded border border-red-100 font-medium">{passwordError}</div>}
                    {passwordSuccess && <div className="text-green-600 text-sm bg-green-50 p-3 rounded border border-green-100 font-medium">{passwordSuccess}</div>}

                    <Input
                        label="Current Password"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        required
                        className="bg-gray-50"
                    />
                    <Input
                        label="New Password"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        required
                        className="bg-gray-50"
                    />
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setShowPasswordModal(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-black text-white hover:bg-gray-800 font-bold">Update Password</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Dashboard;
