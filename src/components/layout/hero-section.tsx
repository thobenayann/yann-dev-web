'use client';

import { person } from '@/config/content';
import { motion } from 'framer-motion';
import { AboutMeButton } from '../ui/about-me-button';

type HeroSectionProps = {
    headline: string;
    subline: string;
    aboutMeLabel: string;
    locale: string;
};

export function HeroSection({
    headline,
    subline,
    aboutMeLabel,
    locale,
}: HeroSectionProps) {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: {
            opacity: 0,
            x: -50,
            filter: 'blur(8px)',
        },
        visible: {
            opacity: 1,
            x: 0,
            filter: 'blur(0px)',
            transition: {
                duration: 3,
                ease: [0.16, 1, 0.3, 1],
            },
        },
    };

    return (
        <div className='w-full flex justify-center mt-36 mb-16 px-6 md:px-10'>
            <motion.div
                className='max-w-4xl w-full'
                variants={containerVariants}
                initial='hidden'
                animate='visible'
            >
                {/* Headline */}
                <motion.h1
                    variants={itemVariants}
                    className='text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-8 max-md:text-center'
                >
                    {headline.split('\n').map((line, i) => (
                        <span key={i} className='block'>
                            {line}
                        </span>
                    ))}
                </motion.h1>

                {/* Subline with IPANOVA badge */}
                <motion.div variants={itemVariants} className='mb-8'>
                    <p className='text-lg md:text-xl text-muted-foreground'>
                        {subline.split('\n').map((line, i) => (
                            <span key={i} className='block mb-2'>
                                {i === 0 && line.includes('IPANOVA') ? (
                                    <>
                                        {line.split('IPANOVA')[0]}
                                        <span className='inline-flex items-center rounded-md bg-foreground/5 px-2 py-1 text-sm font-medium ring-1 ring-inset ring-foreground/10'>
                                            IPANOVA
                                        </span>
                                        {line.split('IPANOVA')[1]}
                                    </>
                                ) : (
                                    line
                                )}
                            </span>
                        ))}
                    </p>
                </motion.div>

                {/* About Me Button */}
                <motion.div variants={itemVariants}>
                    <AboutMeButton
                        href={`/${locale}/about`}
                        label={aboutMeLabel}
                        avatarSrc={person.avatar}
                        avatarAlt={person.firstName}
                        avatarFallback={person.firstName[0]}
                    />
                </motion.div>
            </motion.div>
        </div>
    );
}
