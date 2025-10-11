'use client';

import { cn } from '@/lib/utils';

type BentoCardProps = {
    title: string;
    children: React.ReactNode;
    className?: string;
};

export function BentoCard(props: BentoCardProps) {
    return (
        <div
            className={cn(
                'rounded-2xl border bg-card/50 p-6 shadow-sm dark:bg-card/40',
                props.className
            )}
        >
            <h3 className='mb-4 text-base font-semibold tracking-tight'>
                {props.title}
            </h3>
            {props.children}
        </div>
    );
}

