'use client';

import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

// Fix for default marker icon in Leaflet not valid in Next.js
import L from 'leaflet';

export interface HeatmapPoint {
    location: { lat: number; lng: number };
    intensity: number;
    stopName: string;
}

interface HeatmapMapProps {
    data: HeatmapPoint[];
}

const HeatmapMap = ({ data }: HeatmapMapProps) => {
    const center = { lat: 12.9716, lng: 77.5946 }; // Default center (Bengaluru)

    // Function to determine color based on intensity
    const getColor = (intensity: number) => {
        if (intensity >= 10) return '#ef4444'; // Red
        if (intensity >= 5) return '#facc15';  // Yellow
        return '#60a5fa';                      // Blue
    };

    const getRadius = (intensity: number) => {
        // Scale radius slightly with intensity
        return Math.min(20 + intensity * 2, 50);
    };

    return (
        <MapContainer center={[center.lat, center.lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {data.map((point, index) => (
                <CircleMarker
                    key={index}
                    center={[point.location.lat, point.location.lng]}
                    pathOptions={{
                        color: getColor(point.intensity),
                        fillColor: getColor(point.intensity),
                        fillOpacity: 0.6,
                        weight: 0
                    }}
                    radius={getRadius(point.intensity)}
                >
                    <Popup>
                        <div className="text-center">
                            <h3 className="font-bold text-slate-800">{point.stopName}</h3>
                            <p className="text-indigo-600 font-bold text-lg">{point.intensity} Requests</p>
                        </div>
                    </Popup>
                </CircleMarker>
            ))}

            {/* Auto-fit bounds if data exists */}
            <MapBounds data={data} />
        </MapContainer>
    );
};

// Component to adjust map view to fit all points
const MapBounds = ({ data }: { data: HeatmapPoint[] }) => {
    const map = useMap();
    useEffect(() => {
        if (data.length > 0) {
            const bounds = L.latLngBounds(data.map(d => [d.location.lat, d.location.lng]));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [data, map]);
    return null;
};

export default HeatmapMap;
