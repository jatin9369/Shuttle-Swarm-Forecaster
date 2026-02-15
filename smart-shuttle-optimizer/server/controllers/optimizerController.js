const RiderIntent = require('../models/RiderIntent');
const Route = require('../models/Route');

// Helper: Calculate Haversine Distance (in km)
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

exports.runOptimizer = async (req, res) => {
    try {
        const { thresholdKm = 2 } = req.body;

        // 1. Fetch pending intents
        const demands = await RiderIntent.find({ status: 'pending' });

        if (demands.length === 0) {
            return res.json({ message: "No pending demands to optimize.", clusters: [] });
        }

        // 2. Simple Clustering (Greedy Approach)
        let clusters = [];
        let visited = new Set();

        for (let i = 0; i < demands.length; i++) {
            if (visited.has(demands[i]._id.toString())) continue;

            let cluster = {
                center: demands[i].pickupStop, // Initial center
                points: [demands[i]],
                totalPassengers: demands[i].passengers || 1
            };
            visited.add(demands[i]._id.toString());

            for (let j = i + 1; j < demands.length; j++) {
                if (visited.has(demands[j]._id.toString())) continue;

                const dist = getDistance(
                    cluster.center.lat, cluster.center.lng,
                    demands[j].pickupStop.lat, demands[j].pickupStop.lng
                );

                if (dist <= thresholdKm) {
                    cluster.points.push(demands[j]);
                    cluster.totalPassengers += demands[j].passengers || 1;
                    visited.add(demands[j]._id.toString());
                }
            }
            clusters.push(cluster);
        }

        // 3. Return Optimization Results
        // In a real system, this would save new Routes to DB
        res.json({
            message: "Optimization Successful",
            originalStops: demands.length,
            optimizedStops: clusters.length,
            clusters: clusters.map(c => ({
                centerName: c.points[0].pickupStop.name, // Use first point as name for now
                passengerCount: c.totalPassengers,
                mergedRequestCount: c.points.length
            })),
            estimatedFuelSaved: `${(demands.length - clusters.length) * 0.5} Liters` // Mock calculation
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};
