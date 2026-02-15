'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { io } from 'socket.io-client';
import { Loader2, Zap, Map as MapIcon, Users, Bus, LogOut, Settings, BarChart3, TrendingUp, X, QrCode, Database, AlertTriangle, CloudRain, Calendar, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/app/components/Map'), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-slate-800 animate-pulse rounded-xl" />
});



export default function AdminPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        pendingRequests: 0,
        activeRoutes: 0,
        totalToday: 0
    });
    const [intents, setIntents] = useState<any[]>([]);
    const [routes, setRoutes] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [stops, setStops] = useState<any[]>([]);
    const [optimizing, setOptimizing] = useState(false);
    const [activeView, setActiveView] = useState('dashboard'); // dashboard, users, stops, settings
    const [showRawData, setShowRawData] = useState(false);
    const [useGoogleMaps, setUseGoogleMaps] = useState(false); // Map Type Toggle

    // Modals state
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [newUserCallback, setNewUserCallback] = useState({ name: '', email: '', password: '', role: 'rider' });
    const [qrModal, setQrModal] = useState<{ show: boolean, stopName: string, qrData: string } | null>(null);
    const [suggestionModal, setSuggestionModal] = useState<{ show: boolean, data: any } | null>(null);

    // Mock data for charts
    const [hourlyData, setHourlyData] = useState([
        { name: '8am', uv: 40 },
        { name: '10am', uv: 30 },
        { name: '12pm', uv: 20 },
        { name: '2pm', uv: 27 },
        { name: '4pm', uv: 18 },
        { name: '6pm', uv: 23 },
    ]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        fetchData();

        // Socket Setup
        const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000');

        socket.on('newIntent', (newIntent) => {
            setIntents(prev => [newIntent, ...prev]);
            setStats(prev => ({ ...prev, pendingRequests: prev.pendingRequests + 1, totalToday: prev.totalToday + 1 }));
        });

        socket.on('routesUpdated', (newRoutes) => {
            setRoutes(newRoutes);
            setStats(prev => ({ ...prev, activeRoutes: newRoutes.length }));
            fetchData();
        });

        socket.on('routeSuggestion', (suggestion) => {
            setSuggestionModal({ show: true, data: suggestion });
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [intentsRes, routesRes] = await Promise.all([
                api.get('/intents'),
                api.get('/routes')
            ]);

            const [usersRes, stopsRes] = await Promise.all([
                api.get('/auth/users').catch(() => ({ data: [] })),
                api.get('/stops').catch(() => ({ data: [] }))
            ]);

            const pending = intentsRes.data.filter((i: any) => i.status === 'pending');
            setIntents(pending);
            setRoutes(routesRes.data);
            setUsers(usersRes.data);
            setStops(stopsRes.data);

            setStats({
                pendingRequests: pending.length,
                activeRoutes: routesRes.data.filter((r: any) => r.status === 'active' || r.status === 'planned').length,
                totalToday: intentsRes.data.length
            });
        } catch (err) {
            console.error("Failed to fetch dashboard data", err);
        } finally {
            setLoading(false);
        }
    };

    const refreshUsers = async () => {
        try {
            const res = await api.get('/auth/users');
            setUsers(res.data);
        } catch (err) {
            console.error("Failed to refresh users list", err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    const handleEmergencyMsg = async (type: 'rain' | 'event') => {
        try {
            await api.post('/routes/emergency', { type });
            alert(`🚨 Emergency Mode Activated: ${type.toUpperCase()}\n\nAI Engine is rerouting all buses...`);
        } catch (err) {
            alert("Failed to trigger emergency mode");
        }
    };

    const handleOptimize = async () => {
        setOptimizing(true);
        try {
            await api.post('/routes/optimize');
        } catch (err) {
            alert("Optimization failed");
        } finally {
            setOptimizing(false);
        }
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', newUserCallback);
            setShowAddUserModal(false);
            setNewUserCallback({ name: '', email: '', password: '', role: 'rider' });
            setNewUserCallback({ name: '', email: '', password: '', role: 'rider' });
            await refreshUsers(); // Refresh list immediately without full page reload
            alert("User created successfully");
        } catch (err: any) {
            alert(err.response?.data?.msg || "Failed to create user");
        }
    };

    const handleGenerateQR = (stop: any) => {
        const qrData = JSON.stringify({
            id: stop._id,
            name: stop.name,
            type: 'shuttle-stop'
        });
        setQrModal({
            show: true,
            stopName: stop.name,
            qrData: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}`
        });
    };

    // Calculate Heatmap Color
    const getHeatmapColor = (pax: number) => {
        if (pax >= 5) return 'text-red-500 bg-red-500/10 border-red-500/20';
        if (pax >= 3) return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
        return 'text-green-500 bg-green-500/10 border-green-500/20';
    };

    return (
        <div className="min-h-screen bg-[#0a0e17] text-gray-200 flex font-sans">
            {/* Modals */}
            {showAddUserModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#111625] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
                        <button onClick={() => setShowAddUserModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                            <X size={20} />
                        </button>
                        <h2 className="text-xl font-bold text-white mb-6">Add New User</h2>
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-neon-blue focus:outline-none"
                                    value={newUserCallback.name}
                                    onChange={e => setNewUserCallback({ ...newUserCallback, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-neon-blue focus:outline-none"
                                    value={newUserCallback.email}
                                    onChange={e => setNewUserCallback({ ...newUserCallback, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-neon-blue focus:outline-none"
                                    value={newUserCallback.password}
                                    onChange={e => setNewUserCallback({ ...newUserCallback, password: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                                <select
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-neon-blue focus:outline-none"
                                    value={newUserCallback.role}
                                    onChange={e => setNewUserCallback({ ...newUserCallback, role: e.target.value })}
                                >
                                    <option value="rider">Rider (Student)</option>
                                    <option value="driver">Driver</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full py-3 bg-neon-blue text-black font-bold rounded-lg hover:shadow-neon-blue/50 transition-all mt-4">
                                Create Account
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {qrModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#111625] border border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative flex flex-col items-center">
                        <button onClick={() => setQrModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                            <X size={20} />
                        </button>
                        <h2 className="text-xl font-bold text-white mb-2">{qrModal.stopName}</h2>
                        <p className="text-gray-400 text-sm mb-6">Scan to log stop location</p>

                        <div className="bg-white p-4 rounded-xl">
                            <img src={qrModal.qrData} alt="QR Code" className="w-48 h-48" />
                        </div>

                        <div className="mt-6 text-xs text-gray-500 font-mono text-center">
                            ID: {JSON.parse(decodeURIComponent(qrModal.qrData.split('data=')[1])).id}
                        </div>
                    </div>
                </div>
            )}

            {suggestionModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#111625] border border-neon-green/30 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative neon-border-green">
                        <div className="flex items-center gap-3 mb-4">
                            <Zap className="text-neon-green animate-pulse" />
                            <h2 className="text-xl font-bold text-white">AI Route Suggestion</h2>
                        </div>

                        <div className="bg-white/5 p-4 rounded-xl mb-6">
                            <h3 className="text-lg font-bold text-neon-blue mb-2">{suggestionModal.data.name}</h3>
                            <p className="text-gray-300 mb-2">{suggestionModal.data.reason}</p>
                            <div className="flex gap-2">
                                <span className="px-2 py-1 bg-green-500/20 text-neon-green text-xs rounded border border-green-500/30">
                                    Priority: {suggestionModal.data.priority}
                                </span>
                                <span className="px-2 py-1 bg-blue-500/20 text-neon-blue text-xs rounded border border-blue-500/30">
                                    Savings: {suggestionModal.data.estimatedTimeSaving}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setSuggestionModal(null)}
                                className="px-4 py-2 hover:bg-white/10 rounded-lg text-gray-400 font-bold transition-colors"
                            >
                                Dismiss
                            </button>
                            <button
                                onClick={() => {
                                    alert('Route approved and dispatched to drivers!');
                                    setSuggestionModal(null);
                                }}
                                className="px-6 py-2 bg-neon-green text-black rounded-lg font-bold hover:shadow-[0_0_15px_#00ff9d] transition-all"
                            >
                                Approve & Dispatch
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <div className="w-64 bg-slate-950/50 border-r border-white/5 flex flex-col hidden md:flex">
                <div className="p-6">
                    <h2 className="text-xl font-bold flex items-center gap-2 neon-text-blue">
                        <Bus className="text-neon-blue" />
                        Admin Panel
                    </h2>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    <button
                        onClick={() => setActiveView('dashboard')}
                        className={cn("w-full text-left rounded-lg p-3 transition-all flex items-center gap-3", activeView === 'dashboard' ? "bg-neon-blue/10 text-neon-blue neon-border-blue border border-neon-blue/30" : "hover:bg-white/5 text-gray-400")}
                    >
                        <BarChart3 size={18} /> Dashboard
                    </button>
                    <button
                        onClick={() => setActiveView('users')}
                        className={cn("w-full text-left rounded-lg p-3 transition-all flex items-center gap-3", activeView === 'users' ? "bg-neon-blue/10 text-neon-blue neon-border-blue border border-neon-blue/30" : "hover:bg-white/5 text-gray-400")}
                    >
                        <Users size={18} /> Users & Drivers
                    </button>
                    <button
                        onClick={() => setActiveView('stops')}
                        className={cn("w-full text-left rounded-lg p-3 transition-all flex items-center gap-3", activeView === 'stops' ? "bg-neon-blue/10 text-neon-blue neon-border-blue border border-neon-blue/30" : "hover:bg-white/5 text-gray-400")}
                    >
                        <MapIcon size={18} /> Bus Stops
                    </button>
                    <button
                        onClick={() => setActiveView('settings')}
                        className={cn("w-full text-left rounded-lg p-3 transition-all flex items-center gap-3", activeView === 'settings' ? "bg-neon-blue/10 text-neon-blue neon-border-blue border border-neon-blue/30" : "hover:bg-white/5 text-gray-400")}
                    >
                        <Settings size={18} /> Settings
                    </button>
                    <button
                        onClick={() => router.push('/admin/reports')}
                        className="w-full text-left rounded-lg p-3 transition-all flex items-center gap-3 hover:bg-white/5 text-gray-400"
                    >
                        <BarChart3 size={18} /> Reports
                    </button>
                    <button
                        onClick={() => router.push('/admin/optimization')}
                        className="w-full text-left rounded-lg p-3 transition-all flex items-center gap-3 hover:bg-white/5 text-gray-400"
                    >
                        <Zap size={18} /> Smart Capacity
                    </button>
                </nav>
                <div className="p-6">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors w-full p-2"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto h-screen relative">
                <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none z-0"></div>
                <div className="relative z-10">
                    <header className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold capitalize text-white flex items-center gap-2">
                            {activeView === 'dashboard' ? 'Overview' : activeView}
                            {activeView === 'dashboard' && <span className="w-2 h-2 bg-neon-green rounded-full animate-pulse shadow-[0_0_10px_#00ff9d]"></span>}
                        </h1>
                        <button
                            onClick={handleOptimize}
                            disabled={optimizing || stats.pendingRequests === 0}
                            className={cn(
                                "flex items-center gap-2 px-6 py-3 rounded-lg font-bold shadow-lg transition-all",
                                optimizing ? "bg-gray-800 text-gray-500 cursor-not-allowed" : "neon-button-green text-black hover:scale-105"
                            )}
                        >
                            {optimizing ? (
                                <>
                                    <Loader2 className="animate-spin" /> Neural Optimization...
                                </>
                            ) : (
                                <>
                                    <Zap className="fill-current" /> Auto-Optimize Routes
                                </>
                            )}
                        </button>

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEmergencyMsg('rain')}
                                className="p-3 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 border border-blue-500/30 transition-all"
                                title="Simulate Rain Emergency"
                            >
                                <CloudRain size={20} />
                            </button>
                            <button
                                onClick={() => handleEmergencyMsg('event')}
                                className="p-3 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 border border-purple-500/30 transition-all"
                                title="Simulate Event Spike"
                            >
                                <Calendar size={20} />
                            </button>
                        </div>

                        <div className="h-8 w-[1px] bg-white/10 mx-2"></div>

                        {/* Map Toggle Removed */}
                    </header>

                    {activeView === 'dashboard' && (
                        <div className="space-y-6">
                            {/* Stats Row */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-[#111625] p-6 rounded-2xl border border-white/5 shadow-xl hover:border-blue-500/30 transition-all group">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-gray-400 font-medium text-sm uppercase tracking-wider">Pending Requests</h3>
                                        <Users className="text-neon-blue bg-blue-500/10 p-2 rounded-lg w-10 h-10 group-hover:bg-blue-500/20 transition-all" />
                                    </div>
                                    <div className="text-4xl font-bold text-white group-hover:neon-text-blue transition-all">{stats.pendingRequests}</div>
                                </div>
                                <div className="bg-[#111625] p-6 rounded-2xl border border-white/5 shadow-xl hover:border-green-500/30 transition-all group">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-gray-400 font-medium text-sm uppercase tracking-wider">Active Routes</h3>
                                        <MapIcon className="text-neon-green bg-green-500/10 p-2 rounded-lg w-10 h-10 group-hover:bg-green-500/20 transition-all" />
                                    </div>
                                    <div className="text-4xl font-bold text-white group-hover:neon-text-green transition-all">{stats.activeRoutes}</div>
                                </div>
                                <div className="bg-[#111625] p-6 rounded-2xl border border-white/5 shadow-xl hover:border-purple-500/30 transition-all group">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-gray-400 font-medium text-sm uppercase tracking-wider">Total Demand</h3>
                                        <Zap className="text-neon-purple bg-purple-500/10 p-2 rounded-lg w-10 h-10 group-hover:bg-purple-500/20 transition-all" />
                                    </div>
                                    <div className="text-4xl font-bold text-white group-hover:neon-text-purple transition-all">{stats.totalToday}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Main Map Widget Removed as per user request */}
                                <div className="lg:col-span-2 bg-[#111625] rounded-xl border border-white/5 p-8 flex flex-col items-center justify-center text-center h-[500px]">
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                                        <BarChart3 className="text-neon-blue w-10 h-10" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Analytics Overview</h3>
                                    <p className="text-gray-400 max-w-md mb-6">
                                        The live map has been disabled. View detailed operational reports and system analytics to optimize fleet performance.
                                    </p>
                                    <button
                                        onClick={() => router.push('/admin/reports')}
                                        className="px-6 py-3 bg-neon-blue text-black font-bold rounded-lg hover:shadow-neon-blue/50 transition-all flex items-center gap-2"
                                    >
                                        <TrendingUp size={18} /> View Reports
                                    </button>
                                </div>
                                {/* Heatmap / Live Demand */}
                                <div className="bg-[#111625] rounded-2xl border border-white/5 shadow-xl overflow-hidden flex flex-col h-[400px]">
                                    <div className="p-6 border-b border-white/5">
                                        <h2 className="font-bold text-lg flex items-center gap-2">
                                            <Zap className="text-neon-green" size={20} />
                                            Live Demand Clustering
                                        </h2>
                                    </div>
                                    <div className="p-0 flex-1 overflow-y-auto">
                                        {intents.length === 0 ? (
                                            <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                                    <Users className="text-gray-600" />
                                                </div>
                                                No active demand clusters
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-white/5">
                                                {intents.map((intent: any) => (
                                                    <div key={intent._id} className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className={cn("w-2 h-12 rounded-full", intent.passengers >= 3 ? "bg-red-500 shadow-[0_0_10px_#ef4444]" : "bg-green-500 shadow-[0_0_10px_#22c55e]")}></div>
                                                            <div>
                                                                <div className="text-white font-medium flex items-center gap-2">
                                                                    {intent.pickupStop?.name || 'Unknown'}
                                                                    <span className="text-gray-500 text-xs">to</span>
                                                                    {intent.dropoffStop?.name || 'Unknown'}
                                                                </div>
                                                                <div className="text-xs text-gray-500 mt-1">
                                                                    {new Date(intent.requestedTime).toLocaleTimeString()} • ID: {intent._id.slice(-4)}
                                                                </div>
                                                                {intent.riderScore && (
                                                                    <div className="text-[10px] text-blue-400 mt-1">
                                                                        Score: {intent.riderScore.toFixed(2)}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className={cn("px-3 py-1 rounded-full border text-xs font-bold", getHeatmapColor(intent.passengers))}>
                                                            {intent.passengers} Pax
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Users View */}
                    {activeView === 'users' && (
                        <div className="bg-[#111625] rounded-xl border border-white/5 overflow-hidden">
                            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Users className="text-neon-blue" />
                                    Users & Drivers
                                </h2>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setShowRawData(!showRawData)}
                                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
                                    >
                                        <Database size={14} /> {showRawData ? 'Hide Raw' : 'Show Raw'}
                                    </button>
                                    <button
                                        onClick={() => setShowAddUserModal(true)}
                                        className="px-4 py-2 bg-neon-blue/10 text-neon-blue border border-neon-blue/30 rounded-lg text-sm font-bold hover:bg-neon-blue/20 transition-all"
                                    >
                                        + Add New
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                {showRawData && (
                                    <div className="p-4 bg-black/50 border-b border-white/5">
                                        <pre className="text-xs text-green-500 overflow-auto max-h-48 font-mono">
                                            {JSON.stringify(users, null, 2)}
                                        </pre>
                                    </div>
                                )}
                                <table className="w-full text-left">
                                    <thead className="bg-white/5 text-gray-400 text-xs uppercase font-bold">
                                        <tr>
                                            <th className="p-4">Name</th>
                                            <th className="p-4">Email</th>
                                            <th className="p-4">Role</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {users.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="p-8 text-center text-gray-500">No users found.</td>
                                            </tr>
                                        ) : (
                                            users.map((user: any) => (
                                                <tr key={user._id} className="hover:bg-white/5 transition-colors group">
                                                    <td className="p-4 font-medium text-white">{user.name}</td>
                                                    <td className="p-4 text-gray-400">{user.email}</td>
                                                    <td className="p-4">
                                                        <span className={cn("px-2 py-1 rounded-full text-xs font-bold capitalize border",
                                                            user.role === 'admin' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                                                user.role === 'driver' ? "bg-green-500/10 text-neon-green border-green-500/20" :
                                                                    "bg-blue-500/10 text-neon-blue border-blue-500/20"
                                                        )}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                            <span className="text-sm text-gray-300">Active</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <button className="text-gray-500 hover:text-white transition-colors">Edit</button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Stops View */}
                    {activeView === 'stops' && (
                        <div className="bg-[#111625] rounded-xl border border-white/5 overflow-hidden">
                            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <MapIcon className="text-neon-green" />
                                    Bus Stops
                                </h2>
                                <button className="px-4 py-2 bg-neon-green/10 text-neon-green border border-neon-green/30 rounded-lg text-sm font-bold hover:bg-neon-green/20 transition-all">
                                    + Add Stop
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-white/5 text-gray-400 text-xs uppercase font-bold">
                                        <tr>
                                            <th className="p-4">Stop Name</th>
                                            <th className="p-4">Location (Lat, Lng)</th>
                                            <th className="p-4">QR Code ID</th>
                                            <th className="p-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {stops.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="p-8 text-center text-gray-500">No stops found.</td>
                                            </tr>
                                        ) : (
                                            stops.map((stop: any) => (
                                                <tr key={stop._id} className="hover:bg-white/5 transition-colors">
                                                    <td className="p-4 font-medium text-white flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-neon-green">
                                                            <MapIcon size={14} />
                                                        </div>
                                                        {stop.name}
                                                    </td>
                                                    <td className="p-4 text-gray-400 font-mono text-xs">
                                                        {stop.location?.lat.toFixed(4)}, {stop.location?.lng.toFixed(4)}
                                                    </td>
                                                    <td className="p-4">
                                                        <span className="px-2 py-1 bg-white/5 rounded border border-white/10 text-xs font-mono text-gray-300">
                                                            {stop.qrCodeId || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <button
                                                            onClick={() => handleGenerateQR(stop)}
                                                            className="text-neon-blue hover:text-white text-sm mr-4 transition-colors flex items-center gap-1 inline-flex"
                                                        >
                                                            <QrCode size={14} /> Generate QR
                                                        </button>
                                                        <button className="text-gray-500 hover:text-white text-sm transition-colors">Edit</button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeView === 'settings' && (
                        <div className="bg-[#111625] rounded-xl border border-white/5 overflow-hidden">
                            <div className="p-6 border-b border-white/5">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Settings className="text-neon-purple" />
                                    System Settings
                                </h2>
                            </div>
                            <div className="p-8 space-y-8">
                                {/* System Control */}
                                <div className="space-y-4">
                                    <h3 className="text-gray-400 font-bold uppercase text-sm tracking-wider">System Control</h3>
                                    <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
                                        <div>
                                            <div className="text-white font-medium">Optimization Engine</div>
                                            <div className="text-sm text-gray-500">Enable AI-based route optimization</div>
                                        </div>
                                        <div className="w-12 h-6 bg-neon-green/20 rounded-full relative cursor-pointer border border-neon-green/50">
                                            <div className="w-4 h-4 bg-neon-green rounded-full absolute top-1 right-1 shadow-[0_0_10px_#00ff9d]"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
                                        <div>
                                            <div className="text-white font-medium">System Status</div>
                                            <div className="text-sm text-gray-500">Global system availability</div>
                                        </div>
                                        <div className="w-12 h-6 bg-neon-blue/20 rounded-full relative cursor-pointer border border-neon-blue/50">
                                            <div className="w-4 h-4 bg-neon-blue rounded-full absolute top-1 right-1 shadow-[0_0_10px_#00f3ff]"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Notifications */}
                                <div className="space-y-4">
                                    <h3 className="text-gray-400 font-bold uppercase text-sm tracking-wider">Notifications</h3>
                                    <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
                                        <div>
                                            <div className="text-white font-medium">Driver Alerts</div>
                                            <div className="text-sm text-gray-500">Notify drivers on new route assignments</div>
                                        </div>
                                        <div className="w-12 h-6 bg-neon-purple/20 rounded-full relative cursor-pointer border border-neon-purple/50">
                                            <div className="w-4 h-4 bg-neon-purple rounded-full absolute top-1 right-1 shadow-[0_0_10px_#bd00ff]"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold transition-all w-full">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
