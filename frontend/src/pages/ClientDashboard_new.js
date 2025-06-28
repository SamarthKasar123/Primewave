import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const ClientDashboard = () => {
  const { user, token } = useAuth();
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

  // Fetch all projects for the client
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/projects/client/my-projects', {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          }
        });
        
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
        
        setStats({ active, completed, pending, rejected, extensions });
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProjects();
    }
  }, [token]);

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
      const res = await axios.post('http://localhost:5000/api/projects', newProject, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      });
      
      setProjects([res.data, ...projects]);
      setStats({
        ...stats,
        pending: stats.pending + 1
      });
      
      setNewProject({
        title: '',
        workType: 'short',
        deadline: '',
        budget: '',
        videoDuration: '',
        description: '',
        materialLinks: ''
      });
      
      setShowNewProjectForm(false);
    } catch (err) {
      console.error('Error creating project:', err);
      setError('Failed to create project. Please try again.');
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
      const res = await axios.patch(
        `http://localhost:5000/api/projects/${selectedProject._id}/respond-extension`,
        extensionResponse,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          }
        }
      );
      
      // Update the project in the list
      const updatedProjects = projects.map(p => 
        p._id === selectedProject._id ? res.data : p
      );
      
      setProjects(updatedProjects);
      
      // Update stats based on response
      if (extensionResponse.approved) {
        setStats({
          ...stats,
          active: stats.active + 1,
          extensions: stats.extensions - 1
        });
      }
      
      setSelectedProject(null);
      setShowExtensionForm(false);
    } catch (err) {
      console.error('Error responding to extension:', err);
      setError('Failed to respond to extension request. Please try again.');
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper function to get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="badge bg-secondary">Pending</span>;
      case 'accepted':
        return <span className="badge bg-primary">In Progress</span>;
      case 'rejected':
        return <span className="badge bg-danger">Rejected</span>;
      case 'completed':
        return <span className="badge bg-success">Completed</span>;
      case 'deadline_extension_requested':
        return <span className="badge bg-warning">Extension Requested</span>;
      case 'deadline_extension_approved':
        return <span className="badge bg-info">Extension Approved</span>;
      default:
        return <span className="badge bg-secondary">Unknown</span>;
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

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-12">
          <div className="bg-primary text-white rounded p-4 shadow">
            <h1 className="mb-0">Welcome, {user?.name || 'Client'}</h1>
            <p className="lead mb-0">Primewave Client Dashboard</p>
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
                      <button type="submit" className="btn btn-primary">Submit Project</button>
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
                          {projects.map((project) => (
                            <tr key={project._id}>
                              <td>{project.title}</td>
                              <td>{project.workType === 'short' ? 'Short Video' : 'Long Video'}</td>
                              <td>{formatDate(project.createdAt)}</td>
                              <td>{formatDate(project.deadline)}</td>
                              <td>{getStatusBadge(project.status)}</td>
                              <td>
                                <button 
                                  className="btn btn-sm btn-outline-primary me-2"
                                  onClick={() => {
                                    // View project details (will add modal later)
                                    console.log('View project:', project);
                                  }}
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
                                  <a
                                    href={project.submissionLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-sm btn-success"
                                  >
                                    Download
                                  </a>
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
                                <td>{formatDate(project.deadline)}</td>
                                <td>
                                  <button 
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => {
                                      console.log('View project details:', project);
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
                                    onClick={() => {
                                      console.log('View project details:', project);
                                    }}
                                  >
                                    View
                                  </button>
                                  {project.submissionLink && (
                                    <a
                                      href={project.submissionLink}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="btn btn-sm btn-success"
                                    >
                                      Download
                                    </a>
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
                                <td>{formatDate(project.deadline)}</td>
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
                                      onClick={() => {
                                        console.log('View project details:', project);
                                      }}
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
                                <td>{formatDate(project.deadline)}</td>
                                <td>
                                  <button 
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => {
                                      console.log('View project details:', project);
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
                                      console.log('View project details:', project);
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
    </div>
  );
};

export default ClientDashboard;
