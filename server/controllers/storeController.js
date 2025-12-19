const { User, Store, Rating } = require('../models');

// @desc    Get all stores
// @route   GET /api/stores
// @access  Private (Admin only)
// @access  Private (Admin only)
// @desc    Get all stores
// @route   GET /api/stores
// @access  Private (Admin only)
const getStores = async (req, res) => {
    try {
        // Optimized query: Only fetch score from ratings
        const stores = await Store.findAll({
            include: [
                { model: User, attributes: ['id', 'name', 'email', 'address', 'role'] },
                { model: Rating, attributes: ['score'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        const storesWithRatings = stores.map(store => {
            const ratings = store.Ratings || [];
            let avgRating = 0;

            if (ratings.length > 0) {
                const sum = ratings.reduce((acc, curr) => acc + curr.score, 0);
                avgRating = sum / ratings.length;
            }

            return {
                id: store.id,
                name: store.name,
                address: store.address,
                email: store.email,
                owner: store.User,
                rating: parseFloat(avgRating.toFixed(1))
            };
        });

        res.json(storesWithRatings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new store
// @route   POST /api/stores
// @access  Private (Store Owner, Admin)
const createStore = async (req, res) => {
    const { name, address, email, ownerId } = req.body;

    try {
        let finalOwnerId = req.user.id;

        // If Admin, utilize the provided ownerId
        if (req.user.role === 'System Administrator' && ownerId) {
            finalOwnerId = ownerId;
        }

        const store = await Store.create({
            name,
            address,
            email,
            ownerId: finalOwnerId,
            rating: 0
        });

        res.status(201).json(store);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a store
// @route   PUT /api/stores/:id
// @access  Private (Store Owner)
// @desc    Update a store
// @route   PUT /api/stores/:id
// @access  Private (Store Owner, Admin)
const updateStore = async (req, res) => {
    const { id } = req.params;
    const { name, address, email } = req.body;

    try {
        const whereClause = { id };
        // Only restrict by ownerId if NOT an admin
        if (req.user.role !== 'System Administrator') {
            whereClause.ownerId = req.user.id;
        }

        const store = await Store.findOne({ where: whereClause });

        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        store.name = name || store.name;
        store.address = address || store.address;
        store.email = email || store.email;

        if (req.user.role === 'System Administrator' && req.body.ownerId) {
            store.ownerId = req.body.ownerId;
        }

        await store.save();

        res.json(store);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a store
// @route   DELETE /api/stores/:id
// @access  Private (Store Owner, Admin)
const deleteStore = async (req, res) => {
    const { id } = req.params;

    try {
        const whereClause = { id };
        // Only restrict by ownerId if NOT an admin
        if (req.user.role !== 'System Administrator') {
            whereClause.ownerId = req.user.id;
        }

        const store = await Store.findOne({ where: whereClause });

        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        await store.destroy();

        res.json({ message: 'Store removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getStores, createStore, updateStore, deleteStore };
