import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const ManagerDashboard = () => {
  const { user, token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    pending: 0,
    extensions: 0
  });
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [submissionLink, setSubmissionLink] = useState('');

  // Fetch all projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/projects/manager/all', {
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
        const extensions = res.data.filter(p => 
          p.status === 'deadline_extension_requested' || 
          p.status === 'deadline_extension_approved'
        ).length;
        
        setStats({
          total: res.data.length,
          active,
          completed,
          pending,
          extensions
        });
        
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

  // Handle project status update (accept/reject)
  const handleUpdateStatus = async (projectId, newStatus) => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/projects/${projectId}/status`,
        { status: newStatus },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          }
        }
      );
      
      // Update the project in the list
      const updatedProjects = projects.map(p => 
        p._id === projectId ? res.data : p
      );
      
      setProjects(updatedProjects);
      
      // Update stats based on new status
      if (newStatus === 'accepted') {
        setStats({
          ...stats,
          active: stats.active + 1,
          pending: stats.pending - 1
        });
      } else if (newStatus === 'rejected') {
        setStats({
          ...stats,
          pending: stats.pending - 1
        });
      } else if (newStatus === 'completed') {
        setStats({
          ...stats,
          active: stats.active - 1,
          completed: stats.completed + 1
        });
      }
    } catch (err) {
      console.error(`Error updating project status to ${newStatus}:`, err);
      setError(`Failed to update project status. Please try again.`);
    }
  };

  // Handle request for deadline extension
  const handleRequestExtension = async (projectId) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/projects/${projectId}/request-extension`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          }
        }
      );
      
      // Update projects after request
      const updatedProjects = projects.map(p => 
        p._id === projectId ? { ...p, status: 'deadline_extension_requested' } : p
      );
      
      setProjects(updatedProjects);
      
      // Update stats
      setStats({
        ...stats,
        active: stats.active - 1,
        extensions: stats.extensions + 1
      });
    } catch (err) {
      console.error('Error requesting deadline extension:', err);
      setError('Failed to request deadline extension. Please try again.');
    }
  };

  // Handle project submission
  const handleProjectSubmission = async (e) => {
    e.preventDefault();
    
    if (!selectedProject || !submissionLink) {
      setError('Please provide a submission link');
      return;
    }
    
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/projects/${selectedProject._id}/submit`,
        { submissionLink },
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
      
      // Update stats
      setStats({
        ...stats,
        active: stats.active - 1,
        completed: stats.completed + 1
      });
      
      setSelectedProject(null);
      setSubmissionLink('');
      setShowSubmissionForm(false);
    } catch (err) {
      console.error('Error submitting project:', err);
      setError('Failed to submit project. Please try again.');
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Open submission form for a project
  const openSubmissionForm = (project) => {
    setSelectedProject(project);
    setSubmissionLink('');
    setShowSubmissionForm(true);
  };

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-12">
          <div className="bg-primary text-white rounded p-4 shadow">
            <h1 className="mb-0">Welcome, {user?.username || 'Manager'}</h1>
            <p className="lead mb-0">Primewave Manager Dashboard</p>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Statistics Cards */}
        <div className="col-md-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="display-4 mb-3 text-primary">
                <i className="bi bi-collection"></i>
              </div>
              <h5 className="card-title">Total Projects</h5>
              <h2 className="display-6 fw-bold">{stats.total}</h2>
              <p className="text-muted mb-0">All time</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="display-4 mb-3 text-success">
                <i className="bi bi-play-circle"></i>
              </div>
              <h5 className="card-title">Active Projects</h5>
              <h2 className="display-6 fw-bold">{stats.active}</h2>
              <p className="text-muted mb-0">In progress</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="display-4 mb-3 text-info">
                <i className="bi bi-check-circle"></i>
              </div>
              <h5 className="card-title">Completed Projects</h5>
              <h2 className="display-6 fw-bold">{stats.completed}</h2>
              <p className="text-muted mb-0">All time</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="display-4 mb-3 text-warning">
                <i className="bi bi-hourglass-split"></i>
              </div>
              <h5 className="card-title">Pending Projects</h5>
              <h2 className="display-6 fw-bold">{stats.pending}</h2>
              <p className="text-muted mb-0">Awaiting review</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Submission Form */}
      {showSubmissionForm && selectedProject && (
        <div className="row mt-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">Submit Completed Project</h5>
                <p className="mb-0 small text-muted">For project: {selectedProject.title}</p>
              </div>
              <div className="card-body">
                <form onSubmit={handleProjectSubmission}>
                  <div className="row">
                    <div className="col-12">
                      <label htmlFor="submissionLink" className="form-label">Submission Link (Google Drive, etc.)</label>
                      <input
                        type="text"
                        className="form-control"
                        id="submissionLink"
                        value={submissionLink}
                        onChange={(e) => setSubmissionLink(e.target.value)}
                        placeholder="Paste your drive link here"
                        required
                      />
                    </div>
                    <div className="col-12 mt-3 d-flex justify-content-end">
                      <button
                        type="button"
                        className="btn btn-outline-secondary me-2"
                        onClick={() => {
                          setSelectedProject(null);
                          setShowSubmissionForm(false);
                        }}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-success">Submit Project</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row mt-4">
        <div className="col-12">
          {/* Project Management Tabs */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <ul className="nav nav-tabs card-header-tabs" role="tablist">
                <li className="nav-item" role="presentation">
                  <button 
                    className="nav-link active" 
                    id="pending-tab" 
                    data-bs-toggle="tab" 
                    data-bs-target="#pending" 
                    type="button" 
                    role="tab"
                    aria-controls="pending"
                    aria-selected="true"
                  >
                    Pending Approval ({projects.filter(p => p.status === 'pending').length})
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
                    My Active Projects ({projects.filter(p => p.status === 'accepted').length})
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button 
                    className="nav-link" 
                    id="extension-tab" 
                    data-bs-toggle="tab" 
                    data-bs-target="#extension" 
                    type="button" 
                    role="tab"
                    aria-controls="extension"
                    aria-selected="false"
                  >
                    Extension Requests ({projects.filter(p => p.status === 'deadline_extension_approved').length})
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
                    Completed ({projects.filter(p => p.status === 'completed').length})
                  </button>
                </li>
              </ul>
            </div>

            <div className="card-body">
              <div className="tab-content">
                {/* Pending Approval Tab */}
                <div className="tab-pane fade show active" id="pending" role="tabpanel" aria-labelledby="pending-tab">
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : projects.filter(p => p.status === 'pending').length === 0 ? (
                    <div className="text-center py-4">
                      <p className="mb-0">No pending projects to review.</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Project Name</th>
                            <th>Client</th>
                            <th>Type</th>
                            <th>Deadline</th>
                            <th>Budget</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projects
                            .filter(project => project.status === 'pending')
                            .map((project) => (
                              <tr key={project._id}>
                                <td>{project.title}</td>
                                <td>{project.client.name}</td>
                                <td>{project.workType === 'short' ? 'Short Video' : 'Long Video'}</td>
                                <td>{formatDate(project.deadline)}</td>
                                <td>${project.budget}</td>
                                <td>
                                  <button 
                                    className="btn btn-sm btn-success me-2"
                                    onClick={() => handleUpdateStatus(project._id, 'accepted')}
                                  >
                                    Accept
                                  </button>
                                  <button 
                                    className="btn btn-sm btn-danger me-2"
                                    onClick={() => handleUpdateStatus(project._id, 'rejected')}
                                  >
                                    Reject
                                  </button>
                                  <button 
                                    className="btn btn-sm btn-warning"
                                    onClick={() => handleRequestExtension(project._id)}
                                  >
                                    Request Extension
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Active Projects Tab */}
                <div className="tab-pane fade" id="active" role="tabpanel" aria-labelledby="active-tab">
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : projects.filter(p => p.status === 'accepted').length === 0 ? (
                    <div className="text-center py-4">
                      <p className="mb-0">No active projects to work on.</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Project Name</th>
                            <th>Client</th>
                            <th>Type</th>
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
                                <td>{project.client.name}</td>
                                <td>{project.workType === 'short' ? 'Short Video' : 'Long Video'}</td>
                                <td>{formatDate(project.deadline)}</td>
                                <td>
                                  <button 
                                    className="btn btn-sm btn-outline-primary me-2"
                                    onClick={() => {
                                      console.log('View project details:', project);
                                    }}
                                  >
                                    View
                                  </button>
                                  <button 
                                    className="btn btn-sm btn-warning me-2"
                                    onClick={() => handleRequestExtension(project._id)}
                                  >
                                    Request Extension
                                  </button>
                                  <button 
                                    className="btn btn-sm btn-success"
                                    onClick={() => openSubmissionForm(project)}
                                  >
                                    Submit Work
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Extension Requests Tab */}
                <div className="tab-pane fade" id="extension" role="tabpanel" aria-labelledby="extension-tab">
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : projects.filter(p => p.status === 'deadline_extension_approved').length === 0 ? (
                    <div className="text-center py-4">
                      <p className="mb-0">No approved extension requests.</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Project Name</th>
                            <th>Client</th>
                            <th>Original Deadline</th>
                            <th>New Deadline</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projects
                            .filter(project => project.status === 'deadline_extension_approved')
                            .map((project) => (
                              <tr key={project._id}>
                                <td>{project.title}</td>
                                <td>{project.client.name}</td>
                                <td>
                                  <s className="text-muted">{formatDate(project.createdAt)}</s>
                                </td>
                                <td className="text-success fw-bold">{formatDate(project.deadline)}</td>
                                <td>
                                  <button 
                                    className="btn btn-sm btn-outline-primary me-2"
                                    onClick={() => {
                                      console.log('View project details:', project);
                                    }}
                                  >
                                    View
                                  </button>
                                  <button 
                                    className="btn btn-sm btn-success"
                                    onClick={() => openSubmissionForm(project)}
                                  >
                                    Submit Work
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Completed Projects Tab */}
                <div className="tab-pane fade" id="completed" role="tabpanel" aria-labelledby="completed-tab">
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : projects.filter(p => p.status === 'completed').length === 0 ? (
                    <div className="text-center py-4">
                      <p className="mb-0">No completed projects.</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Project Name</th>
                            <th>Client</th>
                            <th>Type</th>
                            <th>Completion Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projects
                            .filter(project => project.status === 'completed')
                            .map((project) => (
                              <tr key={project._id}>
                                <td>{project.title}</td>
                                <td>{project.client.name}</td>
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
                                      View Submission
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
