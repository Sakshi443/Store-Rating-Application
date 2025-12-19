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

    if (loading) return <div className="text-slate-900 p-8">Loading dashboard...</div>;


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
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
                    <p className="text-slate-500">
                        Welcome back, {user?.name || user?.email}! Here's an overview of your account.
                    </p>
                </div>
                <Button variant="secondary" onClick={() => setShowPasswordModal(true)}>
                    <Lock className="mr-2 h-4 w-4" /> Change Password
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statData.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index} className="border-slate-200 bg-white shadow-sm hover:shadow-md transition-all">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-500">
                                    {stat.title}
                                </CardTitle>
                                <Icon className="h-4 w-4 text-slate-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                                <p className="text-xs text-slate-500">{stat.description}</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Stores Section */}
            <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader>
                    <CardTitle>Registered Stores</CardTitle>
                    <CardDescription>
                        Browse stores and submit your ratings.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 w-full sm:max-w-sm">
                        <Input
                            placeholder="Search stores by name or address..."
                            icon={Search}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredStores.map(store => (
                            <div key={store.id} className="rounded-lg border border-slate-200 p-4 bg-slate-50 hover:bg-white hover:shadow-md transition-all">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h4 className="font-semibold text-slate-900">{store.name}</h4>
                                        <p className="text-sm text-slate-500">{store.address}</p>
                                    </div>
                                    <div className="flex items-center text-amber-500 text-sm font-bold">
                                        <span className="mr-1">{store.rating}</span>
                                        <span className="text-slate-400 font-normal">({store.ratingCount})</span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-200">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-400">Your Rating:</span>
                                        <StarRating
                                            rating={store.myRating}
                                            onRatingChange={(score) => handleRatingChange(store.id, score)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {filteredStores.length === 0 && (
                            <div className="col-span-full py-8 text-center text-slate-500">
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
                    {passwordError && <div className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-100">{passwordError}</div>}
                    {passwordSuccess && <div className="text-green-600 text-sm bg-green-50 p-2 rounded border border-green-100">{passwordSuccess}</div>}

                    <Input
                        label="Current Password"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        required
                    />
                    <Input
                        label="New Password"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        required
                    />
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setShowPasswordModal(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Update Password</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Dashboard;
