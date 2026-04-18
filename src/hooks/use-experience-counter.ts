'use client';

import { useEffect, useState } from 'react';

export type ExperienceDuration = {
    years: number;
    months: number;
};

function calculateDuration(startDate: Date): ExperienceDuration {
    const now = new Date();
    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();

    if (months < 0) {
        years -= 1;
        months += 12;
    }

    return { years, months };
}

export function useExperienceCounter(startDate: Date): ExperienceDuration {
    const [duration, setDuration] = useState<ExperienceDuration>(() =>
        calculateDuration(startDate)
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setDuration(calculateDuration(startDate));
        }, 60_000); // recalcule chaque minute

        return () => clearInterval(interval);
    }, [startDate]);

    return duration;
}
