const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
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
  role: {
    type: String,
    enum: ['admin', 'driver', 'rider'],
    default: 'rider'
  },
  phone: {
    type: String
  },
  // Student Profile Fields
  department: { type: String },
  year: { type: String }, // e.g., "1st Year", "2nd Year"
  hostel: { type: String }, // e.g., "Hostel A"
  homeLocation: {
    address: String,
    lat: Number,
    lng: Number
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stop'
  }],
  qrCodeId: { type: String, unique: true, sparse: true }, // For student ID card mapping
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
