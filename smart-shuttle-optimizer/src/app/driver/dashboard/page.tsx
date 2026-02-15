'use client';

import { useState } from 'react';
import { MapPin, Navigation, Users, AlertTriangle, MessageCircle, Phone, Clock } from 'lucide-react';
import Link from 'next/link';

export default function DriverDashboard() {
    const [isOnTrip, setIsOnTrip] = useState(false);
    const [showDelayModal, setShowDelayModal] = useState(false);
    const [currentStopIndex, setCurrentStopIndex] = useState(0);

    // Mock Assigned Route
    const route = {
        id: 'R101',
        name: 'Morning Shuttle - Route A',
        busNumber: 'KA-01-F-1234',
        passengers: 42,
        stops: [
            { id: 1, name: 'Hostel Block A', time: '08:15 AM', lat: 12.9716, lng: 77.5946, passengers: 15 },
            { id: 2, name: 'Ladies Hostel', time: '08:20 AM', lat: 12.9716, lng: 77.5946, passengers: 12 },
            { id: 3, name: 'Main Gate', time: '08:30 AM', lat: 12.9716, lng: 77.5946, passengers: 10 },
            { id: 4, name: 'Academic Block', time: '08:40 AM', lat: 12.9716, lng: 77.5946, passengers: 5 } // Dropoff
        ]
    };

    const handleStartTrip = () => {
        setIsOnTrip(true);
        // In real app: API call to update bus status
    };

    const handleEndTrip = () => {
        setIsOnTrip(false);
        setCurrentStopIndex(0);
        alert('Trip Completed! Mileage logged.');
    };

    const openNavigation = (lat: number, lng: number) => {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`, '_blank');
    };

    const sendWhatsAppAlert = () => {
        const text = `📢 *Shuttle Update*: Bus ${route.busNumber} is starting now! Track live on the app.`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-slate-100 pb-24">
            {/* Header */}
            <div className="bg-slate-900 text-white p-6 rounded-b-3xl shadow-lg">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-2xl font-heading font-bold">Good Morning, Driver</h1>
                        <p className="text-slate-400 text-sm">Bus: <span className="text-white font-mono">{route.busNumber}</span></p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${isOnTrip ? 'bg-green-500 text-white animate-pulse' : 'bg-slate-700 text-slate-300'}`}>
                        {isOnTrip ? '● LIVE TRIP' : 'OFF DUTY'}
                    </div>
                </div>

                {/* Route Summary Card */}
                <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-xl flex justify-between items-center">
                    <div>
                        <p className="text-slate-300 text-xs uppercase font-bold">Assigned Route</p>
                        <p className="text-lg font-bold">{route.name}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-slate-300 text-xs uppercase font-bold">Passengers</p>
                        <p className="text-xl font-bold flex items-center justify-end gap-1">
                            <Users size={18} /> {route.passengers}
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <button
                        onClick={sendWhatsAppAlert}
                        className="bg-green-600 text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 active:scale-95 transition-transform"
                    >
                        <MessageCircle size={18} /> Notify Group
                    </button>
                    <button
                        onClick={() => setShowDelayModal(true)}
                        className="bg-orange-500 text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95 transition-transform"
                    >
                        <Clock size={18} /> Report Delay
                    </button>
                </div>

                {/* Timeline */}
                <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200 relative">
                    <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <MapPin size={18} className="text-indigo-600" /> Route Timeline
                    </h2>

                    <div className="space-y-6 relative ml-2">
                        {/* Vertical Line */}
                        <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-200"></div>

                        {route.stops.map((stop, index) => (
                            <div key={stop.id} className="relative pl-8">
                                {/* Dot */}
                                <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 z-10 ${index < currentStopIndex ? 'bg-indigo-600 border-indigo-600' :
                                        index === currentStopIndex && isOnTrip ? 'bg-white border-green-500 animate-ping' :
                                            'bg-white border-slate-300'
                                    }`}></div>

                                <div className={`transition-opacity ${index < currentStopIndex ? 'opacity-50' : 'opacity-100'}`}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-slate-800">{stop.name}</h3>
                                            <p className="text-xs text-slate-500">{stop.time} • {stop.passengers} pickup</p>
                                        </div>
                                        <button
                                            onClick={() => openNavigation(stop.lat, stop.lng)}
                                            className="p-2 bg-slate-100 text-indigo-600 rounded-lg hover:bg-indigo-50"
                                        >
                                            <Navigation size={16} />
                                        </button>
                                    </div>
                                    {index === currentStopIndex && isOnTrip && (
                                        <button
                                            onClick={() => setCurrentStopIndex(prev => prev + 1)}
                                            className="mt-2 w-full py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700"
                                        >
                                            Mark Reached
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Controls */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 flex gap-3 z-50">
                {!isOnTrip ? (
                    <button
                        onClick={handleStartTrip}
                        className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-bold text-lg shadow-xl"
                    >
                        START TRIP ▶
                    </button>
                ) : (
                    <button
                        onClick={handleEndTrip}
                        className="flex-1 py-4 bg-red-600 text-white rounded-xl font-bold text-lg shadow-xl"
                    >
                        END TRIP ■
                    </button>
                )}
                <button className="bg-red-100 text-red-600 p-4 rounded-xl font-bold" onClick={() => alert('SOS Alert Sent to Admin!')}>
                    <AlertTriangle size={24} />
                </button>
            </div>

            {/* Delay Modal */}
            {showDelayModal && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-end sm:items-center justify-center p-4">
                    <div className="bg-white w-full max-w-sm rounded-2xl p-6 animate-in slide-in-from-bottom-10">
                        <h3 className="text-xl font-bold mb-4">Report Delay</h3>
                        <div className="space-y-3 mb-6">
                            {['Traffic Jam (+10m)', 'Breakdown', 'Medical Emergency', 'Weather Issue'].map(reason => (
                                <button
                                    key={reason}
                                    onClick={() => { setShowDelayModal(false); alert(`Alert sent: ${reason}`); }}
                                    className="w-full py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-indigo-50 hover:border-indigo-200 text-left px-4"
                                >
                                    {reason}
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setShowDelayModal(false)} className="w-full py-3 text-slate-500 font-bold">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}
