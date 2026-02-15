'use client';

import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LanguageContext';
import { Moon, Sun, Languages, Download, Accessibility } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PremiumControls() {
    const { theme, toggleTheme } = useTheme();
    const { lang, toggleLang } = useLang();
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isHighContrast, setIsHighContrast] = useState(false);

    useEffect(() => {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        });
    }, []);

    const handleInstallClick = () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult: any) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                }
                setDeferredPrompt(null);
            });
        }
    };

    const toggleHighContrast = () => {
        setIsHighContrast(!isHighContrast);
        if (!isHighContrast) {
            document.documentElement.classList.add('high-contrast');
        } else {
            document.documentElement.classList.remove('high-contrast');
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
            {/* PWA Install Button */}
            {deferredPrompt && (
                <button
                    onClick={handleInstallClick}
                    className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center"
                    title="Install App"
                >
                    <Download size={20} />
                </button>
            )}

            {/* Accessibility Toggle */}
            <button
                onClick={toggleHighContrast}
                className={`p-3 rounded-full shadow-lg transition-all flex items-center justify-center ${isHighContrast ? 'bg-yellow-400 text-black font-bold' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                title="High Contrast Mode"
            >
                <Accessibility size={20} />
            </button>

            {/* Language Toggle */}
            <button
                onClick={toggleLang}
                className="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 p-3 rounded-full shadow-lg hover:scale-110 transition-all flex items-center justify-center font-bold text-xs"
                title="Switch Language"
            >
                {lang === 'en' ? 'HI' : 'EN'}
            </button>

            {/* Theme Toggle */}
            <button
                onClick={toggleTheme}
                className="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 p-3 rounded-full shadow-lg hover:scale-110 transition-all flex items-center justify-center"
                title="Toggle Theme"
            >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
        </div>
    );
}
