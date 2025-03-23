'use client';

import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { effects } from '../../config';

type BackgroundCursorProps = {
    className?: string;
    children?: React.ReactNode;
};

export function BackgroundCursor({
    className,
    children,
}: BackgroundCursorProps) {
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 });
    const backgroundRef = useRef<HTMLDivElement>(null);

    const { mask, gradient, dots, lines, grid } = effects;

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (backgroundRef.current) {
                const rect = backgroundRef.current.getBoundingClientRect();
                setCursorPosition({
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top,
                });
            }
        };

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    useEffect(() => {
        let animationFrameId: number;

        const updateSmoothPosition = () => {
            setSmoothPosition((prev) => {
                const dx = cursorPosition.x - prev.x;
                const dy = cursorPosition.y - prev.y;
                const easingFactor = 0.05;

                return {
                    x: Math.round(prev.x + dx * easingFactor),
                    y: Math.round(prev.y + dy * easingFactor),
                };
            });
            animationFrameId = requestAnimationFrame(updateSmoothPosition);
        };

        animationFrameId = requestAnimationFrame(updateSmoothPosition);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [cursorPosition]);

    const maskStyle = mask.cursor
        ? {
              maskImage: `radial-gradient(${mask.radius}vh at ${smoothPosition.x}px ${smoothPosition.y}px, black 0%, transparent 100%)`,
              WebkitMaskImage: `radial-gradient(${mask.radius}vh at ${smoothPosition.x}px ${smoothPosition.y}px, black 0%, transparent 100%)`,
          }
        : {
              maskImage: `radial-gradient(${mask.radius}vh at ${mask.x}% ${mask.y}%, black 0%, transparent 100%)`,
              WebkitMaskImage: `radial-gradient(${mask.radius}vh at ${mask.x}% ${mask.y}%, black 0%, transparent 100%)`,
          };

    return (
        <div className='relative w-full h-full'>
            <div
                ref={backgroundRef}
                className={cn(
                    'fixed inset-0 z-0 overflow-hidden pointer-events-none',
                    className
                )}
                style={maskStyle}
            >
                {gradient.display && (
                    <div
                        className='absolute w-[400%] h-[400%] -left-[150%] -top-[150%]'
                        style={{
                            background: `radial-gradient(ellipse at ${gradient.x}% ${gradient.y}%, ${gradient.colorStart}, ${gradient.colorEnd})`,
                            opacity: gradient.opacity / 100,
                            transform: `rotate(${gradient.tilt}deg)`,
                            transformOrigin: 'center',
                        }}
                    />
                )}

                {dots.display && (
                    <div
                        className='absolute inset-0'
                        style={{
                            backgroundImage: `radial-gradient(${dots.color} 1px, transparent 1px)`,
                            backgroundSize: `${dots.size * 12}px ${
                                dots.size * 12
                            }px`,
                            opacity: dots.opacity / 100,
                        }}
                    />
                )}

                {lines.display && (
                    <div
                        className='absolute inset-0'
                        style={{
                            backgroundImage: `repeating-linear-gradient(45deg, ${
                                lines.color
                            } 0, ${
                                lines.color
                            } 0.5px, transparent 0.5px, transparent ${
                                dots.size * 12
                            }px)`,
                            opacity: lines.opacity / 100,
                        }}
                    />
                )}

                {grid.display && (
                    <div
                        className='absolute inset-0'
                        style={{
                            backgroundSize: `32px 32px`,
                            backgroundPosition: '0 0',
                            backgroundImage: `
                                linear-gradient(90deg, ${grid.color} 0, ${grid.color} 1px, transparent 1px, transparent 32px),
                                linear-gradient(0deg, ${grid.color} 0, ${grid.color} 1px, transparent 1px, transparent 32px)
                            `,
                            opacity: grid.opacity / 100,
                        }}
                    />
                )}
            </div>
            {children}
        </div>
    );
}
