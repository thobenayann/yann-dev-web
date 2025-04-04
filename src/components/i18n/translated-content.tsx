'use client';

import { Project } from '@/types/mdx';
import { useTranslations } from 'next-intl';
import { Projects } from '../ui/projects';

type TranslatedContentProps = {
    projects: Project[];
    locale: string;
};

export function TranslatedContent({
    projects,
    locale,
}: TranslatedContentProps) {
    const tHome = useTranslations('Home');

    return (
        <div className='flex flex-col gap-6 py-52 px-10 md:px-20'>
            <h1 className='text-4xl font-bold'>{tHome('title')}</h1>
            <Projects projects={projects} locale={locale} />
        </div>
    );
}
