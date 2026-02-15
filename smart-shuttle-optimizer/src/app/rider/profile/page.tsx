'use client';

import { User, Mail, Smartphone, MapPin, Shield } from 'lucide-react';

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-cyan-500 to-blue-500 relative">
                    <div className="absolute -bottom-10 left-6 w-24 h-24 bg-white rounded-full p-1 shadow-lg">
                        <img src="https://i.pravatar.cc/150?img=12" alt="Profile" className="w-full h-full rounded-full object-cover" />
                    </div>
                </div>

                <div className="pt-12 px-6 pb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Alex Rider</h1>
                    <p className="text-slate-500 text-sm mb-6">Computer Science • Year 3</p>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                            <Mail className="text-slate-400" size={20} />
                            <div>
                                <p className="text-xs text-slate-400 uppercase font-bold">Email</p>
                                <p className="text-sm font-medium">alex.rider@college.edu</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                            <Smartphone className="text-slate-400" size={20} />
                            <div>
                                <p className="text-xs text-slate-400 uppercase font-bold">Phone</p>
                                <p className="text-sm font-medium">+91 98765 43210</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                            <MapPin className="text-slate-400" size={20} />
                            <div>
                                <p className="text-xs text-slate-400 uppercase font-bold">Home Stop</p>
                                <p className="text-sm font-medium">Main Gate, Stop #3</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex gap-3">
                        <button className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-500/30">
                            Edit Profile
                        </button>
                        <button className="bg-slate-100 text-slate-600 p-3 rounded-xl font-bold">
                            <Shield size={20} />
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-8">
                <button onClick={() => window.history.back()} className="text-slate-500 hover:text-slate-800 font-bold text-sm">
                    ← Back
                </button>
            </div>
        </div>
    );
}
