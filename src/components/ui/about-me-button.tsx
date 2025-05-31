'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';

type AboutMeButtonProps = {
    href: string;
    label: string;
    avatarSrc: string;
    avatarAlt: string;
    avatarFallback: string;
    className?: string;
};

export function AboutMeButton({
    href,
    label,
    avatarSrc,
    avatarAlt,
    avatarFallback,
    className,
}: AboutMeButtonProps) {
    return (
        <Link href={href} className='contents'>
            <motion.div
                className={cn(
                    'group relative inline-flex items-center gap-3 px-5 py-3 rounded-full',
                    'bg-background/90 border border-border/60 backdrop-blur-md',
                    'hover:bg-primary/5 hover:border-primary/30 transition-all duration-700',
                    'hover:shadow-xl hover:shadow-primary/20 dark:hover:shadow-primary/10',
                    'cursor-pointer overflow-hidden',
                    'before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r',
                    'before:from-primary/10 before:via-primary/5 before:to-transparent',
                    'before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500',
                    className
                )}
                whileTap={{ scale: 0.98 }}
                transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                    duration: 0.15,
                }}
            >
                {/* Background glow effect on hover */}
                <motion.div
                    className='absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-full opacity-0 group-hover:opacity-100'
                    initial={false}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                />

                {/* Avatar with animation */}
                <motion.div
                    className='relative z-10'
                    whileHover={{
                        rotate: [0, -5, 5, 0],
                        scale: 1.05,
                    }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                >
                    <div className='relative'>
                        <Avatar className='h-8 w-8 ring-2 ring-background/80 group-hover:ring-primary/40 transition-all duration-500 shadow-md group-hover:shadow-lg'>
                            <AvatarImage
                                src={avatarSrc}
                                alt={avatarAlt}
                                className='group-hover:scale-105 transition-transform duration-500 group-hover:brightness-110'
                            />
                            <AvatarFallback className='text-sm bg-muted/80 group-hover:bg-primary/10 transition-colors duration-300'>
                                {avatarFallback}
                            </AvatarFallback>
                        </Avatar>
                        {/* Glowing ring effect */}
                        <div className='absolute inset-0 rounded-full border-2 border-primary/0 group-hover:border-primary/20 group-hover:scale-110 transition-all duration-200 ease-out' />
                    </div>
                </motion.div>

                {/* Label with subtle animation */}
                <motion.span
                    className='relative z-10 text-base font-semibold text-foreground/85 group-hover:text-primary/90 transition-colors duration-500'
                    initial={false}
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                >
                    {label}
                </motion.span>

                {/* Arrow icon that appears on hover */}
                <div className='relative z-10 flex items-center justify-center w-0 group-hover:w-5 transition-all duration-300 ease-out overflow-hidden'>
                    <svg
                        className='w-4 h-4 text-primary/70 group-hover:text-primary transition-all duration-200 transform translate-x-[-100%] group-hover:translate-x-0 opacity-0 group-hover:opacity-100'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M17 8l4 4m0 0l-4 4m4-4H3'
                        />
                    </svg>
                </div>

                {/* Subtle border glow effect */}
                <motion.div
                    className='absolute inset-0 rounded-full border border-primary/0 group-hover:border-primary/30 transition-all duration-500'
                    initial={false}
                />
            </motion.div>
        </Link>
    );
}
