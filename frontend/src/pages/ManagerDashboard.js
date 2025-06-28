import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import ProjectDetailModal from '../components/ProjectDetailModal';
import { Modal, Button } from 'react-bootstrap';
import { showNotification } from '../utils/notification';

const ManagerDashboard = () => {
  const { user } = useAuth();
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
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showExtensionForm, setShowExtensionForm] = useState(false);
  const [extensionData, setExtensionData] = useState({
    newDeadline: '',
    reason: ''
  });
  
  // Action loading states
  const [actionInProgress, setActionInProgress] = useState({});

  // Helper function to get formatted status with proper color
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

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching manager projects...');
      
      const res = await api.get('/projects/manager/all');
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
      const active = res.data.filter(p => p.status === 'accepted' || p.status === 'deadline_extension_approved').length;
      const completed = res.data.filter(p => p.status === 'completed').length;
      const pending = res.data.filter(p => p.status === 'pending').length;
      const extensions = res.data.filter(
        p => p.status === 'deadline_extension_requested' || p.status === 'deadline_extension_approved'
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
      setError('Failed to load projects: ' + (err.response?.data?.message || err.message || 'Unknown error'));
      // Set empty projects array on error
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all projects
  useEffect(() => {
    if (user && user.id) {
      fetchProjects();
    } else {
      console.log('No user ID available, not fetching projects');
      setLoading(false);
    }
  }, [user]);

  // Auto refresh every 30 seconds
  useEffect(() => {
    if (!user || !user.id) return;
    
    const intervalId = setInterval(() => {
      console.log('Auto-refreshing projects...');
      fetchProjects();
    }, 30000); // 30 seconds
    
    return () => clearInterval(intervalId);
  }, [user]);

  // Helper function to format dates
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Helper function to check if a deadline is approaching (within 24 hours)
  const isDeadlineApproaching = (deadline) => {
    const deadlineDate = new Date(deadline);
    const currentDate = new Date();
    const timeDiff = deadlineDate.getTime() - currentDate.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    return hoursDiff > 0 && hoursDiff <= 24;
  };

  // Helper function to check if a deadline has passed
  const isDeadlinePassed = (deadline) => {
    const deadlineDate = new Date(deadline);
    const currentDate = new Date();
    return deadlineDate < currentDate;
  };

  // Helper function to get deadline status class
  const getDeadlineStatusClass = (deadline) => {
    if (isDeadlinePassed(deadline)) return 'text-danger fw-bold';
    if (isDeadlineApproaching(deadline)) return 'text-warning fw-bold';
    return '';
  };

  // Helper function to format deadline with appropriate styling
  const formatDeadline = (deadline) => {
    const statusClass = getDeadlineStatusClass(deadline);
    return <span className={statusClass}>{formatDate(deadline)}</span>;
  };

  // Function to handle project approval
  const handleApproveProject = async (projectId) => {
    try {
      setActionInProgress({...actionInProgress, [projectId + '_approve']: true});
      await api.patch(`/projects/${projectId}/status`, { status: 'accepted' });
      showNotification('Project approved successfully!', 'success');
      fetchProjects();
    } catch (error) {
      console.error('Error approving project:', error);
      showNotification('Failed to approve project: ' + (error.response?.data?.message || error.message), 'error');
    } finally {
      setActionInProgress({...actionInProgress, [projectId + '_approve']: false});
    }
  };

  // Function to handle project rejection
  const handleRejectProject = async (projectId) => {
    try {
      setActionInProgress({...actionInProgress, [projectId + '_reject']: true});
      await api.patch(`/projects/${projectId}/status`, { status: 'rejected' });
      showNotification('Project rejected successfully!', 'success');
      fetchProjects();
    } catch (error) {
      console.error('Error rejecting project:', error);
      showNotification('Failed to reject project: ' + (error.response?.data?.message || error.message), 'error');
    } finally {
      setActionInProgress({...actionInProgress, [projectId + '_reject']: false});
    }
  };

  // Function to handle deadline extension approval
  const handleApproveExtension = async (projectId) => {
    try {
      setActionInProgress({...actionInProgress, [projectId + '_approve_extension']: true});
      await api.patch(`/projects/${projectId}/extension/approve`);
      showNotification('Deadline extension approved successfully!', 'success');
      fetchProjects();
    } catch (error) {
      console.error('Error approving extension:', error);
      showNotification('Failed to approve extension: ' + (error.response?.data?.message || error.message), 'error');
    } finally {
      setActionInProgress({...actionInProgress, [projectId + '_approve_extension']: false});
    }
  };

  // Function to handle deadline extension rejection
  const handleRejectExtension = async (projectId) => {
    try {
      setActionInProgress({...actionInProgress, [projectId + '_reject_extension']: true});
      await api.patch(`/projects/${projectId}/extension/reject`);
      showNotification('Deadline extension rejected successfully!', 'success');
      fetchProjects();
    } catch (error) {
      console.error('Error rejecting extension:', error);
      showNotification('Failed to reject extension: ' + (error.response?.data?.message || error.message), 'error');
    } finally {
      setActionInProgress({...actionInProgress, [projectId + '_reject_extension']: false});
    }
  };

  // Function to handle project completion
  const handleCompleteProject = async (projectId) => {
    try {
      setActionInProgress({...actionInProgress, [projectId + '_complete']: true});
      await api.put(`/projects/${projectId}/status`, { status: 'completed' });
      showNotification('Project marked as completed!', 'success');
      fetchProjects();
    } catch (error) {
      console.error('Error completing project:', error);
      showNotification('Failed to complete project: ' + (error.response?.data?.message || error.message), 'error');
    } finally {
      setActionInProgress({...actionInProgress, [projectId + '_complete']: false});
    }
  };
  
  // Function to open the submission form modal
  const openSubmissionForm = (project) => {
    setSubmissionLink('');
    setSelectedProject(project);
    setShowSubmissionForm(true);
  };
  
  // Function to open project details modal
  const viewProjectDetails = (project) => {
    setSelectedProject(project);
    setShowProjectModal(true);
  };

  // Function to open the extension form modal
  const openExtensionForm = (project) => {
    setSelectedProject(project);
    setExtensionData({
      newDeadline: '',
      reason: ''
    });
    setShowExtensionForm(true);
  };

  // Function to handle submission of work
  const handleSubmitWork = async (e) => {
    e.preventDefault();
    
    if (!submissionLink.trim()) {
      showNotification('Please enter a submission link', 'warning');
      return;
    }
    
    try {
      setFormSubmitting(true);
      await api.patch(`/projects/${selectedProject._id}/submit`, { 
        submissionLink: submissionLink.trim() 
      });
      showNotification('Work submitted successfully!', 'success');
      setShowSubmissionForm(false);
      setSubmissionLink('');
      fetchProjects();
    } catch (error) {
      console.error('Error submitting work:', error);
      showNotification('Failed to submit work: ' + (error.response?.data?.message || error.message), 'error');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Function to handle deadline extension request
  const handleExtendDeadline = async (e) => {
    e.preventDefault();
    
    if (!extensionData.newDeadline) {
      showNotification('Please select a new deadline', 'warning');
      return;
    }
    
    if (!extensionData.reason.trim()) {
      showNotification('Please provide a reason for extension', 'warning');
      return;
    }
    
    try {
      setFormSubmitting(true);
      await api.patch(`/projects/${selectedProject._id}/request-extension`, extensionData);
      showNotification('Deadline extension request submitted successfully!', 'success');
      setShowExtensionForm(false);
      fetchProjects();
    } catch (error) {
      console.error('Error requesting extension:', error);
      showNotification('Failed to request extension: ' + (error.response?.data?.message || error.message), 'error');
    } finally {
      setFormSubmitting(false);
    }
  };
  
  // Count projects with upcoming deadlines or pending approval
  const pendingCount = projects.filter(p => p.status === 'pending').length;
  const dueSoonCount = projects.filter(p => 
    (p.status === 'accepted' || p.status === 'deadline_extension_approved') && 
    isDeadlineApproaching(p.deadline)).length;
  const overdueCount = projects.filter(p => 
    (p.status === 'accepted' || p.status === 'deadline_extension_approved') && 
    isDeadlinePassed(p.deadline)).length;
  
  const [formSubmitting, setFormSubmitting] = useState(false);
  
  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="h3 mb-0">
              Manager Dashboard 
              {pendingCount > 0 && (
                <span className="badge bg-warning ms-2" title="Projects needing approval">
                  {pendingCount} pending
                </span>
              )}
              {dueSoonCount > 0 && (
                <span className="badge bg-info ms-2" title="Projects due within 24 hours">
                  {dueSoonCount} due soon
                </span>
              )}
              {overdueCount > 0 && (
                <span className="badge bg-danger ms-2" title="Projects past deadline">
                  {overdueCount} overdue
                </span>
              )}
            </h1>
            <button 
              className="btn btn-sm btn-outline-primary" 
              onClick={fetchProjects}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                  Refreshing...
                </>
              ) : (
                <>
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  Refresh Projects
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <button
            type="button"
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={fetchProjects}
          >
            Try Again
          </button>
        </div>
      )}

      <div className="row mb-4">
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card h-100 border-primary">
            <div className="card-body text-center">
              <h5 className="card-title">Total Projects</h5>
              <p className="card-text display-4">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card h-100 border-info">
            <div className="card-body text-center">
              <h5 className="card-title">Active Projects</h5>
              <p className="card-text display-4">{stats.active}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card h-100 border-success">
            <div className="card-body text-center">
              <h5 className="card-title">Completed Projects</h5>
              <p className="card-text display-4">{stats.completed}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card h-100 border-warning">
            <div className="card-body text-center">
              <h5 className="card-title">Pending Approval</h5>
              <p className="card-text display-4">{stats.pending}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card mb-4">
            <div className="card-body">
              <ul className="nav nav-tabs" id="projectsTab" role="tablist">
                <li className="nav-item" role="presentation">
                  <button 
                    className="nav-link active" 
                    id="pending-tab" 
                    data-bs-toggle="tab" 
                    data-bs-target="#pending" 
                    type="button" 
                    role="tab"
                  >
                    Pending Approval {stats.pending > 0 && <span className="badge bg-warning ms-1">{stats.pending}</span>}
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
                  >
                    Active Projects {stats.active > 0 && <span className="badge bg-info ms-1">{stats.active}</span>}
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
                  >
                    Extension Requests {stats.extensions > 0 && <span className="badge bg-secondary ms-1">{stats.extensions}</span>}
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
                  >
                    Completed {stats.completed > 0 && <span className="badge bg-success ms-1">{stats.completed}</span>}
                  </button>
                </li>
              </ul>
              
              <div className="tab-content pt-4" id="projectsTabContent">
                {/* Pending Projects Tab */}
                <div 
                  className="tab-pane fade show active" 
                  id="pending" 
                  role="tabpanel" 
                  aria-labelledby="pending-tab"
                >
                  {loading ? (
                    <div className="text-center my-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2">Loading pending projects...</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover table-sm align-middle">
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Client</th>
                            <th>Type</th>
                            <th>Submitted</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projects.filter(project => project.status === 'pending').length === 0 ? (
                            <tr>
                              <td colSpan="5" className="text-center py-3">
                                <i className="bi bi-check-circle text-muted me-2"></i> 
                                No pending projects to approve
                              </td>
                            </tr>
                          ) : (
                            projects
                              .filter(project => project.status === 'pending')
                              .map(project => (
                                <tr key={project._id}>
                                  <td>
                                    <a 
                                      href="#!" 
                                      onClick={(e) => {
                                        e.preventDefault();
                                        viewProjectDetails(project);
                                      }}
                                    >
                                      {project.title}
                                    </a>
                                  </td>
                                  <td>{project.client.name}</td>
                                  <td>{project.workType === 'short' ? 'Short Video' : 'Long Video'}</td>
                                  <td>{formatDate(project.createdAt)}</td>
                                  <td>
                                    <button
                                      className="btn btn-sm btn-outline-primary me-2"
                                      onClick={() => viewProjectDetails(project)}
                                    >
                                      View Details
                                    </button>
                                    <button 
                                      className="btn btn-sm btn-success me-2"
                                      onClick={() => handleApproveProject(project._id)}
                                      disabled={actionInProgress[project._id + '_approve']}
                                    >
                                      {actionInProgress[project._id + '_approve'] ? (
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                      ) : 'Approve'}
                                    </button>
                                    <button 
                                      className="btn btn-sm btn-danger"
                                      onClick={() => handleRejectProject(project._id)}
                                      disabled={actionInProgress[project._id + '_reject']}
                                    >
                                      {actionInProgress[project._id + '_reject'] ? (
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                      ) : 'Reject'}
                                    </button>
                                  </td>
                                </tr>
                              ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                
                {/* Active Projects Tab */}
                <div 
                  className="tab-pane fade" 
                  id="active" 
                  role="tabpanel" 
                  aria-labelledby="active-tab"
                >
                  {loading ? (
                    <div className="text-center my-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2">Loading active projects...</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover table-sm align-middle">
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Client</th>
                            <th>Type</th>
                            <th>Deadline</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projects.filter(project => project.status === 'accepted' || project.status === 'deadline_extension_approved').length === 0 ? (
                            <tr>
                              <td colSpan="5" className="text-center py-3">
                                <i className="bi bi-exclamation-circle text-muted me-2"></i>
                                No active projects at the moment
                              </td>
                            </tr>
                          ) : (
                            projects
                              .filter(project => project.status === 'accepted' || project.status === 'deadline_extension_approved')
                              .map(project => (
                                <tr key={project._id}>
                                  <td>
                                    <a 
                                      href="#!" 
                                      onClick={(e) => {
                                        e.preventDefault();
                                        viewProjectDetails(project);
                                      }}
                                    >
                                      {project.title}
                                    </a>
                                  </td>
                                  <td>{project.client.name}</td>
                                  <td>{project.workType === 'short' ? 'Short Video' : 'Long Video'}</td>
                                  <td>{formatDeadline(project.deadline)}</td>
                                  <td>
                                    <button
                                      className="btn btn-sm btn-outline-primary me-2"
                                      onClick={() => viewProjectDetails(project)}
                                    >
                                      View Details
                                    </button>
                                    <button
                                      className="btn btn-sm btn-primary me-2"
                                      onClick={() => openSubmissionForm(project)}
                                    >
                                      Submit Work
                                    </button>
                                    <button 
                                      className="btn btn-sm btn-outline-secondary"
                                      onClick={() => openExtensionForm(project)}
                                    >
                                      Extend Deadline
                                    </button>
                                  </td>
                                </tr>
                              ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                
                {/* Extension Requests Tab */}
                <div 
                  className="tab-pane fade" 
                  id="extensions" 
                  role="tabpanel" 
                  aria-labelledby="extensions-tab"
                >
                  {loading ? (
                    <div className="text-center my-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2">Loading extension requests...</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover table-sm align-middle">
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Client</th>
                            <th>Current Deadline</th>
                            <th>Requested Deadline</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projects.filter(project => project.status === 'deadline_extension_requested' || project.status === 'deadline_extension_approved').length === 0 ? (
                            <tr>
                              <td colSpan="5" className="text-center py-3">
                                <i className="bi bi-check-circle text-muted me-2"></i>
                                No deadline extension requests
                              </td>
                            </tr>
                          ) : (
                            projects
                              .filter(project => project.status === 'deadline_extension_requested' || project.status === 'deadline_extension_approved')
                              .map(project => (
                                <tr key={project._id}>
                                  <td>
                                    <a 
                                      href="#!" 
                                      onClick={(e) => {
                                        e.preventDefault();
                                        viewProjectDetails(project);
                                      }}
                                    >
                                      {project.title}
                                    </a>
                                  </td>
                                  <td>{project.client.name}</td>
                                  <td>{formatDate(project.deadline)}</td>
                                  <td>{project.deadlineExtension?.requestedDate ? 
                                      formatDate(project.deadlineExtension.requestedDate) :
                                      'Not specified'}
                                  </td>
                                  <td>
                                    <button
                                      className="btn btn-sm btn-outline-primary me-2"
                                      onClick={() => viewProjectDetails(project)}
                                    >
                                      View Details
                                    </button>
                                    {project.status === 'deadline_extension_requested' ? (
                                      <>
                                        <button 
                                          className="btn btn-sm btn-success me-2"
                                          onClick={() => handleApproveExtension(project._id)}
                                          disabled={actionInProgress[project._id + '_approve_extension']}
                                        >
                                          {actionInProgress[project._id + '_approve_extension'] ? (
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                          ) : 'Approve Extension'}
                                        </button>
                                        <button 
                                          className="btn btn-sm btn-danger"
                                          onClick={() => handleRejectExtension(project._id)}
                                          disabled={actionInProgress[project._id + '_reject_extension']}
                                        >
                                          {actionInProgress[project._id + '_reject_extension'] ? (
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                          ) : 'Reject Extension'}
                                        </button>
                                      </>
                                    ) : (
                                      <button 
                                        className="btn btn-sm btn-primary"
                                        onClick={() => openSubmissionForm(project)}
                                      >
                                        Submit Work
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                
                {/* Completed Projects Tab */}
                <div 
                  className="tab-pane fade" 
                  id="completed" 
                  role="tabpanel" 
                  aria-labelledby="completed-tab"
                >
                  {loading ? (
                    <div className="text-center my-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2">Loading completed projects...</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover table-sm align-middle">
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Client</th>
                            <th>Type</th>
                            <th>Completed</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projects.filter(project => project.status === 'completed').length === 0 ? (
                            <tr>
                              <td colSpan="5" className="text-center py-3">
                                <i className="bi bi-info-circle text-muted me-2"></i>
                                No completed projects yet
                              </td>
                            </tr>
                          ) : (
                            projects
                              .filter(project => project.status === 'completed')
                              .map(project => (
                                <tr key={project._id}>
                                  <td>
                                    <a 
                                      href="#!" 
                                      onClick={(e) => {
                                        e.preventDefault();
                                        viewProjectDetails(project);
                                      }}>
                                      {project.title}
                                    </a>
                                  </td>
                                  <td>{project.client.name}</td>
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
                              ))
                          )}
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
        onSubmitWork={selectedProject && (selectedProject.status === 'accepted' || selectedProject.status === 'deadline_extension_approved') ? 
          () => {
            console.log('Submit work button clicked in modal');
            setShowProjectModal(false);
            openSubmissionForm(selectedProject);
          } : null
        }
      />
      
      {/* Work Submission Modal */}
      <Modal show={showSubmissionForm} onHide={() => setShowSubmissionForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Submit Project Work</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProject && (
            <form onSubmit={handleSubmitWork}>
              <div className="mb-3">
                <label htmlFor="projectTitle" className="form-label">Project</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="projectTitle" 
                  value={selectedProject.title} 
                  disabled
                />
              </div>
              <div className="mb-3">
                <label htmlFor="submissionLink" className="form-label">Submission Link <span className="text-danger">*</span></label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="submissionLink"
                  value={submissionLink}
                  onChange={(e) => setSubmissionLink(e.target.value)}
                  placeholder="https://drive.google.com/file/..."
                  required
                />
                <div className="form-text">
                  Provide a link to Google Drive, Dropbox, or any platform where the client can access the final work.
                </div>
              </div>
            </form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSubmissionForm(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmitWork}
            disabled={formSubmitting}
          >
            {formSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Submitting...
              </>
            ) : 'Submit Work'}
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Deadline Extension Modal */}
      <Modal show={showExtensionForm} onHide={() => setShowExtensionForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Request Deadline Extension</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProject && (
            <form onSubmit={handleExtendDeadline}>
              <div className="mb-3">
                <label htmlFor="projectTitle" className="form-label">Project</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="projectTitle" 
                  value={selectedProject.title} 
                  disabled
                />
              </div>
              <div className="mb-3">
                <label htmlFor="currentDeadline" className="form-label">Current Deadline</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="currentDeadline" 
                  value={formatDate(selectedProject.deadline)} 
                  disabled
                />
              </div>
              <div className="mb-3">
                <label htmlFor="newDeadline" className="form-label">New Deadline <span className="text-danger">*</span></label>
                <input 
                  type="datetime-local" 
                  className="form-control" 
                  id="newDeadline"
                  value={extensionData.newDeadline}
                  onChange={(e) => setExtensionData({...extensionData, newDeadline: e.target.value})}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="extensionReason" className="form-label">Reason for Extension <span className="text-danger">*</span></label>
                <textarea 
                  className="form-control" 
                  id="extensionReason"
                  rows="3"
                  value={extensionData.reason}
                  onChange={(e) => setExtensionData({...extensionData, reason: e.target.value})}
                  placeholder="Please explain why you need an extension..."
                  required
                ></textarea>
              </div>
            </form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowExtensionForm(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleExtendDeadline}
            disabled={formSubmitting}
          >
            {formSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Requesting...
              </>
            ) : 'Request Extension'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManagerDashboard;
