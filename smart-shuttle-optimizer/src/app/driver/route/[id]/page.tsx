'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation'; // Correct import for App Router
import api from '@/lib/api';
import { Loader2, ArrowLeft } from 'lucide-react';
import NavigationMap from '@/app/components/NavigationMap';

export default function DriverRoutePage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [loading, setLoading] = useState(true);
    const [route, setRoute] = useState<any>(null);

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

    return (
        <div className="h-screen w-full bg-gray-900 relative">
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
                <NavigationMap routeData={route} />
            </div>
        </div>
    );
}
