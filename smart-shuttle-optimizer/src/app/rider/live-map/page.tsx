'use client';

import dynamic from 'next/dynamic';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Bus } from '../../components/LiveShuttleMap';

// Dynamically import Map component to avoid SSR issues
const LiveMap = dynamic(() => import('../../components/LiveShuttleMap'), {
    ssr: false,
    loading: () => <div className="h-[calc(100vh-80px)] w-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400">Loading Live Map...</div>
});

export default function LiveMapPage() {
    const [selectedBus, setSelectedBus] = useState<Bus | null>(null);

    return (
        <div className="h-screen flex flex-col bg-slate-50">
            {/* Header */}
            <div className="bg-white px-6 py-4 shadow-sm border-b border-slate-200 flex items-center gap-4 z-20">
                <Link href="/rider/request" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft size={24} className="text-slate-600" />
                </Link>
                <div>
                    <h1 className="text-xl font-heading font-bold text-slate-900">Live Shuttle Tracking</h1>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Updating in real-time
                    </p>
                </div>
            </div>

            {/* Map Container */}
            <div className="flex-1 relative">
                <LiveMap onSelectBus={setSelectedBus} />

                {/* Bus Detail Card (Overlay) */}
                {selectedBus && (
                    <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 p-5 z-[1000] animate-in slide-in-from-bottom-10 fade-in duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800">{selectedBus.name}</h2>
                                <p className="text-sm text-slate-500">{selectedBus.route}</p>
                            </div>
                            <button onClick={() => setSelectedBus(null)} className="text-slate-400 hover:text-slate-600">×</button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-slate-50 p-3 rounded-xl">
                                <span className="text-xs font-bold text-slate-400 uppercase block mb-1">ETA</span>
                                <span className="text-xl font-bold text-indigo-600">{selectedBus.eta}</span>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-xl">
                                <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Crowd</span>
                                <span className={`text-xl font-bold ${selectedBus.crowd === 'High' ? 'text-red-500' :
                                    selectedBus.crowd === 'Medium' ? 'text-yellow-500' : 'text-green-500'
                                    }`}>
                                    {selectedBus.crowd}
                                </span>
                            </div>
                        </div>

                        <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors">
                            Track This Bus
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
