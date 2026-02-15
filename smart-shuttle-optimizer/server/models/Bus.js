const mongoose = require('mongoose');

const BusSchema = new mongoose.Schema({
    plateNumber: {
        type: String,
        required: true,
        unique: true
    },
    totalCapacity: {
        type: Number,
        required: true,
        default: 40
    },
    currentPassengers: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'maintenance', 'idle'],
        default: 'idle'
    },
    currentRouteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route'
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    location: {
        lat: Number,
        lng: Number
    }
}, { timestamps: true });

module.exports = mongoose.model('Bus', BusSchema);
