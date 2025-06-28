import axios from 'axios';

// Create an axios instance with defaults
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 seconds timeout
});

console.log('API initialized with baseURL:', process.env.REACT_APP_API_URL || 'http://localhost:5000/api');

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      if (error.response.status === 401) {
        // Unauthorized - token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Only redirect if we're not already on a login page
        const currentPath = window.location.pathname;
        if (!currentPath.includes('login') && !currentPath.includes('register')) {
          window.location.href = '/login/client';
        }
      }
      
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      // Request made but no response received - server is down
      console.error('Server is not responding. Please try again later.');
    } else {
      // Error setting up request
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Utility function to show notifications
export const showNotification = (message, type = 'success') => {
  // Create notification element
  const notification = document.createElement('div');
  
  // Set classes and styles based on type
  notification.className = `alert alert-${type} notification-toast`;
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.right = '20px';
  notification.style.zIndex = '9999';
  notification.style.minWidth = '300px';
  notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
  notification.style.transition = 'all 0.3s ease-in-out';
  notification.style.opacity = '0';
  notification.style.transform = 'translateX(50px)';
  
  // Add content
  notification.innerHTML = `
    <div class="d-flex align-items-center">
      <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'danger' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
      <div>${message}</div>
      <button type="button" class="btn-close ms-auto" aria-label="Close"></button>
    </div>
  `;
  
  // Append to body
  document.body.appendChild(notification);
  
  // Add event listener to close button
  notification.querySelector('.btn-close').addEventListener('click', () => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(50px)';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  });
  
  // Show notification
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(0)';
  }, 10);
  
  // Auto hide after 5 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(50px)';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 5000);
};

export default api;
