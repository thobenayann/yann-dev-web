'use client';

import { useEffect, useState } from 'react';

type TimeDisplayProps = {
    timeZone: string;
    locale?: string;
};

export function TimeDisplay({ timeZone, locale = 'fr-FR' }: TimeDisplayProps) {
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const options: Intl.DateTimeFormatOptions = {
                timeZone,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            };
            const timeString = new Intl.DateTimeFormat(locale, options).format(
                now
            );
            setCurrentTime(timeString);
        };

        // Mise à jour initiale
        updateTime();
        // Mise à jour toutes les secondes
        const intervalId = setInterval(updateTime, 1000);

        return () => clearInterval(intervalId);
    }, [timeZone, locale]);

    return <time suppressHydrationWarning>{currentTime}</time>;
}
