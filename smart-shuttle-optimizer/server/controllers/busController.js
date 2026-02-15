const Bus = require('../models/Bus');

// Get all buses
exports.getBuses = async (req, res) => {
    try {
        const buses = await Bus.find().populate('currentRouteId driverId');
        res.json(buses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add a new bus
exports.addBus = async (req, res) => {
    try {
        const { plateNumber, totalCapacity, driverId } = req.body;
        const newBus = new Bus({
            plateNumber,
            totalCapacity,
            driverId
        });
        await newBus.save();
        res.json(newBus);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update Bus Status/Location
exports.updateBusStatus = async (req, res) => {
    try {
        const { status, lat, lng, currentPassengers } = req.body;
        const bus = await Bus.findByIdAndUpdate(
            req.params.id,
            { status, location: { lat, lng }, currentPassengers },
            { new: true }
        );
        res.json(bus);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
