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

// Map Stop IDs to Coordinates (Mock for Prototype if DB is empty)
const MOCK_STOPS = {
    'Hostel A': { lat: 12.9716, lng: 77.5946 },
    'Main Block': { lat: 12.9720, lng: 77.5950 },
    'Library': { lat: 12.9730, lng: 77.5960 },
    'Sports Complex': { lat: 12.9740, lng: 77.5930 }
};

async function getCoordinates(stopIdentifier) {
    // 1. Try DB
    if (stopIdentifier.match(/^[0-9a-fA-F]{24}$/)) {
        const stop = await Stop.findById(stopIdentifier);
        if (stop) return { lat: stop.location.lat, lng: stop.location.lng, name: stop.name };
    }
    // 2. Try Mock
    if (MOCK_STOPS[stopIdentifier]) {
        return { ...MOCK_STOPS[stopIdentifier], name: stopIdentifier };
    }
    // 3. Default
    return { lat: 12.9716, lng: 77.5946, name: 'Unknown' };
}

// K-Means Clustering Implementation
exports.clusterRequests = async (intents) => {
    if (intents.length === 0) return [];

    // 1. Prepare Data Points
    const points = [];
    for (const intent of intents) {
        const coords = await getCoordinates(intent.pickupStop); // Works with ID or Name
        points.push({
            id: intent._id,
            lat: coords.lat,
            lng: coords.lng,
            name: coords.name,
            passengers: intent.passengers || 1,
            original: intent
        });
    }

    // 2. Determine K (Number of Clusters)
    // Rule of thumb: Total Passengers / Bus Capacity (e.g., 30)
    const totalPassengers = points.reduce((sum, p) => sum + p.passengers, 0);
    const BUS_CAPACITY = 30;
    let K = Math.ceil(totalPassengers / BUS_CAPACITY);
    if (K === 0) K = 1;
    if (K > points.length) K = points.length;

    // 3. K-Means Algorithm
    let centroids = points.slice(0, K).map(p => ({ lat: p.lat, lng: p.lng })); // Simple random init
    let clusters = Array(K).fill().map(() => []);
    let iterations = 0;
    const MAX_ITER = 10;

    while (iterations < MAX_ITER) {
        // Clear clusters
        clusters = Array(K).fill().map(() => []);

        // Assignment Step
        for (const point of points) {
            let minDist = Infinity;
            let clusterIdx = 0;
            for (let i = 0; i < K; i++) {
                const dist = getDistanceFromLatLonInKm(point.lat, point.lng, centroids[i].lat, centroids[i].lng);
                if (dist < minDist) {
                    minDist = dist;
                    clusterIdx = i;
                }
            }
            clusters[clusterIdx].push(point);
        }

        // Update Step (Recalculate Centroids)
        let changed = false;
        for (let i = 0; i < K; i++) {
            if (clusters[i].length === 0) continue;

            const sumLat = clusters[i].reduce((sum, p) => sum + p.lat, 0);
            const sumLng = clusters[i].reduce((sum, p) => sum + p.lng, 0);
            const newLat = sumLat / clusters[i].length;
            const newLng = sumLng / clusters[i].length;

            if (newLat !== centroids[i].lat || newLng !== centroids[i].lng) {
                centroids[i] = { lat: newLat, lng: newLng };
                changed = true;
            }
        }

        if (!changed) break;
        iterations++;
    }

    // 4. Format Output
    return clusters
        .filter(c => c.length > 0)
        .map((c, i) => ({
            clusterId: i + 1,
            center: { lat: centroids[i].lat, lng: centroids[i].lng },
            size: c.reduce((sum, p) => sum + p.passengers, 0),
            stops: [...new Set(c.map(p => p.name))], // Unique stops
            intents: c.map(p => p.original),
            suggestedAction: `Deploy Bus to ${c[0].name} area (${c.length} stops grouped)`
        }));
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
