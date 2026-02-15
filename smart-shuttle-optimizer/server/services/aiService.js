/**
 * AI Service for Smart Shuttle Optimizer
 * Handles rider scoring and demand prediction simulation
 */

// Simple heuristic to calculate rider score
exports.calculateRiderScore = (userHistory) => {
    // Start with default score
    let score = 0.8;

    if (!userHistory) return score;

    // Adjust based on past cancellations (mock logic)
    // In a real system, we'd query the DB for cancellation rate
    const cancellationRate = userHistory.cancellationRate || 0;
    const totalRides = userHistory.totalRides || 0;

    if (totalRides > 10) {
        score += 0.1; // Frequent rider bonus
    }

    score -= (cancellationRate * 0.5);

    // Time pattern consistency bonus (mock)
    if (userHistory.consistentCommute) {
        score += 0.05;
    }

    // Cap score between 0 and 1
    return Math.max(0, Math.min(1, score));
};

// Predict demand for a specific route or stop
exports.predictDemand = (stopId, timestamp) => {
    // Mock prediction logic based on time
    // Peak hours: 8-10 AM, 4-6 PM
    const date = new Date(timestamp);
    const hour = date.getHours();

    let baseProbability = 0.3;

    if ((hour >= 8 && hour <= 10) || (hour >= 16 && hour <= 18)) {
        baseProbability = 0.9; // Peak hour
    } else if (hour >= 11 && hour <= 14) {
        baseProbability = 0.6; // Lunch rush
    }

    // Add some random variance specifically for "AI" feel
    const variance = (Math.random() * 0.2) - 0.1;

    return Math.min(1, Math.max(0, baseProbability + variance));
};

// Emergency Rerouting Logic
exports.triggerEmergencyReroute = (activeRoutes, condition) => {
    // Condition: 'rain', 'event', 'traffic'
    const adjustments = [];

    activeRoutes.forEach(route => {
        let reason = '';
        let action = '';

        if (condition === 'rain') {
            reason = 'Heavy Rain Detected - Slowing Down';
            action = 'Speed Reduced by 20%';
        } else if (condition === 'event') {
            reason = 'Major Event Spike - Rerouting';
            action = 'Diverting to Avoid Congestion';
        }

        if (reason) {
            adjustments.push({
                routeId: route._id,
                type: 'EMERGENCY_UPDATE',
                reason,
                action,
                newEta: new Date(Date.now() + 15 * 60000) // +15 mins
            });
        }
    });

    return adjustments;
};
