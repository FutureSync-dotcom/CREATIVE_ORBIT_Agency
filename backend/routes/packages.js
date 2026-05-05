const express = require('express');
const router = express.Router();
const Package = require('../models/Package');
const auth = require('../middleware/auth');

// @route   GET api/packages
// @desc    Get all packages
// @access  Public
router.get('/', async (req, res) => {
  try {
    const packages = await Package.find().sort({ order: 1 });
    res.json(packages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/packages
// @desc    Create a package
// @access  Private
router.post('/', auth, async (req, res) => {
  const { name, category, price, description, features, icon, color, popular, order } = req.body;

  try {
    const newPackage = new Package({
      name,
      category,
      price,
      description,
      features,
      icon,
      color,
      popular,
      order
    });

    const pkg = await newPackage.save();
    res.json(pkg);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/packages/:id
// @desc    Update a package
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { name, category, price, description, features, icon, color, popular, order } = req.body;

  try {
    let pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ message: 'Package not found' });

    pkg.name = name || pkg.name;
    pkg.category = category || pkg.category;
    pkg.price = price || pkg.price;
    pkg.description = description || pkg.description;
    pkg.features = features || pkg.features;
    pkg.icon = icon || pkg.icon;
    pkg.color = color || pkg.color;
    pkg.popular = popular !== undefined ? popular : pkg.popular;
    pkg.order = order !== undefined ? order : pkg.order;

    await pkg.save();
    res.json(pkg);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/packages/:id
// @desc    Delete a package
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ message: 'Package not found' });

    await pkg.deleteOne();
    res.json({ message: 'Package removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
