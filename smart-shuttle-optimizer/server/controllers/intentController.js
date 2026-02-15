const RiderIntent = require('../models/RiderIntent');
const Stop = require('../models/Stop');

// Submit Rider Intent
exports.submitIntent = async (req, res) => {
    try {
        const { pickupStopId, dropoffStopId, passengers, deviceFingerprint } = req.body;
        const userId = req.user ? req.user.id : null;

        // Validate Stops
        const pickup = await Stop.findById(pickupStopId);
        const dropoff = await Stop.findById(dropoffStopId);

        if (!pickup || !dropoff) {
            return res.status(404).json({ msg: 'Stop not found' });
        }

        const intent = new RiderIntent({
            pickupStop: pickupStopId,
            dropoffStop: dropoffStopId,
            userId,
            passengers,
            deviceFingerprint
        });

        await intent.save();

        // Emit real-time event
        const io = req.app.get('socketio');
        io.emit('newIntent', await intent.populate('pickupStop dropoffStop'));

        res.json(intent);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get All Intents (Admin/Dashboard)
exports.getIntents = async (req, res) => {
    try {
        // Optional filters: status, time window
        const intents = await RiderIntent.find().populate('pickupStop dropoffStop userId').sort({ requestedTime: -1 });
        res.json(intents);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
