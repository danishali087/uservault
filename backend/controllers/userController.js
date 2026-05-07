const pool = require('../db/db');

//  GET ALL ACTIVE USERS
const getAllUsers = async (req, res) => {
  try {
    const users = await pool.query(
      `SELECT id, name, email, role, created_at, last_login 
       FROM users WHERE is_deleted = false 
       ORDER BY created_at DESC`
    );
    res.status(200).json({ 
      success: true, 
      count: users.rows.length,
      users: users.rows 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  GET SINGLE USER
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query(
      `SELECT id, name, email, role, created_at, last_login 
       FROM users WHERE id = $1 AND is_deleted = false`,
      [id]
    );
    if (user.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user: user.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  CREATE USER
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      `INSERT INTO users (name, email, password, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, name, email, role, created_at`,
      [name, email, hashedPassword, role || 'user']
    );
    res.status(201).json({ 
      success: true, 
      message: 'User created!', 
      user: newUser.rows[0] 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  UPDATE USER
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const updated = await pool.query(
      `UPDATE users SET name = $1, email = $2, role = $3 
       WHERE id = $4 AND is_deleted = false 
       RETURNING id, name, email, role`,
      [name, email, role, id]
    );
    if (updated.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ 
      success: true, 
      message: 'User updated!', 
      user: updated.rows[0] 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  SOFT DELETE USER
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await pool.query(
      `UPDATE users SET is_deleted = true, deleted_at = NOW() 
       WHERE id = $1 AND is_deleted = false 
       RETURNING id, name, email`,
      [id]
    );
    if (deleted.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ 
      success: true, 
      message: 'User soft deleted (recoverable)!', 
      user: deleted.rows[0] 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  GET DELETED USERS
const getDeletedUsers = async (req, res) => {
  try {
    const users = await pool.query(
      `SELECT id, name, email, role, deleted_at 
       FROM users WHERE is_deleted = true 
       ORDER BY deleted_at DESC`
    );
    res.status(200).json({ 
      success: true, 
      count: users.rows.length,
      users: users.rows 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  RESTORE DELETED USER
const restoreUser = async (req, res) => {
  try {
    const { id } = req.params;
    const restored = await pool.query(
      `UPDATE users SET is_deleted = false, deleted_at = NULL 
       WHERE id = $1 AND is_deleted = true 
       RETURNING id, name, email`,
      [id]
    );
    if (restored.rows.length === 0) {
      return res.status(404).json({ success: false, message: '❌ User not found in deleted list' });
    }
    res.status(200).json({ 
      success: true, 
      message: 'User restored successfully!', 
      user: restored.rows[0] 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  DASHBOARD STATS
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await pool.query(
      `SELECT COUNT(*) FROM users WHERE is_deleted = false`
    );
    const deletedUsers = await pool.query(
      `SELECT COUNT(*) FROM users WHERE is_deleted = true`
    );
    const recentLogins = await pool.query(
      `SELECT COUNT(*) FROM users 
       WHERE last_login > NOW() - INTERVAL '24 hours' 
       AND is_deleted = false`
    );
    res.status(200).json({
      success: true,
      stats: {
        totalUsers: parseInt(totalUsers.rows[0].count),
        deletedUsers: parseInt(deletedUsers.rows[0].count),
        recentLogins: parseInt(recentLogins.rows[0].count)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  getAllUsers, getUser, createUser, 
  updateUser, deleteUser, getDeletedUsers, 
  restoreUser, getDashboardStats 
};
