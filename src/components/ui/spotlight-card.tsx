'use client';

import { useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type SpotlightCardProps = {
    children: ReactNode;
    className?: string;
    /** CSS color string for the spotlight, e.g. "rgba(168,85,247,0.15)" */
    spotlightColor?: string;
};

/**
 * Card wrapper that renders a radial gradient spotlight following the cursor.
 * The glow is layered on top via a pointer-events-none overlay so content
 * interaction is never blocked.
 */
export function SpotlightCard({
    children,
    className,
    spotlightColor = 'rgba(168, 85, 247, 0.15)',
}: SpotlightCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setOpacity(1)}
            onMouseLeave={() => setOpacity(0)}
            className={cn('relative overflow-hidden', className)}
        >
            {/* Spotlight overlay */}
            <div
                aria-hidden
                className='pointer-events-none absolute inset-0 z-10 transition-opacity duration-300'
                style={{
                    opacity,
                    background: `radial-gradient(550px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 40%)`,
                }}
            />
            {children}
        </div>
    );
}
