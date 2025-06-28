const jwt = require('jsonwebtoken');

// Authentication middleware with enhanced logging
module.exports = (req, res, next) => {
  try {
    console.log('Auth middleware: Checking authentication');
    const token = req.header('x-auth-token');
    
    if (!token) {
      console.log('Auth middleware: No token provided');
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    
    console.log('Auth middleware: Token found, verifying...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth middleware: Token valid, user data:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware: Token verification failed -', error.message);
    return res.status(401).json({ message: 'Invalid token.' });
  }
};
