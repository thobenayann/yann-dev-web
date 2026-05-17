'use client';

import { AnimatedBeamMultipleOutputs } from '@/components/animated-beam-multiple-outputs';
import { BentoCard, BentoGrid } from '@/components/magicui/bento-grid';
import { FadeIn } from '@/components/magicui/fade-in';
import Marquee from '@/components/magicui/marquee';
import Orbit from '@/components/orbit';
import Technologies from '@/components/technologies';
import { cn } from '@/lib/utils';
import { Project } from '@/types/mdx';
import { useTranslations } from 'next-intl';
import { Projects } from '../ui/projects';
import { SecondaryTitle } from '../ui/secondary-title';
import { HeroSection } from './hero-section';

type HomeContentProps = {
    projects: Project[];
    locale: string;
};

export function HomeContent({ projects, locale }: HomeContentProps) {
    const tHome = useTranslations('Home');

    return (
        <div className='w-full'>
            <HeroSection
                headline={tHome('headline')}
                subline={tHome('subline')}
                aboutMeLabel={tHome('about-me')}
                locale={locale}
            />

            {/* Bento Section (inspiré de cook, adapté au contenu du portfolio) */}
            <section className='mb-20'>
                <div className='container mx-auto px-6 md:px-10 mb-8'>
                    <SecondaryTitle text={tHome('technologies-title')} />
                </div>
                <div className='container mx-auto px-6 md:px-10'>
                    <BentoGrid>
                        {/* Tech Domain */}
                        <BentoCard
                            name={tHome('bento.domains.title')}
                            className='col-span-3 md:col-span-1'
                            background={
                                <div>
                                    <Marquee
                                        className='absolute h-2/3 top-10 [--duration:40s] [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] w-full'
                                        pauseOnHover
                                    >
                                        {(
                                            tHome.raw(
                                                'bento.domains.cards'
                                            ) as any[]
                                        ).map((f, idx) => (
                                            <a
                                                href={`/${locale}/tags/${f.slug}`}
                                                key={idx}
                                                className={cn(
                                                    'relative w-40 h-full cursor-pointer overflow-hidden rounded-xl border p-4 hover:-translate-y-1',
                                                    'border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]',
                                                    'dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]',
                                                    'transform-gpu transition-all duration-300 ease-out hover:blur-none'
                                                )}
                                            >
                                                <div className='flex flex-row items-center gap-2'>
                                                    <div className='flex flex-col'>
                                                        <figcaption className='text-lg font-bold dark:text-white '>
                                                            {f.name}
                                                        </figcaption>
                                                    </div>
                                                </div>
                                                <blockquote className='mt-2 text-xs'>
                                                    {f.body}
                                                </blockquote>
                                            </a>
                                        ))}
                                    </Marquee>
                                </div>
                            }
                        />

                        {/* Technologies */}
                        <BentoCard
                            name={tHome('bento.technologies.title')}
                            className='col-span-3 md:col-span-2'
                            background={
                                <div className='absolute right-0 top-0 w-[80%] origin-top translate-x-0 transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_70%)] md:[mask-image:linear-gradient(to_top,transparent_50%,#000_70%)] group-hover:-translate-y-5 group-hover:scale-105'>
                                    <FadeIn direction='up'>
                                        <Technologies />
                                    </FadeIn>
                                </div>
                            }
                        />

                        {/* AI Integrations */}
                        <BentoCard
                            name={tHome('bento.ai.title')}
                            className='col-span-3 md:col-span-2'
                            background={
                                <AnimatedBeamMultipleOutputs className='absolute right-0 top-4 h-[300px] w-[600px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] md:[mask-image:linear-gradient(to_top,transparent_0%,#000_100%)] group-hover:scale-105' />
                            }
                        />

                        {/* Seamless Deployments */}
                        <BentoCard
                            name={tHome('bento.deployments.title')}
                            className='col-span-3 md:col-span-1'
                            background={
                                <div className='absolute w-full h-full right-0 top-0 origin-top rounded-md transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_25%,#000_70%)] group-hover:scale-105'>
                                    <Orbit />
                                </div>
                            }
                        />
                    </BentoGrid>
                </div>
            </section>

            {/* Projects Section */}
            <section className='container mx-auto px-6 md:px-10'>
                <SecondaryTitle text={tHome('projects-title')} />
                <Projects projects={projects} locale={locale} />
            </section>
        </div>
    );
}
