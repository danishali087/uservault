const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getAllUsers, getUser, createUser,
  updateUser, deleteUser, getDeletedUsers,
  restoreUser, getDashboardStats
} = require('../controllers/userController');

// Dashboard Stats
router.get('/stats', protect, getDashboardStats);

// CRUD Routes
router.get('/', protect, getAllUsers);
router.get('/deleted', protect, getDeletedUsers);
router.get('/:id', protect, getUser);
router.post('/', protect, createUser);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, deleteUser);
router.put('/:id/restore', protect, restoreUser);

module.exports = router;
