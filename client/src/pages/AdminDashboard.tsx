import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/Card';
import config from '../config';
import { Button } from '../components/Button';
import { Plus, Search, MoreHorizontal, Users, Activity, Store as StoreIcon } from 'lucide-react';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { validateName, validateEmail, validatePassword, validateAddress } from '../lib/validation';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    address: string;
    createdAt: string;
    rating?: number | null;
}

interface Store {
    id: number;
    name: string;
    email: string;
    address: string;
    rating: number;
    owner?: {
        id: number;
        name: string;
        email: string;
        address: string;
    }
}

interface Stats {
    totalRatings: number;
    totalUsers: number;
    totalStores: number;
    activeUsers: number;
}

const AdminDashboard = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [stores, setStores] = useState<Store[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'users' | 'stores'>('users');

    // Modals
    const [showAddUser, setShowAddUser] = useState(false);
    const [showAddStore, setShowAddStore] = useState(false);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');

    // Add User Form State
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', address: '', role: 'Normal User' });
    const [userFormError, setUserFormError] = useState('');

    // Add Store Form State
    // Add Store Form State
    const [editingStoreId, setEditingStoreId] = useState<number | null>(null);
    const [newStore, setNewStore] = useState({ name: '', email: '', address: '', ownerId: '' });
    const [storeFormError, setStoreFormError] = useState('');

    // Delete Store State
    const [deleteStoreId, setDeleteStoreId] = useState<number | null>(null);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchData = async () => {
        try {
            const [usersRes, storesRes, statsRes] = await Promise.all([
                fetch(`${config.API_URL}/users`, { headers }),
                fetch(`${config.API_URL}/stores`, { headers }),
                fetch(`${config.API_URL}/stats/admin`, { headers })
            ]);

            if (usersRes.ok) setUsers(await usersRes.json());
            if (storesRes.ok) setStores(await storesRes.json());
            if (statsRes.ok) setStats(await statsRes.json());
        } catch (error) {
            console.error("Failed to fetch admin data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setUserFormError('');

        const nameError = validateName(newUser.name);
        if (nameError) {
            setUserFormError(nameError);
            return;
        }

        const emailError = validateEmail(newUser.email);
        if (emailError) {
            setUserFormError(emailError);
            return;
        }

        const passwordError = validatePassword(newUser.password);
        if (passwordError) {
            setUserFormError(passwordError);
            return;
        }

        const addressError = validateAddress(newUser.address);
        if (addressError) {
            setUserFormError(addressError);
            return;
        }

        try {
            const res = await fetch(`${config.API_URL}/users`, {
                method: 'POST',
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });
            const data = await res.json();
            if (res.ok) {
                setShowAddUser(false);
                setNewUser({ name: '', email: '', password: '', address: '', role: 'Normal User' });
                fetchData();
            } else {
                setUserFormError(data.message || 'Failed to create user');
            }
        } catch (error) {
            setUserFormError('An error occurred');
        }
    };

    const handleSaveStore = async (e: React.FormEvent) => {
        e.preventDefault();
        setStoreFormError('');

        const nameError = validateName(newStore.name);
        if (nameError) {
            setStoreFormError(nameError);
            return;
        }

        const emailError = validateEmail(newStore.email);
        if (emailError) {
            setStoreFormError(emailError);
            return;
        }

        const addressError = validateAddress(newStore.address);
        if (addressError) {
            setStoreFormError(addressError);
            return;
        }

        if (!newStore.ownerId && !editingStoreId) { // Owner required for new stores
            setStoreFormError('Please select a Store Owner');
            return;
        }

        try {
            const url = editingStoreId
                ? `${config.API_URL}/stores/${editingStoreId}`
                : `${config.API_URL}/stores`;

            const method = editingStoreId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify(newStore)
            });
            const data = await res.json();
            if (res.ok) {
                setShowAddStore(false);
                setEditingStoreId(null);
                setNewStore({ name: '', email: '', address: '', ownerId: '' });
                fetchData();
            } else {
                setStoreFormError(data.message || 'Failed to save store');
            }
        } catch (error) {
            setStoreFormError('An error occurred');
        }
    };

    const handleDeleteStore = async () => {
        if (!deleteStoreId) return;
        try {
            const res = await fetch(`${config.API_URL}/stores/${deleteStoreId}`, {
                method: 'DELETE',
                headers
            });
            if (res.ok) {
                setDeleteStoreId(null);
                fetchData();
            }
        } catch (error) {
            console.error("Failed to delete store", error);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.address && user.address.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesRole = roleFilter === 'All' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const filteredStores = stores.filter(store =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (store.owner && store.owner.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const storeOwners = users.filter(u => u.role === 'Store Owner');

    if (loading) return <div className="text-slate-900 p-8">Loading dashboard...</div>;

    const statCards = [
        { title: "Total Ratings", value: stats?.totalRatings || 0, icon: Activity, color: "text-green-400" },
        { title: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "text-blue-400" },
        { title: "Total Stores", value: stats?.totalStores || 0, icon: StoreIcon, color: "text-purple-400" },
        { title: "Active Users", value: stats?.activeUsers || 0, icon: Activity, color: "text-orange-400" },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Admin Dashboard</h2>
                    <p className="text-slate-500">Manage users, stores, and system settings.</p>
                </div>
                {activeTab === 'users' ? (
                    <Button onClick={() => setShowAddUser(true)} className="w-full sm:w-auto">
                        <Plus className="mr-2 h-4 w-4" /> Add User
                    </Button>
                ) : null}
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, index) => (
                    <Card key={index} className="border-slate-200 bg-white shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Tabs & Content */}
            <div className="space-y-4">
                <div className="flex space-x-2 border-b border-slate-200 pb-2">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'users' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        Users
                    </button>
                    <button
                        onClick={() => setActiveTab('stores')}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'stores' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        Stores
                    </button>
                </div>

                <Card className="border-slate-200 bg-white shadow-sm">
                    <CardHeader>
                        <CardTitle>{activeTab === 'users' ? 'Users' : 'Store Manager'}</CardTitle>
                        <CardDescription>
                            {activeTab === 'users' ? 'Manage registered users.' : 'Detailed view of stores and their owners.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="relative w-full sm:max-w-sm">
                                <Input
                                    placeholder="Search..."
                                    icon={Search}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            {activeTab === 'users' && (
                                <select
                                    className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                >
                                    <option value="All">All Roles</option>
                                    <option value="Normal User">Normal User</option>
                                    <option value="Store Owner">Store Owner</option>
                                    <option value="System Administrator">Admin</option>
                                </select>
                            )}
                        </div>

                        <div className="overflow-x-auto rounded-lg border border-slate-200">
                            <table className="w-full text-left text-sm text-slate-500">
                                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                    <tr>
                                        {activeTab === 'users' ? (
                                            <>
                                                <th className="px-6 py-3">Name</th>
                                                <th className="px-6 py-3">Email</th>
                                                <th className="px-6 py-3">Address</th>
                                                <th className="px-6 py-3">Role</th>
                                                <th className="px-6 py-3">Rating</th>
                                                <th className="px-6 py-3 text-right">Actions</th>
                                            </>
                                        ) : (
                                            <>
                                                <th className="px-6 py-3">Store Details</th>
                                                <th className="px-6 py-3">Owner Details</th>
                                                <th className="px-6 py-3">Rating</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeTab === 'users' ? (
                                        filteredUsers.length > 0 ? (
                                            filteredUsers.map((user) => (
                                                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                                                    <td className="px-6 py-4">{user.email}</td>
                                                    <td className="px-6 py-4">{user.address || '-'}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.role === 'System Administrator' ? 'bg-purple-100 text-purple-700' :
                                                            user.role === 'Store Owner' ? 'bg-blue-100 text-blue-700' :
                                                                'bg-slate-100 text-slate-700'
                                                            }`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {user.rating ? (
                                                            <span className="text-amber-500 font-bold">★ {user.rating}</span>
                                                        ) : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-4 text-center">No users found.</td>
                                            </tr>
                                        )
                                    ) : (
                                        filteredStores.length > 0 ? (
                                            filteredStores.map((store) => (
                                                <tr key={store.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-slate-900">{store.name}</div>
                                                        <div className="text-xs">{store.address}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {store.owner ? (
                                                            <>
                                                                <div className="text-slate-900">{store.owner.name}</div>
                                                                <div className="text-xs">{store.owner.email}</div>
                                                                <div className="text-xs text-slate-500">{store.owner.address}</div>
                                                            </>
                                                        ) : <span className="text-slate-400">Unknown</span>}
                                                    </td>
                                                    <td className="px-6 py-4 text-amber-500 font-bold">
                                                        ★ {store.rating || 0}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-4 text-center">No stores found.</td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Add User Modal */}
            <Modal
                isOpen={showAddUser}
                onClose={() => setShowAddUser(false)}
                title="Add New User"
            >
                <form onSubmit={handleAddUser} className="space-y-4">
                    {userFormError && <div className="text-red-400 text-sm">{userFormError}</div>}
                    <Input
                        label="Name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        required
                    />
                    <Input
                        label="Email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        required
                    />
                    <Input
                        label="Address"
                        value={newUser.address}
                        onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                    />
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Role</label>
                        <select
                            className="w-full rounded-md border border-slate-200 bg-white p-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        >
                            <option value="Normal User">Normal User</option>
                            <option value="Store Owner">Store Owner</option>
                            <option value="System Administrator">System Administrator</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setShowAddUser(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Create User</Button>
                    </div>
                </form>
            </Modal>

            {/* Add/Edit Store Modal */}
            <Modal
                isOpen={showAddStore}
                onClose={() => setShowAddStore(false)}
                title={editingStoreId ? "Edit Store" : "Add New Store"}
            >
                <form onSubmit={handleSaveStore} className="space-y-4">
                    {storeFormError && <div className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-100">{storeFormError}</div>}

                    <Input
                        label="Store Name"
                        value={newStore.name}
                        onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                        required
                    />
                    <Input
                        label="Store Email"
                        type="email"
                        value={newStore.email}
                        onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
                        required
                    />
                    <Input
                        label="Store Address"
                        value={newStore.address}
                        onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
                        required
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Assign Owner</label>
                        <select
                            className="w-full rounded-md border border-slate-200 bg-white p-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newStore.ownerId}
                            onChange={(e) => setNewStore({ ...newStore, ownerId: e.target.value })}
                            required
                        >
                            <option value="">Select an Owner</option>
                            {storeOwners.map(owner => (
                                <option key={owner.id} value={owner.id}>
                                    {owner.name} ({owner.email})
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-slate-500">
                            Only users with 'Store Owner' role are listed.
                        </p>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setShowAddStore(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">{editingStoreId ? "Update Store" : "Create Store"}</Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={!!deleteStoreId}
                onClose={() => setDeleteStoreId(null)}
                title="Confirm Deletion"
            >
                <div className="space-y-4">
                    <p className="text-slate-600">
                        Are you sure you want to delete this store? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setDeleteStoreId(null)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteStore}>
                            Delete Store
                        </Button>
                    </div>
                </div>
            </Modal>
        </div >
    );
};

export default AdminDashboard;
