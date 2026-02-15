const RiderIntent = require('../models/RiderIntent');
const Route = require('../models/Route');
const routingService = require('../services/routingService');

exports.runOptimizer = async (req, res) => {
    try {
        // 1. Fetch pending intents
        const demands = await RiderIntent.find({ status: 'pending' });

        if (demands.length === 0) {
            return res.json({ message: "No pending demands to optimize.", clusters: [] });
        }

        // 2. Advanced Clustering (K-Means via Service)
        const clusters = await routingService.clusterRequests(demands);

        // 3. Return Optimization Results
        res.json({
            message: "Optimization Successful",
            algorithm: "K-Means Clustering",
            originalStops: demands.length,
            optimizedClusters: clusters.length,
            clusters: clusters,
            estimatedFuelSaved: `${(demands.length - clusters.length) * 0.8} Liters` // Enhanced mock calculation
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};
