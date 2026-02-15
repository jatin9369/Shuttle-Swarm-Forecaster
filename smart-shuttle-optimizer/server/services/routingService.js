/**
 * Routing Service for Smart Shuttle Optimizer
 * Handles request clustering and route suggestions
 */

const Stop = require('../models/Stop');

// Calculate distance between two points (Haversine formula)
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

// Cluster requests using a simple distance-based approach (simplified DBSCAN)
exports.clusterRequests = async (intents) => {
    // Fetch all stops to map coordinates
    const stops = await Stop.find({});
    const stopMap = {};
    stops.forEach(s => stopMap[s._id] = s);

    const clusters = [];
    const processed = new Set();
    const CLUSTER_RADIUS_KM = 2.0; // 2km radius for clustering

    for (let i = 0; i < intents.length; i++) {
        if (processed.has(intents[i]._id.toString())) continue;

        const baseIntent = intents[i];
        const baseStop = stopMap[baseIntent.pickupStop];

        if (!baseStop) continue;

        const cluster = [baseIntent];
        processed.add(baseIntent._id.toString());

        for (let j = i + 1; j < intents.length; j++) {
            if (processed.has(intents[j]._id.toString())) continue;

            const candidateIntent = intents[j];
            const candidateStop = stopMap[candidateIntent.pickupStop];

            if (!candidateStop) continue;

            const dist = getDistanceFromLatLonInKm(
                baseStop.location.coordinates[1], baseStop.location.coordinates[0],
                candidateStop.location.coordinates[1], candidateStop.location.coordinates[0]
            );

            if (dist <= CLUSTER_RADIUS_KM) {
                cluster.push(candidateIntent);
                processed.add(candidateIntent._id.toString());
            }
        }

        if (cluster.length >= 3) { // Only care about clusters with enough demand
            clusters.push({
                center: baseStop.name, // Simplified center
                intents: cluster,
                size: cluster.length,
                suggestedAction: `Deploy Shuttle to ${baseStop.name} area`
            });
        }
    }

    return clusters;
};

// Generate optimized route suggestion
exports.optimizeRoute = (cluster) => {
    // In a real app, this would use OSRM or Google Routes API
    // For now, we return a structured suggestion object
    return {
        type: 'DYNAMIC_ROUTE',
        name: `Dynamic Route via ${cluster.center}`,
        priority: cluster.size > 10 ? 'HIGH' : 'MEDIUM',
        reason: `High demand detected (${cluster.size} riders) near ${cluster.center}`,
        waypoints: cluster.intents.slice(0, 5).map(intent => intent.pickupStop), // Mock waypoints
        estimatedTimeSaving: '15 mins'
    };
};
