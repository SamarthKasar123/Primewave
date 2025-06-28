const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// Create a new project (Client only)
router.post('/', auth, async (req, res) => {
  try {
    console.log('Project creation request received');
    console.log('User data:', req.user);
    console.log('Request body:', req.body);
    
    // Ensure only clients can create projects
    if (req.user.role !== 'client') {
      console.log('Rejected: User is not a client');
      return res.status(403).json({ message: 'Only clients can create projects' });
    }

    const {
      title,
      workType,
      deadline,
      budget,
      videoDuration,
      description,
      materialLinks
    } = req.body;

    const newProject = new Project({
      client: req.user.id,
      title,
      workType,
      deadline: new Date(deadline),
      budget,
      videoDuration,
      description,
      materialLinks,
      status: 'pending'
    });

    const savedProject = await newProject.save();
    console.log('Project created successfully:', savedProject);
    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
// Get all projects for logged-in client (Client only)
router.get('/client/my-projects', auth, async (req, res) => {
  try {
    console.log('Fetching client projects for user:', req.user.id);
    
    // Ensure only clients can access their projects
    if (req.user.role !== 'client') {
      console.log('Rejected: User is not a client');
      return res.status(403).json({ message: 'Access denied' });
    }

    const projects = await Project.find({ client: req.user.id }).sort({ createdAt: -1 });
    console.log(`Found ${projects.length} projects for client ${req.user.id}`);
    console.log('Projects:', projects);
    res.json(projects);
  } catch (error) {
    console.error('Get client projects error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all projects (Manager only)
router.get('/manager/all', auth, async (req, res) => {
  try {
    // Ensure only managers can view all projects
    if (req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const projects = await Project.find()
      .populate('client', 'name email whatsappNumber')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Get all projects error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update project status (Manager only - accept/reject)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    // Ensure only managers can update project status
    if (req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Only managers can update project status' });
    }

    const { status } = req.body;
    const validStatuses = ['accepted', 'rejected', 'completed'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // If accepting, assign to this manager
    if (status === 'accepted') {
      project.assignedManager = req.user.id;
    }

    project.status = status;
    await project.save();

    res.json(project);
  } catch (error) {
    console.error('Update project status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Request deadline extension (Manager only)
router.patch('/:id/request-extension', auth, async (req, res) => {
  try {
    // Ensure only managers can request deadline extensions
    if (req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Only managers can request deadline extensions' });
    }

    const { newDeadline, reason } = req.body;
    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Save extension request data
    project.deadlineExtension = {
      requestedDate: new Date(newDeadline),
      reason: reason,
      approved: false
    };
    
    project.status = 'deadline_extension_requested';
    await project.save();

    res.json(project);
  } catch (error) {
    console.error('Request extension error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Respond to deadline extension (Client only)
router.patch('/:id/respond-extension', auth, async (req, res) => {
  try {
    // Ensure only clients can respond to deadline extensions
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can respond to deadline extensions' });
    }

    const { newDeadline, reason, approved } = req.body;
    
    if (!newDeadline && approved) {
      return res.status(400).json({ message: 'New deadline is required when approving' });
    }

    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Ensure only the project owner can respond
    if (project.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only respond to your own projects' });
    }

    project.deadlineExtension = {
      requestedDate: new Date(newDeadline),
      reason,
      approved
    };

    if (approved) {
      project.deadline = new Date(newDeadline);
      project.status = 'deadline_extension_approved';
    } else {
      project.status = 'accepted'; // Revert to accepted status if extension is rejected
    }

    await project.save();

    res.json(project);
  } catch (error) {
    console.error('Respond to extension error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Submit completed project (Manager only)
router.patch('/:id/submit', auth, async (req, res) => {
  try {
    // Ensure only managers can submit completed projects
    if (req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Only managers can submit completed projects' });
    }

    const { submissionLink } = req.body;
    
    if (!submissionLink) {
      return res.status(400).json({ message: 'Submission link is required' });
    }

    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Ensure only the assigned manager can submit
    if (project.assignedManager && project.assignedManager.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the assigned manager can submit this project' });
    }

    project.submissionLink = submissionLink;
    project.status = 'completed';
    await project.save();

    res.json(project);
  } catch (error) {
    console.error('Submit project error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a single project by ID (for both client and manager)
router.get('/:id', auth, async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId)
      .populate('client', 'name email whatsappNumber')
      .populate('assignedManager', 'username email');
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check authorization
    if (
      req.user.role === 'client' && project.client._id.toString() !== req.user.id || 
      req.user.role === 'manager' && project.assignedManager && project.assignedManager._id.toString() !== req.user.id && project.status !== 'pending'
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Manager approve deadline extension
router.patch('/:id/extension/approve', auth, async (req, res) => {
  try {
    // Ensure only managers can approve deadline extensions
    if (req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Only managers can approve deadline extensions' });
    }

    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.status !== 'deadline_extension_requested') {
      return res.status(400).json({ message: 'No extension request found for this project' });
    }

    // Update the project deadline if extension request has a new deadline
    if (project.deadlineExtension && project.deadlineExtension.requestedDate) {
      project.deadline = project.deadlineExtension.requestedDate;
    }
    
    project.status = 'deadline_extension_approved';
    await project.save();

    res.json(project);
  } catch (error) {
    console.error('Approve extension error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Manager reject deadline extension
router.patch('/:id/extension/reject', auth, async (req, res) => {
  try {
    // Ensure only managers can reject deadline extensions
    if (req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Only managers can reject deadline extensions' });
    }

    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.status !== 'deadline_extension_requested') {
      return res.status(400).json({ message: 'No extension request found for this project' });
    }

    // Revert to accepted status
    project.status = 'accepted';
    
    // Clear extension request data
    if (project.deadlineExtension) {
      project.deadlineExtension = undefined;
    }
    
    await project.save();

    res.json(project);
  } catch (error) {
    console.error('Reject extension error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
