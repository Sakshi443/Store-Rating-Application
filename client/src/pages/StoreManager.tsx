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

interface RawStore {
    id: number;
    name: string;
    address: string;
    email: string;
    rating: number;
    Ratings?: { length: number }[];
    owner?: {
        id: number;
        name: string;
        email: string;
        address: string;
    };
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
                    const adminStores = data.map((s: RawStore) => ({
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
            console.error(error);
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

    if (loading) return <div className="text-black p-8 font-medium">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-4xl font-black tracking-tight text-[#111]">Store Manager.</h2>
                    <p className="text-gray-500 font-medium mt-2">
                        {isAdmin ? 'Manage all system stores and ownership.' : 'Manage your registered stores efficiently.'}
                    </p>
                </div>
                <Button onClick={() => handleOpenModal()} className="bg-[#FFDA1A] text-black hover:bg-[#e6c417] font-bold border-none shadow-md shadow-[#FFDA1A]/20">
                    <Plus className="mr-2 h-4 w-4" /> Add New Store
                </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder={isAdmin ? "Search stores or owners..." : "Search stores..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-md border border-gray-200 bg-white pl-10 pr-4 py-3 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition-all"
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
                            <Card className="border-gray-200 bg-white shadow-sm hover:shadow-lg hover:shadow-black/5 transition-all h-full flex flex-col group">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-[#111] flex items-center justify-center text-[#FFDA1A] shadow-sm">
                                                <Store className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg font-bold text-[#111]">{store.name}</CardTitle>
                                                <CardDescription className="text-gray-500">{store.email}</CardDescription>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col justify-between">
                                    <div className="space-y-4 mb-4">
                                        <div className="text-sm text-gray-600 line-clamp-2 min-h-[40px] font-medium">
                                            {store.address}
                                        </div>
                                        {isAdmin && store.owner && (
                                            <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-md space-y-1 border border-gray-100">
                                                <div className="font-bold text-black uppercase tracking-wider">Owner Details</div>
                                                <div className="grid grid-cols-[60px_1fr] gap-1">
                                                    <span className="text-gray-400 font-medium">Name:</span>
                                                    <span className="truncate font-medium">{store.owner.name}</span>
                                                    <span className="text-gray-400 font-medium">Email:</span>
                                                    <span className="truncate font-medium">{store.owner.email}</span>
                                                    <span className="text-gray-400 font-medium">Addr:</span>
                                                    <span className="truncate font-medium">{store.owner.address || 'N/A'}</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between text-sm py-2 border-t border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400 font-medium">Rating:</span>
                                                <span className="font-black text-[#111]">{store.averageRating || 0} / 5</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400 font-medium">Reviews:</span>
                                                <span className="font-black text-[#111]">{store.totalRatings || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            className="flex-1 bg-white border-2 border-gray-100 hover:border-black hover:text-black font-bold text-gray-500"
                                            onClick={() => handleOpenModal(store)}
                                        >
                                            <Edit className="mr-2 h-3 w-3" /> Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border-none"
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
                    <div className="col-span-full py-12 text-center text-gray-400 border border-dashed border-gray-200 rounded-lg">
                        <Store className="mx-auto h-12 w-12 opacity-20 mb-4" />
                        <p className="text-lg font-bold">No stores found</p>
                        <p className="text-sm font-medium">Try creating a new store or adjusting your search</p>
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
                    {modalError && <div className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-100 font-medium">{modalError}</div>}
                    {modalSuccess && <div className="text-green-600 text-sm bg-green-50 p-2 rounded border border-green-100 font-medium">{modalSuccess}</div>}

                    <Input
                        label="Store Name"
                        placeholder="e.g. Roxiler Tech Store"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="bg-gray-50"
                    />
                    <Input
                        label="Store Email"
                        type="email"
                        placeholder="store@roxiler.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="bg-gray-50"
                    />
                    <Input
                        label="Store Address"
                        placeholder="123 Tech Park, India"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        required
                        className="bg-gray-50"
                    />

                    {isAdmin && (
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-900">Assign Owner</label>
                            <select
                                className="w-full rounded-md border border-gray-200 bg-gray-50 p-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
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
                            <p className="text-xs text-gray-500 font-medium">Required for new stores.</p>
                        </div>
                    )}


                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-[#FFDA1A] text-black hover:bg-[#e6c417] font-bold">{editingStore ? 'Update Store' : 'Create Store'}</Button>
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
                    <p className="text-gray-600 font-medium">
                        Are you sure you want to delete this store? This action cannot be undone and all associated ratings will be deleted.
                    </p>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setDeleteId(null)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteStore} className="bg-red-600 hover:bg-red-700 text-white font-bold">
                            Delete Store
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default StoreManager;
