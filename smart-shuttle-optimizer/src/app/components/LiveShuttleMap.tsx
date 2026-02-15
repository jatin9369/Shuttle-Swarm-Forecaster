'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';

// Bus Interface
export interface Bus {
    id: number;
    name: string;
    route: string;
    lat: number;
    lng: number;
    crowd: 'Low' | 'Medium' | 'High';
    eta: string;
}

// Mock Buses with Simulated Movement
const INITIAL_BUSES: Bus[] = [
    { id: 1, name: 'Shuttle 101', route: 'Hostel -> Main', lat: 12.9716, lng: 77.5946, crowd: 'Low', eta: '5 min' },
    { id: 2, name: 'Shuttle 204', route: 'City -> Campus', lat: 12.9750, lng: 77.5980, crowd: 'High', eta: '12 min' },
    { id: 3, name: 'Shuttle 305', route: 'Library -> Sports', lat: 12.9730, lng: 77.5920, crowd: 'Medium', eta: '8 min' }
];

// Custom Icons
const createBusIcon = (crowd: string) => {
    const color = crowd === 'High' ? '#ef4444' : crowd === 'Medium' ? '#eab308' : '#22c55e';
    return L.divIcon({
        className: 'custom-bus-icon',
        html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); display: flex; align-items: center; justify-content: center; font-size: 16px;">🚌</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
};

const LiveShuttleMap = ({ onSelectBus }: { onSelectBus: (bus: Bus) => void }) => {
    const [buses, setBuses] = useState<Bus[]>(INITIAL_BUSES);

    // Simulate Movement
    useEffect(() => {
        const interval = setInterval(() => {
            setBuses(prev => prev.map(bus => ({
                ...bus,
                lat: bus.lat + (Math.random() - 0.5) * 0.001, // Random jitter
                lng: bus.lng + (Math.random() - 0.5) * 0.001
            })));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <MapContainer center={[12.9730, 77.5950]} zoom={15} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {buses.map(bus => (
                <Marker
                    key={bus.id}
                    position={[bus.lat, bus.lng]}
                    icon={createBusIcon(bus.crowd)}
                    eventHandlers={{
                        click: () => onSelectBus(bus)
                    }}
                >
                    {/* Popup is optional if using the overlay card */}
                </Marker>
            ))}
        </MapContainer>
    );
};

export default LiveShuttleMap;
