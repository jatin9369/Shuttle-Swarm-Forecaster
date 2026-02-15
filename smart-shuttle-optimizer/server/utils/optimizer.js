const RiderIntent = require('../models/RiderIntent');
const Route = require('../models/Route');
const Stop = require('../models/Stop');

// Simple Optimization Algorithm
// 1. Group pending intents by Pickup Stop
// 2. Create a route for each group (or merge if destination is same - keeping it simple for now)
// 3. Assign available driver (mock assignment if no driver pool logic yet)

exports.optimizeRoutes = async () => {
    try {
        const pendingIntents = await RiderIntent.find({ status: 'pending' }).populate('pickupStop dropoffStop');

        if (pendingIntents.length === 0) {
            return { msg: 'No pending intents to optimize', routes: [] };
        }

        // Group by Pickup Stop ID
        const groupedByPickup = pendingIntents.reduce((acc, intent) => {
            const pickupId = intent.pickupStop._id.toString();
            if (!acc[pickupId]) {
                acc[pickupId] = [];
            }
            acc[pickupId].push(intent);
            return acc;
        }, {});

        const newRoutes = [];

        for (const pickupId in groupedByPickup) {
            const intents = groupedByPickup[pickupId];
            if (intents.length === 0) continue;

            // Logic to find best dropoff sequence could go here.
            // For MVP: Create a route: Pickup -> Dropoff 1 -> Dropoff 2 ...

            // Get unique stops involved
            const stops = [];
            // Add Pickup
            stops.push({
                stopId: pickupId,
                sequence: 1,
                estimatedArrival: new Date(Date.now() + 10 * 60000) // +10 mins
            });

            // Add Dropoffs
            let seq = 2;
            const dropoffMap = new Set();
            intents.forEach(intent => {
                const dropId = intent.dropoffStop._id.toString();
                if (!dropoffMap.has(dropId)) {
                    dropoffMap.add(dropId);
                    stops.push({
                        stopId: dropId,
                        sequence: seq++,
                        estimatedArrival: new Date(Date.now() + (10 + 5 * seq) * 60000) // Mock time
                    });
                }
            });

            // Create Route
            const newRoute = new Route({
                // driverId: assignedDriver, // To be implemented via driver pool
                stops: stops,
                status: 'planned',
                assignedIntents: intents.map(i => i._id)
            });

            await newRoute.save();
            newRoutes.push(newRoute);

            // Update Intents
            await RiderIntent.updateMany(
                { _id: { $in: intents.map(i => i._id) } },
                { status: 'assigned' }
            );
        }

        return { msg: 'Optimization Complete', routes: newRoutes };

    } catch (err) {
        console.error('Optimization logic error:', err);
        throw err;
    }
};
