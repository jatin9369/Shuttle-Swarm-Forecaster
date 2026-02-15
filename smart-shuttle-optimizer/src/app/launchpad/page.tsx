'use client';

import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Map as MapIcon,
    Bus,
    Users,
    Settings,
    Bell,
    Search,
    ChevronDown,
    MoreHorizontal,
    ArrowUpRight,
    Clock,
    Battery,
    ShieldCheck,
    AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LaunchpadDashboard() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex h-screen bg-[#0f172a] text-slate-300 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 overflow-hidden">

            {/* Sidebar Navigation */}
            <aside className="w-64 border-r border-slate-800/50 flex flex-col bg-[#0f172a]">
                <div className="p-6">
                    <div className="flex items-center gap-3 text-white mb-8">
                        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-900/20">
                            <Bus size={16} className="text-white" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">Launchpad</span>
                    </div>

                    <div className="space-y-1">
                        <NavItem icon={LayoutDashboard} label="Overview" active />
                        <NavItem icon={MapIcon} label="Live Map" badge="24" />
                        <NavItem icon={Bus} label="Fleet Status" />
                        <NavItem icon={Users} label="Riders" />
                        <NavItem icon={ShieldCheck} label="Compliance" />
                    </div>

                    <div className="mt-8">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">Projects</h3>
                        <div className="space-y-1">
                            <NavItem icon={AlertCircle} label="Incidents" />
                            <NavItem icon={Settings} label="Settings" />
                        </div>
                    </div>
                </div>

                <div className="mt-auto p-4 border-t border-slate-800/50">
                    <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">NS</div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">Nitin Singh</p>
                            <p className="text-xs text-slate-500 truncate">Admin</p>
                        </div>
                        <ChevronDown size={14} className="text-slate-500" />
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#0b1121]">
                {/* Top Navbar */}
                <header className="h-16 border-b border-slate-800/50 flex items-center justify-between px-8 bg-[#0f172a]/50 backdrop-blur-sm sticky top-0 z-20">
                    <div className="flex items-center">
                        <h1 className="text-sm font-medium text-slate-400">Dashboard / <span className="text-white">Overview</span></h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-slate-900/50 border border-slate-700 rounded-md py-1.5 pl-9 pr-4 text-sm text-slate-300 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 w-64 transition-all"
                            />
                        </div>
                        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                            <Bell size={18} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#0f172a]"></span>
                        </button>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="flex-1 overflow-auto p-8 custom-scrollbar">
                    <div className="max-w-6xl mx-auto space-y-8">

                        {/* Header Stats */}
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h2 className="text-2xl font-semibold text-white tracking-tight">System Status</h2>
                                <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    All systems operational • Last updated {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button className="text-sm font-medium text-slate-400 bg-slate-800/50 hover:bg-slate-800 px-4 py-2 rounded-lg border border-slate-700/50 transition-all">Filter</button>
                                <button className="text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg shadow-lg shadow-emerald-900/20 transition-all">Generate Report</button>
                            </div>
                        </div>

                        {/* Metric Cards - Asymmetric Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <MetricCard
                                title="Active Shuttles"
                                value="24"
                                trend="+2"
                                trendUp={true}
                                icon={Bus}
                                width="lg:col-span-1"
                            />
                            <MetricCard
                                title="Total Passengers"
                                value="1,248"
                                trend="+12%"
                                trendUp={true}
                                icon={Users}
                                width="lg:col-span-1"
                            />
                            <MetricCard
                                title="Avg. Wait Time"
                                value="4m 30s"
                                trend="-15s"
                                trendUp={true}
                                icon={Clock}
                                width="lg:col-span-1"
                            />
                            <MetricCard
                                title="Fuel Efficiency"
                                value="98%"
                                trend="-1%"
                                trendUp={false}
                                icon={Battery}
                                width="lg:col-span-1"
                            />
                        </div>

                        {/* Main Content Grid - Mixed Widget Sizes */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Large Map View Placeholder */}
                            <div className="lg:col-span-2 bg-[#1e293b]/40 border border-slate-700/30 rounded-xl p-6 min-h-[400px] relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[#0f172a] opacity-50 z-0"></div>
                                {/* Mock Map UI */}
                                <div className="relative z-10 h-full flex flex-col">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-base font-semibold text-white">Live Operations Map</h3>
                                            <p className="text-sm text-slate-500">Real-time vehicle tracking across campus</p>
                                        </div>
                                        <button className="p-1.5 text-slate-400 hover:text-white bg-slate-800/50 rounded-md border border-slate-700/50">
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </div>

                                    <div className="flex-1 bg-slate-900/50 rounded-lg border border-slate-700/30 relative overflow-hidden flex items-center justify-center">
                                        <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center grayscale filter invert"></div>

                                        {/* Pulsing Dots */}
                                        <div className="absolute top-1/3 left-1/4">
                                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping absolute opacity-75"></div>
                                            <div className="w-3 h-3 bg-emerald-500 rounded-full relative shadow-lg shadow-emerald-500/50 border border-white/20"></div>
                                        </div>
                                        <div className="absolute bottom-1/3 right-1/3">
                                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping absolute opacity-75 animation-delay-500"></div>
                                            <div className="w-3 h-3 bg-emerald-500 rounded-full relative shadow-lg shadow-emerald-500/50 border border-white/20"></div>
                                        </div>

                                        <button className="bg-slate-800/80 backdrop-blur text-xs font-medium text-slate-300 px-3 py-1.5 rounded-md border border-slate-700/50 flex items-center gap-2 hover:bg-slate-700 transition-colors">
                                            <MapIcon size={12} /> View Full Map
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar List - Recent Activity */}
                            <div className="lg:col-span-1 bg-[#1e293b]/40 border border-slate-700/30 rounded-xl p-6 flex flex-col">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-base font-semibold text-white">Recent Activity</h3>
                                    <button className="text-xs text-emerald-500 hover:text-emerald-400 font-medium">View all</button>
                                </div>

                                <div className="space-y-6 relative">
                                    {/* Timeline Connector */}
                                    <div className="absolute left-[19px] top-4 bottom-4 w-px bg-slate-800 z-0"></div>

                                    <ActivityItem
                                        time="2m ago"
                                        title="Shuttle #104 Completed Route"
                                        desc="Arrived at Engineering Block A"
                                        icon={Bus}
                                        active
                                    />
                                    <ActivityItem
                                        time="15m ago"
                                        title="High Demand Alert"
                                        desc="Unexpected surge at Library Stop"
                                        icon={Users}
                                        color="text-amber-500"
                                        bgColor="bg-amber-500/10"
                                        borderColor="border-amber-500/20"
                                    />
                                    <ActivityItem
                                        time="1h ago"
                                        title="Driver Check-in"
                                        desc="Rajesh K. started shift on Route 4"
                                        icon={LayoutDashboard}
                                    />
                                    <ActivityItem
                                        time="2h ago"
                                        title="System Maintenance"
                                        desc="Scheduled diagnostics completed"
                                        icon={Settings}
                                        isLast
                                    />
                                </div>
                            </div>

                        </div>

                        {/* Bottom Table - Asymmetric Density */}
                        <div className="bg-[#1e293b]/40 border border-slate-700/30 rounded-xl overflow-hidden">
                            <div className="p-6 border-b border-slate-700/30 flex justify-between items-center">
                                <h3 className="text-base font-semibold text-white">Active Routes</h3>
                                <div className="flex gap-2">
                                    <span className="text-xs font-medium text-slate-500 bg-slate-800/50 px-2 py-1 rounded border border-slate-700/30">Sort by: Status</span>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-400">
                                    <thead className="bg-slate-800/30 text-xs uppercase font-medium text-slate-500">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold tracking-wider">Route ID</th>
                                            <th className="px-6 py-4 font-semibold tracking-wider">Driver</th>
                                            <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
                                            <th className="px-6 py-4 font-semibold tracking-wider">Capacity</th>
                                            <th className="px-6 py-4 font-semibold tracking-wider text-right">ETA</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/30">
                                        <TableRow id="R-101" driver="Amit Sharma" status="On Time" capacity="85%" eta="4 min" />
                                        <TableRow id="R-102" driver="Sarah Jenkins" status="Delayed" statusColor="text-amber-500 bg-amber-500/10 border-amber-500/20" capacity="42%" eta="+12 min" />
                                        <TableRow id="R-103" driver="Mike Chen" status="On Time" capacity="12%" eta="1 min" />
                                        <TableRow id="R-104" driver="Priya Patel" status="Arrived" statusColor="text-blue-500 bg-blue-500/10 border-blue-500/20" capacity="0%" eta="Now" />
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}

// Subcomponents for cleanliness
function NavItem({ icon: Icon, label, active, badge }: any) {
    return (
        <div className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-all group ${active ? 'bg-slate-800/80 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
            <div className="flex items-center gap-3">
                <Icon size={18} className={`transition-colors ${active ? 'text-emerald-500' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span className="text-sm font-medium">{label}</span>
            </div>
            {badge && (
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    {badge}
                </span>
            )}
        </div>
    );
}

function MetricCard({ title, value, trend, trendUp, icon: Icon, width }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${width} bg-[#1e293b]/40 border border-slate-700/30 rounded-xl p-5 hover:border-slate-600/50 transition-colors group`}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-slate-800/50 rounded-lg border border-slate-700/30 group-hover:border-emerald-500/30 transition-colors">
                    <Icon size={18} className="text-slate-400 group-hover:text-emerald-400 transition-colors" />
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded ${trendUp ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                    {trend}
                </span>
            </div>
            <div>
                <h3 className="text-sm font-medium text-slate-500 mb-1">{title}</h3>
                <p className="text-2xl font-semibold text-white tracking-tight">{value}</p>
            </div>
        </motion.div>
    );
}

function ActivityItem({ time, title, desc, icon: Icon, color = "text-emerald-500", bgColor = "bg-emerald-500/10", borderColor = "border-emerald-500/20", isLast = false, active = false }: any) {
    return (
        <div className="flex gap-4 relative z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${borderColor} ${bgColor} ${active ? 'shadow-[0_0_15px_rgba(16,185,129,0.15)]' : ''}`}>
                <Icon size={16} className={color} />
            </div>
            <div>
                <p className="text-sm font-medium text-slate-200">{title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                <span className="text-[10px] uppercase font-bold text-slate-600 mt-2 block tracking-wider">{time}</span>
            </div>
        </div>
    );
}

function TableRow({ id, driver, status, statusColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", capacity, eta }: any) {
    return (
        <tr className="hover:bg-slate-800/20 transition-colors group cursor-default">
            <td className="px-6 py-4 font-medium text-white group-hover:text-emerald-400 transition-colors">{id}</td>
            <td className="px-6 py-4">{driver}</td>
            <td className="px-6 py-4">
                <span className={`text-xs font-medium px-2 py-1 rounded border ${statusColor}`}>
                    {status}
                </span>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-400 group-hover:bg-emerald-500 transition-colors" style={{ width: capacity }}></div>
                    </div>
                    <span className="text-xs">{capacity}</span>
                </div>
            </td>
            <td className="px-6 py-4 text-right font-medium text-slate-300">{eta}</td>
        </tr>
    );
}
