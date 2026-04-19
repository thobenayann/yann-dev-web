'use client';

import { motion, useScroll } from 'framer-motion';

type Props = { color: string };

export function ReadingProgress({ color }: Props) {
    const { scrollYProgress } = useScroll();
    return (
        <motion.div
            className='fixed top-0 left-0 right-0 z-50 h-[3px] origin-left'
            style={{ scaleX: scrollYProgress, backgroundColor: color }}
        />
    );
}
