import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [stats, setStats] = useState({
    projects: 0,
    clients: 0,
    experience: 0,
    satisfaction: 0
  });

  // Animated counter effect
  useEffect(() => {
    const targets = { projects: 500, clients: 150, experience: 5, satisfaction: 99 };
    const duration = 2000; // 2 seconds
    const steps = 60; // 60 fps
    const increment = duration / steps;

    Object.keys(targets).forEach(key => {
      let current = 0;
      const target = targets[key];
      const step = target / steps;

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setStats(prev => ({ ...prev, [key]: Math.floor(current) }));
      }, increment);
    });
  }, []);

  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "Content Creator",
      text: "Primewave transformed my YouTube channel! Their editing quality is exceptional and turnaround time is amazing.",
      rating: 5
    },
    {
      name: "Priya Patel",
      role: "Marketing Manager",
      text: "Professional service with creative flair. Our brand videos have never looked better!",
      rating: 5
    },
    {
      name: "Arjun Mehta",
      role: "Filmmaker",
      text: "Outstanding color grading and attention to detail. Highly recommend for any video project.",
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <>
      {/* Enhanced Hero Section */}
      <header 
        className="position-relative text-white overflow-hidden" 
        style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <div className="hero-overlay position-absolute w-100 h-100" 
             style={{ 
               background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8))',
               backdropFilter: 'blur(2px)'
             }}>
        </div>
        
        {/* Animated Background Elements */}
        <div className="position-absolute w-100 h-100">
          <div className="floating-element" style={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: '100px',
            height: '100px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite'
          }}></div>
          <div className="floating-element" style={{
            position: 'absolute',
            top: '60%',
            right: '15%',
            width: '150px',
            height: '150px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '50%',
            animation: 'float 8s ease-in-out infinite reverse'
          }}></div>
        </div>

        <div className="container position-relative z-index-1 py-5">
          <div className="row align-items-center min-vh-100 py-5">
            <div className="col-lg-6">
              <div className="hero-content">
                <h1 className="display-2 fw-bold mb-4">
                  Professional Video Editing Services
                  <span className="d-block text-primary" style={{
                    background: 'linear-gradient(45deg, #4f46e5, #06b6d4)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    That Tell Stories
                  </span>
                </h1>
                <p className="lead mb-4">
                  Transform your raw footage into stunning visual narratives with Primewave's expert editing team. 
                  From concept to completion, we bring your vision to life.
                </p>
                <div className="d-flex flex-wrap gap-3 mb-4">
                  <Link to="/register" className="btn btn-primary btn-lg px-4 py-3 rounded-pill shadow-lg">
                    <i className="bi bi-rocket-takeoff me-2"></i>Get Started
                  </Link>
                  <Link to="/login/client" className="btn btn-outline-light btn-lg px-4 py-3 rounded-pill">
                    <i className="bi bi-person-circle me-2"></i>Client Login
                  </Link>
                </div>
                
                {/* Quick Stats */}
                <div className="row g-3 mt-4">
                  <div className="col-6 col-md-3">
                    <div className="text-center">
                      <h3 className="fw-bold mb-0">{stats.projects}+</h3>
                      <small className="text-light">Projects Completed</small>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="text-center">
                      <h3 className="fw-bold mb-0">{stats.clients}+</h3>
                      <small className="text-light">Happy Clients</small>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="text-center">
                      <h3 className="fw-bold mb-0">{stats.experience}+</h3>
                      <small className="text-light">Years Experience</small>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="text-center">
                      <h3 className="fw-bold mb-0">{stats.satisfaction}%</h3>
                      <small className="text-light">Satisfaction Rate</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-video text-center">
                <div className="video-placeholder p-5 rounded-4 shadow-lg" 
                     style={{background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)'}}>
                  <i className="bi bi-play-circle display-1 text-white mb-3"></i>
                  <h4 className="text-white">Watch Our Showreel</h4>
                  <p className="text-light">See the magic we create</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4">
          <div className="scroll-indicator">
            <i className="bi bi-chevron-down text-white fs-4"></i>
          </div>
        </div>
      </header>

      {/* Enhanced Services Section */}
      <section id="services" className="py-5 position-relative overflow-hidden">
        <div className="position-absolute top-0 start-0 w-100 h-100" 
             style={{background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'}}>
        </div>
        <div className="container py-5 position-relative">
          <div className="text-center mb-5">
            <span className="badge bg-primary px-3 py-2 rounded-pill mb-3">Our Expertise</span>
            <h2 className="display-4 fw-bold mb-3">Premium Video Editing Services</h2>
            <p className="lead text-muted col-lg-8 mx-auto">
              From concept to completion, we offer comprehensive video editing solutions 
              tailored to your specific needs and brand requirements.
            </p>
          </div>
          
          <div className="row g-4 mb-5">
            <div className="col-lg-4 col-md-6">
              <div className="service-card card h-100 border-0 shadow-sm position-relative overflow-hidden">
                <div className="card-body p-4 text-center">
                  <div className="service-icon mb-4 mx-auto d-flex align-items-center justify-content-center" 
                       style={{
                         width: '80px', 
                         height: '80px', 
                         background: 'linear-gradient(45deg, #667eea, #764ba2)',
                         borderRadius: '20px'
                       }}>
                    <i className="bi bi-play-circle text-white fs-3"></i>
                  </div>
                  <h4 className="card-title mb-3">Short Form Videos</h4>
                  <p className="card-text text-muted mb-4">
                    Perfect for social media, reels, and quick promotional content. 
                    Engaging edits that capture attention in seconds.
                  </p>
                  <ul className="list-unstyled text-start small">
                    <li className="mb-2"><i className="bi bi-check text-success me-2"></i>Instagram Reels</li>
                    <li className="mb-2"><i className="bi bi-check text-success me-2"></i>YouTube Shorts</li>
                    <li className="mb-2"><i className="bi bi-check text-success me-2"></i>TikTok Videos</li>
                    <li className="mb-2"><i className="bi bi-check text-success me-2"></i>Promotional Clips</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="col-lg-4 col-md-6">
              <div className="service-card card h-100 border-0 shadow-sm position-relative overflow-hidden">
                <div className="card-body p-4 text-center">
                  <div className="service-icon mb-4 mx-auto d-flex align-items-center justify-content-center" 
                       style={{
                         width: '80px', 
                         height: '80px', 
                         background: 'linear-gradient(45deg, #f093fb, #f5576c)',
                         borderRadius: '20px'
                       }}>
                    <i className="bi bi-film text-white fs-3"></i>
                  </div>
                  <h4 className="card-title mb-3">Long Form Content</h4>
                  <p className="card-text text-muted mb-4">
                    Comprehensive editing for documentaries, tutorials, and extended content 
                    that tells your complete story.
                  </p>
                  <ul className="list-unstyled text-start small">
                    <li className="mb-2"><i className="bi bi-check text-success me-2"></i>YouTube Videos</li>
                    <li className="mb-2"><i className="bi bi-check text-success me-2"></i>Documentaries</li>
                    <li className="mb-2"><i className="bi bi-check text-success me-2"></i>Tutorials</li>
                    <li className="mb-2"><i className="bi bi-check text-success me-2"></i>Webinars</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="col-lg-4 col-md-6">
              <div className="service-card card h-100 border-0 shadow-sm position-relative overflow-hidden">
                <div className="card-body p-4 text-center">
                  <div className="service-icon mb-4 mx-auto d-flex align-items-center justify-content-center" 
                       style={{
                         width: '80px', 
                         height: '80px', 
                         background: 'linear-gradient(45deg, #4facfe, #00f2fe)',
                         borderRadius: '20px'
                       }}>
                    <i className="bi bi-palette text-white fs-3"></i>
                  </div>
                  <h4 className="card-title mb-3">Motion Graphics</h4>
                  <p className="card-text text-muted mb-4">
                    Dynamic animations and graphics that bring your content to life 
                    with professional visual effects.
                  </p>
                  <ul className="list-unstyled text-start small">
                    <li className="mb-2"><i className="bi bi-check text-success me-2"></i>Logo Animations</li>
                    <li className="mb-2"><i className="bi bi-check text-success me-2"></i>Lower Thirds</li>
                    <li className="mb-2"><i className="bi bi-check text-success me-2"></i>Transitions</li>
                    <li className="mb-2"><i className="bi bi-check text-success me-2"></i>Visual Effects</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Process Timeline */}
          <div className="text-center mb-5">
            <h3 className="fw-bold mb-4">Our Simple Process</h3>
            <div className="row g-4">
              <div className="col-lg-3 col-md-6">
                <div className="process-step text-center">
                  <div className="step-number mx-auto mb-3 d-flex align-items-center justify-content-center fw-bold text-white" 
                       style={{
                         width: '60px', 
                         height: '60px', 
                         background: 'linear-gradient(45deg, #667eea, #764ba2)',
                         borderRadius: '50%'
                       }}>
                    1
                  </div>
                  <h5>Upload Content</h5>
                  <p className="text-muted small">Share your raw footage and project requirements with us</p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="process-step text-center">
                  <div className="step-number mx-auto mb-3 d-flex align-items-center justify-content-center fw-bold text-white" 
                       style={{
                         width: '60px', 
                         height: '60px', 
                         background: 'linear-gradient(45deg, #f093fb, #f5576c)',
                         borderRadius: '50%'
                       }}>
                    2
                  </div>
                  <h5>We Edit</h5>
                  <p className="text-muted small">Our expert team works on your project with precision</p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="process-step text-center">
                  <div className="step-number mx-auto mb-3 d-flex align-items-center justify-content-center fw-bold text-white" 
                       style={{
                         width: '60px', 
                         height: '60px', 
                         background: 'linear-gradient(45deg, #4facfe, #00f2fe)',
                         borderRadius: '50%'
                       }}>
                    3
                  </div>
                  <h5>Review & Feedback</h5>
                  <p className="text-muted small">Review the draft and provide feedback for adjustments</p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="process-step text-center">
                  <div className="step-number mx-auto mb-3 d-flex align-items-center justify-content-center fw-bold text-white" 
                       style={{
                         width: '60px', 
                         height: '60px', 
                         background: 'linear-gradient(45deg, #a8edea, #fed6e3)',
                         borderRadius: '50%'
                       }}>
                    4
                  </div>
                  <h5>Final Delivery</h5>
                  <p className="text-muted small">Receive your professionally edited video</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-5" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <span className="badge bg-light text-dark px-3 py-2 rounded-pill mb-3">Testimonials</span>
            <h2 className="display-4 fw-bold text-white mb-3">What Our Clients Say</h2>
            <p className="lead text-light col-lg-8 mx-auto">
              Don't just take our word for it - hear from our satisfied clients
            </p>
          </div>
          
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="testimonial-card p-5 rounded-4 shadow-lg" 
                   style={{background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)'}}>
                <div className="text-center mb-4">
                  <div className="mb-3">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <i key={i} className="bi bi-star-fill text-warning fs-5 me-1"></i>
                    ))}
                  </div>
                  <blockquote className="fs-4 text-white mb-4">
                    "{testimonials[currentTestimonial].text}"
                  </blockquote>
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="avatar rounded-circle bg-primary d-flex align-items-center justify-content-center me-3" 
                         style={{width: '50px', height: '50px'}}>
                      <span className="text-white fw-bold">
                        {testimonials[currentTestimonial].name.charAt(0)}
                      </span>
                    </div>
                    <div className="text-start">
                      <h6 className="text-white mb-0">{testimonials[currentTestimonial].name}</h6>
                      <small className="text-light">{testimonials[currentTestimonial].role}</small>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Testimonial indicators */}
              <div className="text-center mt-4">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`btn rounded-circle me-2 ${
                      index === currentTestimonial ? 'btn-light' : 'btn-outline-light'
                    }`}
                    style={{width: '12px', height: '12px', padding: 0}}
                    onClick={() => setCurrentTestimonial(index)}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="about" className="py-5">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="feature-video rounded-4 shadow-lg overflow-hidden" 
                   style={{background: 'linear-gradient(45deg, #667eea, #764ba2)', height: '400px'}}>
                <div className="d-flex align-items-center justify-content-center h-100">
                  <div className="text-center text-white">
                    <i className="bi bi-play-circle display-1 mb-3"></i>
                    <h4>See Our Work in Action</h4>
                    <p>Watch how we transform raw footage</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <h2 className="display-5 fw-bold mb-4">Why Choose Primewave</h2>
              <ul className="list-unstyled">
                <li className="mb-4 d-flex">
                  <div className="feature-icon me-3 d-flex align-items-center justify-content-center" 
                       style={{
                         width: '50px', 
                         height: '50px', 
                         background: 'linear-gradient(45deg, #667eea, #764ba2)',
                         borderRadius: '12px'
                       }}>
                    <i className="bi bi-people text-white fs-5"></i>
                  </div>
                  <div>
                    <h4 className="h5 mb-2">Expert Editors</h4>
                    <p className="text-muted mb-0">
                      Our team consists of industry professionals with years of experience in video production and storytelling.
                    </p>
                  </div>
                </li>
                <li className="mb-4 d-flex">
                  <div className="feature-icon me-3 d-flex align-items-center justify-content-center" 
                       style={{
                         width: '50px', 
                         height: '50px', 
                         background: 'linear-gradient(45deg, #f093fb, #f5576c)',
                         borderRadius: '12px'
                       }}>
                    <i className="bi bi-lightning text-white fs-5"></i>
                  </div>
                  <div>
                    <h4 className="h5 mb-2">Quick Turnaround</h4>
                    <p className="text-muted mb-0">
                      Receive your professionally edited videos on time, every time, without compromising on quality.
                    </p>
                  </div>
                </li>
                <li className="mb-4 d-flex">
                  <div className="feature-icon me-3 d-flex align-items-center justify-content-center" 
                       style={{
                         width: '50px', 
                         height: '50px', 
                         background: 'linear-gradient(45deg, #4facfe, #00f2fe)',
                         borderRadius: '12px'
                       }}>
                    <i className="bi bi-gear text-white fs-5"></i>
                  </div>
                  <div>
                    <h4 className="h5 mb-2">Customized Solutions</h4>
                    <p className="text-muted mb-0">
                      Tailored editing that matches your brand voice and meets specific project requirements perfectly.
                    </p>
                  </div>
                </li>
              </ul>
              <Link to="/register" className="btn btn-primary btn-lg mt-3 px-4 py-3 rounded-pill">
                <i className="bi bi-arrow-right me-2"></i>Become a Client
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section id="contact" className="py-5" style={{background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'}}>
        <div className="container py-5 text-center">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h2 className="display-5 fw-bold text-white mb-4">Ready to Transform Your Video Content?</h2>
              <p className="lead text-light mb-5">
                Join hundreds of satisfied clients and take your videos to the next level with Primewave's professional editing services.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Link to="/register" className="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow-lg">
                  <i className="bi bi-rocket-takeoff me-2"></i>Start Your Project
                </Link>
                <Link to="/login/client" className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill">
                  <i className="bi bi-person-circle me-2"></i>Client Portal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .service-card {
          transition: all 0.3s ease;
        }
        
        .service-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important;
        }
        
        .process-step {
          transition: all 0.3s ease;
        }
        
        .process-step:hover {
          transform: translateY(-5px);
        }
        
        .scroll-indicator {
          animation: bounce 2s infinite;
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        
        .testimonial-card {
          transition: all 0.3s ease;
        }
        
        .feature-icon {
          transition: all 0.3s ease;
        }
        
        .feature-icon:hover {
          transform: scale(1.1);
        }
      `}</style>
    </>
  );
};

export default HomePage;
