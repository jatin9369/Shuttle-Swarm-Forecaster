'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

// Dynamically import Map component to avoid SSR issues
const LiveMap = dynamic(() => import('../../../components/LiveShuttleMap'), {
    ssr: false,
    loading: () => <div className="h-screen w-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400">Loading Heatmap...</div>
});

export default function HeatmapPage() {
    return (
        <div className="h-screen flex flex-col bg-slate-50">
            <div className="fixed top-4 left-4 right-4 z-[9999] pointer-events-none flex justify-center">
                <div className="bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-2xl border border-pink-200 pointer-events-auto flex items-center gap-4">
                    <span className="text-pink-600 font-bold text-lg">🔥 Live Demand Heatmap</span>
                    <div className="h-6 w-px bg-slate-200"></div>
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-500">
                        <span className="w-3 h-3 rounded-full bg-red-500"></span> High
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-500">
                        <span className="w-3 h-3 rounded-full bg-yellow-400"></span> Med
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-500">
                        <span className="w-3 h-3 rounded-full bg-green-500"></span> Low
                    </span>
                    <button onClick={() => window.history.back()} className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-1.5 rounded-full ml-2">
                        ✕
                    </button>
                </div>
            </div>

            <LiveMap onSelectBus={() => { }} />

            {/* Overlay simulation */}
            <div className="absolute inset-0 pointer-events-none z-[400] mix-blend-multiply opacity-30 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,0,0,0.4),transparent_70%)]"></div>
        </div>
    );
}
