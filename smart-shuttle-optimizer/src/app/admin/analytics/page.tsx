'use client';

import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend
} from 'recharts';
import { Download, Brain, Truck, Fuel, TrendingUp, Calendar, AlertTriangle, Users, Clock } from 'lucide-react';
import { useState } from 'react';

// Mock Data for Charts
const weeklyData = [
    { day: 'Mon', passengers: 450, capacity: 500 },
    { day: 'Tue', passengers: 520, capacity: 500 }, // Overcrowded
    { day: 'Wed', passengers: 480, capacity: 500 },
    { day: 'Thu', passengers: 460, capacity: 500 },
    { day: 'Fri', passengers: 390, capacity: 500 }, // Low Demand
    { day: 'Sat', passengers: 150, capacity: 200 },
    { day: 'Sun', passengers: 120, capacity: 200 },
];

const hourlyData = [
    { time: '07:00', demand: 20 },
    { time: '08:00', demand: 85 }, // Peak
    { time: '09:00', demand: 60 },
    { time: '10:00', demand: 30 },
    { time: '11:00', demand: 25 },
    { time: '12:00', demand: 40 },
    { time: '13:00', demand: 55 },
    { time: '14:00', demand: 35 },
    { time: '15:00', demand: 25 },
    { time: '16:00', demand: 70 }, // Peak
    { time: '17:00', demand: 90 }, // Peak
    { time: '18:00', demand: 45 },
];

export default function AnalyticsDashboard() {
    const [timeRange, setTimeRange] = useState('weekly');

    const handleExport = (format: string) => {
        alert(`Exporting Analytics Report as ${format}... (Simulation)`);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 pb-24">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900 flex items-center gap-2">
                        <Brain className="text-indigo-600" /> AI Analytics Engine
                    </h1>
                    <p className="text-slate-500">Predictive insights and operational intelligence.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => handleExport('CSV')} className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-50">
                        <Download size={18} /> CSV
                    </button>
                    <button onClick={() => handleExport('PDF')} className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-50">
                        <Download size={18} /> PDF
                    </button>
                </div>
            </div>

            {/* AI Insights & Optimization Engine */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Insight 1: Route Optimization */}
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
                    <h2 className="font-bold text-lg mb-4 flex items-center gap-2 relative z-10">
                        <Truck className="text-indigo-200" /> Route Optimization
                    </h2>
                    <div className="space-y-4 relative z-10">
                        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                            <p className="text-xs font-bold text-indigo-200 uppercase mb-1">Recommendation</p>
                            <p className="font-bold text-lg">Merge Route A & C</p>
                            <p className="text-sm text-indigo-100 mb-3">Both routes run at <span className="font-bold">40% capacity</span> at 11:00 AM.</p>
                            <div className="flex gap-2">
                                <button className="bg-white text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-50">Auto-Merge</button>
                                <span className="flex items-center gap-1 text-xs font-bold text-green-300">
                                    <Fuel size={12} /> Saves 32% Fuel
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Insight 2: Demand Forecasting */}
                <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-bold text-lg flex items-center gap-2">
                            <TrendingUp className="text-indigo-600" /> Demand Forecast
                        </h2>
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            <button
                                onClick={() => setTimeRange('weekly')}
                                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${timeRange === 'weekly' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Weekly Pattern
                            </button>
                            <button
                                onClick={() => setTimeRange('daily')}
                                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${timeRange === 'daily' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Intra-Day Peak
                            </button>
                        </div>
                    </div>

                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            {timeRange === 'weekly' ? (
                                <BarChart data={weeklyData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '0.75rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        cursor={{ fill: '#f1f5f9' }}
                                    />
                                    <Bar dataKey="capacity" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Capacity" />
                                    <Bar dataKey="passengers" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Predicted Demand" />
                                </BarChart>
                            ) : (
                                <LineChart data={hourlyData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <Tooltip contentStyle={{ borderRadius: '0.75rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <Line type="monotone" dataKey="demand" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} />
                                </LineChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* KPI Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <MetricCard
                    label="Avg Occupancy"
                    value="78%"
                    trend="+5%"
                    trendUp={true}
                    icon={<Users size={20} className="text-blue-500" />}
                />
                <MetricCard
                    label="Fuel Efficiency"
                    value="8.2 km/l"
                    trend="+1.4%"
                    trendUp={true}
                    icon={<Fuel size={20} className="text-green-500" />}
                />
                <MetricCard
                    label="On-Time Rate"
                    value="94%"
                    trend="-2%"
                    trendUp={false}
                    icon={<Clock size={20} className="text-orange-500" />}
                />
                <MetricCard
                    label="Student Growth"
                    value="+120"
                    trend="New this week"
                    trendUp={true}
                    icon={<TrendingUp size={20} className="text-purple-500" />}
                />
            </div>

            {/* Schedule Management Stub */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-bold text-lg flex items-center gap-2">
                        <Calendar className="text-indigo-600" /> Schedule Manager
                    </h2>
                    <button className="text-sm font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1 rounded-lg">View Full Calendar</button>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-slate-700 shadow-sm border border-slate-200 group-hover:first-line:bg-indigo-600 group-hover:text-indigo-600">
                                    {i + 8}:00
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800">Morning Route {String.fromCharCode(64 + i)}</p>
                                    <p className="text-xs text-slate-500">Bus 10{i} • Driver: Rajesh Kumar</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">Mon-Fri</span>
                                <button className="text-slate-400 hover:text-indigo-600 p-2">Edit</button>
                            </div>
                        </div>
                    ))}
                    <button className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold hover:border-indigo-500 hover:text-indigo-600 transition-colors">
                        + Add New Schedule
                    </button>
                </div>
            </div>

        </div>
    );
}

function MetricCard({ label, value, trend, trendUp, icon }: any) {
    return (
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-2">
                <p className="text-slate-400 text-xs font-bold uppercase">{label}</p>
                {icon}
            </div>
            <p className="text-2xl font-bold text-slate-800 mb-1">{value}</p>
            <p className={`text-xs font-bold ${trendUp ? 'text-green-600' : 'text-red-500'} flex items-center gap-1`}>
                {trendUp ? '↗' : '↘'} {trend}
            </p>
        </div>
    );
}
