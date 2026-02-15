const mongoose = require('mongoose');

const RouteSchema = new mongoose.Schema({
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    stops: [{
        stopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stop' },
        sequence: Number,
        estimatedArrival: Date
    }],
    status: {
        type: String,
        enum: ['planned', 'active', 'completed'],
        default: 'planned'
    },
    isDynamic: {
        type: Boolean,
        default: false
    },
    reason: {
        type: String // e.g., "Demand spike at Hospital"
    },
    assignedIntents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RiderIntent'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Route', RouteSchema);
