const mongoose = require('mongoose');

const RiderIntentSchema = new mongoose.Schema({
    pickupStop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stop',
        required: true
    },
    dropoffStop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stop',
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
    }
});

module.exports = mongoose.model('RiderIntent', RiderIntentSchema);
