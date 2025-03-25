'use client';

import { ExpandableTabs } from '@/components/ui/expandable-tabs';
import person from '@/config/person';
import { TimeDisplay } from '@/lib/time-display';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { AiFillHome } from 'react-icons/ai';
import { BsFillPersonFill } from 'react-icons/bs';
import { FaBlog } from 'react-icons/fa';
import { IoGameController } from 'react-icons/io5';
import { MdWork } from 'react-icons/md';
import { ModeToggle } from '../theme/theme-mode-toggle';

const navigationTabs = [
    {
        title: '',
        icon: AiFillHome,
        path: '/',
    },
    { type: 'separator' as const },
    {
        title: 'About',
        icon: BsFillPersonFill,
        path: '/about',
    },
    {
        title: 'Work',
        icon: MdWork,
        path: '/work',
    },
    {
        title: 'Blog',
        icon: FaBlog,
        path: '/blog',
    },
    {
        title: 'Hobbies',
        icon: IoGameController,
        path: '/hobbies',
    },
] as const;

export function Header() {
    const router = useRouter();
    const [scrollAtTop, setScrollAtTop] = useState(true);
    const pathname = usePathname();

    const activeTabIndex = useMemo(() => {
        const path = pathname ?? '/';
        return navigationTabs.findIndex(
            (tab) => 'path' in tab && tab.path === path
        );
    }, [pathname]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY;
            setScrollAtTop(currentScrollPos < 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleTabChange = (index: number | null) => {
        if (index !== null) {
            const tab = navigationTabs[index];
            if ('path' in tab) {
                router.push(tab.path);
            }
        }
    };

    return (
        <>
            {/* Time and Theme Toggle */}
            <div className='fixed top-4 right-4 flex items-center gap-4 z-50'>
                {person.timeZone && (
                    <div className='text-sm text-muted-foreground'>
                        <TimeDisplay timeZone={person.timeZone} />
                    </div>
                )}
                <ModeToggle />
            </div>

            {/* Navigation */}
            <header className='fixed max-md:bottom-4 md:top-4 left-1/2 -translate-x-1/2 z-50'>
                <ExpandableTabs
                    tabs={navigationTabs}
                    onChange={handleTabChange}
                    className={cn(
                        'bg-background/75 backdrop-blur-md border-white/10',
                        !scrollAtTop && 'shadow-lg'
                    )}
                    activeColor='text-foreground'
                    initialSelectedIndex={activeTabIndex}
                />
            </header>

            {/* Background Mask */}
            <div className='fixed inset-x-0 top-0 h-32 pointer-events-none bg-gradient-to-b from-background to-transparent z-40' />
        </>
    );
}
