const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Manager = require('../models/Manager');
const Client = require('../models/Client');

// Manager login
router.post('/manager/login', async (req, res) => {
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
        email: manager.email,
        role: manager.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Client login
router.post('/client/login', async (req, res) => {
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
      { id: client._id, name: client.name, role: client.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: client._id,
        name: client.name,
        email: client.email,
        role: client.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Client registration
router.post('/client/register', async (req, res) => {
  try {
    const { name, email, password, whatsappNumber } = req.body;
    
    // Check if client already exists
    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(400).json({ message: 'Client already exists with this email' });
    }
    
    // Create new client
    const newClient = new Client({
      name,
      email,
      password,
      whatsappNumber
    });
    
    await newClient.save();
    
    const token = jwt.sign(
      { id: newClient._id, name: newClient.name, role: newClient.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      token,
      user: {
        id: newClient._id,
        name: newClient.name,
        email: newClient.email,
        role: newClient.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
