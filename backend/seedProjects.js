const mongoose = require('mongoose');
require('dotenv').config();
const Project = require('./models/Project');
const Client = require('./models/Client');

const projects = [
  {
    name: 'Nexus Fintech Ecosystem',
    category: 'Web Application',
    image: 'https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?auto=format&fit=crop&w=1200&q=80',
    description: 'A revolutionary wealth management platform that processes $2M+ in daily transactions with zero latency. Built for the modern investor who demands real-time insights and institutional-grade security.',
    results: ['99.9% Uptime', '40% Faster Onboarding', '200k+ Active Users'],
    tags: ['React', 'D3.js', 'Firebase', 'TypeScript'],
    challenge: 'Designing a secure yet intuitive interface for complex financial data visualization while ensuring sub-millisecond data updates.',
    link: 'https://nexus-fintech.example.com',
    budget: 85000,
    status: 'Completed',
    progress: 100,
    isFeatured: true,
    dueDate: '2024-03-15'
  },
  {
    name: 'Lumina Fashion AR',
    category: 'Mobile App',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=80',
    description: 'A luxury fashion app that leverages Augmented Reality to let customers "try on" accessories from their mobile devices. Merging the physical and digital retail worlds into a single, seamless experience.',
    results: ['25% Conversion Boost', 'Global Shipping API', 'iOS & Android Support'],
    tags: ['SwiftUI', 'Node.js', 'Stripe', 'ARKit'],
    challenge: 'Integrating low-latency AR models into a high-performance shopping experience without draining mobile battery life.',
    link: 'https://lumina-fashion.example.com',
    budget: 120000,
    status: 'In Progress',
    progress: 75,
    isFeatured: true,
    dueDate: '2024-06-20'
  },
  {
    name: 'Aether Logistics AI',
    category: 'Enterprise Software',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    description: 'Autonomous supply chain management system powered by neural networks for predictive shipping. Optimizing global routes in real-time to reduce carbon footprint and operational costs.',
    results: ['Reduced Waste by 30%', 'AI-Route Optimization', 'Enterprise Scale Readiness'],
    tags: ['Three.js', 'Next.js', 'GSAP', 'Python'],
    challenge: 'Simplifying multi-layered logistical data into a real-time command center dashboard that any warehouse manager can master.',
    budget: 250000,
    status: 'Completed',
    progress: 100,
    isFeatured: true,
    dueDate: '2024-01-10'
  },
  {
    name: 'Vanguard Cyber Security',
    category: 'Cybersecurity',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    description: 'A proactive threat detection platform that uses machine learning to identify and neutralize zero-day vulnerabilities before they can be exploited.',
    results: ['Zero Data Breaches', '5ms Threat Detection', 'Military-Grade Encryption'],
    tags: ['Go', 'Kubernetes', 'Elasticsearch'],
    challenge: 'Handling terabytes of network traffic logs in real-time while maintaining a zero-false-positive rate for critical alerts.',
    budget: 180000,
    status: 'Completed',
    progress: 100,
    isFeatured: false,
    dueDate: '2023-11-20'
  },
  {
    name: 'Zenith Wellness Platform',
    category: 'Health Tech',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    description: 'A holistic health and meditation platform that tracks biometric data to provide personalized mindfulness routines and stress management techniques.',
    results: ['500k+ App Downloads', '4.9 Star Store Rating', 'Bio-Sync Integration'],
    tags: ['React Native', 'GraphQL', 'AWS'],
    challenge: 'Creating a calming user experience that encourages long-term engagement and daily mindfulness habits.',
    budget: 95000,
    status: 'In Progress',
    progress: 60,
    isFeatured: false,
    dueDate: '2024-08-12'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create a dummy client
    let client = await Client.findOne({ email: 'hello@nexus.com' });
    if (!client) {
      client = new Client({
        name: 'Nexus Corp',
        company: 'Nexus Industries',
        email: 'hello@nexus.com',
        status: 'Active',
        totalRevenue: 500000
      });
      await client.save();
      console.log('Dummy client created');
    }

    // Clear existing projects if needed (Optional: comment out if you want to keep existing)
    await Project.deleteMany({});
    console.log('Existing projects cleared');

    // Add projects
    for (const projectData of projects) {
      const project = new Project({
        ...projectData,
        client: client._id
      });
      await project.save();
    }

    console.log(`${projects.length} projects seeded successfully!`);
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
