const RiderIntent = require('../models/RiderIntent');
const Stop = require('../models/Stop');
const Bus = require('../models/Bus');
const aiService = require('../services/aiService');
const routingService = require('../services/routingService');

// @desc    Submit a new rider intent (Ride Request)
// @route   POST /api/intents
// @access  Public/Private
exports.submitIntent = async (req, res) => {
    try {
        const { pickupStopId, dropoffStopId, passengers = 1, deviceFingerprint, requestedTime, timeWindow, isRecurring, recurringDays } = req.body;
        const userId = req.user ? req.user.id : null;

        // 1. Validate Stops
        // In a real scenario, use Stop IDs. For simplicity in demo, we might receive objects or IDs. 
        // Adapting to previous code structure which seemed to expect Objects in some places and IDs in others.
        // Let's assume IDs are passed as per variable names.

        // 2. SMART BOOKING LOGIC: Check Bus Capacity
        // Find an active bus. In a real app, match based on Route that covers these stops.
        const availableBus = await Bus.findOne({
            status: 'active',
            $expr: { $lt: ["$currentPassengers", "$totalCapacity"] }
        });

        let bookingStatus = 'pending';
        let assignedBusId = null;
        let message = "Request received. Searching for a bus...";

        if (availableBus) {
            // Check if enough seats
            if (availableBus.currentPassengers + passengers <= availableBus.totalCapacity) {
                // Assign to Bus
                availableBus.currentPassengers += passengers;
                await availableBus.save();

                bookingStatus = 'fulfilled';
                assignedBusId = availableBus._id;
                message = `Booking Confirmed! Assigned to Bus ${availableBus.plateNumber}.`;

                // Real-time update to Admin/Drivers
                // const io = req.app.get('socketio');
                // if (io) io.emit('busUpdate', availableBus);
            } else {
                message = "Bus is nearly full. You are on the waitlist.";
            }
        } else {
            message = "No buses available right now. We are optimizing routes...";
        }

        // 3. Create Intent
        const intent = new RiderIntent({
            pickupStop: pickupStopId, // Assuming Schema expects ID or Object. If Object, frontend needs to send object.
            dropoffStop: dropoffStopId, // Keeping it flexible
            userId,
            passengers,
            deviceFingerprint,
            requestedTime: requestedTime || new Date(),
            status: bookingStatus,
            timeWindow: timeWindow || { start: '00:00', end: '23:59' }, // Default window if missing
            isRecurring: isRecurring || false,
            recurringDays: recurringDays || []
        });

        await intent.save();

        // 4. Real-time update for Admin Dashboard
        const io = req.app.get('socketio');
        if (io) io.emit('newIntent', intent);

        res.status(201).json({
            intent,
            message,
            assignedBus: availableBus ? availableBus.plateNumber : null
        });

        // 5. Trigger Optimizations (Async)
        try {
            const pendingIntents = await RiderIntent.find({ status: 'pending' });
            // Mock clustering call if service exists, otherwise skip to avoid crash
            if (routingService && routingService.clusterRequests) {
                const clusters = await routingService.clusterRequests(pendingIntents);
                if (clusters.length > 0 && io) {
                    io.emit('routeSuggestion', { type: 'CLUSTERING', count: clusters.length });
                }
            }
        } catch (optErr) {
            console.error("Optimization trigger error:", optErr.message);
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get All Intents
// @route   GET /api/intents
// @access  Private (Admin)
exports.getIntents = async (req, res) => {
    try {
        const intents = await RiderIntent.find().populate('userId').sort({ requestedTime: -1 });
        res.json(intents);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
