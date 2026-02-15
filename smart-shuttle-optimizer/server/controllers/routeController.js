const Route = require('../models/Route');
const optimizer = require('../utils/optimizer');
const aiService = require('../services/aiService');

// Get All Routes
exports.getRoutes = async (req, res) => {
    try {
        const routes = await Route.find()
            .populate('driverId', 'name')
            .populate('stops.stopId')
            .sort({ createdAt: -1 });
        res.json(routes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Trigger Optimization
exports.triggerOptimization = async (req, res) => {
    try {
        const result = await optimizer.optimizeRoutes();

        // Emit event if routes created
        if (result.routes.length > 0) {
            const io = req.app.get('socketio');
            io.emit('routesUpdated', result.routes);
        }

        res.json(result);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Assign Driver to Route
exports.assignDriver = async (req, res) => {
    try {
        const { routeId, driverId } = req.body;

        const route = await Route.findByIdAndUpdate(
            routeId,
            { driverId: driverId, status: 'active' },
            { new: true }
        ).populate('driverId', 'name').populate('stops.stopId');

        if (!route) return res.status(404).json({ msg: 'Route not found' });

        const io = req.app.get('socketio');
        io.emit('routeAssigned', route);

        res.json(route);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Emergency Reroute Trigger
exports.triggerEmergency = async (req, res) => {
    try {
        const { type } = req.body; // 'rain', 'event'

        // 1. Get all active routes
        const activeRoutes = await Route.find({ status: { $in: ['active', 'planned'] } });

        // 2. Call AI Service
        const adjustments = aiService.triggerEmergencyReroute(activeRoutes, type);

        // 3. Emit to drivers/admin
        if (adjustments.length > 0) {
            const io = req.app.get('socketio');
            io.emit('emergencyAlert', {
                type: type.toUpperCase(),
                message: `Emergency Mode: ${type}. Rerouting active buses.`,
                adjustments
            });
        }

        res.json({ success: true, adjustments });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
