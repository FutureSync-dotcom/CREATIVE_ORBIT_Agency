const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  agencyName: {
    type: String,
    default: 'Digital Agency'
  },
  contactEmail: {
    type: String,
    default: 'contact@agency.com'
  },
  phone: {
    type: String,
    default: '+1 (000) 000-0000'
  },
  address: {
    type: String,
    default: '123 Business St, Innovation City'
  },
  website: {
    type: String,
    default: 'https://youragency.com'
  },
  tagline: {
    type: String,
    default: 'Building the Future with Innovation'
  },
  socialLinks: {
    twitter: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    instagram: { type: String, default: '' },
    github: { type: String, default: '' }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Settings', SettingsSchema);
