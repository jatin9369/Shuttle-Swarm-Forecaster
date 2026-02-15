'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { io } from 'socket.io-client';
import {
    Loader2, Bus, Zap, Leaf, Droplets, Target, RefreshCw,
    TrendingUp, Users, Activity, Radio, AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

export default function OptimizationPage() {
    const [loading, setLoading] = useState(true);
    const [buses, setBuses] = useState<any[]>([]);
    const [metrics, setMetrics] = useState<any>(null);
    const [optimizing, setOptimizing] = useState(false);
    const [optResult, setOptResult] = useState<any>(null);
    const [socket, setSocket] = useState<any>(null);
    const [lastUpdate, setLastUpdate] = useState<string | null>(null);

    useEffect(() => {
        fetchData();

        // Socket.io Connection for Real-time Feeds
        const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000');
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log("🟢 Live Capacity Feed Connected");
        });

        // Listen for live bus updates (e.g. when a student is assigned)
        newSocket.on('busUpdate', (updatedBus: any) => {
            setBuses(prev => prev.map(bus =>
                bus._id === updatedBus._id ? updatedBus : bus
            ));
            setLastUpdate(`Bus ${updatedBus.plateNumber} updated`);

            // Clear toast after 3s
            setTimeout(() => setLastUpdate(null), 3000);
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const fetchData = async () => {
        try {
            const [busesRes, metricsRes] = await Promise.all([
                api.get('/buses'),
                api.get('/reports/sustainability')
            ]);
            setBuses(busesRes.data);
            setMetrics(metricsRes.data);
        } catch (err) {
            console.error("Failed to fetch data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleOptimize = async () => {
        try {
            setOptimizing(true);
            const res = await api.post('/optimizer/run', { thresholdKm: 2 });
            setOptResult(res.data);
            const metricsRes = await api.get('/reports/sustainability');
            setMetrics(metricsRes.data);
        } catch (err) {
            console.error("Optimization failed", err);
        } finally {
            setOptimizing(false);
        }
    };

    if (loading) return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-[#050510] text-[#00f3ff]">
            <Loader2 className="animate-spin w-16 h-16 mb-4" />
            <div className="text-xl font-mono animate-pulse">Initializing Neural Fleet...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050510] text-gray-200 relative overflow-hidden font-sans selection:bg-[#00f3ff] selection:text-black">

            {/* Background Ambient Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#00f3ff]/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#e000ff]/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />

            <div className="relative z-10 p-8 space-y-10 max-w-7xl mx-auto">

                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            {lastUpdate && (
                                <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/30 animate-in fade-in slide-in-from-right">
                                    ⚡ {lastUpdate}
                                </div>
                            )}
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 tracking-tight">
                            Smart <span className="text-[#00f3ff]">Capacity</span>
                        </h1>
                        <p className="text-gray-400 mt-2 text-lg max-w-xl">
                            Real-time fleet optimization engine driven by AI clustering and predictive demand modeling.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                            <div className="text-sm text-gray-400">System Status</div>
                            <div className="flex items-center justify-end gap-2 text-[#00f3ff] font-bold">
                                <Activity size={16} className="animate-pulse" /> Live & Optimizing
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Metrics & Optimizer (4 Cols) */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* AI Optimizer Card */}
                        <div className="relative group overflow-hidden rounded-3xl bg-[#0a0f1e] border border-white/10 p-8 transition-all hover:border-[#00f3ff]/30 shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#00f3ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Zap className="text-[#00f3ff]" /> AI Optimizer
                                    </h3>
                                    <Radio className={cn("text-gray-600", optimizing && "text-[#00f3ff] animate-spin")} />
                                </div>

                                <p className="text-gray-400 text-sm mb-8">
                                    Cluster nearby student requests (2km radius) to merge low-demand stops.
                                </p>

                                <button
                                    onClick={handleOptimize}
                                    disabled={optimizing}
                                    className="w-full py-4 bg-gradient-to-r from-[#00f3ff] to-[#0066ff] text-black font-bold uppercase tracking-widest rounded-xl hover:shadow-[0_0_30px_rgba(0,243,255,0.4)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group-hover:scale-[1.02] active:scale-95"
                                >
                                    {optimizing ? <Loader2 className="animate-spin" /> : <RefreshCw className="group-hover:rotate-180 transition-transform duration-500" />}
                                    {optimizing ? 'Crunching Data...' : 'Run Auto-Optimizer'}
                                </button>

                                {optResult && (
                                    <div className="mt-6 p-4 bg-black/40 rounded-xl border border-[#00f3ff]/20 animate-in slide-in-from-bottom fade-in">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[#00f3ff] font-bold text-sm">Optimization Complete</span>
                                            <span className="text-xs text-gray-500">Just now</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-center">
                                            <div className="p-2 bg-white/5 rounded-lg">
                                                <div className="text-gray-400 text-[10px] uppercase">Stops Merged</div>
                                                <div className="text-white font-bold">{optResult.originalStops} → {optResult.optimizedStops}</div>
                                            </div>
                                            <div className="p-2 bg-white/5 rounded-lg">
                                                <div className="text-gray-400 text-[10px] uppercase">Fuel Saved</div>
                                                <div className="text-[#00ff9d] font-bold">{optResult.estimatedFuelSaved}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sustainability Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#0a0f1e] p-5 rounded-3xl border border-white/10 hover:border-[#00ff9d]/30 transition-all group">
                                <Leaf className="text-[#00ff9d] mb-3 group-hover:scale-110 transition-transform" />
                                <div className="text-3xl font-black text-white mb-1 group-hover:text-[#00ff9d] transition-colors">
                                    {metrics?.co2Reduced?.toFixed(1) || 0}<span className="text-sm font-normal text-gray-500 ml-1">kg</span>
                                </div>
                                <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">CO2 Reduced</div>
                            </div>
                            <div className="bg-[#0a0f1e] p-5 rounded-3xl border border-white/10 hover:border-[#e000ff]/30 transition-all group">
                                <Droplets className="text-[#e000ff] mb-3 group-hover:scale-110 transition-transform" />
                                <div className="text-3xl font-black text-white mb-1 group-hover:text-[#e000ff] transition-colors">
                                    {metrics?.fuelSaved?.toFixed(1) || 0}<span className="text-sm font-normal text-gray-500 ml-1">L</span>
                                </div>
                                <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Fuel Saved</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Live Fleet Capacity (8 Cols) */}
                    <div className="lg:col-span-8">
                        <div className="bg-[#0a0f1e]/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8 h-full">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                Live Fleet Grid <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-400">{buses.length} Active</span>
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {buses.map((bus, idx) => {
                                    const filledPct = (bus.currentPassengers / bus.totalCapacity) * 100;
                                    const isFull = filledPct >= 100;
                                    const isNearlyFull = filledPct > 80;
                                    const statusColor = isFull ? "#ef4444" : isNearlyFull ? "#f59e0b" : "#00f3ff";

                                    return (
                                        <div
                                            key={bus._id}
                                            className="group relative bg-[#151a2a] rounded-2xl p-6 border border-white/5 hover:border-white/20 transition-all hover:-translate-y-1 hover:shadow-xl"
                                        >
                                            {/* Status Dot */}
                                            <div className="absolute top-4 right-4 flex items-center gap-2">
                                                <div className={cn("w-2 h-2 rounded-full animate-pulse",
                                                    bus.status === 'active' ? "bg-green-500 shadow-[0_0_8px_#22c55e]" : "bg-gray-500"
                                                )} />
                                                <span className="text-[10px] text-gray-500 uppercase font-bold">{bus.status}</span>
                                            </div>

                                            {/* Bus Icon & Plate */}
                                            <div className="flex items-center gap-4 mb-6">
                                                <div
                                                    className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-800 group-hover:bg-gray-700 transition-colors"
                                                    style={{ borderBottom: `2px solid ${statusColor}` }}
                                                >
                                                    <Bus className="text-white" size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-white text-lg">{bus.plateNumber}</h3>
                                                    <div className="text-xs text-gray-400">Route #{bus.currentRouteId?.toString().slice(-4) || 'Unassigned'}</div>
                                                </div>
                                            </div>

                                            {/* Capacity Ring / Bar */}
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Occupancy</div>
                                                        <div className="text-2xl font-bold text-white">
                                                            {bus.currentPassengers}<span className="text-sm text-gray-500">/{bus.totalCapacity}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-xl font-bold" style={{ color: statusColor }}>
                                                            {Math.round(filledPct)}%
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Fancy Progress Bar */}
                                                <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full transition-all duration-700 ease-out relative"
                                                        style={{ width: `${filledPct}%`, backgroundColor: statusColor }}
                                                    >
                                                        <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Hints */}
                                            {isFull && (
                                                <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 text-red-400 text-xs font-bold animate-pulse">
                                                    <AlertCircle size={12} /> MAX CAPACITY REACHED
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
