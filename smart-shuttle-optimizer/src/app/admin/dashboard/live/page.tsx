'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
    Bus, Users, Map as MapIcon, AlertTriangle,
    TrendingUp, Activity, Clock, Zap
} from 'lucide-react';
import Link from 'next/link';

// Dynamically import Map component to avoid SSR issues
const LiveMap = dynamic(() => import('../../../components/LiveShuttleMap'), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-400">Loading Live Map...</div>
});

// Mock Data Generators
const generateRandomStats = () => ({
    activeBuses: 12,
    totalPassengers: Math.floor(Math.random() * (450 - 300) + 300),
    efficiencyScore: Math.floor(Math.random() * (98 - 85) + 85),
    avgWaitTime: Math.floor(Math.random() * (8 - 4) + 4)
});

export default function AdminLiveDashboard() {
    const [stats, setStats] = useState(generateRandomStats());
    const [alerts, setAlerts] = useState<any[]>([]);

    // Simulate Live Data Updates
    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({
                ...prev,
                totalPassengers: prev.totalPassengers + Math.floor(Math.random() * 5 - 2),
                efficiencyScore: Math.min(100, Math.max(0, prev.efficiencyScore + Math.floor(Math.random() * 3 - 1)))
            }));

            // Randomly trigger alerts
            if (Math.random() > 0.8) {
                const newAlert = {
                    id: Date.now(),
                    type: Math.random() > 0.5 ? 'overcrowding' : 'idle',
                    message: Math.random() > 0.5 ? 'Bus 104 is reaching capacity (95%)' : 'Bus 202 idle at Main Gate > 10m',
                    time: new Date().toLocaleTimeString()
                };
                setAlerts(prev => [newAlert, ...prev].slice(0, 5));
            }
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 p-6 pb-24">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900">Live Operations Center</h1>
                    <p className="text-slate-500">Real-time fleet monitoring and centralized command.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-50">
                        <TrendingUp size={18} /> Export Report
                    </button>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 animate-pulse">
                        <Activity size={18} /> Live Status: HEALTHY
                    </button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Active Fleet"
                    value={stats.activeBuses.toString()}
                    icon={<Bus size={24} className="text-blue-600" />}
                    trend="+2 vs yesterday"
                    color="bg-blue-50 text-blue-900"
                />
                <StatCard
                    title="Live Passengers"
                    value={stats.totalPassengers.toString()}
                    icon={<Users size={24} className="text-emerald-600" />}
                    trend="High Demand"
                    color="bg-emerald-50 text-emerald-900"
                />
                <StatCard
                    title="Efficiency Score"
                    value={`${stats.efficiencyScore}%`}
                    icon={<Zap size={24} className="text-amber-600" />}
                    trend="Optimized"
                    color="bg-amber-50 text-amber-900"
                />
                <StatCard
                    title="Avg Wait Time"
                    value={`${stats.avgWaitTime} min`}
                    icon={<Clock size={24} className="text-indigo-600" />}
                    trend="-1 min saved"
                    color="bg-indigo-50 text-indigo-900"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Map View */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 h-[600px] flex flex-col relative">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                        <h2 className="font-bold flex items-center gap-2">
                            <MapIcon size={18} className="text-slate-400" /> Live Fleet Map
                        </h2>
                        <div className="flex gap-2">
                            <span className="flex items-center gap-1 text-xs font-bold text-slate-500">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span> Moving
                            </span>
                            <span className="flex items-center gap-1 text-xs font-bold text-slate-500">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span> Stopped
                            </span>
                        </div>
                    </div>
                    <div className="flex-1 relative">
                        <LiveMap onSelectBus={(bus: any) => console.log('Admin selected:', bus)} />

                        {/* Heatmap Overlay Toggle */}
                        <div className="absolute top-4 right-4 z-[400]">
                            <Link href="/admin/dashboard/heatmap" className="bg-white/90 backdrop-blur text-slate-800 px-4 py-2 rounded-lg font-bold shadow-lg border border-slate-200 text-sm hover:bg-indigo-50 flex items-center gap-2">
                                🔥 View Heatmap Layer
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar: Alerts & Route Stats */}
                <div className="space-y-6">

                    {/* Live Alerts Panel */}
                    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold text-lg flex items-center gap-2">
                                <AlertTriangle size={20} className="text-red-500" /> Smart Alerts
                            </h2>
                            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">{alerts.length} New</span>
                        </div>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto">
                            {alerts.length === 0 && <p className="text-slate-400 text-sm text-center py-4">No active alerts. System optimized.</p>}
                            {alerts.map(alert => (
                                <div key={alert.id} className={`p-3 rounded-xl border-l-4 ${alert.type === 'overcrowding' ? 'bg-orange-50 border-orange-500' : 'bg-red-50 border-red-500'} animate-in slide-in-from-right`}>
                                    <div className="flex justify-between items-start">
                                        <p className="text-sm font-bold text-slate-800">{alert.message}</p>
                                        <span className="text-[10px] text-slate-500 font-mono">{alert.time}</span>
                                    </div>
                                    <div className="mt-2 flex gap-2">
                                        <button className="text-xs bg-white border border-slate-200 px-2 py-1 rounded hover:bg-slate-50 font-medium">Ignore</button>
                                        <button className="text-xs bg-slate-900 text-white px-2 py-1 rounded hover:bg-slate-800 font-medium">Deploy Extra Bus</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions Panel */}
                    <div className="bg-indigo-900 text-white rounded-3xl shadow-xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
                        <h2 className="font-bold text-lg mb-4 relative z-10">Command Actions</h2>
                        <div className="grid grid-cols-2 gap-3 relative z-10">
                            <button className="bg-white/10 hover:bg-white/20 p-3 rounded-xl text-left transition-colors">
                                <Zap size={20} className="mb-2 text-yellow-300" />
                                <span className="text-xs font-bold block">Optimize Routes</span>
                            </button>
                            <button className="bg-white/10 hover:bg-white/20 p-3 rounded-xl text-left transition-colors">
                                <Users size={20} className="mb-2 text-blue-300" />
                                <span className="text-xs font-bold block">Broadcast Message</span>
                            </button>
                            <button className="bg-white/10 hover:bg-white/20 p-3 rounded-xl text-left transition-colors">
                                <Bus size={20} className="mb-2 text-green-300" />
                                <span className="text-xs font-bold block">Add Shuttle</span>
                            </button>
                            <button className="bg-red-500/20 hover:bg-red-500/30 p-3 rounded-xl text-left transition-colors border border-red-500/30">
                                <AlertTriangle size={20} className="mb-2 text-red-300" />
                                <span className="text-xs font-bold block">Emergency Stop</span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, trend, color }: any) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${color}`}>
                    {icon}
                </div>
                <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">{trend}</span>
            </div>
            <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">{title}</h3>
            <p className="text-3xl font-heading font-bold text-slate-800">{value}</p>
        </div>
    );
}
