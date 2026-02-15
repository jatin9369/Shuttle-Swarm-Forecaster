'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, TrafficLayer, Marker, Polyline, InfoWindow } from '@react-google-maps/api';
import { Loader2, Zap, AlertTriangle } from 'lucide-react';

// Maps API configuration
const LIBRARIES: ("places" | "geometry")[] = ["places", "geometry"];

// Dark Mode Style for Google Maps
const darkMapStyle = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
    },
    {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
    },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
    },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
    },
    {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
    },
    {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
    },
    {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
    },
];

interface LiveTrafficMapProps {
    stops: any[];
    routes: any[];
    intents: any[];
}

export default function LiveTrafficMap({ stops, routes, intents }: LiveTrafficMapProps) {
    const [showTraffic, setShowTraffic] = useState(true);
    const [selectedMarker, setSelectedMarker] = useState<any>(null);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '',
        libraries: LIBRARIES
    });

    // Calculate center dynamically
    const center = useMemo(() => {
        if (stops.length > 0 && stops[0]?.location?.coordinates?.length === 2) {
            return { lat: stops[0].location.coordinates[1], lng: stops[0].location.coordinates[0] };
        }
        return { lat: 28.6139, lng: 77.2090 }; // New Delhi default
    }, [stops]);

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        // Fit bounds to show all markers
        if (stops.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            stops.forEach(stop => {
                if (stop?.location?.coordinates?.length === 2) {
                    bounds.extend({ lat: stop.location.coordinates[1], lng: stop.location.coordinates[0] });
                }
            });
            map.fitBounds(bounds);
        }
    }, [stops]);

    const onUnmount = useCallback(function callback(map: google.maps.Map) {
        // Cleanup if necessary
    }, []);

    if (!isLoaded) {
        return (
            <div className="h-[400px] w-full bg-slate-900 flex flex-col items-center justify-center text-white gap-3">
                <Loader2 className="animate-spin w-8 h-8 text-neon-blue" />
                <p className="text-gray-400 text-sm">Loading Google Maps API...</p>
            </div>
        );
    }

    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY) {
        return (
            <div className="h-[400px] w-full bg-slate-900 flex flex-col items-center justify-center text-white gap-3 border border-red-500/30 rounded-lg p-6 text-center">
                <AlertTriangle className="w-12 h-12 text-red-500 mb-2" />
                <h3 className="text-xl font-bold text-red-400">API Key Missing</h3>
                <p className="text-gray-400 text-sm max-w-md">
                    To enable <strong>Google Maps Live Traffic</strong>, you need to add your API key to <code>.env.local</code>:
                </p>
                <code className="bg-black/50 p-2 rounded text-xs text-yellow-300">
                    NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_key_here
                </code>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl border border-white/10">
            {/* Map Controls Overlay */}
            <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md p-3 rounded-lg border border-white/10 shadow-lg">
                <div className="flex items-center justify-between gap-3 mb-2">
                    <h3 className="text-white font-bold text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        Live Traffic
                    </h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showTraffic}
                            onChange={() => setShowTraffic(!showTraffic)}
                            className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-neon-blue rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                </div>
                <div className="text-xs text-gray-400">
                    Auto-updates every 60s
                </div>
            </div>

            <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={center}
                zoom={14}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{
                    styles: darkMapStyle,
                    disableDefaultUI: false,
                    zoomControl: true,
                    streetViewControl: false,
                    mapTypeControl: false,
                }}
            >
                {/* Traffic Layer */}
                {showTraffic && <TrafficLayer options={{ autoRefresh: true }} />}

                {/* Stops Markers */}
                {stops.map((stop: any) => (
                    stop?.location?.coordinates && (
                        <Marker
                            key={stop._id}
                            position={{ lat: stop.location.coordinates[1], lng: stop.location.coordinates[0] }}
                            icon={{
                                url: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
                                scaledSize: new window.google.maps.Size(30, 30)
                            }}
                            onClick={() => setSelectedMarker(stop)}
                        />
                    )
                ))}

                {/* Bus Markers */}
                {routes.map((route: any) => {
                    const firstStop = route.stops?.[0]?.stopId;
                    if (!firstStop?.location?.coordinates) return null;

                    return (
                        <Marker
                            key={route._id}
                            position={{ lat: firstStop.location.coordinates[1], lng: firstStop.location.coordinates[0] }}
                            icon={{
                                url: "https://cdn-icons-png.flaticon.com/512/3448/3448339.png",
                                scaledSize: new window.google.maps.Size(40, 40)
                            }}
                            onClick={() => setSelectedMarker({ ...route, isBus: true })}
                        />
                    );
                })}

                {/* Route Projections (Polylines) - Simple connection between stops */}
                {routes.map((route: any) => {
                    const path = route.stops
                        .filter((s: any) => s.stopId?.location?.coordinates)
                        .map((s: any) => ({
                            lat: s.stopId.location.coordinates[1],
                            lng: s.stopId.location.coordinates[0]
                        }));

                    if (path.length < 2) return null;

                    return (
                        <Polyline
                            key={`poly-${route._id}`}
                            path={path}
                            options={{
                                strokeColor: "#00f3ff",
                                strokeOpacity: 0.6,
                                strokeWeight: 4,
                            }}
                        />
                    );
                })}

                {/* Info Window */}
                {selectedMarker && (
                    <InfoWindow
                        position={{
                            lat: selectedMarker.location?.coordinates?.[1] || selectedMarker.stops?.[0]?.stopId?.location?.coordinates?.[1],
                            lng: selectedMarker.location?.coordinates?.[0] || selectedMarker.stops?.[0]?.stopId?.location?.coordinates?.[0]
                        }}
                        onCloseClick={() => setSelectedMarker(null)}
                    >
                        <div className="p-2 min-w-[200px]">
                            <h3 className="font-bold text-gray-800 text-lg mb-1">
                                {selectedMarker.name ? selectedMarker.name : `Bus Route #${selectedMarker._id.slice(-4)}`}
                            </h3>
                            {selectedMarker.isBus && (
                                <div className="text-sm text-gray-600">
                                    <p>Status: <span className="font-bold text-blue-600">{selectedMarker.status}</span></p>
                                    <p>Driver: {selectedMarker.driverId?.name || 'Unassigned'}</p>
                                </div>
                            )}
                            {!selectedMarker.isBus && (
                                <p className="text-sm text-gray-500">Bus Stop</p>
                            )}
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>

            {/* Mock Traffic Legend */}
            <div className="absolute bottom-6 right-16 z-10 bg-slate-900/90 backdrop-blur-md p-3 rounded-lg border border-white/10 text-xs">
                <div className="flex items-center gap-2 mb-1">
                    <span className="w-3 h-1 bg-green-500 rounded"></span> Clear
                </div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="w-3 h-1 bg-yellow-500 rounded"></span> Moderate
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-1 bg-red-500 rounded"></span> Heavy
                </div>
            </div>
        </div>
    );
}
