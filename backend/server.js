const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas successfully');
    global.dbConnected = true;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// Initialize database connection
connectDB();

// Routes
console.log('Loading routes...');
try {
  const authRoutes = require('./routes/auth');
  app.use('/api/auth', authRoutes);
  console.log('Auth routes loaded successfully');
} catch (error) {
  console.error('Error loading auth routes:', error.message);
  console.error('Stack:', error.stack);
}

try {
  const projectRoutes = require('./routes/projects');
  app.use('/api/projects', projectRoutes);
  console.log('Projects routes loaded successfully');
} catch (error) {
  console.error('Error loading projects routes:', error.message);
  console.error('Stack:', error.stack);
}

// Test auth route
app.post('/api/auth/test', (req, res) => {
  res.json({ message: 'Auth route is working', timestamp: new Date() });
});

// Temporary inline auth routes until we fix the file loading issue
const jwt = require('jsonwebtoken');

// Import models directly
let Manager, Client;
try {
  Manager = require('./models/Manager');
  Client = require('./models/Client');
  console.log('Models loaded successfully');
} catch (error) {
  console.error('Error loading models:', error.message);
}

// Manager login
app.post('/api/auth/manager/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const manager = await Manager.findOne({ username });
    if (!manager) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await manager.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: manager._id, username: manager.username, role: manager.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: manager._id,
        username: manager.username,
        role: manager.role
      }
    });
  } catch (error) {
    console.error('Manager login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Client login
app.post('/api/auth/client/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await client.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: client._id, email: client.email, role: 'client' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: client._id,
        name: client.name,
        email: client.email,
        role: 'client'
      }
    });
  } catch (error) {
    console.error('Client login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Client register
app.post('/api/auth/client/register', async (req, res) => {
  try {
    const { name, email, password, whatsappNumber } = req.body;
    
    // Check if client already exists
    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(400).json({ message: 'Client already exists with this email' });
    }
    
    // Create new client
    const client = new Client({
      name,
      email,
      password,
      whatsappNumber
    });
    
    await client.save();
    
    // Generate token
    const token = jwt.sign(
      { id: client._id, email: client.email, role: 'client' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      token,
      user: {
        id: client._id,
        name: client.name,
        email: client.email,
        role: 'client'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to Primewave API!');
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    dbConnected: global.dbConnected || false,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Debug route to list all registered routes
app.get('/api/debug/routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach(function(middleware) {
    if(middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if(middleware.name === 'router') {
      middleware.handle.stack.forEach(function(handler) {
        if(handler.route) {
          routes.push({
            path: handler.route.path,
            methods: Object.keys(handler.route.methods)
          });
        }
      });
    }
  });
  res.json({ routes, timestamp: new Date() });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
