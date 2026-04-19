'use client';

import { Heading } from '@/lib/blog-types';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

type Props = { headings: Heading[] };

const NAV_OFFSET = 88; // px — height of sticky nav + extra breathing room

function useActiveHeading(ids: string[]): string {
    const [activeId, setActiveId] = useState(ids[0] ?? '');
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        if (ids.length === 0) return;

        observerRef.current?.disconnect();

        observerRef.current = new IntersectionObserver(
            (entries) => {
                // Pick the topmost entry that is intersecting
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort(
                        (a, b) =>
                            a.boundingClientRect.top - b.boundingClientRect.top
                    );
                if (visible.length > 0) {
                    setActiveId(visible[0].target.id);
                }
            },
            {
                rootMargin: `-${NAV_OFFSET}px 0% -55% 0%`,
                threshold: 0,
            }
        );

        ids.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observerRef.current!.observe(el);
        });

        return () => observerRef.current?.disconnect();
    }, [ids]);

    return activeId;
}

function scrollToHeading(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top: y, behavior: 'smooth' });
}

export function Toc({ headings }: Props) {
    const ids = headings.map((h) => h.id);
    const activeId = useActiveHeading(ids);

    if (headings.length === 0) return null;

    return (
        <nav className='hidden lg:block sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto'>
            <p className='text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-4'>
                Table des matières
            </p>
            <ol className='space-y-0.5'>
                {headings.map((h) => (
                    <li key={h.id}>
                        <button
                            onClick={() => scrollToHeading(h.id)}
                            className={cn(
                                'w-full text-left text-sm py-1.5 transition-all duration-150 leading-snug border-l-2 pl-3',
                                h.level === 3 && 'pl-5 text-xs',
                                activeId === h.id
                                    ? 'text-foreground font-medium border-white/60'
                                    : 'text-muted-foreground hover:text-foreground/80 border-white/10 hover:border-white/25'
                            )}
                        >
                            {h.text}
                        </button>
                    </li>
                ))}
            </ol>
        </nav>
    );
}
