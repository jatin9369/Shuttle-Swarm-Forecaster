require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Socket.io Setup
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Make io accessible to routes
app.set('socketio', io);

// Routes Placeholder
app.get('/', (req, res) => {
    res.send('Smart Shuttle Optimizer API Running');
});

// Seed Route (Temporary for Debugging)
app.get('/api/seed', async (req, res) => {
    try {
        const seedData = require('./seed');
        const result = await seedData();
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Import Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/intents', require('./routes/intents'));
app.use('/api/routes', require('./routes/routes'));
app.use('/api/stops', require('./routes/stops'));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
