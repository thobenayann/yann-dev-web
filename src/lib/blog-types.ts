// Client-safe types and tag helpers for blog posts.
// No filesystem imports — can be used from client components.

export type PostMetadata = {
    title: string;
    publishedAt: string;
    summary: string;
    image?: string;
    tag: string;
    lang: string;
};

export type Post = {
    metadata: PostMetadata;
    slug: string;
    content: string; // source MDX brute pour MDXRemote/rsc
    readingTime: string; // ex: "5 min"
};

export type Heading = {
    id: string;
    text: string;
    level: 2 | 3;
};

// ── Tag colors ────────────────────────────────────────────────────

export type TagConfig = {
    gradient: string;
    gradientFrom: string;
    gradientTo: string;
    badge: string;
    border: string;
    progressColor: string;
};

const TAG_CONFIGS: Record<string, TagConfig> = {
    'IA & LLM': {
        gradient: 'from-violet-600 to-indigo-600',
        gradientFrom: '#7c3aed',
        gradientTo: '#4f46e5',
        badge: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
        border: 'border-violet-500/30',
        progressColor: '#7c3aed',
    },
    Dev: {
        gradient: 'from-cyan-500 to-teal-500',
        gradientFrom: '#06b6d4',
        gradientTo: '#14b8a6',
        badge: 'bg-cyan-400/10 text-cyan-300 border-cyan-400/20',
        border: 'border-cyan-400/30',
        progressColor: '#06b6d4',
    },
    'Web Development': {
        gradient: 'from-cyan-500 to-teal-500',
        gradientFrom: '#06b6d4',
        gradientTo: '#14b8a6',
        badge: 'bg-cyan-400/10 text-cyan-300 border-cyan-400/20',
        border: 'border-cyan-400/30',
        progressColor: '#06b6d4',
    },
    SEO: {
        gradient: 'from-green-500 to-emerald-500',
        gradientFrom: '#22c55e',
        gradientTo: '#10b981',
        badge: 'bg-green-500/10 text-green-300 border-green-500/20',
        border: 'border-green-500/30',
        progressColor: '#22c55e',
    },
    Carrière: {
        gradient: 'from-orange-500 to-rose-500',
        gradientFrom: '#f97316',
        gradientTo: '#f43f5e',
        badge: 'bg-orange-500/10 text-orange-300 border-orange-500/20',
        border: 'border-orange-500/30',
        progressColor: '#f97316',
    },
    Career: {
        gradient: 'from-orange-500 to-rose-500',
        gradientFrom: '#f97316',
        gradientTo: '#f43f5e',
        badge: 'bg-orange-500/10 text-orange-300 border-orange-500/20',
        border: 'border-orange-500/30',
        progressColor: '#f97316',
    },
};

const DEFAULT_TAG_CONFIG: TagConfig = TAG_CONFIGS['Dev'];

export function getTagConfig(tag: string): TagConfig {
    return TAG_CONFIGS[tag] ?? DEFAULT_TAG_CONFIG;
}

// ── Pure helper: slugify (safe for client) ─────────────────────────

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

export function extractHeadings(content: string): Heading[] {
    const lines = content.split('\n');
    return lines
        .filter((l) => /^#{2,3}\s+/.test(l))
        .map((l) => {
            const level = l.startsWith('### ') ? 3 : 2;
            const text = l.replace(/^#{2,3}\s+/, '').trim();
            return { id: slugify(text), text, level };
        });
}
