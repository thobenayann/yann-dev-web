import { Project } from '@/types/mdx';
import { useTranslations } from 'next-intl';
import { HeroSection } from '../layout/hero-section';
import { Projects } from '../ui/projects';
import { SecondaryTitle } from '../ui/secondary-title';

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
                <SecondaryTitle text={tHome('projects-title')} />
                <Projects projects={projects} locale={locale} />
            </section>
        </div>
    );
}
