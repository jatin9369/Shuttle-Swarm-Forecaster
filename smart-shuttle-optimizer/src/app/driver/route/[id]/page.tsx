'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Correct import for App Router
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { Loader2, ArrowLeft, MapPin, Navigation, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
// dynamic import for Map to avoid SSR issues with Leaflet
import dynamic from 'next/dynamic';

// Fix for default marker icon missing in Leaflet + Next.js
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false }) as any;
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false }) as any;
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false }) as any;
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false }) as any;
const Polyline = dynamic(() => import('react-leaflet').then(mod => mod.Polyline), { ssr: false }) as any;

// Component to handle geolocation and centering
const MapControls = ({ center }: { center: [number, number] }) => {
    const { useMap } = require('react-leaflet');
    const map = useMap();

    const handleLocate = () => {
        map.locate().on("locationfound", function (e: any) {
            map.flyTo(e.latlng, map.getZoom());
        });
    };

    const handleReset = () => {
        map.flyTo(center, 15);
    };

    return (
        <div className="absolute top-20 right-4 z-[400] flex flex-col gap-2">
            <button
                onClick={handleLocate}
                className="bg-black/50 backdrop-blur-md p-3 rounded-full text-white border border-white/10 hover:bg-neon-blue/20 hover:text-neon-blue transition-all shadow-lg"
                title="Locate Me"
            >
                <MapPin size={20} />
            </button>
            <button
                onClick={handleReset}
                className="bg-black/50 backdrop-blur-md p-3 rounded-full text-white border border-white/10 hover:bg-neon-green/20 hover:text-neon-green transition-all shadow-lg"
                title="Recenter on Route"
            >
                <Navigation size={20} />
            </button>
        </div>
    );
};

// Dynamic import for MapControls to avoid SSR
const MapControlsClient = dynamic(() => Promise.resolve(MapControls), { ssr: false });

// Component to update map center when route changes
const MapUpdater = ({ center }: { center: [number, number] }) => {
    const { useMap } = require('react-leaflet');
    const map = useMap();
    useEffect(() => {
        map.setView(center, 15);
    }, [center, map]);
    return null;
};

// Dynamic import for MapUpdater to avoid SSR
const MapUpdaterClient = dynamic(() => Promise.resolve(MapUpdater), { ssr: false });

export default function DriverRoutePage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [loading, setLoading] = useState(true);
    const [route, setRoute] = useState<any>(null);
    const [navigationStarted, setNavigationStarted] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchRoute = async () => {
            try {
                // In a real app, we'd fetch specific route by ID. 
                // However, our mock API might only return all routes. 
                // We'll fetch all and find the one.
                const res = await api.get('/routes');
                const found = res.data.find((r: any) => r._id === id);
                setRoute(found);
            } catch (err) {
                console.error("Failed to fetch route details");
            } finally {
                setLoading(false);
            }
        };
        fetchRoute();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center text-neon-blue">
                <Loader2 className="animate-spin w-10 h-10" />
            </div>
        );
    }

    if (!route) {
        return (
            <div className="min-h-screen bg-[#0a0e17] flex flex-col items-center justify-center text-gray-500">
                <p>Route not found</p>
                <button onClick={() => router.back()} className="mt-4 text-neon-blue hover:underline">Go Back</button>
            </div>
        );
    }

    // Prepare Coordinates
    const stopsCoordinates = route.stops.map((stop: any) => {
        // Fallback or use stop location properties
        const lat = stop.stopId?.location?.lat || 28.545;
        const lng = stop.stopId?.location?.lng || 77.192;
        return [lat, lng] as [number, number];
    });

    // Default center to first stop
    const center: [number, number] = stopsCoordinates.length > 0 ? stopsCoordinates[0] : [28.545, 77.192];

    const handleStartNavigation = () => {
        setNavigationStarted(true);
        // In a real app, this might trigger a backend status update
        alert("Navigation Started! Follow the blue line.");
    };

    return (
        <div className="min-h-screen bg-[#0a0e17] flex flex-col relative text-gray-200">
            <header className="absolute top-0 left-0 right-0 z-50 p-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                <div className="pointer-events-auto flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10 hover:bg-black/70 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="px-4 py-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 text-white font-bold shadow-lg">
                        Route #{route._id.slice(-4)}
                    </div>
                </div>
            </header>

            <div className="absolute inset-0 z-0">
                {/* Map Implementation */}
                {typeof window !== 'undefined' && (
                    <MapContainer center={center} zoom={15} style={{ height: '100%', width: '100%' }} className="z-0">
                        {/* Force dark mode tiles */}
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        />

                        {/* Route Polyline (Raw Directions) */}
                        {stopsCoordinates.length > 1 && (
                            <Polyline
                                positions={stopsCoordinates}
                                pathOptions={{ color: '#00f3ff', weight: 4, opacity: 0.8, dashArray: navigationStarted ? '10, 10' : undefined }}
                            />
                        )}

                        {/* Markers for stops */}
                        {route.stops.map((stop: any, idx: number) => {
                            const lat = stop.stopId?.location?.lat || 28.545;
                            const lng = stop.stopId?.location?.lng || 77.192;
                            return (
                                <Marker key={stop._id} position={[lat, lng] as [number, number]}>
                                    <Popup className="text-black">
                                        <strong>{stop.stopId?.name}</strong><br />
                                        Stop #{idx + 1}
                                    </Popup>
                                </Marker>
                            )
                        })}

                        {/* Recenter Map on load */}
                        <MapUpdaterClient center={center} />
                        <MapControlsClient center={center} />

                    </MapContainer>
                )}

                {/* Overlay for Stops List & Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-[#111625] rounded-t-3xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-20 max-h-[40vh] overflow-y-auto">
                    <div className="p-2 flex justify-center sticky top-0 bg-[#111625] z-30">
                        <div className="w-12 h-1.5 bg-gray-700/50 rounded-full"></div>
                    </div>
                    <div className="p-6 pt-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white">Route Details</h2>
                                <p className="text-sm text-gray-400">{route.stops.length} Stops • ~45 mins</p>
                            </div>
                            <button
                                onClick={handleStartNavigation}
                                disabled={navigationStarted}
                                className={cn(
                                    "flex items-center gap-2 px-6 py-3 rounded-full shadow-lg transition-all font-bold",
                                    navigationStarted ? "bg-green-600/20 text-green-500 border border-green-500/50" : "bg-neon-blue text-black hover:shadow-neon-blue/50"
                                )}
                            >
                                {navigationStarted ? (
                                    <>
                                        <CheckCircle2 size={18} /> Started
                                    </>
                                ) : (
                                    <>
                                        <Navigation size={18} /> Start Navigation
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="space-y-4 relative">
                            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-700"></div>
                            {route.stops.map((stop: any, idx: number) => (
                                <div key={stop._id} className={cn("flex items-center gap-4 relative z-10 p-2 rounded-xl transition-all", navigationStarted && idx === 0 ? "bg-green-500/10 border border-green-500/20" : "")}>
                                    <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 bg-[#111625]",
                                        idx === 0 ? "border-neon-blue bg-blue-500/20" :
                                            idx === route.stops.length - 1 ? "border-neon-green bg-green-500/20" : "border-gray-600"
                                    )}>
                                        <div className={cn("w-2 h-2 rounded-full",
                                            idx === 0 ? "bg-neon-blue" :
                                                idx === route.stops.length - 1 ? "bg-neon-green" : "bg-gray-600"
                                        )}></div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-white font-medium">{stop.stopId?.name || "Stop"}</div>
                                        <div className="text-xs text-gray-500">
                                            {idx === 0 ? "Pickup Point" : idx === route.stops.length - 1 ? "Dropoff Point" : "Waystop"}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
