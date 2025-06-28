import React from 'react';

const ProjectDetailModal = ({ 
  show, 
  onHide, 
  project, 
  formatDate, 
  getStatusBadge, 
  onSubmitWork 
}) => {
  if (!project) return null;
  
  return (
    <div className="modal fade show" style={{display: show ? 'block' : 'none', backgroundColor: 'rgba(0,0,0,0.5)'}} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Project Details</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onHide}
            ></button>
          </div>
          <div className="modal-body">
            <div className="project-details">
              <div className="row mb-3">
                <div className="col-12 col-md-6">
                  <h5 className="text-primary">{project.title}</h5>
                  <p className="mb-1">
                    <strong>Status:</strong> {getStatusBadge(project.status)}
                  </p>
                  <p className="mb-1">
                    <strong>Type:</strong> {project.workType === 'short' ? 'Short Video' : 'Long Video'}
                  </p>
                  <p className="mb-1">
                    <strong>Budget:</strong> ${project.budget}
                  </p>
                </div>
                <div className="col-12 col-md-6">
                  <p className="mb-1">
                    <strong>Created:</strong> {formatDate(project.createdAt)}
                  </p>
                  <p className="mb-1">
                    <strong>Deadline:</strong> {formatDate(project.deadline)}
                  </p>
                  <p className="mb-1">
                    <strong>Video Duration:</strong> {project.videoDuration}
                  </p>
                </div>
              </div>
              
              {project.client && (
                <>
                  <h6 className="mt-4 mb-2">Client Information</h6>
                  <div className="client-info p-3 bg-light rounded mb-3">
                    <p className="mb-1"><strong>Name:</strong> {project.client?.name || 'N/A'}</p>
                    <p className="mb-1"><strong>Email:</strong> {project.client?.email || 'N/A'}</p>
                    <p className="mb-1"><strong>WhatsApp:</strong> {project.client?.whatsappNumber || 'N/A'}</p>
                  </div>
                </>
              )}
              
              <h6 className="mt-4 mb-2">Project Description</h6>
              <div className="description p-3 bg-light rounded mb-3">
                <p>{project.description}</p>
              </div>
              
              <h6 className="mt-4 mb-2">Material Links</h6>
              <div className="links p-3 bg-light rounded mb-3">
                <p className="text-break">{project.materialLinks}</p>
              </div>
              
              {project.submissionLink && (
                <>
                  <h6 className="mt-4 mb-2">Submission</h6>
                  <div className="submission p-3 bg-light rounded mb-3">
                    <p className="mb-1"><strong>Submission Link:</strong></p>
                    <p className="text-break mb-3">
                      <a href={project.submissionLink} target="_blank" rel="noreferrer">
                        {project.submissionLink}
                      </a>
                    </p>
                    <div className="d-flex gap-2">
                      <a 
                        href={project.submissionLink} 
                        target="_blank" 
                        rel="noreferrer"
                        className="btn btn-success"
                      >
                        <i className="bi bi-cloud-download me-2"></i>
                        Open in New Tab
                      </a>
                      <button 
                        className="btn btn-outline-primary"
                        onClick={() => {
                          navigator.clipboard.writeText(project.submissionLink);
                          alert("Submission link copied to clipboard!");
                        }}
                      >
                        <i className="bi bi-clipboard me-2"></i>
                        Copy Link
                      </button>
                    </div>
                  </div>
                </>
              )}
              
              {project.deadlineExtension && (
                <>
                  <h6 className="mt-4 mb-2">Deadline Extension</h6>
                  <div className="extension p-3 bg-light rounded mb-3">
                    <p className="mb-1">
                      <strong>Requested New Date:</strong> {formatDate(project.deadlineExtension.requestedDate)}
                    </p>
                    <p className="mb-1">
                      <strong>Status:</strong> {project.deadlineExtension.approved ? 
                        <span className="badge bg-success">Approved</span> : 
                        <span className="badge bg-danger">Rejected</span>
                      }
                    </p>
                    <p className="mb-1"><strong>Reason:</strong> {project.deadlineExtension.reason || 'N/A'}</p>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onHide}>
              Close
            </button>
            {(project.status === 'accepted' || project.status === 'deadline_extension_approved') && onSubmitWork && (
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={onSubmitWork}
              >
                Submit Work
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;
