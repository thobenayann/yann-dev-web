import { Project, ProjectMetadata } from '@/types/mdx';
import { ProjectMetadataSchema } from '@/types/mdx.schema';
import fs from 'fs/promises';
import matter from 'gray-matter';
import path from 'path';

/**
 * Récupère tous les fichiers MDX d'un répertoire
 */
async function getMDXFiles(dir: string): Promise<string[]> {
    try {
        const files = await fs.readdir(dir);
        return files.filter((file) => path.extname(file) === '.mdx');
    } catch {
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

        // Valider et normaliser les métadonnées via Zod
        const parsed = ProjectMetadataSchema.safeParse(data);
        const metadata: ProjectMetadata = parsed.success
            ? parsed.data
            : {
                  title: String(data.title ?? ''),
                  publishedAt: String(
                      data.publishedAt ?? new Date().toISOString()
                  ),
                  summary: String(data.summary ?? ''),
                  image: data.image,
                  images: Array.isArray(data.images) ? data.images : [],
                  tag: data.tag,
                  team: Array.isArray(data.team) ? data.team : [],
                  link: data.link,
                  links: Array.isArray(data.links) ? data.links : [],
              };

        return {
            metadata,
            content,
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
 * Récupère un projet par son slug avec le contenu MDX brut (non compilé).
 * Utilisé par la route `/work/[slug]` qui rend via `next-mdx-remote/rsc`.
 */
export async function getProjectBySlug(
    slug: string,
    locale: string = 'fr'
): Promise<Project | null> {
    const projectsDir = path.join(
        process.cwd(),
        'src',
        'app',
        '[locale]',
        'work',
        'projects',
        locale
    );
    const filePath = path.join(projectsDir, `${slug}.mdx`);
    try {
        const rawContent = await fs.readFile(filePath, 'utf-8');
        const { data, content } = matter(rawContent);
        const parsed = ProjectMetadataSchema.safeParse(data);
        const metadata: ProjectMetadata = parsed.success
            ? parsed.data
            : {
                  title: String(data.title ?? ''),
                  publishedAt: String(
                      data.publishedAt ?? new Date().toISOString()
                  ),
                  summary: String(data.summary ?? ''),
                  image: data.image,
                  images: Array.isArray(data.images) ? data.images : [],
                  tag: data.tag,
                  team: Array.isArray(data.team) ? data.team : [],
                  link: data.link,
                  links: Array.isArray(data.links) ? data.links : [],
              };
        return { metadata, slug, content };
    } catch {
        return null;
    }
}

/**
 * Liste les slugs disponibles pour une locale donnée (utilisé par generateStaticParams).
 */
export async function getProjectSlugs(
    locale: string = 'fr'
): Promise<string[]> {
    const projectsDir = path.join(
        process.cwd(),
        'src',
        'app',
        '[locale]',
        'work',
        'projects',
        locale
    );
    const mdxFiles = await getMDXFiles(projectsDir);
    return mdxFiles.map((f) => path.basename(f, path.extname(f)));
}
