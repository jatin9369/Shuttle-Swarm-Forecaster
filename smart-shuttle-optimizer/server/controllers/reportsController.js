const Trip = require('../models/Trip');
const RiderIntent = require('../models/RiderIntent');
const Route = require('../models/Route');

exports.getWeeklyReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        // Default to last 7 days if not provided
        const start = startDate ? new Date(startDate) : new Date(new Date() - 7 * 24 * 60 * 60 * 1000);
        const end = endDate ? new Date(endDate) : new Date();

        // 1. Total Fleet Status (Mock or fetch from Bus model if exists)
        // For now, assuming static fleet size
        const fleetStatus = {
            totalBuses: 20,
            activeBuses: 18,
            operationalDays: 5
        };

        // 2. Total Riders (Fulfilled Intents)
        const totalRiders = await RiderIntent.countDocuments({
            status: 'fulfilled',
            requestedTime: { $gte: start, $lte: end }
        });

        // 3. Total Trips
        const totalTrips = await Trip.countDocuments({
            status: 'completed',
            startTime: { $gte: start, $lte: end }
        });

        // 4. Most Demanded Route (Top Route Analysis)
        const topRoute = await Trip.aggregate([
            { $match: { startTime: { $gte: start, $lte: end } } },
            { $group: { _id: "$routeId", totalPassengers: { $sum: "$passengerCount" } } },
            { $sort: { totalPassengers: -1 } },
            { $limit: 1 },
            { $lookup: { from: 'routes', localField: '_id', foreignField: '_id', as: 'route' } },
            { $unwind: "$route" },
            { $project: { name: "$route.name", totalPassengers: 1 } }
        ]);

        // 5. Peak Hour Analysis
        const peakHour = await RiderIntent.aggregate([
            { $match: { requestedTime: { $gte: start, $lte: end } } },
            { $project: { hour: { $hour: "$requestedTime" } } },
            { $group: { _id: "$hour", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]);

        // 6. Occupancy Rate (Average)
        // Assuming capacity is constant 30 for simplicity if not in route
        const avgOccupancy = await Trip.aggregate([
            { $match: { startTime: { $gte: start, $lte: end } } },
            { $group: { _id: null, avgLoad: { $avg: "$passengerCount" } } }
        ]);

        const occupancyRate = avgOccupancy.length > 0 ? (avgOccupancy[0].avgLoad / 30) * 100 : 0;

        res.json({
            header: {
                reportType: 'Weekly Operational Report',
                dateRange: `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`,
                generatedOn: new Date(),
                ...fleetStatus
            },
            executiveSummary: {
                totalRiders,
                totalTrips,
                avgOccupancyRate: occupancyRate.toFixed(2),
                peakHour: peakHour.length > 0 ? `${peakHour[0]._id}:00` : 'N/A',
                topPerformer: topRoute.length > 0 ? topRoute[0].name : 'N/A'
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.getAnalytics = async (req, res) => {
    try {
        const { type } = req.query; // 'occupancy', 'heatmap', 'hourly'

        const start = new Date(new Date() - 30 * 24 * 60 * 60 * 1000); // Last 30 days

        if (type === 'occupancy') {
            const data = await Trip.aggregate([
                { $match: { startTime: { $gte: start } } },
                { $lookup: { from: 'routes', localField: 'routeId', foreignField: '_id', as: 'route' } },
                { $unwind: '$route' },
                {
                    $group: {
                        _id: '$route.name',
                        avgPassengerCount: { $avg: '$passengerCount' },
                        trips: { $sum: 1 }
                    }
                }
            ]);
            return res.json(data);
        }

        if (type === 'heatmap') {
            const data = await RiderIntent.aggregate([
                { $match: { requestedTime: { $gte: start } } },
                { $group: { _id: '$pickupStop.name', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]);
            return res.json(data);
        }

        if (type === 'hourly') {
            const data = await RiderIntent.aggregate([
                { $match: { requestedTime: { $gte: start } } },
                { $project: { hour: { $hour: "$requestedTime" } } },
                { $group: { _id: "$hour", count: { $sum: 1 } } },
                { $sort: { _id: 1 } }
            ]);
            return res.json(data);
        }

        res.status(400).json({ msg: 'Invalid analytics type' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.getSustainabilityMetrics = async (req, res) => {
    try {
        // Mock Data for Sustainability (In real app, calculate from Trip history)
        // Fuel Saved = (Optimized Distance - Standard Distance) * Fuel/Km
        // CO2 = Fuel Saved * 2.68kg

        const metrics = {
            fuelSaved: 124.5, // Liters
            co2Reduced: 333.6, // kg
            tripsAvoided: 12,
            treesEquivalent: 15 // Mock calc: CO2 / 22kg per tree
        };

        res.json(metrics);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
