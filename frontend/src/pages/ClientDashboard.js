import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import ProjectDetailModal from '../components/ProjectDetailModal';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    active: 0,
    completed: 0,
    pending: 0,
    rejected: 0,
    extensions: 0
  });
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [showExtensionForm, setShowExtensionForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);

  // Form state for new project
  const [newProject, setNewProject] = useState({
    title: '',
    workType: 'short',
    deadline: '',
    budget: '',
    videoDuration: '',
    description: '',
    materialLinks: ''
  });

  // Form state for extension response
  const [extensionResponse, setExtensionResponse] = useState({
    newDeadline: '',
    reason: '',
    approved: true
  });

  // Fetch all projects for the client - moved outside useEffect to be reusable
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching client projects...');
      console.log('API base URL:', process.env.REACT_APP_API_URL);
      console.log('Current user:', user);
      
      const res = await api.get('/projects/client/my-projects');
      console.log('Projects data received:', res.data);
      
      // Check if response data is valid
      if (!res.data || !Array.isArray(res.data)) {
        console.error('Invalid response data format:', res.data);
        setError('Received invalid data from server. Please reload.');
        setProjects([]);
        return;
      }
      
      setProjects(res.data);
      
      // Calculate statistics
      const active = res.data.filter(p => p.status === 'accepted').length;
      const completed = res.data.filter(p => p.status === 'completed').length;
      const pending = res.data.filter(p => p.status === 'pending').length;
      const rejected = res.data.filter(p => p.status === 'rejected').length;
      const extensions = res.data.filter(p => 
        p.status === 'deadline_extension_requested' || 
        p.status === 'deadline_extension_approved'
      ).length;
      
      console.log('Project stats:', { active, completed, pending, rejected, extensions });
      setStats({ active, completed, pending, rejected, extensions });
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects: ' + (err.response?.data?.message || err.message || 'Unknown error'));
      // Set empty projects array on error
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all projects for the client
  useEffect(() => {

    if (user && user.id) {
      fetchProjects();
    } else {
      console.log('No user ID available, not fetching projects');
      setLoading(false);
    }
  }, [user]);
  
  // Auto refresh data every 30 seconds
  useEffect(() => {
    if (!user || !user.id) return;
    
    const interval = setInterval(() => {
      console.log('Auto-refreshing client project data...');
      fetchProjects();
    }, 30000); // 30 seconds
    
    return () => clearInterval(interval);
  }, [user]);

  // Handle new project form changes
  const handleNewProjectChange = (e) => {
    setNewProject({
      ...newProject,
      [e.target.name]: e.target.value
    });
  };

  // Handle new project submission
  const handleNewProjectSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('Submitting new project:', newProject);
      setError(null);
      
      // Check for any missing required fields
      const requiredFields = ['title', 'workType', 'deadline', 'budget', 'videoDuration', 'description', 'materialLinks'];
      const missingFields = requiredFields.filter(field => !newProject[field]);
      
      if (missingFields.length > 0) {
        setError(`Please fill all required fields: ${missingFields.join(', ')}`);
        return;
      }
      
      setFormSubmitting(true); // Start form submission loading
      
      const res = await api.post('/projects', newProject);
      console.log('Project created successfully:', res.data);
      
      // Refresh the project list
      await fetchProjects();
      
      // Reset form
      setNewProject({
        title: '',
        workType: 'short',
        deadline: '',
        budget: '',
        videoDuration: '',
        description: '',
        materialLinks: ''
      });
      
      // Close form and show success message
      setShowNewProjectForm(false);
      alert('Project created successfully!');
    } catch (err) {
      console.error('Project creation error:', err);
      setError('Failed to create project: ' + (err.response?.data?.message || err.message || 'Unknown error'));
    } finally {
      setFormSubmitting(false); // End form submission loading
    }
  };

  // Handle extension response form changes
  const handleExtensionResponseChange = (e) => {
    if (e.target.name === 'approved') {
      setExtensionResponse({
        ...extensionResponse,
        approved: e.target.value === 'true'
      });
    } else {
      setExtensionResponse({
        ...extensionResponse,
        [e.target.name]: e.target.value
      });
    }
  };

  // Handle extension response submission
  const handleExtensionResponseSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await api.patch(
        `/projects/${selectedProject._id}/respond-extension`,
        extensionResponse
      );
      
      // Refresh the project list with updated data
      await fetchProjects();
      
      setSelectedProject(null);
      setShowExtensionForm(false);
      
      alert(extensionResponse.approved ? 
        'Extension request approved. New deadline has been set!' : 
        'Extension request declined.');
    } catch (err) {
      console.error('Error responding to extension:', err);
      setError('Failed to respond to extension request. Please try again.');
    }
  };

  // Function to view project details
  const viewProjectDetails = (project) => {
    setSelectedProject(project);
    setShowProjectModal(true);
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper function for status badges
  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { text: 'Pending Approval', class: 'bg-warning' },
      accepted: { text: 'In Progress', class: 'bg-info' },
      rejected: { text: 'Rejected', class: 'bg-danger' },
      completed: { text: 'Completed', class: 'bg-success' },
      deadline_extension_requested: { text: 'Extension Requested', class: 'bg-secondary' },
      deadline_extension_approved: { text: 'Extension Approved', class: 'bg-primary' }
    };

    const statusInfo = statusMap[status] || { text: status, class: 'bg-secondary' };
    
    return (
      <span className={`badge ${statusInfo.class}`}>
        {statusInfo.text}
      </span>
    );
  };

  // Get deadline status with color indicator
  const getDeadlineStatus = (deadline) => {
    if (!deadline) return { text: 'No deadline', className: 'text-secondary' };

    const now = new Date();
    const deadlineDate = new Date(deadline);
    const daysLeft = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) {
      return { text: 'Overdue', className: 'text-danger fw-bold' };
    } else if (daysLeft === 0) {
      return { text: 'Due today!', className: 'text-warning fw-bold' };
    } else if (daysLeft <= 2) {
      return { text: `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`, className: 'text-warning' };
    } else if (daysLeft <= 7) {
      return { text: `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`, className: 'text-info' };
    } else {
      return { text: `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`, className: 'text-success' };
    }
  };

  // Handle opening the extension response form
  const openExtensionForm = (project) => {
    setSelectedProject(project);
    setExtensionResponse({
      newDeadline: '',
      reason: '',
      approved: true
    });
    setShowExtensionForm(true);
  };

  // This function was replaced by viewProjectDetails

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-12">
          <div className="bg-primary text-white rounded p-4 shadow">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="mb-0">Welcome, {user?.name || 'Client'}</h1>
                <p className="lead mb-0">Primewave Client Dashboard</p>
              </div>
              <button 
                className="btn btn-outline-light" 
                onClick={() => fetchProjects()}
                disabled={loading}
              >
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Refreshing...</>
                ) : (
                  <><i className="bi bi-arrow-clockwise me-2"></i> Refresh</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Statistics Cards */}
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="display-4 mb-3 text-primary">
                <i className="bi bi-play-circle"></i>
              </div>
              <h5 className="card-title">Active Projects</h5>
              <h2 className="display-6 fw-bold">{stats.active}</h2>
              <p className="text-muted mb-0">In progress</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="display-4 mb-3 text-success">
                <i className="bi bi-check-circle"></i>
              </div>
              <h5 className="card-title">Completed Projects</h5>
              <h2 className="display-6 fw-bold">{stats.completed}</h2>
              <p className="text-muted mb-0">Successfully delivered</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="display-4 mb-3 text-warning">
                <i className="bi bi-clock-history"></i>
              </div>
              <h5 className="card-title">Pending Review</h5>
              <h2 className="display-6 fw-bold">{stats.pending}</h2>
              <p className="text-muted mb-0">Awaiting manager approval</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row mt-5">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="mb-0">Your Projects</h3>
            <button 
              className="btn btn-primary" 
              onClick={() => setShowNewProjectForm(!showNewProjectForm)}
            >
              <i className="bi bi-plus-circle me-2"></i> Add New Project
            </button>
          </div>

          {/* New Project Form */}
          {showNewProjectForm && (
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">Create New Project</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleNewProjectSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="title" className="form-label">Project Title</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="title"
                        name="title"
                        value={newProject.title}
                        onChange={handleNewProjectChange}
                        required 
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="workType" className="form-label">Work Type</label>
                      <select 
                        className="form-select" 
                        id="workType"
                        name="workType"
                        value={newProject.workType}
                        onChange={handleNewProjectChange}
                        required
                      >
                        <option value="short">Short Video</option>
                        <option value="long">Long Video</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="deadline" className="form-label">Deadline</label>
                      <input 
                        type="date" 
                        className="form-control" 
                        id="deadline"
                        name="deadline"
                        value={newProject.deadline}
                        onChange={handleNewProjectChange}
                        min={new Date().toISOString().split('T')[0]}
                        required 
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="budget" className="form-label">Budget (USD)</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        id="budget"
                        name="budget"
                        value={newProject.budget}
                        onChange={handleNewProjectChange}
                        min="1"
                        required 
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="videoDuration" className="form-label">Video Duration</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="videoDuration"
                        name="videoDuration"
                        value={newProject.videoDuration}
                        onChange={handleNewProjectChange}
                        placeholder="e.g., 2:30 min, 5-7 min"
                        required 
                      />
                    </div>
                    <div className="col-12">
                      <label htmlFor="description" className="form-label">Project Description & Requirements</label>
                      <textarea 
                        className="form-control" 
                        id="description"
                        name="description"
                        value={newProject.description}
                        onChange={handleNewProjectChange}
                        rows="4"
                        required 
                      ></textarea>
                    </div>
                    <div className="col-12">
                      <label htmlFor="materialLinks" className="form-label">Material Links (Google Drive, etc.)</label>
                      <textarea 
                        className="form-control" 
                        id="materialLinks"
                        name="materialLinks"
                        value={newProject.materialLinks}
                        onChange={handleNewProjectChange}
                        rows="2"
                        placeholder="Paste Google Drive or other file sharing links here"
                        required 
                      ></textarea>
                    </div>
                    <div className="col-12 d-flex justify-content-end">
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary me-2"
                        onClick={() => setShowNewProjectForm(false)}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={formSubmitting} // Disable button while submitting
                      >
                        {formSubmitting ? (
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        ) : null}
                        Submit Project
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Extension Response Form */}
          {showExtensionForm && selectedProject && (
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">Respond to Deadline Extension Request</h5>
                <p className="mb-0 small text-muted">For project: {selectedProject.title}</p>
              </div>
              <div className="card-body">
                <form onSubmit={handleExtensionResponseSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Project Deadline</label>
                      <p className="form-control-static">{formatDate(selectedProject.deadline)}</p>
                    </div>
                    <div className="col-12">
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="approved"
                          id="approveExtension"
                          value="true"
                          checked={extensionResponse.approved === true}
                          onChange={handleExtensionResponseChange}
                        />
                        <label className="form-check-label" htmlFor="approveExtension">
                          Approve Extension
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="approved"
                          id="rejectExtension"
                          value="false"
                          checked={extensionResponse.approved === false}
                          onChange={handleExtensionResponseChange}
                        />
                        <label className="form-check-label" htmlFor="rejectExtension">
                          Reject Extension
                        </label>
                      </div>
                    </div>
                    {extensionResponse.approved && (
                      <div className="col-md-6">
                        <label htmlFor="newDeadline" className="form-label">New Deadline Date</label>
                        <input
                          type="date"
                          className="form-control"
                          id="newDeadline"
                          name="newDeadline"
                          value={extensionResponse.newDeadline}
                          onChange={handleExtensionResponseChange}
                          min={new Date().toISOString().split('T')[0]}
                          required={extensionResponse.approved}
                        />
                      </div>
                    )}
                    <div className="col-12">
                      <label htmlFor="reason" className="form-label">Reason / Comments</label>
                      <textarea
                        className="form-control"
                        id="reason"
                        name="reason"
                        value={extensionResponse.reason}
                        onChange={handleExtensionResponseChange}
                        rows="3"
                      ></textarea>
                    </div>
                    <div className="col-12 d-flex justify-content-end">
                      <button
                        type="button"
                        className="btn btn-outline-secondary me-2"
                        onClick={() => {
                          setSelectedProject(null);
                          setShowExtensionForm(false);
                        }}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">Submit Response</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Project Tabs */}
          <ul className="nav nav-tabs" id="projectTabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button 
                className="nav-link active" 
                id="all-tab" 
                data-bs-toggle="tab" 
                data-bs-target="#all" 
                type="button" 
                role="tab" 
                aria-controls="all"
                aria-selected="true"
              >
                All Projects
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button 
                className="nav-link" 
                id="active-tab" 
                data-bs-toggle="tab" 
                data-bs-target="#active" 
                type="button" 
                role="tab"
                aria-controls="active"
                aria-selected="false"
              >
                In Progress
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button 
                className="nav-link" 
                id="completed-tab" 
                data-bs-toggle="tab" 
                data-bs-target="#completed" 
                type="button" 
                role="tab"
                aria-controls="completed"
                aria-selected="false"
              >
                Completed
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button 
                className="nav-link" 
                id="extensions-tab" 
                data-bs-toggle="tab" 
                data-bs-target="#extensions" 
                type="button" 
                role="tab"
                aria-controls="extensions"
                aria-selected="false"
              >
                Extension Requests
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button 
                className="nav-link" 
                id="pending-tab" 
                data-bs-toggle="tab" 
                data-bs-target="#pending" 
                type="button" 
                role="tab"
                aria-controls="pending"
                aria-selected="false"
              >
                Pending
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button 
                className="nav-link" 
                id="rejected-tab" 
                data-bs-toggle="tab" 
                data-bs-target="#rejected" 
                type="button" 
                role="tab"
                aria-controls="rejected"
                aria-selected="false"
              >
                Rejected
              </button>
            </li>
          </ul>
          
          <div className="tab-content" id="projectTabsContent">
            {/* All Projects Tab */}
            <div className="tab-pane fade show active" id="all" role="tabpanel" aria-labelledby="all-tab">
              <div className="card border-top-0 rounded-0 rounded-bottom shadow-sm">
                <div className="card-body">
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2">Loading projects...</p>
                    </div>
                  ) : error ? (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  ) : projects.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="mb-0">No projects found. Create a new project to get started.</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Project Name</th>
                            <th>Type</th>
                            <th>Created</th>
                            <th>Deadline</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projects.map((project) => (                              <tr key={project._id}>
                                <td>
                                  <button 
                                    className="btn btn-link p-0 text-start text-decoration-none"
                                    onClick={() => viewProjectDetails(project)}
                                    style={{border: 'none', background: 'none', color: 'inherit'}}
                                  >
                                    {project.title}
                                  </button>
                                </td>
                                <td>{project.workType === 'short' ? 'Short Video' : 'Long Video'}</td>
                                <td>{formatDate(project.createdAt)}</td>
                                <td>
                                  <span className={getDeadlineStatus(project.deadline).className}>
                                    {formatDate(project.deadline)}
                                  </span>
                                </td>
                                <td>{getStatusBadge(project.status)}</td>
                              <td>
                                <button 
                                  className="btn btn-sm btn-outline-primary me-2"
                                  onClick={() => viewProjectDetails(project)}
                                >
                                  View
                                </button>
                                {project.status === 'deadline_extension_requested' && (
                                  <button
                                    className="btn btn-sm btn-warning"
                                    onClick={() => openExtensionForm(project)}
                                  >
                                    Respond
                                  </button>
                                )}
                                {project.status === 'completed' && project.submissionLink && (
                                  <button
                                    onClick={() => viewProjectDetails(project)}
                                    className="btn btn-sm btn-success"
                                  >
                                    View Submission
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* In Progress Tab */}
            <div className="tab-pane fade" id="active" role="tabpanel" aria-labelledby="active-tab">
              <div className="card border-top-0 rounded-0 rounded-bottom shadow-sm">
                <div className="card-body">
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : projects.filter(p => p.status === 'accepted').length === 0 ? (
                    <div className="text-center py-4">
                      <p className="mb-0">No active projects.</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Project Name</th>
                            <th>Type</th>
                            <th>Created</th>
                            <th>Deadline</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projects
                            .filter(project => project.status === 'accepted')
                            .map((project) => (
                              <tr key={project._id}>
                                <td>{project.title}</td>
                                <td>{project.workType === 'short' ? 'Short Video' : 'Long Video'}</td>
                                <td>{formatDate(project.createdAt)}</td>
                                <td>
                                  <span className={getDeadlineStatus(project.deadline).className}>
                                    {formatDate(project.deadline)}
                                  </span>
                                </td>
                                <td>
                                  <button 
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => {
                                      viewProjectDetails(project);
                                    }}
                                  >
                                    View
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Completed Tab */}
            <div className="tab-pane fade" id="completed" role="tabpanel" aria-labelledby="completed-tab">
              <div className="card border-top-0 rounded-0 rounded-bottom shadow-sm">
                <div className="card-body">
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : projects.filter(p => p.status === 'completed').length === 0 ? (
                    <div className="text-center py-4">
                      <p className="mb-0">No completed projects yet.</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Project Name</th>
                            <th>Type</th>
                            <th>Completed Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projects
                            .filter(project => project.status === 'completed')
                            .map((project) => (
                              <tr key={project._id}>
                                <td>{project.title}</td>
                                <td>{project.workType === 'short' ? 'Short Video' : 'Long Video'}</td>
                                <td>{formatDate(project.updatedAt)}</td>
                                <td>
                                  <button 
                                    className="btn btn-sm btn-outline-primary me-2"
                                    onClick={() => viewProjectDetails(project)}
                                  >
                                    View
                                  </button>
                                  {project.submissionLink && (
                                    <button
                                      onClick={() => viewProjectDetails(project)}
                                      className="btn btn-sm btn-success"
                                    >
                                      View Submission
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Extension Requests Tab */}
            <div className="tab-pane fade" id="extensions" role="tabpanel" aria-labelledby="extensions-tab">
              <div className="card border-top-0 rounded-0 rounded-bottom shadow-sm">
                <div className="card-body">
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : projects.filter(p => p.status === 'deadline_extension_requested' || p.status === 'deadline_extension_approved').length === 0 ? (
                    <div className="text-center py-4">
                      <p className="mb-0">No extension requests.</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Project Name</th>
                            <th>Type</th>
                            <th>Current Deadline</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projects
                            .filter(project => project.status === 'deadline_extension_requested' || project.status === 'deadline_extension_approved')
                            .map((project) => (
                              <tr key={project._id}>
                                <td>{project.title}</td>
                                <td>{project.workType === 'short' ? 'Short Video' : 'Long Video'}</td>
                                <td>
                                  <div className="d-flex flex-column">
                                    <span>{formatDate(project.deadline)}</span>
                                    <small className={getDeadlineStatus(project.deadline).className}>
                                      <i className="bi bi-clock me-1"></i>
                                      {getDeadlineStatus(project.deadline).text}
                                    </small>
                                  </div>
                                </td>
                                <td>{getStatusBadge(project.status)}</td>
                                <td>
                                  {project.status === 'deadline_extension_requested' ? (
                                    <button
                                      className="btn btn-sm btn-warning"
                                      onClick={() => openExtensionForm(project)}
                                    >
                                      Respond
                                    </button>
                                  ) : (
                                    <button 
                                      className="btn btn-sm btn-outline-primary"
                                      onClick={() => viewProjectDetails(project)}
                                    >
                                      View
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Pending Tab */}
            <div className="tab-pane fade" id="pending" role="tabpanel" aria-labelledby="pending-tab">
              <div className="card border-top-0 rounded-0 rounded-bottom shadow-sm">
                <div className="card-body">
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : projects.filter(p => p.status === 'pending').length === 0 ? (
                    <div className="text-center py-4">
                      <p className="mb-0">No pending projects.</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Project Name</th>
                            <th>Type</th>
                            <th>Created</th>
                            <th>Deadline</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projects
                            .filter(project => project.status === 'pending')
                            .map((project) => (
                              <tr key={project._id}>
                                <td>{project.title}</td>
                                <td>{project.workType === 'short' ? 'Short Video' : 'Long Video'}</td>
                                <td>{formatDate(project.createdAt)}</td>
                                <td>
                                  <span className={getDeadlineStatus(project.deadline).className}>
                                    {formatDate(project.deadline)}
                                  </span>
                                </td>
                                <td>
                                  <button 
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => {
                                      viewProjectDetails(project);
                                    }}
                                  >
                                    View
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Rejected Tab */}
            <div className="tab-pane fade" id="rejected" role="tabpanel" aria-labelledby="rejected-tab">
              <div className="card border-top-0 rounded-0 rounded-bottom shadow-sm">
                <div className="card-body">
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : projects.filter(p => p.status === 'rejected').length === 0 ? (
                    <div className="text-center py-4">
                      <p className="mb-0">No rejected projects.</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Project Name</th>
                            <th>Type</th>
                            <th>Created</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projects
                            .filter(project => project.status === 'rejected')
                            .map((project) => (
                              <tr key={project._id}>
                                <td>{project.title}</td>
                                <td>{project.workType === 'short' ? 'Short Video' : 'Long Video'}</td>
                                <td>{formatDate(project.createdAt)}</td>
                                <td>
                                  <button 
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => {
                                      viewProjectDetails(project);
                                    }}
                                  >
                                    View
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Details Modal */}
      <ProjectDetailModal
        show={showProjectModal}
        onHide={() => setShowProjectModal(false)}
        project={selectedProject}
        formatDate={formatDate}
        getStatusBadge={getStatusBadge}
        onSubmitWork={null} // Clients don't submit work
      />
    </div>
  );
};

export default ClientDashboard;
