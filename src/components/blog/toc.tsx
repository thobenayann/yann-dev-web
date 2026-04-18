'use client';

import { Heading } from '@/lib/blog-types';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

type Props = { headings: Heading[] };

function useActiveHeading(ids: string[]): string {
    const [activeId, setActiveId] = useState('');

    useEffect(() => {
        if (ids.length === 0) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-20% 0% -70% 0%' }
        );
        ids.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, [ids]);

    return activeId;
}

export function Toc({ headings }: Props) {
    const ids = headings.map((h) => h.id);
    const activeId = useActiveHeading(ids);

    if (headings.length === 0) return null;

    return (
        <nav className='hidden lg:block sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto space-y-1 text-sm'>
            <p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3'>
                Table des matières
            </p>
            {headings.map((h) => (
                <a
                    key={h.id}
                    href={`#${h.id}`}
                    onClick={(e) => {
                        e.preventDefault();
                        document
                            .getElementById(h.id)
                            ?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={cn(
                        'block py-1 transition-colors leading-snug',
                        h.level === 3 && 'pl-3',
                        activeId === h.id
                            ? 'text-foreground font-medium'
                            : 'text-muted-foreground hover:text-foreground'
                    )}
                >
                    {h.text}
                </a>
            ))}
        </nav>
    );
}
