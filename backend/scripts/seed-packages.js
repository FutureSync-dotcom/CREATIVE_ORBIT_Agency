const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Package = require('../models/Package');

dotenv.config({ path: path.join(__dirname, '../.env') });

const packages = [
  {
    name: 'Dynamic Web',
    category: 'Web & Mobile Dev',
    price: '$1,200',
    description: 'High-end responsive website design and development with modern tech stack.',
    features: ['Website Design & Development', 'Custom UI Components', 'CMS Integration', 'Mobile Optimization', 'Basic SEO'],
    icon: 'Code2',
    color: 'cyan',
    popular: true,
    order: 1
  },
  {
    name: 'App Ecosystem',
    category: 'Web & Mobile Dev',
    price: '$3,500',
    description: 'Full-scale mobile and web application development for established brands.',
    features: ['Mobile Application Development', 'Cross-platform (iOS/Android)', 'API Integration', 'Backend Support', 'App Store Submission'],
    icon: 'Smartphone',
    color: 'cyan',
    popular: false,
    order: 2
  },
  {
    name: 'Essential Brand',
    category: 'Logo & Identity',
    price: '$450',
    description: 'Establish your visual identity with professional, modern logo design.',
    features: ['Logo Design (3 Concepts)', 'Vector Source Files', 'Brand Color Palette', 'Typography Guide'],
    icon: 'PenTool',
    color: 'purple',
    popular: true,
    order: 3
  },
  {
    name: 'Corporate Identity',
    category: 'Logo & Identity',
    price: '$950',
    description: 'Complete branding suite including high-end stationery and digital assets.',
    features: ['Premium Logo Design', 'Stationery Design', 'Business Card Design', 'Letterhead & Envelopes', 'Brand Guidelines'],
    icon: 'Star',
    color: 'purple',
    popular: false,
    order: 4
  }
];

const seedPackages = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for package seeding...');

    await Package.deleteMany({});
    console.log('Cleared existing packages.');

    await Package.insertMany(packages);
    console.log('Successfully seeded packages!');

    process.exit();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

seedPackages();
