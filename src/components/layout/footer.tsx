import { person } from '@/config/content';
import { SITE_URL } from '@/config/site';
import { cn } from '@/lib/utils';
import { Github, Linkedin, Mail } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

type Props = { locale: string };

const socialLinks = (email: string) => [
    {
        label: 'GitHub',
        href: 'https://github.com/thobenayann',
        icon: <Github className='h-4 w-4' />,
    },
    {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/yann-thobena/',
        icon: <Linkedin className='h-4 w-4' />,
    },
    {
        label: 'Email',
        href: `mailto:${email}`,
        icon: <Mail className='h-4 w-4' />,
    },
];

export async function Footer({ locale }: Props) {
    const t = await getTranslations({ locale, namespace: 'Footer' });

    const nav = [
        { title: t('nav.home'), href: `/${locale}` },
        { title: t('nav.about'), href: `/${locale}/about` },
        { title: t('nav.work'), href: `/${locale}/work` },
        { title: t('nav.blog'), href: `/${locale}/blog` },
    ];

    const legal = [
        { title: t('legal.mentions'), href: `/${locale}/legal/mentions-legales` },
        { title: t('legal.privacy'), href: `/${locale}/legal/confidentialite` },
    ];

    const email = 'thobena.yann@gmail.com';

    return (
        <footer className='relative mt-auto'>
            {/* Top border */}
            <div className='absolute inset-x-0 top-0 h-px bg-border' />

            <div
                className={cn(
                    'mx-auto max-w-6xl px-6 md:px-10',
                    'bg-[radial-gradient(40%_60%_at_10%_0%,oklch(0.541_0.281_293/0.06),transparent)]'
                )}
            >
                <div className='grid grid-cols-6 gap-8 py-12'>
                    {/* Brand + social */}
                    <div className='col-span-6 flex flex-col gap-4 md:col-span-4'>
                        <p className='text-base font-bold tracking-tight'>
                            {person.firstName}{' '}
                            <span className='text-muted-foreground'>
                                {person.lastName}
                            </span>
                        </p>
                        <p className='max-w-sm text-sm text-muted-foreground text-balance leading-relaxed'>
                            {t('tagline')}
                        </p>
                        {/* Social links */}
                        <div className='flex gap-2'>
                            {socialLinks(email).map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    target={s.href.startsWith('mailto') ? undefined : '_blank'}
                                    rel='noopener noreferrer'
                                    aria-label={s.label}
                                    className='flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground hover:border-white/20 hover:text-foreground hover:bg-white/10 transition-all duration-200'
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className='col-span-3 md:col-span-1'>
                        <span className='text-xs font-semibold uppercase tracking-widest text-muted-foreground/60'>
                            {t('nav.title')}
                        </span>
                        <div className='mt-3 flex flex-col gap-2'>
                            {nav.map(({ href, title }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className='w-max text-sm text-muted-foreground hover:text-foreground transition-colors duration-150'
                                >
                                    {title}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Légal */}
                    <div className='col-span-3 md:col-span-1'>
                        <span className='text-xs font-semibold uppercase tracking-widest text-muted-foreground/60'>
                            {t('legal.title')}
                        </span>
                        <div className='mt-3 flex flex-col gap-2'>
                            {legal.map(({ href, title }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className='w-max text-sm text-muted-foreground hover:text-foreground transition-colors duration-150'
                                >
                                    {title}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom border + copyright */}
                <div className='border-t border-border py-5'>
                    <p className='text-center text-sm text-muted-foreground font-light'>
                        &copy; {new Date().getFullYear()} {person.name} ·{' '}
                        {t('rights')}
                    </p>
                </div>
            </div>
        </footer>
    );
}
