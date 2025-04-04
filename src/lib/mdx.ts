import { Project, ProjectMetadata } from '@/types/mdx';
import fs from 'fs/promises';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import path from 'path';

/**
 * Récupère tous les fichiers MDX d'un répertoire
 */
async function getMDXFiles(dir: string): Promise<string[]> {
    try {
        const files = await fs.readdir(dir);
        return files.filter((file) => path.extname(file) === '.mdx');
    } catch (error) {
        console.error(`Erreur lors de la lecture du répertoire ${dir}:`, error);
        return [];
    }
}

/**
 * Lit et parse un fichier MDX
 */
async function readMDXFile(filePath: string): Promise<{
    metadata: ProjectMetadata;
    content: string;
}> {
    try {
        const rawContent = await fs.readFile(filePath, 'utf-8');
        const { data, content } = matter(rawContent);

        // Valide et transforme les métadonnées
        const metadata: ProjectMetadata = {
            title: data.title || '',
            publishedAt: data.publishedAt || new Date().toISOString(),
            summary: data.summary || '',
            image: data.image,
            images: data.images || [],
            tag: data.tag,
            team: data.team || [],
            link: data.link,
            links: data.links || [],
        };

        // Sérialise le contenu MDX
        const mdxSource = await serialize(content, {
            parseFrontmatter: true,
            mdxOptions: {
                development: process.env.NODE_ENV === 'development',
            },
        });

        return {
            metadata,
            content: mdxSource.compiledSource,
        };
    } catch (error) {
        console.error(
            `Erreur lors de la lecture du fichier ${filePath}:`,
            error
        );
        return {
            metadata: {
                title: 'Erreur',
                publishedAt: new Date().toISOString(),
                summary:
                    'Une erreur est survenue lors de la lecture du contenu.',
                images: [],
                team: [],
            },
            content: 'Erreur lors du chargement du contenu.',
        };
    }
}

/**
 * Récupère les données de tous les projets MDX d'un répertoire
 */
async function getMDXData(dir: string): Promise<Project[]> {
    try {
        const mdxFiles = await getMDXFiles(dir);
        const projectsPromises = mdxFiles.map(async (file) => {
            const filePath = path.join(dir, file);
            const { metadata, content } = await readMDXFile(filePath);
            const slug = path.basename(file, path.extname(file));

            return {
                metadata,
                slug,
                content,
            };
        });

        return await Promise.all(projectsPromises);
    } catch (error) {
        console.error(`Erreur lors de la récupération des données MDX:`, error);
        return [];
    }
}

/**
 * Récupère tous les projets pour une locale donnée
 */
export async function getProjects(locale: string = 'fr'): Promise<Project[]> {
    const projectsDir = path.join(
        process.cwd(),
        'src',
        'app',
        '[locale]',
        'work',
        'projects',
        locale
    );

    try {
        return await getMDXData(projectsDir);
    } catch (error) {
        console.error(
            `Erreur lors de la récupération des projets pour la locale ${locale}:`,
            error
        );
        return [];
    }
}

/**
 * Récupère un projet spécifique par son slug
 */
export async function getProjectBySlug(
    slug: string,
    locale: string = 'fr'
): Promise<Project | null> {
    const projects = await getProjects(locale);
    return projects.find((project) => project.slug === slug) || null;
}
