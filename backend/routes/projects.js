const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// @route   GET api/projects/client/:clientId
// @desc    Get projects by client ID
// @access  Private
router.get('/client/:clientId', auth, async (req, res) => {
  try {
    const projects = await Project.find({ client: req.params.clientId }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/projects
// @desc    Get all projects (Public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().populate('client', 'name company').sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/projects/:id
// @desc    Get project by ID (Public)
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('client', 'name company');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ message: 'Project not found' });
    res.status(500).send('Server Error');
  }
});

// @route   POST api/projects
// @desc    Create a project
// @access  Private
router.post('/', auth, async (req, res) => {
  const { name, client, status, progress, description, dueDate, budget, isFeatured, image, results, tags, challenge, link } = req.body;

  try {
    const newProject = new Project({
      name,
      client,
      status,
      progress,
      description,
      dueDate,
      budget,
      isFeatured,
      image,
      results,
      tags,
      challenge,
      link
    });

    const project = await newProject.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/projects/:id
// @desc    Update a project
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { name, client, status, progress, description, dueDate, budget, isFeatured, image, results, tags, challenge, link } = req.body;

  try {
    let project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: { name, client, status, progress, description, dueDate, budget, isFeatured, image, results, tags, challenge, link } },
      { new: true }
    );

    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/projects/:id
// @desc    Delete a project
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
