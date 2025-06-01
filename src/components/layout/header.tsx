'use client';

import { ExpandableTabs } from '@/components/ui/expandable-tabs';
import { person } from '@/config/content';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { AiFillHome } from 'react-icons/ai';
import { BsFillPersonFill } from 'react-icons/bs';
import { FaBlog } from 'react-icons/fa';
import { IoGameController } from 'react-icons/io5';
import { MdWork } from 'react-icons/md';
import { LanguageSwitcher } from '../i18n/language-switcher';
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

    /**
     * Détermine l'index de l'onglet actif en fonction du chemin actuel
     * Gère les cas spéciaux :
     * - Route home (/fr ou /en)
     * - Routes avec locale (/fr/about, /en/work, etc.)
     */
    const activeTabIndex = useMemo(() => {
        // Utilise le pathname actuel ou '/' par défaut
        const path = pathname ?? '/';

        // Extrait les segments du chemin (ex: ['', 'fr', 'about'] pour '/fr/about')
        const segments = path.split('/').filter(Boolean);

        // Si nous n'avons que la locale (ex: /fr ou /en), c'est la page d'accueil
        if (segments.length === 1) {
            return navigationTabs.findIndex(
                (tab) => 'path' in tab && tab.path === '/'
            );
        }

        // Pour les autres routes, on compare sans la locale
        const pathWithoutLocale = segments.slice(1).join('/');
        return navigationTabs.findIndex(
            (tab) => 'path' in tab && tab.path === `/${pathWithoutLocale}`
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
            {/* Location */}
            <div className='fixed top-6 left-8 z-50 flex flex-col items-start gap-4'>
                <div className='text-sm text-primary'>{person.location}</div>
            </div>

            {/* Time and Theme Toggle */}
            <div className='fixed top-6 right-8 flex items-center gap-4 z-50'>
                {person.timezone && <LanguageSwitcher />}
                <ModeToggle />
            </div>

            {/* Navigation */}
            <nav className='fixed max-md:bottom-4 md:top-4 left-1/2 -translate-x-1/2 z-50'>
                <ExpandableTabs
                    tabs={navigationTabs}
                    onChange={handleTabChange}
                    className={cn(
                        'bg-background/75 backdrop-blur-md border-white/10',
                        !scrollAtTop && 'shadow-lg'
                    )}
                    initialSelectedIndex={activeTabIndex}
                />
            </nav>

            {/* Background Mask */}
            <div className='fixed inset-x-0 top-0 h-32 pointer-events-none bg-gradient-to-b from-background to-transparent z-40' />
        </>
    );
}
