'use client';

import Link from 'next/link';
import { User, Bus, ShieldCheck, ArrowRight, Zap, Map, Smartphone, CheckCircle2, Leaf, Clock, TrendingUp, Wind, TreePine, Car, Target, Eye, Heart, Play, Users } from 'lucide-react';

const roles = [
  {
    id: 'rider',
    title: 'Student / Rider',
    description: 'Track shuttles in real-time and plan your commute effortlessly.',
    icon: User,
    color: 'purple',
    href: '/auth/login/rider',
  },
  {
    id: 'driver',
    title: 'Shuttle Driver',
    description: 'Manage your route, view passengers, and get live traffic updates.',
    icon: Bus,
    color: 'purple',
    href: '/auth/login/driver',
  },
  {
    id: 'admin',
    title: 'Administrator',
    description: 'Monitor the entire fleet, analyze demand, and optimize routes.',
    icon: ShieldCheck,
    color: 'purple',
    href: '/auth/login/admin',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans overflow-x-hidden text-[#101828]">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-brave-purple to-brave-pink rounded-xl flex items-center justify-center text-white shadow-lg shadow-brave-purple/20">
              <Bus size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#101828]">Smart<span className="text-brave-purple">Shuttle</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8 font-medium text-gray-600">
            <Link href="#" className="hover:text-brave-purple transition-colors">Home</Link>
            <Link href="#impact" className="hover:text-brave-purple transition-colors">Impact</Link>
            <Link href="#features" className="hover:text-brave-purple transition-colors">Features</Link>
            <Link href="#roles" className="hover:text-brave-purple transition-colors">Roles</Link>
            <Link href="/live-map" className="hover:text-brave-purple transition-colors">Live Map</Link>
          </div>

          <Link href="/auth/login/rider" className="hidden md:flex bg-[#101828] text-white px-6 py-2.5 rounded-full font-semibold hover:bg-brave-purple transition-all shadow-lg shadow-brave-purple/20">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-b from-purple-50/50 to-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* Text Content */}
            <div className="lg:w-1/2 relative z-10 animate-in slide-in-from-left duration-1000">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brave-purple/10 text-brave-purple font-semibold text-sm mb-6 border border-brave-purple/20">
                <Zap size={14} className="fill-brave-purple" /> #1 Campus Innovation
              </div>

              <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight text-[#101828]">
                Smart Commute. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brave-purple to-brave-pink">Save Time.</span> <br />
                Go Green.
              </h1>

              <p className="text-xl text-gray-500 mb-8 max-w-lg leading-relaxed">
                Join the smartest transportation network. AI-powered routing, live tracking, and seamless co-riding for the entire campus.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="#roles" className="px-8 py-4 bg-brave-purple text-white font-bold rounded-xl shadow-xl shadow-brave-purple/30 hover:shadow-2xl hover:scale-105 transition-all text-center flex items-center justify-center gap-2">
                  Start Riding <ArrowRight size={20} />
                </Link>
                <Link href="/live-map" className="px-8 py-4 bg-white text-[#101828] border border-gray-200 font-bold rounded-xl hover:bg-gray-50 transition-all text-center flex items-center justify-center gap-2 shadow-sm">
                  <Map size={20} className="text-brave-purple" /> View Map
                </Link>
              </div>

              <div className="flex items-center gap-8 text-gray-500 font-medium border-t border-gray-200 pt-8">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-brave-purple" /> Verified Riders
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-brave-purple" /> Live Tracking
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-brave-purple" /> Eco-Friendly
                </div>
              </div>
            </div>

            {/* Phone Mockup / Image Area */}
            <div className="lg:w-1/2 relative z-10 animate-in slide-in-from-right duration-1000 delay-200 flex justify-center">
              <div className="relative border-gray-900 bg-gray-900 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-2xl shadow-brave-purple/40 rotate-[-6deg] hover:rotate-0 transition-all duration-500 z-20">
                <div className="h-[32px] w-[3px] bg-gray-800 absolute -start-[17px] top-[72px] rounded-s-lg"></div>
                <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
                <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
                <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
                <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white relative">
                  {/* Mock App UI */}
                  <div className="bg-brave-purple h-40 rounded-b-3xl relative p-6 flex flex-col justify-center">
                    <h3 className="text-white font-bold text-xl">Good Morning, <br /> Nitin!</h3>
                    <div className="absolute -bottom-6 left-6 right-6 bg-white p-4 rounded-xl shadow-lg flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Map size={20} className="text-black" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Destination</p>
                        <p className="text-sm font-bold">Engineering Block A</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 px-6">
                    <h4 className="font-bold text-gray-800 mb-4">Nearby Shuttles</h4>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-2xl">🚌</div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-gray-800">Route #{100 + i}</p>
                            <p className="text-xs text-green-600 font-medium">Arriving in {i * 2} min</p>
                          </div>
                          <button className="bg-black text-white px-3 py-1 rounded-lg text-xs font-bold">Track</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="absolute bottom-0 w-full p-4 bg-gray-50 border-t">
                    <div className="flex justify-around text-gray-400">
                      <div className="flex flex-col items-center gap-1 text-brave-purple"><Map size={20} /><span className="text-[10px] font-bold">Home</span></div>
                      <div className="flex flex-col items-center gap-1"><Clock size={20} /><span className="text-[10px]">Trips</span></div>
                      <div className="flex flex-col items-center gap-1"><User size={20} /><span className="text-[10px]">Profile</span></div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative Blob Behind Phone */}
              <div className="absolute top-20 right-[-50px] w-72 h-72 bg-brave-purple rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            </div>

          </div>
        </div>
      </header>

      {/* Impact Section - Growing Every Day */}
      <section id="impact" className="py-20 bg-brave-purple relative overflow-hidden text-center text-white">
        <div className="absolute inset-0 bg-dot-pattern opacity-10"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-sm font-medium mb-4">
            Our Impact
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Growing Every Day</h2>
          <p className="text-purple-200 max-w-2xl mx-auto mb-16 text-lg">
            Trusted by thousands of students and faculty across campus for their daily commute.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: "App Downloads", value: "9,000+", bg: "bg-white/10" },
              { label: "Peak Daily Rides", value: "150+", bg: "bg-white/10" },
              { label: "Cost Savings", value: "75%", bg: "bg-white/10" },
              { label: "Trees Equivalent", value: "500+", bg: "bg-[#0ea5e9]/20 border border-[#0ea5e9]/30" } // Highlighted card
            ].map((stat, idx) => (
              <div key={idx} className={`p-8 rounded-2xl backdrop-blur-sm border border-white/10 ${stat.bg} hover:transform hover:-translate-y-1 transition-transform`}>
                <h3 className="text-4xl font-bold mb-2">{stat.value}</h3>
                <p className="text-purple-200 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Green Journey Section */}
      <section className="py-20 bg-gradient-to-b from-white to-green-50/50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-[#101828] mb-4">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-green-500">Green Journey</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto mb-16">
            Every shared ride makes a difference. See how our community is helping the planet.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 text-left hover:shadow-2xl transition-shadow">
              <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-6">
                <Wind size={28} />
              </div>
              <h3 className="text-4xl font-bold text-[#101828] mb-2">2,450 kg</h3>
              <p className="font-bold text-gray-800 mb-2">CO2 Saved</p>
              <p className="text-sm text-gray-500 mb-6">Carbon emissions prevented through ride-sharing.</p>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 w-[70%] rounded-full"></div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 text-left hover:shadow-2xl transition-shadow">
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                <TreePine size={28} />
              </div>
              <h3 className="text-4xl font-bold text-[#101828] mb-2">122</h3>
              <p className="font-bold text-gray-800 mb-2">Trees Equivalent</p>
              <p className="text-sm text-gray-500 mb-6">Annual CO2 absorption equivalent.</p>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[45%] rounded-full"></div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 text-left hover:shadow-2xl transition-shadow">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                <Car size={28} />
              </div>
              <h3 className="text-4xl font-bold text-[#101828] mb-2">5,890 mi</h3>
              <p className="font-bold text-gray-800 mb-2">Car Miles Avoided</p>
              <p className="text-sm text-gray-500 mb-6">Solo driving prevented across campus.</p>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 w-[85%] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Advanced Timeline */}
      <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] left-[-5%] w-96 h-96 bg-brave-purple/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[20%] right-[-5%] w-96 h-96 bg-brave-pink/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <span className="text-brave-purple font-bold tracking-wider text-sm uppercase mb-2 block">Simple & Seamless</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#101828]">How Smart Shuttle <span className="text-transparent bg-clip-text bg-gradient-to-r from-brave-purple to-brave-pink">Works</span></h2>
          </div>

          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-gray-100 via-brave-purple/20 to-gray-100 -translate-y-1/2"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Step 1 */}
              <div className="relative group bg-white p-8 rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-brave-purple text-white rounded-full flex items-center justify-center font-bold text-xl border-4 border-white shadow-md z-10 group-hover:scale-110 transition-transform">1</div>
                <div className="mt-6 text-center">
                  <div className="w-20 h-20 mx-auto bg-purple-50 rounded-2xl flex items-center justify-center text-brave-purple mb-6 group-hover:rotate-12 transition-transform">
                    <Smartphone size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-[#101828] mb-3">Book via App</h3>
                  <p className="text-gray-500 leading-relaxed">
                    Enter your destination. Our AI checks your schedule and suggests the best pickup time.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative group bg-white p-8 rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-brave-pink text-white rounded-full flex items-center justify-center font-bold text-xl border-4 border-white shadow-md z-10 group-hover:scale-110 transition-transform">2</div>
                <div className="mt-6 text-center">
                  <div className="w-20 h-20 mx-auto bg-pink-50 rounded-2xl flex items-center justify-center text-brave-pink mb-6 group-hover:-rotate-12 transition-transform">
                    <Users size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-[#101828] mb-3">Get Matched</h3>
                  <p className="text-gray-500 leading-relaxed">
                    We pair you with other riders going your way. Smart routing ensures no unnecessary detours.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative group bg-white p-8 rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-xl border-4 border-white shadow-md z-10 group-hover:scale-110 transition-transform">3</div>
                <div className="mt-6 text-center">
                  <div className="w-20 h-20 mx-auto bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6 group-hover:rotate-12 transition-transform">
                    <Bus size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-[#101828] mb-3">Ride & Relax</h3>
                  <p className="text-gray-500 leading-relaxed">
                    Hop on the shuttle. Track it live, enjoy the Wi-Fi, and arrive on time, every time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Beliefs */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 rounded-full bg-gray-100 text-gray-600 font-bold text-xs uppercase tracking-wider mb-4">
              What Drives Us
            </div>
            <h2 className="text-4xl font-bold text-[#101828]">Our Core <span className="text-[#0ea5e9]">Beliefs</span></h2>
            <p className="text-gray-500 mt-4">The principles that guide every decision we make.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mission */}
            <div className="bg-blue-50/50 p-10 rounded-[2.5rem] hover:bg-blue-50 transition-colors">
              <div className="w-16 h-16 bg-blue-200/50 rounded-2xl flex items-center justify-center text-blue-600 mb-8">
                <Target size={32} />
              </div>
              <h3 className="text-2xl font-bold text-[#101828] mb-4">Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To make travel affordable and accessible for everyone through smart pooling — connecting people who share similar routes while reducing environmental impact.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-teal-50/50 p-10 rounded-[2.5rem] hover:bg-teal-50 transition-colors">
              <div className="w-16 h-16 bg-teal-200/50 rounded-2xl flex items-center justify-center text-teal-600 mb-8">
                <Eye size={32} />
              </div>
              <h3 className="text-2xl font-bold text-[#101828] mb-4">Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To become the most trusted transit platform, where every shared ride means savings for riders, efficiency for the campus, and a greener planet for everyone.
              </p>
            </div>

            {/* Values */}
            <div className="bg-purple-50/50 p-10 rounded-[2.5rem] hover:bg-purple-50 transition-colors">
              <div className="w-16 h-16 bg-purple-200/50 rounded-2xl flex items-center justify-center text-purple-600 mb-8">
                <Heart size={32} />
              </div>
              <h3 className="text-2xl font-bold text-[#101828] mb-4">Values</h3>
              <p className="text-gray-600 leading-relaxed">
                Legal and ethical operations, rider safety, environmental sustainability, and creating value for our entire community through continuous innovation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison / Feature Blocks */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-brave-purple/5 rounded-full blur-3xl -z-10"></div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-red-50 border border-red-100">
                    <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-500">
                      <Clock size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">Without Smart Shuttle</h4>
                      <p className="text-sm text-gray-500">Long wait times, crowded stops, unpredictable delays.</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 text-sm">VS</div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-green-50 border border-green-100 shadow-md">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      <TrendingUp size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">With Smart Shuttle</h4>
                      <p className="text-sm text-gray-500">AI-optimized routes, 40% faster commute, guaranteed seats.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2">
              <span className="text-brave-purple font-bold tracking-wider text-sm uppercase mb-2 block">The Technology</span>
              <h2 className="text-4xl font-extrabold text-[#101828] mb-6">
                Not just a bus. <br /> A <span className="text-transparent bg-clip-text bg-gradient-to-r from-brave-purple to-brave-pink">Data-Driven Network.</span>
              </h2>
              <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                Our algorithms analyze thousands of data points every second—from student schedules to traffic patterns—to ensure shuttles are exactly where they need to be.
              </p>

              <div className="space-y-4">
                {[
                  "Real-time Demand Heatmaps",
                  "Dynamic Rerouting for Traffic",
                  "Predictive Capacity Planning",
                  "Seamless Driver Communication"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <CheckCircle2 size={14} />
                    </div>
                    <span className="font-medium text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roles / Triple Win Section */}
      <section id="roles" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-block px-4 py-1.5 rounded-full bg-brave-purple/10 text-brave-purple font-bold text-sm mb-4">
              The Smart Choice
            </div>
            <h2 className="text-4xl font-bold text-[#101828] mb-4">Why Smart Shuttle is <span className="text-brave-purple">Smarter</span></h2>
            <p className="text-gray-500 text-lg">Designed for everyone on campus. Select your role to get started.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <div key={role.id} className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-brave-purple/10 hover:-translate-y-2 transition-all duration-300">
                  <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center text-3xl transition-transform group-hover:scale-110 group-hover:rotate-6 bg-${role.color === 'purple' ? 'purple' : 'pink'}-50 text-brave-purple`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#101828] mb-3">{role.title}</h3>
                  <p className="text-gray-500 mb-8 leading-relaxed">
                    {role.description}
                  </p>
                  <Link href={role.href} className="flex items-center gap-2 font-bold text-brave-purple group-hover:translate-x-1 transition-transform">
                    Access Portal <ArrowRight size={18} />
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#101828] text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-gray-800 pb-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <span className="text-2xl font-bold tracking-tight text-white mb-6 block">Smart<span className="text-brave-purple">Shuttle</span></span>
              <p className="text-gray-400 text-sm leading-relaxed">
                Reimagining campus transportation for a greener, faster future.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Live Map</a></li>
                <li><a href="#" className="hover:text-white">Driver App</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between text-gray-500 text-sm">
            <p>© 2024 Smart Shuttle Optimizer. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              {/* Social Icons Placeholder */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
