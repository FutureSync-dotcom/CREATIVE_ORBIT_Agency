const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');

// @route   GET api/settings
// @desc    Get global settings
// @access  Public (for Maintenance mode check)
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/settings
// @desc    Update global settings
// @access  Private
router.put('/', auth, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      // Update all fields from body
      const fields = [
        'maintenanceMode', 
        'agencyName', 
        'contactEmail', 
        'phone', 
        'address', 
        'website', 
        'tagline',
        'socialLinks'
      ];
      
      fields.forEach(field => {
        if (req.body[field] !== undefined) {
          settings[field] = req.body[field];
        }
      });
      
      settings.updatedAt = Date.now();
    }
    await settings.save();
    res.json(settings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
