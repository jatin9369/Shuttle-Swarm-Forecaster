'use client';

import { createContext, useContext, useState } from 'react';

type Language = 'en' | 'hi';

const translations = {
    en: {
        requestRide: 'Request a Ride',
        whereTo: 'Tell us where you need to go.',
        scanQr: 'Scan QR',
        quickRide: 'Quick Ride',
        location: 'Location',
        pickup: 'Pickup Point',
        dropoff: 'Destination',
        timing: 'Timing',
        recurring: 'Recurring Ride?',
        confirm: 'Confirm Request',
        submitting: 'Submitting...',
        aiPrediction: 'AI Prediction',
        voteRoute: 'Vote for Better Routes',
        suggestNew: 'Suggest New Route',
        installApp: 'Install App'
    },
    hi: {
        requestRide: 'राइड बुक करें',
        whereTo: 'हमें बताएं कि आपको कहां जाना है।',
        scanQr: 'QR स्कैन करें',
        quickRide: 'त्वरित राइड',
        location: 'स्थान',
        pickup: 'पिकअप बिंदु',
        dropoff: 'गंतव्य',
        timing: 'समय',
        recurring: 'दैनिक राइड?',
        confirm: 'पुष्टि करें',
        submitting: 'जमा हो रहा है...',
        aiPrediction: 'AI भविष्यवाणी',
        voteRoute: 'बेहतर रूट के लिए वोट करें',
        suggestNew: 'नया रूट सुझाएं',
        installApp: 'ऐप इंस्टॉल करें'
    }
};

const LanguageContext = createContext<{ lang: Language; t: (key: keyof typeof translations['en']) => string; toggleLang: () => void }>({
    lang: 'en',
    t: (key) => translations['en'][key],
    toggleLang: () => { },
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [lang, setLang] = useState<Language>('en');

    const toggleLang = () => {
        setLang(prev => prev === 'en' ? 'hi' : 'en');
    };

    const t = (key: keyof typeof translations['en']) => {
        return translations[lang][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ lang, t, toggleLang }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLang = () => useContext(LanguageContext);
