const mongoose = require('mongoose');
const Manager = require('./models/Manager');
require('dotenv').config();

const managers = [
  {
    username: 'siddharth',
    password: 'Siddharth@123', // Will be hashed by pre-save hook
    email: 'siddharth@primewave.com',
    role: 'manager'
  },
  {
    username: 'abhinav',
    password: 'Abhinav@123', // Will be hashed by pre-save hook
    email: 'abhinav@primewave.com',
    role: 'manager'
  }
];

const seedManagers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing managers
    await Manager.deleteMany({});
    console.log('Existing managers cleared');
    
    // Insert new managers
    await Manager.create(managers);
    console.log('Managers seeded successfully');
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding managers:', error);
    process.exit(1);
  }
};

seedManagers();
