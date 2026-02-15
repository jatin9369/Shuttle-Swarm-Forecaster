'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Loader2, MapPin, Bus, Clock, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RiderPage() {
    interface Stop {
        _id: string;
        name: string;
    }

    const [stops, setStops] = useState<Stop[]>([]);
    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');
    const [passengers, setPassengers] = useState(1);
    const [timeSlot, setTimeSlot] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    // Generate time slots for the next 12 hours
    const generateTimeSlots = () => {
        const slots = [];
        const now = new Date();
        now.setMinutes(Math.ceil(now.getMinutes() / 15) * 15, 0, 0); // Round up to next 15 min

        for (let i = 0; i < 8; i++) { // Next 2 hours, 15 min intervals
            const time = new Date(now.getTime() + i * 15 * 60000);
            slots.push(time);
        }
        return slots;
    };

    const [availableSlots, setAvailableSlots] = useState<Date[]>([]);

    useEffect(() => {
        setAvailableSlots(generateTimeSlots());
        const fetchStops = async () => {
            try {
                const res = await api.get('/stops');
                setStops(res.data);
            } catch (err) {
                console.error("Failed to load stops");
            }
        };
        fetchStops();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/intents', {
                pickupStopId: pickup,
                dropoffStopId: dropoff,
                passengers,
                requestedTime: timeSlot ? new Date(timeSlot) : new Date(),
                deviceFingerprint: 'browser-' + Date.now() // Simple fingerprint
            });
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setPickup('');
                setDropoff('');
                setTimeSlot('');
            }, 3000);
        } catch (err) {
            alert('Failed to submit request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-grid opacity-20 z-0 pointer-events-none"></div>

            {/* Back Button */}
            <button onClick={() => router.push('/')} className="absolute top-6 left-6 text-gray-400 hover:text-white transition z-10">
                &larr; Back to Home
            </button>

            <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 neon-border-blue animation-fade-in-up">
                <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 p-6 text-center border-b border-white/5">
                    <div className="mx-auto w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-3">
                        <Bus className="w-6 h-6 text-neon-blue neon-text-blue" />
                    </div>
                    <h1 className="text-2xl font-bold text-white neon-text-blue">Request Shuttle</h1>
                    <p className="text-gray-400 text-sm">Join the swarm to optimize the route</p>
                </div>

                <div className="p-8">
                    {success ? (
                        <div className="text-center py-8 animate-fade-in">
                            <div className="w-20 h-20 bg-green-500/20 text-neon-green rounded-full flex items-center justify-center mx-auto mb-6 neon-border-green">
                                <MapPin className="w-10 h-10 neon-text-green" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Request Sent!</h3>
                            <p className="text-gray-400">Our AI is optimizing the route.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-blue-400" /> Pickup Location
                                    </label>
                                    <select
                                        className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-neon-blue focus:border-transparent outline-none transition"
                                        value={pickup}
                                        onChange={(e) => setPickup(e.target.value)}
                                        required
                                    >
                                        <option value="" className="bg-gray-900">Select Pickup Stop</option>
                                        {stops.map(stop => (
                                            <option key={stop._id} value={stop._id} className="bg-gray-900">{stop.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-green-400" /> Destination
                                    </label>
                                    <select
                                        className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-neon-green focus:border-transparent outline-none transition"
                                        value={dropoff}
                                        onChange={(e) => setDropoff(e.target.value)}
                                        required
                                    >
                                        <option value="" className="bg-gray-900">Select Destination</option>
                                        {stops.map(stop => (
                                            <option key={stop._id} value={stop._id} className="bg-gray-900">{stop.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-purple-400" /> Time Slot
                                    </label>
                                    <select
                                        className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                                        value={timeSlot}
                                        onChange={(e) => setTimeSlot(e.target.value)}
                                        required
                                    >
                                        <option value="" className="bg-gray-900">Now</option>
                                        {availableSlots.map((time, idx) => (
                                            <option key={idx} value={time.toISOString()} className="bg-gray-900">
                                                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                        <Users className="w-4 h-4 text-yellow-400" /> Passengers
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="5"
                                        className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition"
                                        value={passengers}
                                        onChange={(e) => setPassengers(parseInt(e.target.value))}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={cn(
                                    "w-full py-4 rounded-xl font-bold text-white transition-all transform hover:scale-[1.02]",
                                    loading ? "bg-gray-700 cursor-not-allowed" : "neon-button-blue hover:shadow-neon-blue"
                                )}
                            >
                                {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "Request Shuttle"}
                            </button>
                        </form>
                    )}
                </div>

                <div className="bg-black/20 p-4 text-center text-xs text-gray-600 border-t border-white/5">
                    Shuttle Swarm Forecaster © 2024
                </div>
            </div>
        </div>
    );
}
