'use client';

import { useState } from 'react';
import { MapPin, Clock, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import React from 'react'; // Import React for React.FormEvent type
import { useLang } from '../../context/LanguageContext';

interface FormData {
    pickup: string;
    dropoff: string;
    time: string;
    isRecurring: boolean;
    days: string[];
}

export default function RideRequestPage() {
    const { t } = useLang();
    const [formData, setFormData] = useState<FormData>({

        pickup: '',
        dropoff: '',
        time: '',
        isRecurring: false,
        days: []
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle'); // idle, loading, success, error

    // Mock Stops for Demo
    const stops = [
        { id: '65cf1234567890abcdef1234', name: 'Hostel A' },
        { id: '65cf1234567890abcdef5678', name: 'Main Block' },
        { id: '65cf1234567890abcdef9012', name: 'Library' },
        { id: '65cf1234567890abcdef3456', name: 'Sports Complex' }
    ];

    const [isOffline, setIsOffline] = useState(false);

    // Check online status
    React.useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Sync pending intents when back online
        if (navigator.onLine) {
            const pending = localStorage.getItem('pendingIntents');
            if (pending) {
                alert('Syncing ' + JSON.parse(pending).length + ' offline requests...');
                localStorage.removeItem('pendingIntents');
            }
        } else {
            setIsOffline(true);
        }

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            if (isOffline) {
                // Offline Mode: Save to LocalStorage
                const pending = JSON.parse(localStorage.getItem('pendingIntents') || '[]');
                pending.push({ ...formData, timestamp: new Date().toISOString() });
                localStorage.setItem('pendingIntents', JSON.stringify(pending));

                // Simulate success
                setTimeout(() => {
                    setStatus('success');
                    alert('You are offline. Request saved and will sync when online.');
                }, 1000);
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/intents`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pickupStopId: stops.find(s => s.name === formData.pickup)?.id || formData.pickup, // Fallback to string if free text
                    dropoffStopId: stops.find(s => s.name === formData.dropoff)?.id || formData.dropoff,
                    requestedTime: new Date().toISOString(), // Use current date + time logic if needed
                    timeWindow: { start: formData.time, end: formData.time }, // Simplified window
                    isRecurring: formData.isRecurring,
                    recurringDays: formData.days
                })
            });

            if (response.ok) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    const toggleDay = (day: string) => {
        setFormData(prev => ({
            ...prev,
            days: prev.days.includes(day)
                ? prev.days.filter(d => d !== day)
                : [...prev.days, day]
        }));
    };

    const [showAiSuggestion, setShowAiSuggestion] = useState(true);
    const [showVoteModal, setShowVoteModal] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, text: '📢 Route 5 is delayed by 10 mins due to traffic.', type: 'alert' },
        { id: 2, text: '✅ Your ride to Main Block is confirmed.', type: 'success' }
    ]);
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 relative transition-colors duration-300">

            {/* AI Commute Prediction (Smart Suggestion) */}
            {showAiSuggestion && (
                <div className="fixed top-4 left-4 right-4 z-[60] bg-white/90 dark:bg-slate-800/90 backdrop-blur border-l-4 border-indigo-500 shadow-2xl p-4 rounded-xl animate-in slide-in-from-top-10 fade-in duration-500 flex justify-between items-center max-w-lg mx-auto">
                    <div>
                        <p className="text-xs font-bold text-indigo-500 uppercase flex items-center gap-1">
                            <span className="text-lg">🤖</span> {t('aiPrediction')}
                        </p>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">You usually go to <span className="font-bold">Main Block</span> at <span className="font-bold">08:30 AM</span>.</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setShowAiSuggestion(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">✕</button>
                        <button
                            onClick={() => {
                                setFormData({ pickup: 'Hostel A', dropoff: 'Main Block', time: '08:30', isRecurring: false, days: [] });
                                setShowAiSuggestion(false);
                            }}
                            className="bg-indigo-600 text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-indigo-700"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-indigo-600 dark:bg-indigo-900 pt-12 pb-24 px-6 rounded-b-[3rem] shadow-xl relative overflow-hidden transition-colors duration-300">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                {/* Header with Notifications */}
                <div className="relative z-10 flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-white mb-2">{t('requestRide')}</h1>
                        <p className="text-indigo-200">{t('whereTo')}</p>
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-2 bg-white/10 backdrop-blur rounded-full text-white hover:bg-white/20 relative"
                        >
                            <span className="text-xl">🔔</span>
                            {notifications.length > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-indigo-600"></span>}
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 top-12 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50 animate-in slide-in-from-top-2">
                                <div className="p-3 border-b border-slate-50 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-200 text-sm">Notifications</div>
                                {notifications.map(n => (
                                    <div key={n.id} className={`p-3 text-xs border-b border-slate-50 dark:border-slate-700 ${n.type === 'alert' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' : 'text-slate-600 dark:text-slate-300'}`}>
                                        {n.text}
                                    </div>
                                ))}
                                <button onClick={() => setNotifications([])} className="w-full py-2 text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-700">Clear All</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="relative z-10 flex gap-3">
                    <button
                        onClick={() => alert('QR Scanner Simulation: [Scanned Stop ID: 65cf...]')}
                        className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl flex items-center justify-center gap-2 text-white font-bold hover:bg-white/20 transition-colors"
                    >
                        <span className="text-xl">📷</span> {t('scanQr')}
                    </button>
                    <button
                        onClick={() => setFormData({ ...formData, pickup: 'Hostel A', dropoff: 'Main Block', time: '08:30' })}
                        className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl flex items-center justify-center gap-2 text-white font-bold hover:bg-white/20 transition-colors"
                    >
                        <span className="text-xl">⚡</span> {t('quickRide')}
                    </button>
                </div>
            </div>

            {/* Active Ride Status (Waitlist & Carpool Logic) */}
            {status === 'success' && (
                <div className="absolute top-28 right-6 z-50 animate-in slide-in-from-right fade-in">
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-indigo-100 dark:border-slate-700 w-80">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold text-slate-800 dark:text-white">🎉 Ride Confirmed!</h3>
                            <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-full">Waitlist #4</span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Your request has been added to the optimization queue.</p>

                        {/* Carpool Suggestion */}
                        <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg mb-3 border border-green-100 dark:border-green-800">
                            <p className="text-xs font-bold text-green-700 dark:text-green-400 flex items-center gap-1">
                                <span>🚕</span> Bus full? Carpool available!
                            </p>
                            <p className="text-xs text-green-600 dark:text-green-300">3 students are going to Main Block now.</p>
                            <button className="text-xs font-bold text-green-700 dark:text-green-400 underline mt-1">Join Carpool</button>
                        </div>

                        <div className="flex gap-2">
                            <button onClick={() => setStatus('idle')} className="flex-1 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-600">Dismiss</button>
                            <button onClick={() => { setStatus('idle'); alert('Ride Cancelled'); }} className="flex-1 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-bold hover:bg-red-100 dark:hover:bg-red-900/30">Cancel Ride</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-6 -mt-16 relative z-20 max-w-lg">
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 border border-slate-100 dark:border-slate-700 transition-colors duration-300">

                    {status === 'success' ? (
                        <div className="text-center py-10">
                            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mx-auto mb-6 animate-bounce">
                                <CheckCircle size={40} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Request Received!</h2>
                            <p className="text-slate-500 dark:text-slate-400 mb-8">We'll notify you when a shuttle is assigned.</p>
                            <button onClick={() => setStatus('idle')} className="w-full py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl font-bold hover:scale-[1.02] transition-transform">
                                Request Another
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Location */}
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">{t('location')}</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" size={20} />
                                    <input
                                        type="text"
                                        placeholder={t('pickup')}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700 dark:text-white placeholder-slate-400"
                                        required
                                        value={formData.pickup}
                                        onChange={e => setFormData({ ...formData, pickup: e.target.value })}
                                    />
                                </div>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" size={20} />
                                    <input
                                        type="text"
                                        placeholder={t('dropoff')}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 rounded-xl border-none focus:ring-2 focus:ring-pink-500 font-medium text-slate-700 dark:text-white placeholder-slate-400"
                                        required
                                        value={formData.dropoff}
                                        onChange={e => setFormData({ ...formData, dropoff: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Time */}
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">{t('timing')}</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="time"
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700 dark:text-white"
                                        required
                                        value={formData.time}
                                        onChange={e => setFormData({ ...formData, time: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Recurring */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                        <Calendar size={16} /> {t('recurring')}
                                    </label>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={formData.isRecurring} onChange={e => setFormData({ ...formData, isRecurring: e.target.checked })} />
                                        <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                </div>

                                {formData.isRecurring && (
                                    <div className="flex justify-between gap-1">
                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                                            <button
                                                key={day}
                                                type="button"
                                                onClick={() => toggleDay(day)}
                                                className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${formData.days.includes(day) ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                                            >
                                                {day[0]}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {status === 'loading' ? t('submitting') : t('confirm')}
                            </button>
                        </form>
                    )}

                    {/* Voting Section (Demand Voting) */}
                    <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-700">
                        <h3 className="font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                            <span>🗳️</span> {t('voteRoute')}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Route crowded? Suggest a new time.</p>

                        {!showVoteModal ? (
                            <button
                                onClick={() => setShowVoteModal(true)}
                                className="w-full py-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold text-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-800 border-dashed"
                            >
                                + {t('suggestNew')}
                            </button>
                        ) : (
                            <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-xl animate-in fade-in">
                                <p className="text-xs font-bold text-slate-400 dark:text-slate-300 mb-2 uppercase">I need a bus at...</p>
                                <div className="flex gap-2 mb-3">
                                    <button className="flex-1 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400">09:00 AM</button>
                                    <button className="flex-1 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400">05:00 PM</button>
                                </div>
                                <button
                                    onClick={() => { setShowVoteModal(false); alert('Vote Submitted! We will notify you if enough students join.'); }}
                                    className="w-full py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold"
                                >
                                    Submit Vote
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
