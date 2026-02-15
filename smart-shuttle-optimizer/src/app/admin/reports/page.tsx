'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Loader2, TrendingUp, Users, Map as MapIcon, Calendar, Download, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

// Color Palette for Charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function ReportsPage() {
    const [loading, setLoading] = useState(true);
    const [reportType, setReportType] = useState('weekly'); // 'weekly' or 'monthly'
    const [summary, setSummary] = useState<any>(null);
    const [occupancyData, setOccupancyData] = useState<any[]>([]);
    const [hourlyData, setHourlyData] = useState<any[]>([]);
    const [heatmapData, setHeatmapData] = useState<any[]>([]);

    useEffect(() => {
        fetchReport();
        fetchAnalytics();
    }, [reportType]);

    const fetchReport = async () => {
        try {
            setLoading(true);
            // Dynamic date range could be added here
            const res = await api.get(`/reports/weekly`);
            setSummary(res.data);
        } catch (err) {
            console.error("Failed to fetch report", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAnalytics = async () => {
        try {
            const [occRes, hourRes, heatRes] = await Promise.all([
                api.get('/reports/analytics?type=occupancy'),
                api.get('/reports/analytics?type=hourly'),
                api.get('/reports/analytics?type=heatmap')
            ]);
            setOccupancyData(occRes.data);
            setHourlyData(hourRes.data);
            setHeatmapData(heatRes.data);
        } catch (err) {
            console.error("Failed to fetch analytics", err);
        }
    };

    const handleDownload = () => {
        alert("Downloading PDF Report... (Mock Functionality)");
    };

    if (loading && !summary) {
        return (
            <div className="h-full flex items-center justify-center text-neon-blue">
                <Loader2 className="animate-spin w-10 h-10" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 bg-[#0a0e17] min-h-screen text-gray-200">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        <BarChart3 className="text-neon-blue" /> Operational Reports
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        {summary?.header?.dateRange} • Generated: {new Date(summary?.header?.generatedOn).toLocaleTimeString()}
                    </p>
                </div>
                <div className="flex gap-3">
                    <select
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                        className="bg-[#111625] border border-white/10 text-white p-2 rounded-lg focus:border-neon-blue outline-none"
                    >
                        <option value="weekly">Weekly Report</option>
                        <option value="monthly">Monthly Report</option>
                    </select>
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-4 py-2 bg-neon-blue/10 text-neon-blue border border-neon-blue/30 rounded-lg font-bold hover:bg-neon-blue/20 transition-all"
                    >
                        <Download size={18} /> Export PDF
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#111625] p-6 rounded-2xl border border-white/5 shadow-lg">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase">Total Riders</p>
                            <h3 className="text-3xl font-bold text-white mt-1">{summary?.executiveSummary?.totalRiders}</h3>
                        </div>
                        <div className="p-2 bg-blue-500/10 rounded-lg text-neon-blue">
                            <Users size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-[#111625] p-6 rounded-2xl border border-white/5 shadow-lg">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase">Avg. Occupancy</p>
                            <h3 className="text-3xl font-bold text-white mt-1">{summary?.executiveSummary?.avgOccupancyRate}%</h3>
                        </div>
                        <div className="p-2 bg-green-500/10 rounded-lg text-neon-green">
                            <PieChartIcon size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-[#111625] p-6 rounded-2xl border border-white/5 shadow-lg">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase">Peak Hour</p>
                            <h3 className="text-3xl font-bold text-white mt-1">{summary?.executiveSummary?.peakHour}</h3>
                        </div>
                        <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400">
                            <TrendingUp size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-[#111625] p-6 rounded-2xl border border-white/5 shadow-lg">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase">Top Route</p>
                            <h3 className="text-xl font-bold text-white mt-2 truncate max-w-[150px]" title={summary?.executiveSummary?.topPerformer}>
                                {summary?.executiveSummary?.topPerformer}
                            </h3>
                        </div>
                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                            <MapIcon size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Hourly Demand Area Chart */}
                <div className="bg-[#111625] p-6 rounded-2xl border border-white/5 shadow-lg">
                    <h3 className="text-lg font-bold text-white mb-6">Hourly Demand Distribution</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={hourlyData} dataKey="count">
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#00f3ff" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="_id" stroke="#666" />
                                <YAxis stroke="#666" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="count" stroke="#00f3ff" fillOpacity={1} fill="url(#colorCount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Route Occupancy Bar Chart */}
                <div className="bg-[#111625] p-6 rounded-2xl border border-white/5 shadow-lg">
                    <h3 className="text-lg font-bold text-white mb-6">Avg. Passengers per Route</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={occupancyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="_id" stroke="#666" />
                                <YAxis stroke="#666" />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="avgPassengerCount" fill="#00ff9d" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Heatmap / Top Stops Table */}
            <div className="bg-[#111625] rounded-2xl border border-white/5 shadow-lg overflow-hidden">
                <div className="p-6 border-b border-white/5">
                    <h3 className="text-lg font-bold text-white">Top Pickup Locations (Heatmap Data)</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-gray-400 text-xs uppercase font-bold">
                            <tr>
                                <th className="p-4">Rank</th>
                                <th className="p-4">Station Name</th>
                                <th className="p-4">Demand Count</th>
                                <th className="p-4">Intensity</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {heatmapData.map((station: any, idx: number) => (
                                <tr key={station._id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-gray-500 font-mono">#{idx + 1}</td>
                                    <td className="p-4 font-bold text-white">{station._id || 'Unknown Stop'}</td>
                                    <td className="p-4 text-gray-300">{station.count} Requests</td>
                                    <td className="p-4">
                                        <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-green-500 to-red-500"
                                                style={{ width: `${Math.min(station.count * 10, 100)}%` }}
                                            ></div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
