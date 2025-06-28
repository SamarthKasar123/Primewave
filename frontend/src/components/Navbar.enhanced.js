import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`navbar navbar-expand-lg fixed-top transition-all ${
      scrolled ? 'navbar-light bg-white shadow-lg' : 'navbar-dark bg-transparent'
    }`} 
    style={{
      backdropFilter: scrolled ? 'blur(10px)' : 'none',
      background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
      transition: 'all 0.3s ease'
    }}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <div className="brand-icon me-2 d-flex align-items-center justify-content-center" 
               style={{
                 width: '40px',
                 height: '40px',
                 background: 'linear-gradient(45deg, #667eea, #764ba2)',
                 borderRadius: '10px'
               }}>
            <i className="bi bi-play-circle text-white fs-5"></i>
          </div>
          <span className="fw-bold fs-4" style={{
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Primewave
          </span>
        </Link>
        
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          style={{boxShadow: 'none'}}
        >
          <i className={`bi bi-list fs-4 ${scrolled ? 'text-dark' : 'text-white'}`}></i>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link className={`nav-link fw-500 px-3 ${scrolled ? 'text-dark' : 'text-white'}`} to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <a className={`nav-link fw-500 px-3 ${scrolled ? 'text-dark' : 'text-white'}`} href="/#services">
                Services
              </a>
            </li>
            <li className="nav-item">
              <a className={`nav-link fw-500 px-3 ${scrolled ? 'text-dark' : 'text-white'}`} href="/#about">
                About
              </a>
            </li>
            <li className="nav-item">
              <a className={`nav-link fw-500 px-3 ${scrolled ? 'text-dark' : 'text-white'}`} href="/#contact">
                Contact
              </a>
            </li>
          </ul>
          
          <ul className="navbar-nav">
            {!isAuthenticated ? (
              <>
                <li className="nav-item dropdown">
                  <button
                    className={`nav-link dropdown-toggle btn btn-link border-0 fw-500 px-3 ${
                      scrolled ? 'text-dark' : 'text-white'
                    }`}
                    id="loginDropdown" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                    style={{background: 'none', boxShadow: 'none'}}
                  >
                    <i className="bi bi-person-circle me-1"></i>
                    Login
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-3">
                    <li>
                      <Link className="dropdown-item py-2 px-3" to="/login/client">
                        <i className="bi bi-person me-2 text-primary"></i>
                        Client Login
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item py-2 px-3" to="/login/manager">
                        <i className="bi bi-shield-check me-2 text-success"></i>
                        Manager Login
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="nav-item ms-2">
                  <Link 
                    className="btn btn-primary px-4 py-2 rounded-pill fw-500" 
                    to="/register"
                    style={{
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      border: 'none',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                    }}
                  >
                    <i className="bi bi-person-plus me-1"></i>
                    Get Started
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item dropdown">
                  <button
                    className={`nav-link dropdown-toggle btn btn-link border-0 fw-500 px-3 ${
                      scrolled ? 'text-dark' : 'text-white'
                    }`}
                    id="userDropdown" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                    style={{background: 'none', boxShadow: 'none'}}
                  >
                    <i className="bi bi-person-circle me-1"></i>
                    {user?.name || user?.username}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-3">
                    <li>
                      <Link 
                        className="dropdown-item py-2 px-3" 
                        to={user?.role === 'manager' ? '/manager/dashboard' : '/client/dashboard'}
                      >
                        <i className="bi bi-speedometer2 me-2 text-primary"></i>
                        Dashboard
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button 
                        className="dropdown-item py-2 px-3 text-danger" 
                        onClick={handleLogout}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
