const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  whatsappNumber: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'client'
  },
  registrationDate: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to hash password
clientSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare password
clientSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
