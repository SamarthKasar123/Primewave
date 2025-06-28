const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

console.log("Testing MongoDB connection...");
console.log("MongoDB URI:", process.env.MONGO_URI);

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    
    console.log("✅ Connection successful!");
    console.log("Connection details:", mongoose.connection.host);
    
    // Test a simple database operation
    const collections = await mongoose.connection.db.collections();
    console.log("Collections in database:", collections.length);
    
    // Close connection
    await mongoose.connection.close();
    console.log("Connection closed cleanly");
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    console.log("\nPossible solutions:");
    console.log("1. Check that your IP address is whitelisted in MongoDB Atlas");
    console.log("2. Verify your username and password in the connection string");
    console.log("3. Make sure your MongoDB Atlas cluster is active");
    console.log("4. Check if your network allows MongoDB connections (port 27017)");
  }
}

testConnection();
