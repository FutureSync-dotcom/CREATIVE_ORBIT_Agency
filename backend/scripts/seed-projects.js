const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Project = require('../models/Project');
const Client = require('../models/Client');

dotenv.config();

const seedProjects = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for project seeding...');

    // Clear existing projects
    await Project.deleteMany();
    console.log('Cleared existing projects.');

    // Fetch clients to link them
    const clients = await Client.find();
    if (clients.length === 0) {
      console.log('No clients found. Please seed clients first.');
      process.exit(1);
    }

    const naccarryClient = clients.find(c => c.company === 'Naccarry Tech') || clients[0];
    const healthSyncClient = clients.find(c => c.company === 'HealthSync') || clients[0];
    const styleCloudClient = clients.find(c => c.company === 'StyleCloud Inc.') || clients[0];

    const initialProjects = [
      {
        name: 'Naccarry Mobile App',
        client: naccarryClient._id,
        status: 'In Progress',
        progress: 65,
        budget: 15000,
        dueDate: new Date('2023-12-15'),
        description: 'A logistics and transport tracking application built with Flutter.'
      },
      {
        name: 'HealthSync Dashboard',
        client: healthSyncClient._id,
        status: 'Pending',
        progress: 10,
        budget: 12000,
        dueDate: new Date('2024-01-20'),
        description: 'Internal admin panel for managing healthcare data.'
      },
      {
        name: 'E-commerce Rebrand',
        client: styleCloudClient._id,
        status: 'Completed',
        progress: 100,
        budget: 8500,
        dueDate: new Date('2023-10-30'),
        description: 'Complete UI/UX overhaul of the main store page.'
      },
      {
        name: 'Corporate Website',
        client: naccarryClient._id,
        status: 'In Progress',
        progress: 45,
        budget: 5000,
        dueDate: new Date('2023-11-25'),
        description: 'Responsive multi-page website for business presence.'
      }
    ];

    await Project.insertMany(initialProjects);
    console.log('Successfully seeded projects linked to clients.');

    process.exit(0);
  } catch (err) {
    console.error('Error seeding projects:', err.message);
    process.exit(1);
  }
};

seedProjects();
