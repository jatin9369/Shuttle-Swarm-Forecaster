'use client';

import { FileText, Download, TrendingUp } from 'lucide-react';

export default function ReportsPage() {
    return (
        <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center">
            <div className="bg-white p-8 rounded-3xl shadow-xl max-w-lg w-full text-center">
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6 text-teal-600">
                    <FileText size={40} />
                </div>
                <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">System Reports</h1>
                <p className="text-slate-500 mb-8">Download comprehensive analytics and operational logs.</p>

                <div className="space-y-4">
                    <button className="w-full bg-slate-100 hover:bg-slate-200 p-4 rounded-xl flex items-center justify-between group transition-colors">
                        <div className="flex items-center gap-3">
                            <TrendingUp className="text-indigo-600" />
                            <span className="font-bold text-slate-700">Monthly Performance.pdf</span>
                        </div>
                        <Download className="text-slate-400 group-hover:text-indigo-600" size={20} />
                    </button>
                    <button className="w-full bg-slate-100 hover:bg-slate-200 p-4 rounded-xl flex items-center justify-between group transition-colors">
                        <div className="flex items-center gap-3">
                            <FileText className="text-green-600" />
                            <span className="font-bold text-slate-700">Driver Log_Feb2025.csv</span>
                        </div>
                        <Download className="text-slate-400 group-hover:text-green-600" size={20} />
                    </button>
                </div>

                <div className="mt-8 border-t border-slate-100 pt-6">
                    <button onClick={() => window.history.back()} className="text-slate-500 hover:text-slate-800 font-bold text-sm">
                        ← Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
