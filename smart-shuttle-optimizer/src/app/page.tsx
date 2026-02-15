'use client';

import Link from 'next/link';
import { User, Bus, ShieldCheck, ArrowRight, Zap, Map, Heart, ChevronRight, Activity, Calendar, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import TestimonialSlider from './components/TestimonialSlider';

const roles = [
  {
    id: 'rider',
    title: 'Student / Rider',
    description: 'Real-time tracking and effortless commute planning.',
    icon: User,
    color: 'from-emerald-500 to-green-500',
    href: '/auth/login/rider',
  },
  {
    id: 'driver',
    title: 'Shuttle Driver',
    description: 'Route management and passenger insights.',
    icon: Bus,
    color: 'from-teal-500 to-cyan-500',
    href: '/auth/login/driver',
  },
  {
    id: 'admin',
    title: 'Administrator',
    description: 'Fleet monitoring and AI-powered route optimization.',
    icon: ShieldCheck,
    color: 'from-green-600 to-emerald-600',
    href: '/auth/login/admin',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-emerald-50 font-body overflow-x-hidden text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">

      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-green-500/10 rounded-full blur-[100px] animate-float"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] bg-teal-500/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Floating Navbar */}
      <nav className="fixed top-6 left-0 right-0 z-50 px-4 md:px-0">
        <div className="container mx-auto max-w-6xl">
          <div className="glass-panel rounded-full px-6 py-3 flex items-center justify-between border-emerald-100/50 bg-white/80 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-green-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <Bus size={20} />
              </div>
              <span className="text-xl font-heading font-bold tracking-tight text-slate-800">Smart<span className="text-emerald-600">Shuttle</span></span>
            </div>

            <div className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
              {['Features', 'Roles'].map((item) => (
                <Link key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-emerald-600 transition-colors relative group">
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 transition-all group-hover:w-full"></span>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Link href="/live-map" className="hidden md:flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors">
                <Map size={16} /> Live Map
              </Link>
              <Link href="/auth/login/rider" className="bg-emerald-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-800 transition-all hover:scale-105 shadow-lg shadow-emerald-900/20 flex items-center gap-2">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-40 pb-32 overflow-hidden z-10">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

            {/* Left Content */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 font-semibold text-xs uppercase tracking-wide mb-8"
              >
                <Zap size={14} className="fill-emerald-700" /> Next-Gen Green Mobility
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl lg:text-7xl font-heading font-bold leading-[1.1] mb-8 tracking-tight text-slate-900"
              >
                Reinventing <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-600 to-teal-500 animate-gradient-x">Daily Commute</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl text-slate-500 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                Experience the future of transportation. AI-driven routing, real-time analytics, and eco-friendly connections for a smarter campus.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start"
              >
                <Link href="#roles" className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/25 hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3">
                  Start Riding Now <ArrowRight size={20} />
                </Link>
                <Link href="/live-map" className="px-8 py-4 bg-white text-slate-700 border border-emerald-200 font-bold rounded-2xl hover:bg-emerald-50 transition-all flex items-center justify-center gap-3 hover-shine group">
                  <Map size={20} className="text-emerald-600 group-hover:scale-110 transition-transform" /> View Live Map
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-center lg:justify-start gap-8 text-sm font-medium text-slate-500"
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] bg-[url('https://i.pravatar.cc/100?img=${i}')] bg-cover`}></div>
                    ))}
                  </div>
                  <span>Loved by 5000+ Students</span>
                </div>
              </motion.div>
            </div>

            {/* Right Visual - 3D Phone Mockup */}
            <div className="lg:w-1/2 relative delay-200" style={{ perspective: '1000px' }}>
              <div className="relative mx-auto w-[320px] h-[640px] bg-emerald-950 rounded-[3rem] border-8 border-emerald-950 shadow-2xl shadow-emerald-500/20 rotate-[-12deg] hover:rotate-0 transition-all duration-700 z-20 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-emerald-950 rounded-b-xl z-20"></div>

                {/* Screen Content */}
                <div className="w-full h-full bg-slate-50 relative overflow-hidden flex flex-col">
                  <div className="h-1/2 bg-emerald-600 relative p-6">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white to-transparent"></div>
                    <div className="flex justify-between items-center text-white mt-8 mb-6">
                      <div className="w-8 h-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center"><User size={16} /></div>
                      <div className="font-bold">My Profile</div>
                      <div className="w-8 h-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center"><Bus size={16} /></div>
                    </div>
                    <h2 className="text-white text-3xl font-heading font-bold">Good Morning,<br />Alex!</h2>

                    <div className="mt-6 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                        <Map size={20} />
                      </div>
                      <div>
                        <p className="text-emerald-100 text-xs">Destination</p>
                        <p className="text-white font-bold">Block C, Engg Dept.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 bg-slate-50 rounded-t-3xl -mt-6 relative z-10 p-6">
                    <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6"></div>
                    <h3 className="font-bold text-slate-800 mb-4">Nearby Shuttles</h3>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-emerald-200 transition-colors">
                          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-2xl">🚌</div>
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-800">Shuttle #{100 + i}</h4>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <span className="text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded">On Time</span>
                              <span>• 5 mins away</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements behind phone */}
              <div className="absolute top-20 right-0 w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
              <div className="absolute bottom-20 left-0 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            </div>
          </div>
        </div>
      </header>

      {/* DASHBOARD COMMAND CENTER - Quick Access */}
      <section className="relative z-20 -mt-20 mb-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl shadow-emerald-500/20 border border-slate-800">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  🚀 Launchpad <Link href="/launchpad" className="text-emerald-400 text-sm bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors">Live Demo</Link>
                </h2>
                <p className="text-slate-400 text-sm">Instant access to all modules and features.</p>
              </div>
            </div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"
            >
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <Link href="/rider/request" className="group bg-slate-800 p-4 rounded-xl hover:bg-emerald-600 transition-all hover:-translate-y-1 border border-slate-700 hover:border-emerald-500 block h-full">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 group-hover:bg-white/20 group-hover:text-white mb-3">
                    <Bus size={20} />
                  </div>
                  <h3 className="font-bold text-white text-sm">Request Ride</h3>
                  <p className="text-slate-400 text-xs group-hover:text-emerald-100">Student Portal</p>
                </Link>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <Link href="/driver/dashboard" className="group bg-slate-800 p-4 rounded-xl hover:bg-teal-600 transition-all hover:-translate-y-1 border border-slate-700 hover:border-teal-500 block h-full">
                  <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center text-teal-400 group-hover:bg-white/20 group-hover:text-white mb-3">
                    <User size={20} />
                  </div>
                  <h3 className="font-bold text-white text-sm">Driver App</h3>
                  <p className="text-slate-400 text-xs group-hover:text-teal-100">Route View</p>
                </Link>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <Link href="/admin/dashboard/live" className="group bg-slate-800 p-4 rounded-xl hover:bg-red-600 transition-all hover:-translate-y-1 border border-slate-700 hover:border-red-500 block h-full">
                  <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center text-red-400 group-hover:bg-white/20 group-hover:text-white mb-3">
                    <ShieldCheck size={20} />
                  </div>
                  <h3 className="font-bold text-white text-sm">Admin Console</h3>
                  <p className="text-slate-400 text-xs group-hover:text-red-100">Live Ops</p>
                </Link>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <Link href="/admin/analytics" className="group bg-slate-800 p-4 rounded-xl hover:bg-green-600 transition-all hover:-translate-y-1 border border-slate-700 hover:border-green-500 block h-full">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400 group-hover:bg-white/20 group-hover:text-white mb-3">
                    <Zap size={20} />
                  </div>
                  <h3 className="font-bold text-white text-sm">Analytics & AI</h3>
                  <p className="text-slate-400 text-xs group-hover:text-green-100">Forecasting</p>
                </Link>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <Link href="/admin/system/health" className="group bg-slate-800 p-4 rounded-xl hover:bg-cyan-600 transition-all hover:-translate-y-1 border border-slate-700 hover:border-cyan-500 block h-full">
                  <div className="w-10 h-10 bg-cyan-600/20 rounded-lg flex items-center justify-center text-cyan-400 group-hover:bg-white/20 group-hover:text-white mb-3">
                    <Activity size={20} />
                  </div>
                  <h3 className="font-bold text-white text-sm">System Health</h3>
                  <p className="text-slate-400 text-xs group-hover:text-cyan-100">Audit Logs</p>
                </Link>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <Link href="/rider/live-map" className="group bg-slate-800 p-4 rounded-xl hover:bg-emerald-600 transition-all hover:-translate-y-1 border border-slate-700 hover:border-emerald-500 block h-full">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 group-hover:bg-white/20 group-hover:text-white mb-3">
                    <Map size={20} />
                  </div>
                  <h3 className="font-bold text-white text-sm">Live Map</h3>
                  <p className="text-slate-400 text-xs group-hover:text-emerald-100">Global View</p>
                </Link>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <Link href="/admin/dashboard/heatmap" className="group bg-slate-800 p-4 rounded-xl hover:bg-lime-600 transition-all hover:-translate-y-1 border border-slate-700 hover:border-lime-500 block h-full">
                  <div className="w-10 h-10 bg-lime-500/20 rounded-lg flex items-center justify-center text-lime-400 group-hover:bg-white/20 group-hover:text-white mb-3">
                    <Zap size={20} />
                  </div>
                  <h3 className="font-bold text-white text-sm">Heatmap</h3>
                  <p className="text-slate-400 text-xs group-hover:text-lime-100">Demand View</p>
                </Link>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <Link href="/rider/profile" className="group bg-slate-800 p-4 rounded-xl hover:bg-teal-600 transition-all hover:-translate-y-1 border border-slate-700 hover:border-teal-500 block h-full">
                  <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center text-teal-400 group-hover:bg-white/20 group-hover:text-white mb-3">
                    <User size={20} />
                  </div>
                  <h3 className="font-bold text-white text-sm">Profile</h3>
                  <p className="text-slate-400 text-xs group-hover:text-teal-100">User Data</p>
                </Link>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <Link href="/rider/schedule" className="group bg-slate-800 p-4 rounded-xl hover:bg-green-600 transition-all hover:-translate-y-1 border border-slate-700 hover:border-green-500 block h-full">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400 group-hover:bg-white/20 group-hover:text-white mb-3">
                    <Calendar size={20} />
                  </div>
                  <h3 className="font-bold text-white text-sm">Schedule</h3>
                  <p className="text-slate-400 text-xs group-hover:text-green-100">My Trips</p>
                </Link>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <Link href="/admin/reports" className="group bg-slate-800 p-4 rounded-xl hover:bg-teal-600 transition-all hover:-translate-y-1 border border-slate-700 hover:border-teal-500 block h-full">
                  <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center text-teal-400 group-hover:bg-white/20 group-hover:text-white mb-3">
                    <FileText size={20} />
                  </div>
                  <h3 className="font-bold text-white text-sm">Reports</h3>
                  <p className="text-slate-400 text-xs group-hover:text-teal-100">Export PDF</p>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Bento Grid Features */}
      <section id="features" className="py-32 relative scroll-mt-40">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-slate-900">Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">move smarter.</span></h2>
            <p className="text-slate-500 text-lg">Powerful features wrapped in a simple, beautiful interface. Designed for students, drivers, and admins.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(200px,auto)]">
            {/* Card 1 - Large Left */}
            <div className="md:col-span-2 glass-card p-10 rounded-3xl relative overflow-hidden group border-emerald-100">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-emerald-200 transition-colors"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Map size={28} />
                </div>
                <h3 className="text-3xl font-heading font-bold text-slate-800 mb-4">Live Tracking Map</h3>
                <p className="text-slate-500 max-w-md">Real-time visibility of every shuttle in the network. See current capacity, estimated arrival times, and traffic conditions instantly.</p>
              </div>
            </div>

            {/* Card 2 - Tall Right */}
            <div className="md:row-span-2 glass-card p-10 rounded-3xl relative overflow-hidden group bg-gradient-to-b from-slate-900 to-slate-800 text-white border-emerald-900">
              <div className="absolute bottom-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
              <div className="relative z-10 h-full flex flex-col">
                <div className="w-14 h-14 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center text-emerald-300 mb-6 border border-white/10">
                  <Zap size={28} />
                </div>
                <h3 className="text-3xl font-heading font-bold mb-4">AI Optimization</h3>
                <p className="text-slate-400 mb-8">Our proprietary algorithms analyze historical data to predict demand and optimize routes dynamically.</p>

                <div className="mt-auto p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-medium text-slate-300">Efficiency Boost</span>
                    <span className="text-2xl font-bold text-emerald-400">+42%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[70%]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="glass-card p-8 rounded-3xl relative overflow-hidden group border-emerald-100">
              <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-500 mb-4">
                <Heart size={24} />
              </div>
              <h3 className="text-xl font-heading font-bold text-slate-800 mb-2">Eco-Friendly</h3>
              <p className="text-slate-500 text-sm">Reduce your carbon footprint by sharing the ride.</p>
            </div>

            {/* Card 4 */}
            <div className="glass-card p-8 rounded-3xl relative overflow-hidden group border-emerald-100">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 mb-4">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-heading font-bold text-slate-800 mb-2">Secure & Safe</h3>
              <p className="text-slate-500 text-sm">Verified riders and monitored rides for peace of mind.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection */}
      <section id="roles" className="py-24 bg-white relative scroll-mt-40">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-bold tracking-widest text-xs uppercase">Get Started</span>
            <h2 className="text-4xl font-heading font-bold text-slate-900 mt-2">Choose your portal</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <Link href={role.href} key={role.id} className="group relative">
                  <div className={`absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl blur-xl -z-10 ${role.color}`}></div>
                  <div className="bg-white border border-slate-100 p-8 rounded-3xl h-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 relative z-10 overflow-hidden">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center text-white mb-6 shadow-md`}>
                      <Icon size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">{role.title}</h3>
                    <p className="text-slate-500 mb-8">{role.description}</p>

                    <div className="flex items-center text-sm font-bold text-emerald-600 group-hover:gap-2 transition-all">
                      Access Portal <ChevronRight size={16} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-20 border-t border-slate-800">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-6 text-white">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <Bus size={16} />
                </div>
                <span className="text-xl font-heading font-bold">Smart<span className="text-emerald-400">Shuttle</span></span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Optimizing campus mobility one ride at a time. Join the revolution today.
              </p>
              <div className="flex gap-4">
                {/* Socials could go here */}
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Platform</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/live-map" className="hover:text-white transition-colors">Live Map</Link></li>
                <li><Link href="/auth/login/driver" className="hover:text-white transition-colors">For Drivers</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Newsletter</h4>
              <p className="text-xs text-slate-500 mb-4">Stay updated with the latest features.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Email address" className="bg-slate-800 border-none rounded-lg px-4 py-2 text-sm w-full focus:ring-2 focus:ring-emerald-600" />
                <button className="bg-emerald-600 text-white rounded-lg px-3 py-2 hover:bg-emerald-500 transition-colors"><ArrowRight size={16} /></button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
            <p>© 2024 Smart Shuttle Optimizer. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="#" className="hover:text-white">Terms</Link>
              <Link href="#" className="hover:text-white">Privacy</Link>
              <Link href="#" className="hover:text-white">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
