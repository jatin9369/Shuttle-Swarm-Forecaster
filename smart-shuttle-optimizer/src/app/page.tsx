'use client';

import Link from 'next/link';
import { User, Bus, ShieldCheck } from 'lucide-react';

const roles = [
  {
    id: 'rider',
    title: 'Student / Rider',
    description: 'Track shuttles and plan your commute.',
    icon: User,
    color: 'blue',
    href: '/auth/login/rider',
  },
  {
    id: 'driver',
    title: 'Shuttle Driver',
    description: 'Manage routes and update location.',
    icon: Bus,
    color: 'orange',
    href: '/auth/login/driver',
  },
  {
    id: 'admin',
    title: 'Administrator',
    description: 'Monitor system and manage users.',
    icon: ShieldCheck,
    color: 'red',
    href: '/auth/login/admin',
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid z-0 pointer-events-none"></div>
      <div className="absolute top-0 w-full h-full bg-gradient-to-b from-transparent via-background/80 to-background z-0"></div>

      <main className="relative z-10 flex flex-col items-center text-center px-4 max-w-6xl mx-auto w-full">
        <div className="mb-12 animate-fade-in-up">
          <div className="inline-flex items-center justify-center p-4 bg-blue-500/10 rounded-full mb-6 border border-blue-500/30 neon-border-blue">
            <Bus className="w-12 h-12 text-neon-blue neon-text-blue" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 mb-6 drop-shadow-lg">
            Shuttle Swarm <br /> Forecaster
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            AI-Powered Smart Transportation System. <br />
            <span className="text-white font-medium">Select your role to login or sign up.</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {roles.map((role) => {
            const Icon = role.icon;
            // Tailwind classes to ensure they are picked up
            const borderColor = role.color === 'blue' ? 'hover:border-blue-500' : role.color === 'orange' ? 'hover:border-orange-500' : 'hover:border-red-500';
            const iconColor = role.color === 'blue' ? 'text-blue-500' : role.color === 'orange' ? 'text-orange-500' : 'text-red-500';
            const bgColor = role.color === 'blue' ? 'bg-blue-500/10' : role.color === 'orange' ? 'bg-orange-500/10' : 'bg-red-500/10';
            const buttonColor = role.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' : role.color === 'orange' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-red-600 hover:bg-red-700';
            const shadowColor = role.color === 'blue' ? 'shadow-blue-500/20' : role.color === 'orange' ? 'shadow-orange-500/20' : 'shadow-red-500/20';
            const gradientColor = role.color === 'blue' ? 'from-blue-500/5' : role.color === 'orange' ? 'from-orange-500/5' : 'from-red-500/5';

            return (
              <Link
                key={role.id}
                href={role.href}
                className={`group relative p-8 rounded-2xl bg-card border border-white/10 ${borderColor} transition-all duration-300 hover:scale-105 hover:shadow-xl`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${gradientColor} to-transparent rounded-2xl`} />

                <div className="relative flex flex-col items-center">
                  <div className={`p-4 rounded-full mb-6 ${bgColor} transition-colors group-hover:bg-opacity-80`}>
                    <Icon className={`w-10 h-10 ${iconColor}`} />
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-2">{role.title}</h2>
                  <p className="text-gray-400 mb-8 text-sm min-h-[40px]">{role.description}</p>

                  <span className={`px-6 py-2 rounded-full text-white font-semibold shadow-lg ${shadowColor} ${buttonColor} transition-all w-full`}>
                    Login / Sign Up
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <footer className="mt-16 text-xs text-gray-600">
          Smart Shuttle Optimizer © 2024
        </footer>
      </main>
    </div>
  );
}
