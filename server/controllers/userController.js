const { User, Store, Rating } = require('../models');

const bcrypt = require('bcryptjs');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin only)
const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            include: [{
                model: Store,
                attributes: ['id'], // We only need to iterate stores
                include: [{ model: Rating, attributes: ['score'] }] // Only need scores
            }],
            order: [['createdAt', 'DESC']]
        });

        const usersWithStats = users.map(user => {
            let averageRating = null;

            if (user.role === 'Store Owner' && user.Stores && user.Stores.length > 0) {
                let totalScore = 0;
                let totalRatings = 0;

                user.Stores.forEach(store => {
                    if (store.Ratings) {
                        store.Ratings.forEach(rating => {
                            totalScore += rating.score;
                            totalRatings++;
                        });
                    }
                });

                if (totalRatings > 0) {
                    averageRating = parseFloat((totalScore / totalRatings).toFixed(1));
                } else {
                    averageRating = 0;
                }
            }

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address,
                createdAt: user.createdAt,
                rating: averageRating
            };
        });

        res.json(usersWithStats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new user (Admin)
// @route   POST /api/users
// @access  Private (Admin only)
const createUser = async (req, res) => {
    const { name, email, password, address, role } = req.body;

    try {
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            address,
            password: hashedPassword,
            role: role || 'Normal User',
        });

        if (user) {
            res.status(201).json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUsers, createUser };
