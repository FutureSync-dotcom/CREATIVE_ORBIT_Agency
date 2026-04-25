const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Lead = require('../models/Lead');
const Deal = require('../models/Deal');
const Client = require('../models/Client');
const Invoice = require('../models/Invoice');
const Admin = require('../models/Admin');
const auth = require('../middleware/auth');

// @route   GET api/stats
// @desc    Get dashboard stats
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({ status: 'In Progress' });
    const completedProjects = await Project.countDocuments({ status: 'Completed' });
    
    // Revenue from paid invoices
    const paidInvoices = await Invoice.find({ status: 'Paid' });
    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);

    // Leads & Conversion
    const totalLeads = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ 
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
    });

    // Deals Pipeline
    const activeDeals = await Deal.find({ stage: { $nin: ['Won', 'Lost'] } });
    const pipelineValue = activeDeals.reduce((sum, d) => sum + (d.value || 0), 0);

    const totalClients = await Client.countDocuments();

    // System Status
    const mongoose = require('mongoose');
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    
    // Get current admin last login
    const currentAdmin = await Admin.findById(req.admin.id);
    const lastLogin = currentAdmin?.lastLogin || currentAdmin?.createdAt;

    res.json({
      totalRevenue,
      activeProjects,
      totalProjects,
      completedProjects,
      totalLeads,
      newLeads,
      pipelineValue,
      totalClients,
      avgResponse: '1.8h',
      systemStatus: {
        backend: 'Connected',
        database: dbStatus,
        lastLogin: lastLogin
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
