import { useEffect, useState } from 'react';
import config from '../config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { Edit, Trash2, Plus, Store, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { validateName, validateAddress, validateEmail } from '../lib/validation';

interface StoreData {
    id: number;
    name: string;
    address: string;
    email: string;
    totalRatings: number;
    averageRating: number;
    owner?: {
        id: number;
        name: string;
        email: string;
        address: string;
    }
}


interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

const StoreManager = () => {
    const { user } = useAuth();
    const [stores, setStores] = useState<StoreData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [storeOwners, setStoreOwners] = useState<User[]>([]);

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStore, setEditingStore] = useState<StoreData | null>(null);
    const [formData, setFormData] = useState({ name: '', address: '', email: '', ownerId: '' });
    const [modalError, setModalError] = useState('');
    const [modalSuccess, setModalSuccess] = useState('');

    // Delete State
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const isAdmin = user?.role === 'System Administrator';

    const fetchData = async () => {
        setLoading(true);
        try {
            const storeEndpoint = isAdmin ? `${config.API_URL}/stores` : `${config.API_URL}/stats/store`;

            const promises = [fetch(storeEndpoint, { headers })];
            if (isAdmin) {
                promises.push(fetch(`${config.API_URL}/users`, { headers }));
            }

            const responses = await Promise.all(promises);
            const storeRes = responses[0];

            if (storeRes.ok) {
                const data = await storeRes.json();
                if (isAdmin) {
                    const adminStores = data.map((s: any) => ({
                        id: s.id,
                        name: s.name,
                        address: s.address,
                        email: s.email,
                        totalRatings: s.Ratings ? s.Ratings.length : 0,
                        averageRating: s.rating,
                        owner: s.owner
                    }));
                    setStores(adminStores);
                } else {
                    setStores(data.stores || []);
                }
            }

            if (isAdmin && responses[1] && responses[1].ok) {
                const users = await responses[1].json();
                setStoreOwners(users.filter((u: User) => u.role === 'Store Owner'));
            }

        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleOpenModal = (store?: StoreData) => {
        setModalError('');
        setModalSuccess('');
        if (store) {
            setEditingStore(store);
            setFormData({
                name: store.name,
                address: store.address,
                email: store.email,
                ownerId: store.owner?.id ? store.owner.id.toString() : ''
            });
        } else {
            setEditingStore(null);
            setFormData({ name: '', address: '', email: '', ownerId: '' });
        }
        setIsModalOpen(true);
    };

    const handleSaveStore = async (e: React.FormEvent) => {
        e.preventDefault();
        setModalError('');
        setModalSuccess('');

        if (!formData.name || !formData.address || !formData.email) {
            setModalError('All fields are required');
            return;
        }

        const nameError = validateName(formData.name);
        if (nameError) {
            setModalError(nameError);
            return;
        }

        const emailError = validateEmail(formData.email);
        if (emailError) {
            setModalError(emailError);
            return;
        }

        const addressError = validateAddress(formData.address);
        if (addressError) {
            setModalError(addressError);
            return;
        }

        if (isAdmin && !formData.ownerId && !editingStore) {
            setModalError('Please assign an owner');
            return;
        }

        try {
            const url = editingStore
                ? `${config.API_URL}/stores/${editingStore.id}`
                : `${config.API_URL}/stores`;

            const method = editingStore ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                setModalSuccess(editingStore ? 'Store updated successfully' : 'Store created successfully');
                setTimeout(() => {
                    setIsModalOpen(false);
                    fetchData();
                }, 1500);
            } else {
                setModalError(data.message || 'Operation failed');
            }
        } catch (error) {
            setModalError('An error occurred');
        }
    };

    const handleDeleteStore = async () => {
        if (!deleteId) return;
        try {
            const res = await fetch(`${config.API_URL}/stores/${deleteId}`, {
                method: 'DELETE',
                headers
            });

            if (res.ok) {
                setDeleteId(null);
                fetchData();
            }
        } catch (error) {
            console.error("Failed to delete store", error);
        }
    };

    const filteredStores = stores.filter(store =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (store.owner && store.owner.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return <div className="text-slate-900 p-8">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Store Manager</h2>
                    <p className="text-slate-500">
                        {isAdmin ? 'Manage all system stores and ownership.' : 'Manage your registered stores efficiently.'}
                    </p>
                </div>
                <Button onClick={() => handleOpenModal()}>
                    <Plus className="mr-2 h-4 w-4" /> Add New Store
                </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                    type="text"
                    placeholder={isAdmin ? "Search stores or owners..." : "Search stores..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                    {filteredStores.map((store) => (
                        <motion.div
                            key={store.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            layout
                        >
                            <Card className="border-slate-200 bg-white shadow-sm hover:shadow-md transition-all h-full flex flex-col">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                                <Store className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg text-slate-900">{store.name}</CardTitle>
                                                <CardDescription>{store.email}</CardDescription>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col justify-between">
                                    <div className="space-y-4 mb-4">
                                        <div className="text-sm text-slate-500 line-clamp-2 min-h-[40px]">
                                            {store.address}
                                        </div>
                                        {isAdmin && store.owner && (
                                            <div className="mt-2 text-xs text-blue-700 bg-blue-50 p-3 rounded-md space-y-1 border border-blue-100">
                                                <div className="font-semibold text-blue-800">Owner Details</div>
                                                <div className="grid grid-cols-[60px_1fr] gap-1">
                                                    <span className="text-blue-500">Name:</span>
                                                    <span className="truncate">{store.owner.name}</span>
                                                    <span className="text-blue-500">Email:</span>
                                                    <span className="truncate">{store.owner.email}</span>
                                                    <span className="text-blue-500">Address:</span>
                                                    <span className="truncate">{store.owner.address || 'N/A'}</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between text-sm py-2 border-t border-slate-100">
                                            <div className="flex items-center gap-2">
                                                <span className="text-slate-400">Rating:</span>
                                                <span className="font-bold text-amber-500">{store.averageRating || 0} / 5</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-slate-400">Reviews:</span>
                                                <span className="font-bold text-slate-900">{store.totalRatings || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => handleOpenModal(store)}
                                        >
                                            <Edit className="mr-2 h-3 w-3" /> Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => setDeleteId(store.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredStores.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-500 border border-dashed border-slate-200 rounded-lg">
                        <Store className="mx-auto h-12 w-12 opacity-50 mb-4" />
                        <p className="text-lg">No stores found</p>
                        <p className="text-sm">Try creating a new store or adjusting your search</p>
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingStore ? 'Edit Store' : 'Create New Store'}
            >
                <form onSubmit={handleSaveStore} className="space-y-4">
                    {modalError && <div className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-100">{modalError}</div>}
                    {modalSuccess && <div className="text-green-600 text-sm bg-green-50 p-2 rounded border border-green-100">{modalSuccess}</div>}

                    <Input
                        label="Store Name"
                        placeholder="e.g. Roxiler Tech Store"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <Input
                        label="Store Email"
                        type="email"
                        placeholder="store@roxiler.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <Input
                        label="Store Address"
                        placeholder="123 Tech Park, India"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        required
                    />

                    {isAdmin && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Assign Owner</label>
                            <select
                                className="w-full rounded-md border border-slate-200 bg-white p-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.ownerId}
                                onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
                                required={!editingStore}
                            >
                                <option value="">Select an Owner</option>
                                {storeOwners.map(owner => (
                                    <option key={owner.id} value={owner.id}>
                                        {owner.name} ({owner.email})
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-slate-500">Required for new stores.</p>
                        </div>
                    )}


                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">{editingStore ? 'Update Store' : 'Create Store'}</Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                title="Confirm Deletion"
            >
                <div className="space-y-4">
                    <p className="text-slate-600">
                        Are you sure you want to delete this store? This action cannot be undone and all associated ratings will be deleted.
                    </p>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setDeleteId(null)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteStore}>
                            Delete Store
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default StoreManager;
