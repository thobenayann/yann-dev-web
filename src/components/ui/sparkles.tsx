'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type Sparkle = {
    id: string;
    x: number; // % of container width
    y: number; // % of container height
    size: number;
    color: string;
    delay: number;
    duration: number;
};

// ─── 4-pointed star SVG ───────────────────────────────────────────────────────

function StarShape({ size, color }: { size: number; color: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox='0 0 68 68'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
        >
            <path
                d='M26.5 25.5C19 33.4 0 34 0 34C0 34 19.1 34.8 26.5 43.5C33.9 52.2 34 68 34 68C34 68 34 52.1 41.5 43.5C49 34.9 68 34 68 34C68 34 49.1 33.1 41.5 25.5C33.9 17.9 34 0 34 0C34 0 34 17.9 26.5 25.5Z'
                fill={color}
            />
        </svg>
    );
}

// ─── Random sparkle factory ───────────────────────────────────────────────────

const COLORS = [
    'oklch(0.85 0.15 200)', // sky
    'oklch(0.75 0.18 210)', // cyan
    'oklch(0.80 0.10 280)', // soft purple
    'oklch(0.90 0.05 220)', // near-white
];

function makeSparkle(): Sparkle {
    return {
        id: Math.random().toString(36).slice(2),
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 8 + 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 1000,
        duration: Math.random() * 700 + 600,
    };
}

// ─── Sparkles ─────────────────────────────────────────────────────────────────

type SparklesProps = {
    count?: number;
    className?: string;
    children?: React.ReactNode;
};

export function Sparkles({ count = 12, className, children }: SparklesProps) {
    const [sparkles, setSparkles] = useState<Sparkle[]>([]);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const addSparkle = () => {
        setSparkles((prev) => {
            // remove oldest if over limit
            const next = prev.length >= count ? prev.slice(1) : prev;
            return [...next, makeSparkle()];
        });
    };

    useEffect(() => {
        // Seed initial sparkles staggered
        const ids: ReturnType<typeof setTimeout>[] = [];
        for (let i = 0; i < count; i++) {
            ids.push(setTimeout(() => addSparkle(), i * 180));
        }
        // Continuous refresh
        const interval = setInterval(addSparkle, 600);
        return () => {
            ids.forEach(clearTimeout);
            clearInterval(interval);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [count]);

    return (
        <div className={cn('relative', className)}>
            {sparkles.map((s) => (
                <span
                    key={s.id}
                    className='pointer-events-none absolute'
                    style={{
                        left: `${s.x}%`,
                        top: `${s.y}%`,
                        animation: `sparkle-pop ${s.duration}ms ease-in-out ${s.delay}ms both`,
                    }}
                >
                    <StarShape size={s.size} color={s.color} />
                </span>
            ))}
            {children}
        </div>
    );
}
