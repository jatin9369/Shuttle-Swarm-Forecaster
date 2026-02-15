const mongoose = require('mongoose');

const RiderIntentSchema = new mongoose.Schema({
    pickupStop: {
        type: String, // Changed from ObjectId for flexibility during dev
        required: true
    },
    dropoffStop: {
        type: String, // Changed from ObjectId
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Can be anonymous via QR
    },
    passengers: {
        type: Number,
        default: 1
    },
    status: {
        type: String,
        enum: ['pending', 'assigned', 'completed', 'cancelled'],
        default: 'pending'
    },
    requestedTime: {
        type: Date,
        default: Date.now
    },
    deviceFingerprint: {
        type: String // To prevent spam if anonymous
    },
    riderScore: {
        type: Number,
        default: 1.0
    },
    isPredicted: {
        type: Boolean,
        default: false
    },
    // Enhanced fields for Optimizer
    timeWindow: {
        start: { type: String, required: true }, // e.g., "08:30"
        end: { type: String, required: true }   // e.g., "09:00"
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    recurringDays: [{
        type: String,
        enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }],
    statusHistory: [{
        status: String,
        timestamp: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('RiderIntent', RiderIntentSchema);
