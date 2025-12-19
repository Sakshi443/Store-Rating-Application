import { useEffect, useState } from 'react';
import config from '../config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { TrendingUp, Star, Lock, Plus } from 'lucide-react';
import { validatePassword, validateName, validateEmail, validateAddress } from '../lib/validation';

interface Review {
    id: number;
    user: string;
    score: number;
    date: string;
}

interface StoreData {
    id: number;
    name: string;
    address: string;
    email: string;
    totalRatings: number;
    averageRating: number;
    ratingCounts: { [key: number]: number };
    reviews: Review[];
}

const StoreOwnerDashboard = () => {
    const [stores, setStores] = useState<StoreData[]>([]);
    const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    // Store Registration State
    const [showStoreModal, setShowStoreModal] = useState(false);
    const [newStore, setNewStore] = useState({ name: '', address: '', email: '' });
    const [storeError, setStoreError] = useState('');
    const [storeSuccess, setStoreSuccess] = useState('');

    // Change Password State
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchStats = async () => {
        try {
            const response = await fetch(`${config.API_URL}/stats/store`, {
                headers
            });
            if (response.ok) {
                const data = await response.json();
                setStores(data.stores);
                if (data.stores.length > 0 && !selectedStoreId) {
                    setSelectedStoreId(data.stores[0].id);
                }
            }
        } catch (error) {
            console.error("Failed to fetch store stats", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    const handleCreateStore = async (e: React.FormEvent) => {
        e.preventDefault();
        setStoreError('');
        setStoreSuccess('');

        const nameError = validateName(newStore.name);
        if (nameError) {
            setStoreError(nameError);
            return;
        }

        const emailError = validateEmail(newStore.email);
        if (emailError) {
            setStoreError(emailError);
            return;
        }

        const addressError = validateAddress(newStore.address);
        if (addressError) {
            setStoreError(addressError);
            return;
        }

        try {
            const res = await fetch(`${config.API_URL}/stores`, {
                method: 'POST',
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify(newStore)
            });
            const data = await res.json();
            if (res.ok) {
                setStoreSuccess('Store registered successfully!');
                setNewStore({ name: '', address: '', email: '' });
                await fetchStats(); // Refresh to show dashboard
                setTimeout(() => {
                    setShowStoreModal(false);
                    setStoreSuccess('');
                }, 1500);
            } else {
                setStoreError(data.message || 'Failed to register store');
            }
        } catch (error) {
            setStoreError('An error occurred');
        }
    };

    const activeStore = stores.find(s => s.id === selectedStoreId) || stores[0];

    if (loading) return <div className="text-slate-900 p-8">Loading dashboard...</div>;

    if (stores.length === 0) {
        return (
            <div className="flex flex-col gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Welcome, Store Owner!</h2>
                    <p className="text-slate-500">Please register your store to start tracking statistics.</p>
                </div>

                <div className="max-w-md mx-auto w-full mt-8">
                    <Card className="border-slate-200 bg-white shadow-sm">
                        <CardHeader>
                            <CardTitle>Register Your Store</CardTitle>
                            <CardDescription>Enter details about your flagship store.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreateStore} className="space-y-4">
                                {storeError && <div className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-100">{storeError}</div>}
                                {storeSuccess && <div className="text-green-600 text-sm bg-green-50 p-2 rounded border border-green-100">{storeSuccess}</div>}

                                <Input
                                    label="Store Name"
                                    placeholder="e.g. Roxiler Tech Store"
                                    value={newStore.name}
                                    onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Store Email"
                                    type="email"
                                    placeholder="store@roxiler.com"
                                    value={newStore.email}
                                    onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Store Address"
                                    placeholder="123 Tech Park, India"
                                    value={newStore.address}
                                    onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
                                    required
                                />
                                <Button type="submit" className="w-full">Register Store</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <div className="absolute top-8 right-8">
                    <Button variant="secondary" onClick={() => setShowPasswordModal(true)}>
                        <Lock className="mr-2 h-4 w-4" /> Change Password
                    </Button>
                </div>
                {/* Change Password Modal */}
                <Modal
                    isOpen={showPasswordModal}
                    onClose={() => setShowPasswordModal(false)}
                    title="Change Password"
                >
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        {passwordError && <div className="text-red-400 text-sm">{passwordError}</div>}
                        {passwordSuccess && <div className="text-green-400 text-sm">{passwordSuccess}</div>}

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
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Store Dashboard</h2>
                    <p className="text-slate-500">Monitor your store performance and ratings.</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setShowStoreModal(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Register Store
                    </Button>
                    <Button variant="secondary" onClick={() => setShowPasswordModal(true)}>
                        <Lock className="mr-2 h-4 w-4" /> Change Password
                    </Button>
                </div>
            </div>

            {/* Store Selector */}
            {stores.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {stores.map(store => (
                        <button
                            key={store.id}
                            onClick={() => setSelectedStoreId(store.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${store.id === activeStore.id
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            {store.name}
                        </button>
                    ))}
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-slate-200 bg-white shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">
                            Average Rating
                        </CardTitle>
                        <Star className="h-4 w-4 text-amber-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{activeStore.averageRating} / 5</div>
                        <p className="text-xs text-slate-500">Based on {activeStore.totalRatings} reviews</p>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 bg-white shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">
                            Total Reviews
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{activeStore.totalRatings}</div>
                        <p className="text-xs text-slate-500">Total feedback received</p>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 bg-white shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">
                            5-Star Ratings
                        </CardTitle>
                        <Star className="h-4 w-4 text-green-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{activeStore.ratingCounts[5] || 0}</div>
                        <p className="text-xs text-slate-500">Happy customers</p>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 bg-white shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">
                            1-Star Ratings
                        </CardTitle>
                        <Star className="h-4 w-4 text-red-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{activeStore.ratingCounts[1] || 0}</div>
                        <p className="text-xs text-slate-500">Areas to improve</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Recent Reviews</CardTitle>
                            <CardDescription>
                                Recent ratings and feedback for {activeStore.name}.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {activeStore.reviews && activeStore.reviews.length > 0 ? (
                        <div className="space-y-4">
                            {activeStore.reviews.map((review) => (
                                <div key={review.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                            {review.user.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">{review.user}</p>
                                            <p className="text-xs text-slate-500">{new Date(review.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-amber-500">
                                        <Star className="h-4 w-4 fill-current" />
                                        <span className="font-bold">{review.score}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50">
                            <div className="text-center text-slate-500">
                                <Star className="mx-auto h-8 w-8 opacity-50 mb-2" />
                                <p>No reviews yet.</p>
                            </div>
                        </div>
                    )}
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

            {/* Add Store Modal */}
            <Modal
                isOpen={showStoreModal}
                onClose={() => setShowStoreModal(false)}
                title="Register New Store"
            >
                <form onSubmit={handleCreateStore} className="space-y-4">
                    {storeError && <div className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-100">{storeError}</div>}
                    {storeSuccess && <div className="text-green-600 text-sm bg-green-50 p-2 rounded border border-green-100">{storeSuccess}</div>}

                    <Input
                        label="Store Name"
                        placeholder="e.g. Roxiler Tech Store"
                        value={newStore.name}
                        onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                        required
                    />
                    <Input
                        label="Store Email"
                        type="email"
                        placeholder="store@roxiler.com"
                        value={newStore.email}
                        onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
                        required
                    />
                    <Input
                        label="Store Address"
                        placeholder="123 Tech Park, India"
                        value={newStore.address}
                        onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
                        required
                    />
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setShowStoreModal(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Register Store</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default StoreOwnerDashboard;
