'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Loader2, Zap, Map as MapIcon, Users, Bus, LogOut, Phone, Send, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DriverPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [routes, setRoutes] = useState<any[]>([]);

    // Mock Driver Data
    const driverName = "Alex Driver";

    useEffect(() => {
        // Simulate auth check or redirect
        const token = localStorage.getItem('token');
        if (!token) {
            // For demo purposes, we might allow bypassing if specifically testing driver view, 
            // but standard flow requires login. 
            // Let's assume user logs in as driver. 
            router.push('/login');
        }
        fetchRoutes();
    }, []);

    const fetchRoutes = async () => {
        try {
            setLoading(true);
            const res = await api.get('/routes');
            // Filter for 'assigned' routes or just show all active for demo
            const activeRoutes = res.data.filter((r: any) => r.status === 'active' || r.status === 'planned');
            setRoutes(activeRoutes);
        } catch (err) {
            console.error("Failed to fetch routes");
        } finally {
            setLoading(false);
        }
    };

    const handleSendNotification = (routeId: string) => {
        alert(`Notification sent to passengers of Route #${routeId.slice(-4)}: "Shuttle is arriving in 5 mins!"`);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-[#0a0e17] text-gray-200 flex flex-col font-sans relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none z-0"></div>

            <header className="bg-slate-950/80 backdrop-blur-md border-b border-white/5 p-4 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center neon-border-green">
                        <Bus className="text-neon-green neon-text-green" />
                    </div>
                    <div>
                        <h1 className="font-bold text-white text-lg leading-tight">Driver Portal</h1>
                        <p className="text-xs text-gray-400">Welcome, {driverName}</p>
                    </div>
                </div>
                <button onClick={handleLogout} className="text-gray-400 hover:text-white">
                    <LogOut size={20} />
                </button>
            </header>

            <main className="flex-1 p-4 max-w-lg mx-auto w-full z-10 space-y-6">
                <div className="bg-[#111625] rounded-2xl border border-white/5 p-6 shadow-xl">
                    <h2 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-4">Current Status</h2>
                    <div className="flex items-center gap-4">
                        <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse shadow-[0_0_10px_#00ff9d]"></div>
                        <span className="text-white font-medium">Online & Ready</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Assigned Routes</h2>

                    {loading ? (
                        <div className="flex justify-center p-8 text-neon-blue">
                            <Loader2 className="animate-spin w-8 h-8" />
                        </div>
                    ) : routes.length === 0 ? (
                        <div className="bg-[#111625] rounded-2xl border border-white/5 p-8 text-center text-gray-500">
                            No active routes assigned.
                        </div>
                    ) : (
                        routes.map((route: any) => (
                            <div key={route._id} className="bg-[#111625] rounded-2xl border border-white/5 overflow-hidden shadow-lg group hover:border-neon-green/30 transition-all">
                                <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/5">
                                    <h3 className="font-bold text-white text-lg">Route #{route._id.slice(-4)}</h3>
                                    <span className="px-3 py-1 bg-green-500/10 text-neon-green text-xs font-bold rounded-full border border-green-500/20">
                                        {route.status}
                                    </span>
                                </div>
                                <div className="p-5 space-y-4">
                                    <div className="space-y-4 relative">
                                        {/* Route Line */}
                                        <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-gray-700"></div>

                                        {route.stops.map((stop: any, idx: number) => (
                                            <div key={stop._id} className="flex items-start gap-4 relative z-10">
                                                <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 bg-[#0a0e17]",
                                                    idx === 0 ? "border-neon-blue bg-blue-500/20" :
                                                        idx === route.stops.length - 1 ? "border-neon-green bg-green-500/20" : "border-gray-600"
                                                )}>
                                                    <div className={cn("w-2 h-2 rounded-full",
                                                        idx === 0 ? "bg-neon-blue" :
                                                            idx === route.stops.length - 1 ? "bg-neon-green" : "bg-gray-600"
                                                    )}></div>
                                                </div>
                                                <div>
                                                    <div className="text-white font-medium">{stop.stopId?.name || "Stop"}</div>
                                                    <div className="text-xs text-gray-500">Scheduled: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                                        <button
                                            onClick={() => router.push(`/driver/route/${route._id}`)}
                                            className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white font-medium transition-colors"
                                        >
                                            <Navigation size={18} /> View Map
                                        </button>
                                        <button
                                            onClick={() => handleSendNotification(route._id)}
                                            className="flex items-center justify-center gap-2 py-3 bg-neon-green/10 hover:bg-neon-green/20 text-neon-green border border-neon-green/30 rounded-xl font-medium transition-colors neon-text-green"
                                        >
                                            <Send size={18} /> Notify
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
