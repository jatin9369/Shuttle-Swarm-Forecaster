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
