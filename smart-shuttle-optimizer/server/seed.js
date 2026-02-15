require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Stop = require('./models/Stop');
const RiderIntent = require('./models/RiderIntent');
const Route = require('./models/Route');

const seedData = async () => {
    try {
        console.log('Starting Database Seed...');

        // Clear existing data
        await User.deleteMany({});
        await Stop.deleteMany({});
        await RiderIntent.deleteMany({});
        await Route.deleteMany({});

        console.log('Data Cleared');

        // Create Users (Admin, Drivers, Riders)
        const salt = await bcrypt.genSalt(10);
        const hashedAdminPass = await bcrypt.hash('admin123', salt);
        const hashedDriverPass = await bcrypt.hash('driver123', salt);
        const hashedRiderPass = await bcrypt.hash('rider123', salt);

        // Admins
        await User.create([
            { name: 'Admin User', email: 'admin@college.edu', password: hashedAdminPass, role: 'admin' },
            { name: 'System Manager', email: 'manager@college.edu', password: hashedAdminPass, role: 'admin' }
        ]);

        // Drivers
        await User.create([
            { name: 'Deepak Driver', email: 'driver@college.edu', password: hashedDriverPass, role: 'driver' },
            { name: 'Rajesh Kumar', email: 'rajesh.k@college.edu', password: hashedDriverPass, role: 'driver' },
            { name: 'Suresh Singh', email: 'suresh.s@college.edu', password: hashedDriverPass, role: 'driver' },
            { name: 'Vikram Malhotra', email: 'vikram.m@college.edu', password: hashedDriverPass, role: 'driver' },
            { name: 'Amit Verma', email: 'amit.v@college.edu', password: hashedDriverPass, role: 'driver' }
        ]);

        // Riders (Students)
        await User.create([
            { name: 'Rohan Rider', email: 'rohan@student.edu', password: hashedRiderPass, role: 'rider' },
            { name: 'Priya Sharma', email: 'priya.s@student.edu', password: hashedRiderPass, role: 'rider' },
            { name: 'Aditya Gupta', email: 'aditya.g@student.edu', password: hashedRiderPass, role: 'rider' },
            { name: 'Neha Patel', email: 'neha.p@student.edu', password: hashedRiderPass, role: 'rider' },
            { name: 'Karan Mehra', email: 'karan.m@student.edu', password: hashedRiderPass, role: 'rider' },
            { name: 'Isha Reddy', email: 'isha.r@student.edu', password: hashedRiderPass, role: 'rider' }
        ]);

        console.log('Users Created (Admins, Drivers, Students)');

        // Create Stops (Mock Engineering College Area)
        const stops = await Stop.insertMany([
            { name: 'Main Gate', location: { lat: 28.545, lng: 77.192 }, qrCodeId: 'STOP_001' },
            { name: 'Hostel Block A', location: { lat: 28.548, lng: 77.195 }, qrCodeId: 'STOP_002' },
            { name: 'Hostel Block B', location: { lat: 28.549, lng: 77.196 }, qrCodeId: 'STOP_002B' },
            { name: 'Library', location: { lat: 28.542, lng: 77.190 }, qrCodeId: 'STOP_003' },
            { name: 'Academic Block 1', location: { lat: 28.543, lng: 77.191 }, qrCodeId: 'STOP_003B' },
            { name: 'Academic Block 2', location: { lat: 28.544, lng: 77.192 }, qrCodeId: 'STOP_003C' },
            { name: 'Metro Station', location: { lat: 28.550, lng: 77.200 }, qrCodeId: 'STOP_004' },
            { name: 'Cafeteria', location: { lat: 28.546, lng: 77.193 }, qrCodeId: 'STOP_005' },
            { name: 'Sports Complex', location: { lat: 28.547, lng: 77.198 }, qrCodeId: 'STOP_006' },
            { name: 'Auditorium', location: { lat: 28.541, lng: 77.189 }, qrCodeId: 'STOP_007' }
        ]);

        console.log('Stops Created');

        // Create Sample Intents (Pending)
        await RiderIntent.create([
            { pickupStop: stops[1]._id, dropoffStop: stops[3]._id, passengers: 2, status: 'pending', userId: rider._id },
            { pickupStop: stops[1]._id, dropoffStop: stops[3]._id, passengers: 1, status: 'pending' }, // Anonymous
            { pickupStop: stops[2]._id, dropoffStop: stops[0]._id, passengers: 1, status: 'pending' },
            { pickupStop: stops[4]._id, dropoffStop: stops[3]._id, passengers: 3, status: 'pending' }
        ]);

        console.log('Sample Intents Created');
        console.log('Seeding Complete');
        return { success: true, message: 'Seeding Complete' };
    } catch (err) {
        console.error(err);
        return { success: false, error: err.message };
    }
};

if (require.main === module) {
    mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart-shuttle')
        .then(() => seedData())
        .then(() => {
            console.log('Database seeded successfully');
            process.exit(0);
        })
        .catch(err => {
            console.error('Seeding failed:', err);
            process.exit(1);
        });
}

module.exports = seedData;
