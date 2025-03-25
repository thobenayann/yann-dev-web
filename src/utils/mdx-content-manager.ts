import { compile } from '@mdx-js/mdx';
import fs from 'fs';
import path from 'path';

/**
 * Represents a team member in a project or blog post
 */
type Team = {
    name: string;
    role: string;
    avatar: string;
    linkedIn: string;
};

/**
 * Represents an external link in a project
 */
type ProjectLink = {
    label: string;
    url: string;
    icon: string;
};

/**
 * Metadata structure for MDX content (blog posts, projects, etc.)
 */
type Metadata = {
    title: string;
    publishedAt: string;
    summary: string;
    image?: string;
    images: string[];
    tag?: string;
    team: Team[];
    link?: string;
    links?: ProjectLink[];
};

/**
 * Retrieves all MDX files from a specified directory
 * @param dir - Directory path to search for MDX files
 * @returns Array of MDX filenames
 */
function getMDXFiles(dir: string) {
    try {
        if (!fs.existsSync(dir)) {
            console.error(`Directory does not exist: ${dir}`);
            return [];
        }

        return fs
            .readdirSync(dir)
            .filter((file) => path.extname(file) === '.mdx');
    } catch (error) {
        console.error(`Error reading MDX files from directory ${dir}:`, error);
        return [];
    }
}

/**
 * Reads and parses an MDX file, extracting its metadata and content
 * @param filePath - Path to the MDX file
 * @returns Object containing metadata and content
 */
async function readMDXFile(filePath: string) {
    try {
        if (!fs.existsSync(filePath)) {
            return getErrorContent(
                'Not Found',
                'This content could not be found.'
            );
        }

        const rawContent = fs.readFileSync(filePath, 'utf-8');

        // Extract frontmatter using regex
        const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
        const match = rawContent.match(frontmatterRegex);
        const frontmatter = match ? match[1] : '';
        const content = rawContent.replace(frontmatterRegex, '').trim();

        // Parse frontmatter
        const metadata = parseFrontmatter(frontmatter);

        // Compile MDX content
        const compiledContent = await compile(content, {
            outputFormat: 'function-body',
            development: process.env.NODE_ENV === 'development',
        });

        return { metadata, content: String(compiledContent) };
    } catch (error) {
        console.error(`Error reading MDX file ${filePath}:`, error);
        return getErrorContent(
            'Error',
            'An error occurred while reading this content.'
        );
    }
}

/**
 * Parses YAML frontmatter into structured metadata
 * @param frontmatter - YAML frontmatter string
 * @returns Parsed metadata object
 */
function parseFrontmatter(frontmatter: string): Metadata {
    try {
        // Simple YAML parser for frontmatter
        const data = frontmatter.split('\n').reduce((acc, line) => {
            const [key, ...values] = line.split(':');
            if (key && values.length) {
                acc[key.trim()] = values.join(':').trim();
            }
            return acc;
        }, {} as Record<string, string>);

        return {
            title: data.title || '',
            publishedAt: data.publishedAt || new Date().toISOString(),
            summary: data.summary || '',
            image: data.image || '',
            images: data.images ? JSON.parse(data.images) : [],
            tag: data.tag || '',
            team: data.team ? JSON.parse(data.team) : [],
            link: data.link || '',
            links: data.links ? JSON.parse(data.links) : [],
        };
    } catch (error) {
        console.error('Error parsing frontmatter:', error);
        return getDefaultMetadata();
    }
}

/**
 * Creates default error content
 * @param title - Error title
 * @param message - Error message
 */
function getErrorContent(title: string, message: string) {
    return {
        metadata: {
            title,
            publishedAt: new Date().toISOString(),
            summary: message,
            images: [],
            team: [],
        },
        content: message,
    };
}

/**
 * Returns default metadata structure
 */
function getDefaultMetadata(): Metadata {
    return {
        title: '',
        publishedAt: new Date().toISOString(),
        summary: '',
        images: [],
        team: [],
    };
}

/**
 * Processes all MDX files in a directory
 * @param dir - Directory containing MDX files
 * @returns Array of processed MDX content with metadata
 */
async function getMDXData(dir: string) {
    try {
        const mdxFiles = getMDXFiles(dir);
        const contentPromises = mdxFiles.map(async (file) => {
            try {
                const { metadata, content } = await readMDXFile(
                    path.join(dir, file)
                );
                const slug = path.basename(file, path.extname(file));
                return { metadata, slug, content };
            } catch (error) {
                console.error(`Error processing MDX file ${file}:`, error);
                return {
                    metadata: getDefaultMetadata(),
                    slug: path.basename(file, path.extname(file)),
                    content: 'Error processing content.',
                };
            }
        });

        return await Promise.all(contentPromises);
    } catch (error) {
        console.error(`Error getting MDX data from directory ${dir}:`, error);
        return [];
    }
}

/**
 * Retrieves and processes MDX posts from a specified path
 * @param customPath - Array of path segments to the MDX files directory
 * @returns Array of processed MDX posts with metadata
 */
export async function getPosts(customPath = ['', '', '', '']) {
    try {
        const postsDir = path.join(process.cwd(), ...customPath);
        return await getMDXData(postsDir);
    } catch (error) {
        console.error(
            `Error in getPosts with path ${customPath.join('/')}:`,
            error
        );
        return [];
    }
}
