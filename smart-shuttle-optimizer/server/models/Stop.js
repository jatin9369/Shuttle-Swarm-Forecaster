const mongoose = require('mongoose');

const StopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    qrCodeId: {
        type: String,
        required: true,
        unique: true
    },
    active: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Stop', StopSchema);
