import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import PremiumControls from "./components/PremiumControls";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Smart Shuttle Optimizer",
  description: "AI-powered transport management",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-slate-50 dark:bg-slate-950 transition-colors duration-300`}>
        <ThemeProvider>
          <LanguageProvider>
            {children}
            <PremiumControls />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
