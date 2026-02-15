'use client';

import { useState, useEffect } from 'react';
import {
    Activity, Server, Database, Shield, FileText, CheckCircle,
    AlertTriangle, RefreshCw, Cpu, HardDrive
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function SystemHealthPage() {
    const [metrics, setMetrics] = useState({
        cpu: 45,
        memory: 62,
        latency: 120,
        uptime: '99.98%'
    });

    // Recent Audit Logs
    const [logs, setLogs] = useState([
        { id: 1, action: 'ADMIN_LOGIN', user: 'admin@college.edu', ip: '192.168.1.10', status: 'SUCCESS', time: '10:05 AM' },
        { id: 2, action: 'UPDATE_ROUTE', user: 'admin@college.edu', ip: '192.168.1.10', status: 'SUCCESS', time: '09:45 AM' },
        { id: 3, action: 'DRIVER_ASSIGN', user: 'ops@college.edu', ip: '10.0.0.5', status: 'SUCCESS', time: '09:30 AM' },
        { id: 4, action: 'FAILED_LOGIN', user: 'unknown', ip: '45.33.22.11', status: 'WARNING', time: '08:15 AM' },
    ]);

    // Live Chart Data
    const [chartData, setChartData] = useState(() =>
        Array.from({ length: 20 }, (_, i) => ({ time: i, value: 30 + Math.random() * 40 }))
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics(prev => ({
                cpu: 30 + Math.floor(Math.random() * 40),
                memory: 60 + Math.floor(Math.random() * 10),
                latency: 80 + Math.floor(Math.random() * 100),
                uptime: '99.98%'
            }));

            setChartData(prev => [
                ...prev.slice(1),
                { time: prev[prev.length - 1].time + 1, value: 30 + Math.random() * 40 }
            ]);

            // Randomly add logs
            if (Math.random() > 0.9) {
                const actions = ['API_REQUEST', 'DB_QUERY', 'CACHE_HIT', 'AUTH_CHECK'];
                setLogs(prev => [{
                    id: Date.now(),
                    action: actions[Math.floor(Math.random() * actions.length)],
                    user: 'system',
                    ip: 'internal',
                    status: 'INFO',
                    time: new Date().toLocaleTimeString()
                }, ...prev].slice(0, 10));
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 p-6 pb-24">

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900 flex items-center gap-2">
                        <Activity className="text-green-600" /> System Health Monitor
                    </h1>
                    <p className="text-slate-500">Infrastructure status and security audit logs.</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-50">
                        <RefreshCw size={18} /> Refresh Log
                    </button>
                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 animate-pulse">
                        <CheckCircle size={18} /> All Systems Operational
                    </span>
                </div>
            </div>

            {/* Infrastructure Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <MetricCard
                    title="CPU Usage"
                    value={`${metrics.cpu}%`}
                    icon={<Cpu size={24} className="text-blue-500" />}
                    status="Normal"
                />
                <MetricCard
                    title="Memory Usage"
                    value={`${metrics.memory}%`}
                    icon={<HardDrive size={24} className="text-purple-500" />}
                    status="Stable"
                />
                <MetricCard
                    title="API Latency"
                    value={`${metrics.latency}ms`}
                    icon={<Activity size={24} className="text-yellow-500" />}
                    status={metrics.latency > 150 ? 'Degraded' : 'Fast'}
                />
                <MetricCard
                    title="Database"
                    value="Connected"
                    icon={<Database size={24} className="text-green-500" />}
                    status="Primary"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Real-time Load Chart */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-6 border border-slate-200">
                    <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                        <Server className="text-indigo-600" /> Real-time Traffic Load
                    </h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <Tooltip contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#4f46e5"
                                    strokeWidth={3}
                                    dot={false}
                                    isAnimationActive={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Service Status */}
                <div className="space-y-6">
                    <div className="bg-white rounded-3xl shadow-xl p-6 border border-slate-200">
                        <h2 className="font-bold text-lg mb-4">Service Status</h2>
                        <div className="space-y-4">
                            <ServiceRow name="Auth Service (JWT)" status="Operational" />
                            <ServiceRow name="Route Engine (Python)" status="Operational" />
                            <ServiceRow name="Redis Cache" status="Operational" />
                            <ServiceRow name="Notification Service" status="Idle" />
                            <ServiceRow name="Payment Gateway" status="Maintenance" warning />
                        </div>
                    </div>

                    <div className="bg-slate-900 text-white rounded-3xl shadow-xl p-6">
                        <h2 className="font-bold text-lg mb-2 flex items-center gap-2">
                            <Shield className="text-green-400" /> Security Status
                        </h2>
                        <p className="text-slate-400 text-sm mb-4">Last scan: 5 mins ago</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/10 p-3 rounded-xl">
                                <p className="text-xs text-slate-300 uppercase">Threats Blocked</p>
                                <p className="text-2xl font-bold">0</p>
                            </div>
                            <div className="bg-white/10 p-3 rounded-xl">
                                <p className="text-xs text-slate-300 uppercase">Active Sessions</p>
                                <p className="text-2xl font-bold">142</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Audit Logs */}
            <div className="mt-8 bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="font-bold text-lg flex items-center gap-2">
                        <FileText className="text-slate-500" /> Audit Logs
                    </h2>
                    <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">View All Logs</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="p-4 text-xs font-bold uppercase">Time</th>
                                <th className="p-4 text-xs font-bold uppercase">Action</th>
                                <th className="p-4 text-xs font-bold uppercase">User</th>
                                <th className="p-4 text-xs font-bold uppercase">IP Address</th>
                                <th className="p-4 text-xs font-bold uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {logs.map(log => (
                                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 text-sm font-mono text-slate-500">{log.time}</td>
                                    <td className="p-4 text-sm font-bold text-slate-800">{log.action}</td>
                                    <td className="p-4 text-sm text-slate-600">{log.user}</td>
                                    <td className="p-4 text-sm font-mono text-slate-500">{log.ip}</td>
                                    <td className="p-4">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${log.status === 'SUCCESS' ? 'bg-green-100 text-green-700' :
                                                log.status === 'WARNING' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-slate-100 text-slate-600'
                                            }`}>
                                            {log.status}
                                        </span>
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

function MetricCard({ title, value, icon, status }: any) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-slate-50 rounded-xl text-slate-600">
                {icon}
            </div>
            <div>
                <p className="text-slate-400 text-xs font-bold uppercase">{title}</p>
                <p className="text-xl font-bold text-slate-900">{value}</p>
                <p className={`text-xs font-bold ${status === 'Degraded' ? 'text-red-500' : 'text-green-600'}`}>
                    ● {status}
                </p>
            </div>
        </div>
    );
}

function ServiceRow({ name, status, warning }: any) {
    return (
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${warning ? 'bg-orange-500' : status === 'Idle' ? 'bg-gray-400' : 'bg-green-500'}`}></div>
                <span className="font-bold text-sm text-slate-700">{name}</span>
            </div>
            <span className={`text-xs font-bold ${warning ? 'text-orange-600' : status === 'Idle' ? 'text-slate-400' : 'text-green-600'}`}>
                {status}
            </span>
        </div>
    );
}
