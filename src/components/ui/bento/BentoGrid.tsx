'use client';

import { cn } from '@/lib/utils';

type BentoGridProps = {
    children: React.ReactNode;
    className?: string;
};

export function BentoGrid(props: BentoGridProps) {
    return (
        <div
            className={cn(
                'grid grid-cols-1 gap-6 md:grid-cols-6',
                props.className
            )}
        >
            {props.children}
        </div>
    );
}

