'use client';

import { cn } from '@/lib/utils';

/**
 * A component that displays inline code with a monospace font and a subtle background
 * Used for displaying short code snippets within text
 */
export function InlineCode({
    children,
    className,
    ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
    return (
        <span
            className={cn(
                'inline-flex items-center px-2 py-0.5 text-[80%] leading-[125%] align-middle',
                'rounded-md bg-muted/50 border border-border/50',
                'font-mono text-foreground/90',
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
}
