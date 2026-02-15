const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
    routeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
        required: true
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    busId: {
        type: String, // Or ObjectId if Bus model exists
        default: 'BUS-001'
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date
    },
    status: {
        type: String,
        enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    passengerCount: {
        type: Number,
        default: 0
    },
    distanceTraveled: {
        type: Number, // in km
        default: 0
    }
}, { timestamps: true });

// Indexes for fast lookups in reports
TripSchema.index({ startTime: 1 });
TripSchema.index({ routeId: 1 });
TripSchema.index({ driverId: 1 });
TripSchema.index({ status: 1 });

module.exports = mongoose.model('Trip', TripSchema);
