'use client';

import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import * as React from 'react';
import type { IconType } from 'react-icons';
import { useOnClickOutside } from 'usehooks-ts';

/**
 * Represents a standard tab with an icon and optional path
 */
type BaseTab = {
    title: string;
    icon: IconType;
    type?: never;
    path?: string;
};

/**
 * Represents a separator between tabs
 */
type SeparatorTab = {
    type: 'separator';
    title?: never;
    icon?: never;
    path?: never;
};

type TabItem = BaseTab | SeparatorTab;

/**
 * Props for the ExpandableTabs component
 */
interface ExpandableTabsProps {
    /** Array of tabs to display */
    tabs: readonly TabItem[] | TabItem[];
    /** Additional CSS classes */
    className?: string;
    /** Callback when a tab is selected */
    onChange?: (index: number | null) => void;
    /** Index of the initially selected tab */
    initialSelectedIndex?: number;
}

/**
 * Animation variants for the button container
 * Controls the padding and gap based on selection state
 */
const buttonVariants = {
    initial: {
        gap: 0,
        paddingLeft: '.5rem',
        paddingRight: '.5rem',
    },
    animate: (isSelected: boolean) => ({
        gap: isSelected ? '.5rem' : 0,
        paddingLeft: isSelected ? '1rem' : '.5rem',
        paddingRight: isSelected ? '1rem' : '.5rem',
    }),
};

/**
 * Animation variants for the text span
 * Controls the width and opacity for the expanding/collapsing effect
 */
const spanVariants = {
    initial: { width: 0, opacity: 0 },
    animate: { width: 'auto', opacity: 1 },
    exit: { width: 0, opacity: 0 },
};

// Animation transition configuration
const transition = { delay: 0.1, type: 'spring', bounce: 0, duration: 0.6 };

/**
 * A responsive navigation component that displays tabs with expanding labels
 * - On desktop (>= 768px): Always shows labels
 * - On mobile (< 768px): Shows labels only for the active/selected tab
 * - Supports separators between tabs
 * - Includes smooth animations for expanding/collapsing labels
 * - Integrates with Next.js routing
 */
export function ExpandableTabs({
    tabs,
    className,
    onChange,
    initialSelectedIndex,
}: ExpandableTabsProps) {
    // Track which tab is being hovered/expanded on mobile
    const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);
    const outsideClickRef = React.useRef<HTMLDivElement>(null);
    // Detect if we're on desktop for different behavior
    const isDesktop = useMediaQuery('(min-width: 1024px)');

    // Handle clicking outside the tabs (mobile only)
    useOnClickOutside(outsideClickRef as React.RefObject<HTMLElement>, () => {
        if (!isDesktop) {
            setHoverIndex(null);
            onChange?.(null);
        }
    });

    // Handle tab selection (mobile only)
    const handleSelect = (index: number) => {
        if (!isDesktop) {
            setHoverIndex(index);
            onChange?.(index);
        }
    };

    // Separator component between tabs
    const Separator = () => (
        <div className='mx-1 h-[24px] w-[1.2px] bg-border' aria-hidden='true' />
    );

    return (
        <div
            ref={outsideClickRef}
            className={cn(
                'flex md:flex-wrap items-center gap-2 rounded-2xl border bg-background p-1 shadow-sm',
                className
            )}
        >
            {tabs.map((tab, index) => {
                if (tab.type === 'separator') {
                    return <Separator key={`separator-${index}`} />;
                }

                const Icon = tab.icon;
                const isActive = index === initialSelectedIndex;

                // Show title if we're on desktop or if this tab is selected (mobile)
                const shouldShowTitle =
                    isDesktop || (hoverIndex === index && !isDesktop);

                // Tab content with icon and animated label
                const TabContent = () => (
                    <>
                        <Icon size={20} />
                        <AnimatePresence initial={false}>
                            {shouldShowTitle && tab.title && (
                                <motion.span
                                    variants={spanVariants}
                                    initial='initial'
                                    animate='animate'
                                    exit='exit'
                                    transition={transition}
                                    className='overflow-hidden pl-2'
                                >
                                    {tab.title}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </>
                );

                return (
                    <Link
                        href={tab.path || '/'}
                        key={tab.title || index}
                        onClick={() => handleSelect(index)}
                        className='contents'
                    >
                        <motion.div
                            variants={buttonVariants}
                            initial={false}
                            animate='animate'
                            custom={isDesktop ? true : hoverIndex === index}
                            transition={transition}
                            className={cn(
                                'relative flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-300 cursor-pointer',
                                isActive
                                    ? cn('text-primary')
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            )}
                        >
                            <TabContent />
                            {isActive && (
                                <motion.div
                                    layoutId='lamp'
                                    className='absolute inset-0 w-full rounded-xl -z-10'
                                    initial={false}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 300,
                                        damping: 30,
                                    }}
                                >
                                    <div className='absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-brand/80 dark:bg-primary/80 rounded-t-full'>
                                        <div className='absolute w-12 h-6 bg-brand/20 dark:bg-primary/20 rounded-full blur-md -top-2 -left-2' />
                                        <div className='absolute w-8 h-6 bg-brand/20 dark:bg-primary/20 rounded-full blur-md -top-1' />
                                        <div className='absolute w-4 h-4 bg-brand/20 dark:bg-primary/20 rounded-full blur-sm top-0 left-2' />
                                    </div>
                                    <div className='absolute inset-0 bg-brand/5 dark:bg-primary/5 rounded-xl backdrop-blur-sm' />
                                </motion.div>
                            )}
                        </motion.div>
                    </Link>
                );
            })}
        </div>
    );
}
