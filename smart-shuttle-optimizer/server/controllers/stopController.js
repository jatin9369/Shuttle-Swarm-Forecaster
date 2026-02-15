const Stop = require('../models/Stop');

exports.getAllStops = async (req, res) => {
    try {
        const stops = await Stop.find({ active: true });
        res.json(stops);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
