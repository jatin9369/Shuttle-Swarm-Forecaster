'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { MapPin, Navigation, Clock, Users, ArrowRight, Loader2 } from 'lucide-react';

export default function DriverDashboard() {
    const router = useRouter();
    const [routes, setRoutes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRoutes();
    }, []);

    const fetchRoutes = async () => {
        try {
            // Fetch routes assigned to this driver (or all routes for demo)
            const res = await api.get('/routes');
            setRoutes(res.data);
        } catch (error) {
            console.error("Failed to fetch routes", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="h-screen w-full flex items-center justify-center bg-[#050510] text-neon-blue">
            <Loader2 className="animate-spin w-10 h-10" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050510] p-6 text-gray-200">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Driver Dashboard</h1>
                <p className="text-gray-400">Select an active route to start navigation.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {routes.length === 0 ? (
                    <div className="col-span-full text-center py-10 bg-[#111625] rounded-xl border border-white/5">
                        <MapPin className="mx-auto text-gray-600 mb-4" size={48} />
                        <p className="text-gray-400">No active routes assigned.</p>
                    </div>
                ) : routes.map((route) => (
                    <div key={route._id} className="bg-[#111625] rounded-2xl p-6 border border-white/5 hover:border-neon-blue/30 transition-all group relative overflow-hidden">

                        {/* Status Badge */}
                        <div className="absolute top-4 right-4 px-2 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded border border-green-500/20 uppercase">
                            Active
                        </div>

                        <h3 className="text-xl font-bold text-white mb-4">{route.name}</h3>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                <MapPin size={16} className="text-neon-blue" />
                                <span>{route.stops?.length || 0} Stops</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                <Clock size={16} className="text-purple-400" />
                                <span>Est. 45 mins</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                <Users size={16} className="text-orange-400" />
                                <span>{route.capacity || 40} Seats</span>
                            </div>
                        </div>

                        <button
                            onClick={() => router.push(`/driver/route/${route._id}`)}
                            className="w-full py-3 bg-[#00f3ff] text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#00c2cc] hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all active:scale-95"
                        >
                            <Navigation size={18} /> Start Route
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
