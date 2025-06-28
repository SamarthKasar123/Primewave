import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient" style={{background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'}}>
      <div className="container">
        {/* Main Footer Content */}
        <div className="row g-4 py-5 text-white">
          <div className="col-lg-4 col-md-6">
            <div className="mb-4">
              <h3 className="fw-bold mb-3" style={{background: 'linear-gradient(45deg, #4f46e5, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>
                Primewave
              </h3>
              <p className="mb-4 text-light opacity-75 lh-lg">
                Professional video editing services delivering high-quality content tailored to your needs. 
                Transform your vision into stunning visual stories with our expert team.
              </p>
              <div className="social-icons d-flex gap-3">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                   className="btn btn-outline-light rounded-circle p-2 social-btn" 
                   style={{width: '45px', height: '45px', transition: 'all 0.3s ease'}}>
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                   className="btn btn-outline-light rounded-circle p-2 social-btn" 
                   style={{width: '45px', height: '45px', transition: 'all 0.3s ease'}}>
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                   className="btn btn-outline-light rounded-circle p-2 social-btn" 
                   style={{width: '45px', height: '45px', transition: 'all 0.3s ease'}}>
                  <i className="bi bi-twitter"></i>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" 
                   className="btn btn-outline-light rounded-circle p-2 social-btn" 
                   style={{width: '45px', height: '45px', transition: 'all 0.3s ease'}}>
                  <i className="bi bi-youtube"></i>
                </a>
              </div>
            </div>
          </div>
          
          <div className="col-lg-2 col-md-6">
            <h5 className="mb-4 fw-bold text-white">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-light text-decoration-none footer-link d-flex align-items-center">
                  <i className="bi bi-chevron-right me-2 small"></i>Home
                </Link>
              </li>
              <li className="mb-2">
                <a href="/#services" className="text-light text-decoration-none footer-link d-flex align-items-center">
                  <i className="bi bi-chevron-right me-2 small"></i>Services
                </a>
              </li>
              <li className="mb-2">
                <a href="/#about" className="text-light text-decoration-none footer-link d-flex align-items-center">
                  <i className="bi bi-chevron-right me-2 small"></i>About Us
                </a>
              </li>
              <li className="mb-2">
                <a href="/#portfolio" className="text-light text-decoration-none footer-link d-flex align-items-center">
                  <i className="bi bi-chevron-right me-2 small"></i>Portfolio
                </a>
              </li>
              <li className="mb-2">
                <a href="/#contact" className="text-light text-decoration-none footer-link d-flex align-items-center">
                  <i className="bi bi-chevron-right me-2 small"></i>Contact
                </a>
              </li>
            </ul>
          </div>
          
          <div className="col-lg-2 col-md-6">
            <h5 className="mb-4 fw-bold text-white">Our Services</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <span className="text-light d-flex align-items-center">
                  <i className="bi bi-play-circle me-2 small text-primary"></i>Short Form Videos
                </span>
              </li>
              <li className="mb-2">
                <span className="text-light d-flex align-items-center">
                  <i className="bi bi-film me-2 small text-primary"></i>Long Form Content
                </span>
              </li>
              <li className="mb-2">
                <span className="text-light d-flex align-items-center">
                  <i className="bi bi-palette me-2 small text-primary"></i>Motion Graphics
                </span>
              </li>
              <li className="mb-2">
                <span className="text-light d-flex align-items-center">
                  <i className="bi bi-brush me-2 small text-primary"></i>Color Grading
                </span>
              </li>
              <li className="mb-2">
                <span className="text-light d-flex align-items-center">
                  <i className="bi bi-music-note me-2 small text-primary"></i>Audio Enhancement
                </span>
              </li>
            </ul>
          </div>
          
          <div className="col-lg-4 col-md-6">
            <h5 className="mb-4 fw-bold text-white">Contact Information</h5>
            <div className="contact-info">
              <div className="contact-item mb-3 p-3 rounded" style={{background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)'}}>
                <div className="d-flex align-items-start">
                  <div className="contact-icon me-3">
                    <i className="bi bi-geo-alt-fill text-primary fs-5"></i>
                  </div>
                  <div>
                    <h6 className="mb-1 text-white">Our Location</h6>
                    <p className="mb-0 text-light small">
                      Nashik, Maharashtra, India<br/>
                      422 104
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="contact-item mb-3 p-3 rounded" style={{background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)'}}>
                <div className="d-flex align-items-start">
                  <div className="contact-icon me-3">
                    <i className="bi bi-envelope-fill text-primary fs-5"></i>
                  </div>
                  <div>
                    <h6 className="mb-1 text-white">Email Us</h6>
                    <a href="mailto:primewave09@gmail.com" className="text-light text-decoration-none small">
                      primewave09@gmail.com
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="contact-item mb-3 p-3 rounded" style={{background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)'}}>
                <div className="d-flex align-items-start">
                  <div className="contact-icon me-3">
                    <i className="bi bi-telephone-fill text-primary fs-5"></i>
                  </div>
                  <div>
                    <h6 className="mb-1 text-white">Call Us</h6>
                    <a href="tel:+919172571809" className="text-light text-decoration-none small">
                      +91 9172571809
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Newsletter Section */}
        <div className="py-4" style={{background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)'}}>
          <div className="row align-items-center">
            <div className="col-lg-6 mb-3 mb-lg-0">
              <h5 className="text-white mb-2">Stay Updated with Primewave</h5>
              <p className="text-light opacity-75 mb-0">Get the latest updates on video editing trends and our services.</p>
            </div>
            <div className="col-lg-6">
              <div className="newsletter-form">
                <div className="input-group">
                  <input 
                    type="email" 
                    className="form-control bg-transparent border-light text-white" 
                    placeholder="Enter your email address"
                    style={{backdropFilter: 'blur(10px)'}}
                  />
                  <button 
                    className="btn btn-primary px-4" 
                    type="button"
                    style={{background: 'linear-gradient(45deg, #4f46e5, #06b6d4)', border: 'none'}}
                  >
                    <i className="bi bi-send me-2"></i>Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="py-4" style={{borderTop: '1px solid rgba(255,255,255,0.1)'}}>
          <div className="row align-items-center">
            <div className="col-md-6 mb-3 mb-md-0">
              <p className="mb-0 text-light opacity-75">
                © {new Date().getFullYear()} Primewave. All rights reserved. 
                <span className="ms-2">Made with ❤️ in India</span>
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="d-flex justify-content-md-end gap-3 flex-wrap">
                <Link to="/privacy" className="text-light text-decoration-none footer-link">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-light text-decoration-none footer-link">
                  Terms of Service
                </Link>
                <Link to="/sitemap" className="text-light text-decoration-none footer-link">
                  Sitemap
                </Link>
                <Link to="/support" className="text-light text-decoration-none footer-link">
                  Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom CSS for enhanced styling */}
      <style jsx>{`
        .social-btn:hover {
          background: linear-gradient(45deg, #4f46e5, #06b6d4) !important;
          border-color: transparent !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(79, 70, 229, 0.3);
        }
        
        .footer-link {
          transition: all 0.3s ease;
          position: relative;
        }
        
        .footer-link:hover {
          color: #06b6d4 !important;
          transform: translateX(5px);
        }
        
        .contact-item {
          transition: all 0.3s ease;
        }
        
        .contact-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        }
        
        .newsletter-form input::placeholder {
          color: rgba(255,255,255,0.6);
        }
        
        .newsletter-form input:focus {
          box-shadow: 0 0 0 0.2rem rgba(79, 70, 229, 0.25);
          border-color: #4f46e5;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
