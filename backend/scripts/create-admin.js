const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for script...');

    const email = 'qadirdadkazi@gmail.com';
    const password = 'Password1';

    // Optional: Delete existing test admin if needed
    await Admin.deleteOne({ email: 'qadirdadkazi@gmail.com' });

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log('Admin already exists.');
      process.exit(0);
    }

    const newAdmin = new Admin({
      email,
      password,
      name: 'Qadirdad Kazi',
      role: 'Super Admin'
    });

    await newAdmin.save();
    console.log('Admin user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);

    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err.message);
    process.exit(1);
  }
};

createAdmin();
