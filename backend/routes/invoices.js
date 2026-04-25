const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const auth = require('../middleware/auth');

// @route   GET api/invoices
// @desc    Get all invoices with populated client and project
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('client', 'name company')
      .populate('project', 'name')
      .sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/invoices
// @desc    Create an invoice
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const newInvoice = new Invoice(req.body);
    const savedInvoice = await newInvoice.save();
    const populatedInvoice = await Invoice.findById(savedInvoice._id)
      .populate('client', 'name company')
      .populate('project', 'name');
    res.json(populatedInvoice);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/invoices/:id
// @desc    Update an invoice
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate('client', 'name company').populate('project', 'name');
    res.json(updatedInvoice);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/invoices/:id
// @desc    Delete an invoice
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Invoice removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
