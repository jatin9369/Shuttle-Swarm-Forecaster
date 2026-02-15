'use client';

import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import { Loader2 } from 'lucide-react';

// Fix leaflet icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const customBusIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png',
    iconSize: [35, 35],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const customStopIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [25, 25],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

export default function Map({ intents, routes, stops }: any) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="h-[400px] w-full bg-slate-900 flex items-center justify-center text-white">
                <Loader2 className="animate-spin w-8 h-8 text-neon-blue" />
            </div>
        );
    }

    // Default center (example coordinates, should be dynamic based on stops)
    const getCenter = (): [number, number] => {
        if (stops.length > 0 && stops[0]?.location?.coordinates?.length === 2) {
            return [stops[0].location.coordinates[1], stops[0].location.coordinates[0]];
        }
        return [28.6139, 77.2090]; // New Delhi default
    };

    // Simulated Traffic Lanes (3-4 Lanes as requested)
    const trafficLanes = [
        {
            id: 'lane-1',
            coordinates: [[28.6500, 77.2090], [28.5800, 77.2090]] as [number, number][],
            color: '#ef4444', // Red - High Traffic
            label: 'Main North-South Corridor (Heavy)'
        },
        {
            id: 'lane-2',
            coordinates: [[28.6139, 77.1500], [28.6139, 77.2500]] as [number, number][],
            color: '#facc15', // Yellow - Moderate
            label: 'East-West Expressway'
        },
        {
            id: 'lane-3',
            coordinates: [[28.6300, 77.1800], [28.6000, 77.2300]] as [number, number][],
            color: '#4ade80', // Green - Clear
            label: 'Inner Ring Road'
        },
        {
            id: 'lane-4',
            coordinates: [[28.6300, 77.2300], [28.6000, 77.1800]] as [number, number][],
            color: '#ef4444', // Red
            label: 'Campus Connector'
        }
    ];

    return (
        <MapContainer center={getCenter()} zoom={13} style={{ height: '100%', width: '100%' }} className="z-0">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {/* Traffic Lanes Visualization */}
            {trafficLanes.map((lane) => (
                <Polyline
                    key={lane.id}
                    positions={lane.coordinates}
                    pathOptions={{
                        color: lane.color,
                        weight: 6,
                        opacity: 0.7,
                        lineCap: 'round',
                        className: lane.color === '#ef4444' ? 'traffic-flow-heavy' :
                            lane.color === '#facc15' ? 'traffic-flow-moderate' :
                                'traffic-flow-clear'
                    }}
                >
                    <Popup className="text-black">
                        <strong>{lane.label}</strong><br />
                        Status: {lane.color === '#ef4444' ? 'Congested' : lane.color === '#facc15' ? 'Moderate' : 'Clear'}
                    </Popup>
                </Polyline>
            ))}

            {/* Bus Stops */}
            {stops.map((stop: any) => {
                if (!stop?.location?.coordinates || stop.location.coordinates.length < 2) return null;
                return (
                    <Marker
                        key={stop._id}
                        position={[stop.location.coordinates[1], stop.location.coordinates[0]]}
                        icon={customStopIcon}
                    >
                        <Popup className="text-black">
                            <strong>{stop.name}</strong>
                        </Popup>
                    </Marker>
                );
            })}

            {/* Demand Clusters (Heatmap Simulation) */}
            {intents.map((intent: any) => {
                const loc = intent.pickupStop?.location;
                if (!loc?.coordinates || loc.coordinates.length < 2) return null;

                return (
                    <Circle
                        key={intent._id}
                        center={[loc.coordinates[1], loc.coordinates[0]]}
                        pathOptions={{
                            fillColor: 'red',
                            color: 'red',
                            weight: 1,
                            opacity: 0.5,
                            fillOpacity: 0.3
                        }}
                        radius={200 * (intent.passengers || 1)}
                    />
                );
            })}

            {/* Active Routes (Buses) */}
            {routes.map((route: any) => {
                // Simplified: Just showing first stop as location for demo if no real-time loc
                const firstStop = route.stops?.[0]?.stopId;
                if (!firstStop?.location?.coordinates || firstStop.location.coordinates.length < 2) return null;

                return (
                    <Marker
                        key={route._id}
                        position={[firstStop.location.coordinates[1], firstStop.location.coordinates[0]]}
                        icon={customBusIcon}
                    >
                        <Popup className="text-black">
                            <strong>Bus on Route #{route._id.slice(-4)}</strong><br />
                            Status: {route.status}
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}
