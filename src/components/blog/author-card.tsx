import { person } from '@/config/content';
import { Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
    locale: string;
    cta: string;
    contactLabel: string;
    projectsLabel: string;
    tag?: string;
};

export function AuthorCard({
    locale,
    cta,
    contactLabel,
    projectsLabel,
}: Props) {
    return (
        <div className='rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 md:p-8 space-y-4'>
            <div className='flex items-center gap-4'>
                <Image
                    src={person.avatar}
                    alt={person.name}
                    width={56}
                    height={56}
                    className='rounded-full border border-white/20'
                />
                <div>
                    <p className='font-semibold text-foreground'>
                        {person.name}
                    </p>
                    <p className='text-sm text-muted-foreground'>
                        {person.role}
                    </p>
                </div>
            </div>

            <p className='text-muted-foreground leading-relaxed'>{cta}</p>

            <div className='flex flex-wrap gap-3'>
                <Link
                    href='mailto:thobena.yann@gmail.com'
                    className='inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors'
                >
                    <Mail className='h-4 w-4' />
                    {contactLabel}
                </Link>
                <Link
                    href={`/${locale}/work`}
                    className='inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm font-medium hover:bg-white/5 transition-colors'
                >
                    {projectsLabel}
                </Link>
            </div>
        </div>
    );
}
