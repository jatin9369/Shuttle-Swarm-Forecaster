'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        name: "Alex Johnson",
        role: "CS Student",
        quote: "The live tracking is a game changer! I never miss my bus anymore.",
        avatar: "https://i.pravatar.cc/100?img=11"
    },
    {
        id: 2,
        name: "Sarah Chen",
        role: "Architecture Student",
        quote: "Love the green theme and how easy it is to book a seat.",
        avatar: "https://i.pravatar.cc/100?img=5"
    },
    {
        id: 3,
        name: "Michael Smith",
        role: "Faculty Member",
        quote: "Efficient and reliable. The admin dashboard provides great insights.",
        avatar: "https://i.pravatar.cc/100?img=3"
    },
    {
        id: 4,
        name: "Priya Patel",
        role: "Med Student",
        quote: "Saved me so much time during exams. The 'Smart Shuttle' lives up to its name!",
        avatar: "https://i.pravatar.cc/100?img=9"
    },
    {
        id: 5,
        name: "David Kim",
        role: "Driver",
        quote: "The route optimization helps me avoid traffic and stay on schedule.",
        avatar: "https://i.pravatar.cc/100?img=13"
    },
    {
        id: 6,
        name: "Emily Davis",
        role: "Research Scholar",
        quote: "Eco-friendly and convenient. Highly recommend to all campus residents.",
        avatar: "https://i.pravatar.cc/100?img=24"
    }
];

export default function TestimonialSlider() {
    return (
        <div className="relative w-full overflow-hidden py-10 bg-gradient-to-b from-transparent to-emerald-50/50">

            {/* Fade Gradients for smooth edges */}
            <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-emerald-50 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-emerald-50 to-transparent z-10 pointer-events-none"></div>

            <div className="flex">
                <motion.div
                    initial={{ x: 0 }}
                    animate={{ x: "-50%" }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 20, // Adjust speed here
                    }}
                    className="flex gap-6 px-6"
                    style={{ width: "max-content" }}
                >
                    {/* Double the list to create seamless loop */}
                    {[...testimonials, ...testimonials].map((t, index) => (
                        <div
                            key={`${t.id}-${index}`}
                            className="w-[350px] bg-white border border-emerald-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow shrink-0 flex flex-col"
                        >
                            <div className="flex items-center gap-1 text-yellow-400 mb-4">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                            </div>

                            <p className="text-slate-600 italic mb-6 flex-1">"{t.quote}"</p>

                            <div className="flex items-center gap-3 mt-auto">
                                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full border border-emerald-200" />
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">{t.name}</h4>
                                    <p className="text-xs text-emerald-600 font-medium">{t.role}</p>
                                </div>
                                <Quote size={32} className="ml-auto text-emerald-100" />
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
