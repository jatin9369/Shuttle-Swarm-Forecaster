# 🚌 Smart Shuttle Optimizer

A modern, full-stack web application for optimizing campus shuttle operations through AI-driven demand prediction, real-time tracking, and dynamic route optimization.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-blue?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?style=flat&logo=tailwind-css)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Key Pages](#key-pages)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**Smart Shuttle Optimizer** is designed to solve inefficient bus utilization and long commute times on college campuses. It leverages crowd-sourced demand prediction, real-time GPS tracking, and AI-powered route optimization to provide a seamless transportation experience for students, drivers, and administrators.

### Problem Statement
- **Inefficient bus utilization** leading to overcrowding or empty shuttles
- **Long wait times** due to unpredictable demand
- **Lack of real-time visibility** for riders and administrators

### Solution
- **Demand Prediction Dashboard**: Collect rider intent via QR codes and predict demand patterns
- **Live Tracking**: Real-time GPS tracking with interactive maps
- **Dynamic Route Optimization**: AI-driven algorithms to optimize routes based on live data
- **Multi-Role Portals**: Dedicated interfaces for Riders, Drivers, and Admins

---

## ✨ Features

### 🎓 For Students/Riders
- **Ride Requests**: Book shuttle rides with real-time availability
- **Live Map**: Track shuttle locations and ETAs
- **Trip History**: View past rides and schedules
- **Profile Management**: Update personal information and preferences

### 🚗 For Drivers
- **Route Dashboard**: View assigned routes and passenger lists
- **Navigation Assistance**: Turn-by-turn directions with live traffic
- **Capacity Monitoring**: Real-time passenger count and capacity alerts
- **Shift Management**: Check-in/check-out and schedule viewing

### 🛡️ For Administrators
- **Live Operations Map**: Monitor all shuttles in real-time
- **Analytics Dashboard**: Demand forecasting, route efficiency metrics
- **Fleet Management**: Bus status, maintenance tracking, fuel efficiency
- **System Health Monitor**: Real-time metrics, audit logs, and incident tracking
- **Report Generation**: Export PDF reports for analysis

### 🚀 Additional Features
- **Launchpad Dashboard**: Realistic SaaS-style command center for operations
- **Testimonial Slider**: Infinite scrolling user feedback carousel
- **Responsive Design**: Mobile-first, works on all devices
- **Dark Mode**: Muted dark theme for reduced eye strain
- **Real-time Updates**: WebSocket integration for live data

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16.1.6](https://nextjs.org/) (App Router)
- **UI Library**: [React 19.2.3](https://react.dev/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion 12](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Maps**: [React Leaflet](https://react-leaflet.js.org/) + [Google Maps API](https://developers.google.com/maps)
- **Charts**: [Recharts](https://recharts.org/)

### Backend
- **Runtime**: Node.js (Express-like server in `/server`)
- **Authentication**: JWT (jsonwebtoken, jose)
- **Password Hashing**: bcryptjs
- **Real-time**: Socket.IO Client

### Development Tools
- **Linting**: ESLint 9
- **Type Checking**: TypeScript
- **Package Manager**: npm

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and **npm** installed
- **Google Maps API Key** (for map features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/smart-shuttle-optimizer.git
   cd smart-shuttle-optimizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   JWT_SECRET=your_jwt_secret_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
smart-shuttle-optimizer/
├── src/
│   ├── app/
│   │   ├── admin/          # Admin portal pages
│   │   ├── driver/         # Driver portal pages
│   │   ├── rider/          # Rider portal pages
│   │   ├── launchpad/      # SaaS-style dashboard
│   │   ├── auth/           # Authentication pages
│   │   ├── components/     # Reusable React components
│   │   ├── context/        # React Context providers
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Landing page
│   └── middleware.ts       # Next.js middleware for auth
├── server/                 # Backend API (Express-like)
│   ├── controllers/        # Route handlers
│   ├── models/             # Data models
│   └── routes/             # API routes
├── public/                 # Static assets
├── package.json
└── README.md
```

---

## 🗺️ Key Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, features, and role selection |
| `/launchpad` | Realistic SaaS dashboard for operations monitoring |
| `/auth/login/[role]` | Role-based login (rider/driver/admin) |
| `/auth/signup/[role]` | Role-based signup |
| `/rider/request` | Ride booking interface |
| `/rider/live-map` | Live shuttle tracking map |
| `/driver/dashboard` | Driver route and passenger management |
| `/admin/dashboard/live` | Admin live operations map |
| `/admin/analytics` | Analytics and AI forecasting |
| `/admin/optimization` | Smart capacity optimization |
| `/admin/system/health` | System health monitoring |

---

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key for map features | Yes |
| `JWT_SECRET` | Secret key for JWT token generation | Yes |

---

## 🎨 Design Philosophy

- **Production-Ready**: Inspired by Linear, Notion, and Stripe dashboards
- **Realistic UI**: Asymmetric layouts, varied card sizes, subtle imperfections
- **Functional Over Aesthetic**: Prioritizes usability and information density
- **Muted Dark Theme**: Reduces eye strain with `#0f172a` base color
- **Accessible**: WCAG-compliant color contrasts and keyboard navigation

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Nitin Singh** - *Initial work* - [GitHub](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for deployment platform
- Lucide for beautiful icons
- TailwindCSS for utility-first styling
- Framer Motion for smooth animations

---

## 📞 Support

For support, email support@smartshuttle.com or open an issue on GitHub.

---

**Built with ❤️ for smarter campus mobility**
