'use client';

import { cn } from '@/lib/utils';
import { HTMLMotionProps, motion } from 'framer-motion';
import * as React from 'react';

/**
 * Props pour le composant RevealFx
 */
type RevealFxProps = {
    /** Le contenu à révéler */
    children: React.ReactNode;
    /** La vitesse de l'animation */
    speed?: 'slow' | 'medium' | 'fast';
    /** Le délai avant le début de l'animation (en secondes) */
    delay?: number;
    /** Si le contenu doit être révélé dès le montage */
    revealedByDefault?: boolean;
    /** La distance de translation verticale (en pixels) */
    translateY?: number;
    /** Déclenche manuellement l'animation */
    trigger?: boolean;
    /** Classes CSS additionnelles */
    className?: string;
} & Omit<HTMLMotionProps<'div'>, 'children' | 'className'>;

/**
 * Mapping des vitesses d'animation vers leurs durées en secondes
 */
const speedMap = {
    fast: 1,
    medium: 2,
    slow: 3,
} as const;

/**
 * Composant qui révèle son contenu avec une animation élégante
 * Combine un effet de flou, une translation et un masque de gradient
 *
 * @example
 * ```tsx
 * <RevealFx delay={0.5} speed="fast">
 *   <h1>Contenu à révéler</h1>
 * </RevealFx>
 * ```
 */
export function RevealFx({
    children,
    speed = 'medium',
    delay = 0,
    revealedByDefault = false,
    translateY = 20,
    trigger,
    className,
    ...props
}: RevealFxProps) {
    // État local pour gérer la visibilité du contenu
    const [isRevealed, setIsRevealed] = React.useState(revealedByDefault);

    // Gestion du délai initial
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIsRevealed(true);
        }, delay * 1000);

        return () => clearTimeout(timer);
    }, [delay]);

    // Gestion du déclencheur manuel
    React.useEffect(() => {
        if (trigger !== undefined) {
            setIsRevealed(trigger);
        }
    }, [trigger]);

    return (
        <motion.div
            // État initial de l'animation
            initial={{
                opacity: 0,
                y: translateY,
                filter: 'blur(8px)',
                maskImage:
                    'linear-gradient(to right, black 0%, black 25%, transparent 50%)',
                maskSize: '300% 100%',
                maskPosition: '100% 0',
                WebkitMaskImage:
                    'linear-gradient(to right, black 0%, black 25%, transparent 50%)',
                WebkitMaskSize: '300% 100%',
                WebkitMaskPosition: '100% 0',
            }}
            // État final de l'animation
            animate={{
                opacity: isRevealed ? 1 : 0,
                y: isRevealed ? 0 : translateY,
                filter: isRevealed ? 'blur(0px)' : 'blur(8px)',
                maskPosition: isRevealed ? '0% 0' : '100% 0',
                WebkitMaskPosition: isRevealed ? '0% 0' : '100% 0',
            }}
            // Configuration de la transition
            transition={{
                duration: speedMap[speed],
                ease: [0.16, 1, 0.3, 1], // Courbe d'accélération personnalisée
            }}
            className={cn(
                'flex w-full items-center justify-center relative',
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}
