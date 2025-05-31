import { Project } from '@/types/mdx';
import { useTranslations } from 'next-intl';
import { HeroSection } from '../layout/hero-section';
import { Projects } from '../ui/projects';

type TranslatedHomeContentProps = {
    projects: Project[];
    locale: string;
};

export function TranslatedHomeContent({
    projects,
    locale,
}: TranslatedHomeContentProps) {
    const tHome = useTranslations('Home');

    return (
        <div className='w-full'>
            <HeroSection
                headline={tHome('headline')}
                subline={tHome('subline')}
                aboutMeLabel={tHome('about-me')}
                locale={locale}
            />

            <section className='container mx-auto px-6 md:px-10'>
                <h2 className='text-2xl md:text-3xl font-bold mb-10'>
                    {tHome('projects-title')}
                </h2>
                <Projects projects={projects} locale={locale} />
            </section>
        </div>
    );
}
