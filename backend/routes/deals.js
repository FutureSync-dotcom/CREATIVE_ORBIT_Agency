const express = require('express');
const router = express.Router();
const Deal = require('../models/Deal');
const auth = require('../middleware/auth');

// @route   GET api/deals
// @desc    Get all deals with populated client
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const deals = await Deal.find()
      .populate('client', 'name company email')
      .sort({ createdAt: -1 });
    res.json(deals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/deals
// @desc    Create a deal
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const newDeal = new Deal(req.body);
    const savedDeal = await newDeal.save();
    const populatedDeal = await Deal.findById(savedDeal._id).populate('client', 'name company email');
    res.json(populatedDeal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/deals/:id
// @desc    Update a deal
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedDeal = await Deal.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate('client', 'name company email');
    res.json(updatedDeal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/deals/:id
// @desc    Delete a deal
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    await Deal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deal removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
