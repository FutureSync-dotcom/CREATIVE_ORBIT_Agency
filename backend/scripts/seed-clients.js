const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Client = require('../models/Client');

dotenv.config();

const seedClients = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for client seeding...');

    const initialClients = [
      {
        name: 'John Doe',
        company: 'Naccarry Tech',
        email: 'john@naccarry.tech',
        phone: '+1 555 123 4567',
        status: 'Active',
        totalProjects: 3,
        totalRevenue: 45000
      },
      {
        name: 'Sarah Smith',
        company: 'Global Trade Co.',
        email: 'sarah@globaltrade.com',
        phone: '+1 555 987 6543',
        status: 'Active',
        totalProjects: 1,
        totalRevenue: 25000
      },
      {
        name: 'Michael Brown',
        company: 'HealthSync',
        email: 'michael@healthsync.io',
        phone: '+1 555 456 7890',
        status: 'Lead',
        totalProjects: 0,
        totalRevenue: 0
      },
      {
        name: 'Emily Davis',
        company: 'StyleCloud Inc.',
        email: 'emily@stylecloud.com',
        phone: '+1 555 222 3333',
        status: 'Active',
        totalProjects: 2,
        totalRevenue: 18000
      }
    ];

    for (const clientData of initialClients) {
      const existingClient = await Client.findOne({ email: clientData.email });
      if (!existingClient) {
        const client = new Client(clientData);
        await client.save();
        console.log(`Created client: ${clientData.name} (${clientData.company})`);
      } else {
        console.log(`Client already exists: ${clientData.name}`);
      }
    }

    process.exit(0);
  } catch (err) {
    console.error('Error seeding clients:', err.message);
    process.exit(1);
  }
};

seedClients();
