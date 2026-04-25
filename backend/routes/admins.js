const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const auth = require('../middleware/auth');

// @route   GET api/admins
// @desc    Get all admins
// @access  Private (Super Admin only ideally, but keeping it simple for now)
router.get('/', auth, async (req, res) => {
  try {
    const admins = await Admin.find().select('-password');
    res.json(admins);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/admins
// @desc    Create a new admin
// @access  Private
router.post('/', auth, async (req, res) => {
  const { name, email, password, role, permissions } = req.body;

  try {
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    admin = new Admin({
      name,
      email,
      password,
      role: role || 'admin',
      permissions: permissions || ['dashboard']
    });

    await admin.save();
    res.json(admin);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/admins/:id
// @desc    Update admin permissions or info
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { name, email, role, permissions } = req.body;

  try {
    let admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (name) admin.name = name;
    if (email) admin.email = email;
    if (role) admin.role = role;
    if (permissions) admin.permissions = permissions;

    await admin.save();
    res.json(admin);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/admins/:id
// @desc    Delete an admin
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Prevent deleting self
    if (admin.id === req.admin.id) {
      return res.status(400).json({ message: 'You cannot delete yourself' });
    }

    await admin.deleteOne();
    res.json({ message: 'Admin removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
