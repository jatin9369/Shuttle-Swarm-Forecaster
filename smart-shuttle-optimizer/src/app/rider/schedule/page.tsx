'use client';

import { Calendar, Clock, MapPin } from 'lucide-react';

export default function SchedulePage() {
    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Calendar className="text-orange-500" /> My Trip Schedule
            </h1>

            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center font-bold text-orange-600">
                            {8 + i}:30
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-slate-800">Morning Route {String.fromCharCode(64 + i)}</h3>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                <Clock size={12} /> Mon, Wed, Fri
                                <span className="mx-1">•</span>
                                <MapPin size={12} /> Stop {i}
                            </div>
                        </div>
                        <button className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg">
                            Track
                        </button>
                    </div>
                ))}
            </div>
            <div className="mt-8">
                <button onClick={() => window.history.back()} className="text-slate-500 hover:text-slate-800 font-bold text-sm">
                    ← Back
                </button>
            </div>
        </div>
    );
}
