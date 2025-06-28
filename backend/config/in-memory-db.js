const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Setup in-memory MongoDB for development
async function setupInMemoryMongo() {
  console.log('Setting up in-memory MongoDB for development...');
  
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  
  console.log('In-memory MongoDB URI:', uri);
  
  try {
    await mongoose.connect(uri);
    console.log('Connected to in-memory MongoDB');
    
    // Create sample data if needed
    // ...
    
    return mongod;
  } catch (err) {
    console.error('Failed to connect to in-memory MongoDB:', err);
    throw err;
  }
}

module.exports = { setupInMemoryMongo };
