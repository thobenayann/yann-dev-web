'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import * as React from 'react';

type CarouselProps = {
    images: Array<{
        src: string;
        alt: string;
    }>;
    aspectRatio?: string;
    sizes?: string;
    priority?: boolean;
};

export function Carousel({
    images = [],
    aspectRatio = '16/9',
    sizes = '(max-width: 960px) 100vw, 960px',
    priority = false,
}: CarouselProps) {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [isTransitioning, setIsTransitioning] = React.useState(false);

    const handleNext = React.useCallback(() => {
        if (!isTransitioning && images.length > 1) {
            setIsTransitioning(true);
            setActiveIndex((current) => (current + 1) % images.length);
        }
    }, [images.length, isTransitioning]);

    const handleDotClick = React.useCallback(
        (index: number) => {
            if (!isTransitioning && index !== activeIndex) {
                setIsTransitioning(true);
                setActiveIndex(index);
            }
        },
        [activeIndex, isTransitioning]
    );

    React.useEffect(() => {
        if (isTransitioning) {
            const timer = setTimeout(() => {
                setIsTransitioning(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isTransitioning]);

    if (images.length === 0) return null;

    return (
        <div className='flex flex-col gap-3 w-full'>
            {/* Image Container */}
            <motion.div
                className={cn(
                    'relative w-full overflow-hidden rounded-xl',
                    'cursor-pointer',
                    'hover:shadow-lg transition-shadow duration-300'
                )}
                style={{ aspectRatio }}
                onClick={handleNext}
            >
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className='absolute inset-0'
                    >
                        <Image
                            src={images[activeIndex].src}
                            alt={images[activeIndex].alt}
                            fill
                            className='object-cover'
                            sizes={sizes}
                            priority={priority}
                        />
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            {/* Indicators */}
            {images.length > 1 && (
                <div className='flex gap-1 justify-center px-2'>
                    {images.map((_, index) => (
                        <motion.button
                            key={index}
                            className={cn(
                                'h-0.5 transition-all duration-300',
                                'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                                index === activeIndex
                                    ? 'bg-foreground flex-[0.15]'
                                    : 'bg-muted-foreground/30 flex-[0.1]'
                            )}
                            onClick={() => handleDotClick(index)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
