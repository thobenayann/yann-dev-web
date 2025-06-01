'use client';

import { cn } from '@/lib/utils';
import { motion, stagger, useAnimate, useInView } from 'framer-motion';
import { useEffect } from 'react';

type SecondaryTitleProps = {
    text: string;
    className?: string;
    textClassName?: string;
    cursorClassName?: string;
    speed?: number;
    showCursor?: boolean;
};

export function SecondaryTitle({
    text,
    className,
    textClassName,
    cursorClassName,
    speed = 0.1,
    showCursor = true,
}: SecondaryTitleProps) {
    // Split text into array of characters
    const textArray = text.split('');

    const [scope, animate] = useAnimate();
    const isInView = useInView(scope);

    useEffect(() => {
        if (isInView) {
            animate(
                'span',
                {
                    display: 'inline-block',
                    opacity: 1,
                    width: 'fit-content',
                },
                {
                    duration: 0.3,
                    delay: stagger(speed),
                    ease: 'easeInOut',
                }
            );
        }
    }, [isInView, animate, speed]);

    const renderText = () => {
        return (
            <motion.h2 ref={scope} className='inline'>
                {textArray.map((char, index) => (
                    <motion.span
                        initial={{}}
                        key={`char-${index}`}
                        className={cn(
                            'opacity-0 hidden text-foreground',
                            textClassName
                        )}
                    >
                        {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                ))}
            </motion.h2>
        );
    };

    return (
        <div
            className={cn(
                'flex items-center gap-1 mb-10',
                'text-2xl md:text-3xl font-bold',
                className
            )}
        >
            {renderText()}
            {showCursor && (
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        delay: textArray.length * speed + 0.5,
                    }}
                    className={cn(
                        'inline-block rounded-sm w-[3px] h-6 md:h-8 bg-primary',
                        cursorClassName
                    )}
                />
            )}
        </div>
    );
}
