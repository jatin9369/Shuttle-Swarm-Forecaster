'use client';

import { useMemo, useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, TrafficLayer, Marker } from '@react-google-maps/api';
import { Navigation, Menu, Volume2, AlertTriangle, Search, X } from 'lucide-react';

const containerStyle = {
    width: '100%',
    height: '100%',
};

// Default center (San Francisco or user location)
const defaultCenter = {
    lat: 37.7749,
    lng: -122.4194,
};

const mapOptions = {
    disableDefaultUI: true,
    zoomControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    heading: 0,
    tilt: 45, // Tilted view for navigation feel
};

export default function NavigationMap({ routeData }: { routeData?: any }) {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    });

    const [center, setCenter] = useState(defaultCenter);
    const [heading, setHeading] = useState(0);

    // Simulate movement for demo purposes
    useEffect(() => {
        const interval = setInterval(() => {
            setHeading(prev => (prev + 1) % 360);
        }, 100);
        return () => clearInterval(interval);
    }, []);

    const arrowIcon = useMemo(() => ({
        path: "M -6,0 0,-12 6,0 0,-3 z", // Simple arrow shape
        fillColor: "#2563EB",
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: "white",
        rotation: heading,
        scale: 2,
        anchor: { x: 0, y: -6 } as any, // Fix type issue
    }), [heading]);

    if (!isLoaded) {
        // Fallback UI while loading or if no key
        return (
            <div className="w-full h-full bg-gray-900 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-grid opacity-10"></div>
                <div className="z-10 text-center p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/10">
                    <Navigation size={48} className="mx-auto text-neon-blue mb-4 animate-pulse" />
                    <h3 className="font-bold text-white">Loading Navigation...</h3>
                    <p className="text-sm text-gray-400">Waiting for GPS signal...</p>
                    <p className="text-xs text-gray-600 mt-2">Make sure Google Maps API Key is set</p>
                </div>
            </div>
        )
    }

    return (
        <div className="relative w-full h-full bg-gray-900">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={18}
                options={mapOptions}
            >
                <TrafficLayer options={{ autoRefresh: true }} />

                {/* User Location Arrow */}
                <Marker
                    position={center}
                    icon={arrowIcon}
                />
            </GoogleMap>

            {/* Top Right Controls */}
            <div className="absolute top-16 right-4 flex flex-col gap-3">
                <button className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50">
                    <div className="w-6 h-6 border-4 border-t-red-500 border-r-green-500 border-b-yellow-500 border-l-blue-500 rounded-full"></div>
                </button>
                <button className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50">
                    <AlertTriangle size={24} />
                </button>
                <button className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50">
                    <Search size={24} />
                </button>
                <button className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50">
                    <Volume2 size={24} />
                </button>
            </div>

            {/* Bottom Navigation Card */}
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.1)] p-6 animate-in slide-in-from-bottom duration-500">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6"></div>

                <div className="flex justify-between items-center mb-6">
                    <div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-green-600">5 min</span>
                            <span className="text-lg font-medium text-gray-500">(3.5 km)</span>
                        </div>
                        <div className="text-gray-400 font-medium">
                            Arrival: <span className="text-gray-800">1:16 PM</span>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition-colors">
                            <X size={24} className="text-gray-600" />
                        </button>
                        <button className="bg-black text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2">
                            <Navigation size={20} className="fill-current" /> Start
                        </button>
                    </div>
                </div>
            </div>

            {/* Turn Indicator Overlay */}
            <div className="absolute top-4 left-4 right-4 bg-green-600 text-white p-4 rounded-xl shadow-lg flex items-center gap-4">
                <div className="text-4xl">↱</div>
                <div>
                    <div className="text-sm opacity-80">200m</div>
                    <div className="font-bold text-xl">Turn Right onto Market St</div>
                </div>
            </div>

        </div>
    );
}
