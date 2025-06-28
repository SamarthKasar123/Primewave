const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  workType: {
    type: String,
    enum: ['short', 'long'],
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  budget: {
    type: Number,
    required: true
  },
  videoDuration: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  materialLinks: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'deadline_extension_requested', 'deadline_extension_approved'],
    default: 'pending'
  },
  assignedManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Manager',
    default: null
  },
  submissionLink: {
    type: String,
    default: null
  },
  deadlineExtension: {
    requestedDate: Date,
    reason: String,
    approved: Boolean
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp when document is modified
projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
