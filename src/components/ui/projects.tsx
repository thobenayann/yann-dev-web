'use client';

import { Project } from '@/types/mdx';
import { ProjectCard } from './project-card';

/**
 * Props du composant Projects
 */
type ProjectsProps = {
    /** Liste des projets à afficher */
    projects: Project[];
    /** Locale pour l'internationalisation */
    locale: string;
};

/**
 * Composant qui affiche une liste de projets avec pagination
 */
export function Projects({ projects, locale }: ProjectsProps) {
    const sortedProjects = [...projects].sort(
        (a, b) =>
            new Date(b.metadata.publishedAt).getTime() -
            new Date(a.metadata.publishedAt).getTime()
    );

    return (
        <div className='flex flex-col gap-20 w-full'>
            {sortedProjects.map((project, index) => (
                <ProjectCard
                    key={project.slug}
                    project={project}
                    priority={index < 2}
                    locale={locale}
                />
            ))}
        </div>
    );
}
