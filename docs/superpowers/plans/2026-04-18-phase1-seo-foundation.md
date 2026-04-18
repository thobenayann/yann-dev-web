# Phase 1 SEO Foundation — Implementation Plan

**Goal:** Corriger les 3 problèmes P0 identifiés dans l'audit SEO 2026-04-18 :
1. Route `/og` manquante (previews sociales cassées)
2. Aucun JSON-LD / structured data (E-E-A-T nul)
3. Route `/work/[slug]` manquante → 6 URLs 404 dans le sitemap

**Architecture :** on crée une infrastructure SEO réutilisable (composant `<JsonLd />`, route `/og` dynamique) puis on rend les 6 MDX existants via `/work/[slug]` avec `SoftwareApplication` + `BreadcrumbList` schemas. Bonus P1 : fix du `manifest.ts` et enrichissement `/work` (generateMetadata).

**Tech stack :** Next.js 16 App Router, `next-mdx-remote/rsc` pour rendu serveur MDX, `next/og` (ImageResponse) pour images OG, JSON-LD via balise `<script>`.

---

## File structure

- **Create** : `src/app/og/route.tsx` — route handler ImageResponse
- **Create** : `src/components/seo/json-ld.tsx` — composant utilitaire `<JsonLd data={...} />`
- **Create** : `src/lib/seo/schemas.ts` — factories `personSchema()`, `websiteSchema()`, `softwareAppSchema()`, `breadcrumbSchema()`
- **Create** : `src/app/[locale]/work/[slug]/page.tsx` — route détail projet SSG
- **Create** : `src/components/work/project-detail.tsx` — composant UI du détail projet
- **Modify** : `src/app/[locale]/layout.tsx` — injection du `WebSite` JSON-LD
- **Modify** : `src/app/[locale]/about/page.tsx` — injection du `Person` + `ProfilePage` JSON-LD
- **Modify** : `src/app/[locale]/work/page.tsx` — ajout `generateMetadata` + hero
- **Modify** : `src/app/manifest.ts` — theme_color + description localisée
- **Modify** : `src/lib/mdx.ts` — exposer `getProjectBySlug(slug, locale)` pour la page détail
- **Modify** : `messages/fr.json` + `messages/en.json` — ajouts clés Work.hero

---

## Task 1 — Route `/og` (ImageResponse dynamique)

**Files:** Create `src/app/og/route.tsx`

- [ ] **Step 1 : Créer la route handler**

```tsx
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') ?? 'Yann THOBENA · Portfolio';
    const subtitle =
        searchParams.get('subtitle') ??
        'Concepteur Développeur d’Applications & Expert IA';

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '80px',
                    background:
                        'linear-gradient(135deg, #0a0a0f 0%, #1a0b2e 50%, #06202f 100%)',
                    fontFamily: 'sans-serif',
                    color: '#ffffff',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div
                        style={{
                            width: '14px',
                            height: '14px',
                            borderRadius: '999px',
                            background:
                                'linear-gradient(135deg, oklch(0.541 0.281 293), oklch(0.75 0.18 210))',
                        }}
                    />
                    <div style={{ fontSize: '28px', opacity: 0.8 }}>
                        yanndevweb.com
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div
                        style={{
                            fontSize: '72px',
                            fontWeight: 700,
                            lineHeight: 1.1,
                            letterSpacing: '-0.02em',
                        }}
                    >
                        {title}
                    </div>
                    <div
                        style={{
                            fontSize: '32px',
                            opacity: 0.7,
                            maxWidth: '900px',
                        }}
                    >
                        {subtitle}
                    </div>
                </div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '24px',
                        opacity: 0.6,
                    }}
                >
                    <div>Yann THOBENA</div>
                    <div>Toulouse · France</div>
                </div>
            </div>
        ),
        { width: 1200, height: 630 }
    );
}
```

- [ ] **Step 2 : Vérifier visuellement**

Run dev server and visit `http://localhost:3000/og?title=Test`. Expected: PNG 1200×630 rendu avec le titre.

- [ ] **Step 3 : Commit**

```bash
git add src/app/og/route.tsx
git commit -m "feat(seo): add dynamic OG image route via next/og ImageResponse"
```

---

## Task 2 — Composant `<JsonLd />` + factories schémas

**Files:** Create `src/components/seo/json-ld.tsx`, `src/lib/seo/schemas.ts`

- [ ] **Step 1 : Composant `<JsonLd />`**

```tsx
// src/components/seo/json-ld.tsx
type JsonLdProps = {
    data: Record<string, unknown> | Record<string, unknown>[];
};

export function JsonLd({ data }: JsonLdProps) {
    return (
        <script
            type='application/ld+json'
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
```

- [ ] **Step 2 : Factories de schémas**

```ts
// src/lib/seo/schemas.ts
import { SITE_URL } from '@/config/site';

export function websiteSchema(locale: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Yann THOBENA's Portfolio",
        inLanguage: locale === 'fr' ? 'fr-FR' : 'en-US',
        potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE_URL}/${locale}/blog?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
        },
    };
}

export function personSchema(locale: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': `${SITE_URL}/#person`,
        name: 'Yann THOBENA',
        givenName: 'Yann',
        familyName: 'THOBENA',
        url: `${SITE_URL}/${locale}/about`,
        image: `${SITE_URL}/images/avatar.svg`,
        jobTitle:
            locale === 'fr'
                ? "Concepteur Développeur d'Applications & Expert IA"
                : 'Application Designer & Developer, AI Expert',
        worksFor: {
            '@type': 'Organization',
            name: 'IPANOVA',
            url: 'https://www.ipanova.fr',
        },
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Toulouse',
            addressCountry: 'FR',
        },
        knowsAbout: [
            'Next.js',
            'React',
            'TypeScript',
            'NestJS',
            'PostgreSQL',
            'Docker',
            'Artificial Intelligence',
            'Large Language Models',
            'Retrieval Augmented Generation',
            'Prompt Engineering',
        ],
        sameAs: [
            'https://www.linkedin.com/in/yann-thobena/',
            'https://github.com/thobenayann',
        ],
    };
}

export function profilePageSchema(locale: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        url: `${SITE_URL}/${locale}/about`,
        mainEntity: { '@id': `${SITE_URL}/#person` },
        inLanguage: locale === 'fr' ? 'fr-FR' : 'en-US',
    };
}

export function softwareAppSchema(params: {
    locale: string;
    slug: string;
    title: string;
    summary: string;
    datePublished: string;
    image?: string;
    applicationUrl?: string;
    keywords?: string[];
}) {
    const { locale, slug, title, summary, datePublished, image, applicationUrl, keywords } = params;
    return {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: title,
        description: summary,
        url: `${SITE_URL}/${locale}/work/${slug}`,
        datePublished,
        image: image ? `${SITE_URL}${image}` : undefined,
        applicationCategory: 'WebApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
        author: { '@id': `${SITE_URL}/#person` },
        creator: { '@id': `${SITE_URL}/#person` },
        keywords: keywords?.join(', '),
        sameAs: applicationUrl,
    };
}

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: item.name,
            item: item.url,
        })),
    };
}
```

- [ ] **Step 3 : Commit**

```bash
git add src/components/seo/ src/lib/seo/
git commit -m "feat(seo): add JsonLd component and schema.org factories (Person, WebSite, SoftwareApp, Breadcrumb)"
```

---

## Task 3 — Injection `WebSite` dans le layout + `Person`/`ProfilePage` sur /about

**Files:** Modify `src/app/[locale]/layout.tsx`, `src/app/[locale]/about/page.tsx`

- [ ] **Step 1 : Layout root**

Ajouter dans `src/app/[locale]/layout.tsx`, à l'intérieur du `<body>` (tout début) :

```tsx
import { JsonLd } from '@/components/seo/json-ld';
import { personSchema, websiteSchema } from '@/lib/seo/schemas';
// …

// dans le JSX :
<JsonLd data={[websiteSchema(locale), personSchema(locale)]} />
```

- [ ] **Step 2 : Page About**

Ajouter dans `src/app/[locale]/about/page.tsx`, tout début du `<main>` :

```tsx
import { JsonLd } from '@/components/seo/json-ld';
import { profilePageSchema, breadcrumbSchema } from '@/lib/seo/schemas';
import { SITE_URL } from '@/config/site';
// …

<JsonLd
    data={[
        profilePageSchema(locale),
        breadcrumbSchema([
            { name: 'Home', url: `${SITE_URL}/${locale}` },
            { name: t('title'), url: `${SITE_URL}/${locale}/about` },
        ]),
    ]}
/>
```

- [ ] **Step 3 : Vérifier**

Run `pnpm build` → aucune erreur. Dev server `pnpm dev` → ouvrir `http://localhost:3000/fr/about` → inspecter source HTML → voir 2 balises `<script type="application/ld+json">` (layout: WebSite + Person ; about: ProfilePage + Breadcrumb).

- [ ] **Step 4 : Commit**

```bash
git add src/app/[locale]/layout.tsx src/app/[locale]/about/page.tsx
git commit -m "feat(seo): inject WebSite/Person JSON-LD globally and ProfilePage/Breadcrumb on about"
```

---

## Task 4 — Route `/work/[slug]` avec MDX rendering + SEO

**Files:** Modify `src/lib/mdx.ts`, create `src/app/[locale]/work/[slug]/page.tsx`, create `src/components/work/project-detail.tsx`

- [ ] **Step 1 : Exposer `getProjectBySlug` dans `src/lib/mdx.ts`**

Ajouter à la fin du fichier :

```ts
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
        const { metadata, content } = await readMDXFile(filePath);
        return { metadata, slug, content };
    } catch {
        return null;
    }
}

export async function getProjectSlugs(locale: string = 'fr'): Promise<string[]> {
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
```

Note : il faut sortir `getMDXFiles` du scope privé — changer `async function getMDXFiles` en `export async function getMDXFiles` ou le laisser privé et dupliquer la ligne `fs.readdir` inline dans `getProjectSlugs`.

- [ ] **Step 2 : Composant `<ProjectDetail />` (server component)**

```tsx
// src/components/work/project-detail.tsx
import { Carousel } from '@/components/ui/carousel';
import { Project } from '@/types/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ExternalLink, Lock, ArrowLeft } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

type Props = { project: Project; locale: string };

export async function ProjectDetail({ project, locale }: Props) {
    const { metadata } = project;
    const t = await getTranslations({ locale, namespace: 'Work' });

    return (
        <article className='container mx-auto px-6 md:px-10 py-16 max-w-4xl space-y-10'>
            <Link
                href={`/${locale}/work`}
                className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors'
            >
                <ArrowLeft className='h-4 w-4' />
                {t('backToProjects')}
            </Link>

            <header className='space-y-4'>
                <h1 className='text-3xl md:text-5xl font-bold tracking-tight'>
                    {metadata.title}
                </h1>
                {metadata.publishedAt && (
                    <time
                        dateTime={metadata.publishedAt}
                        className='text-sm text-muted-foreground'
                    >
                        {new Date(metadata.publishedAt).toLocaleDateString(
                            locale === 'fr' ? 'fr-FR' : 'en-US',
                            { year: 'numeric', month: 'long', day: 'numeric' }
                        )}
                    </time>
                )}
                <p className='text-lg text-muted-foreground leading-relaxed'>
                    {metadata.summary}
                </p>
            </header>

            {metadata.images.length > 0 && (
                <Carousel
                    images={metadata.images.map((image) => ({
                        src: image,
                        alt: metadata.title,
                    }))}
                    priority
                />
            )}

            {metadata.team.length > 0 && (
                <section className='space-y-4'>
                    <h2 className='text-xl font-semibold'>{t('projectDetails.overview')}</h2>
                    <div className='flex flex-wrap gap-3'>
                        {metadata.team.map((member, i) => (
                            <div key={i} className='flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5'>
                                <Avatar className='h-6 w-6'>
                                    <AvatarImage src={member.avatar} alt={member.name} />
                                    <AvatarFallback>{member.name?.[0]}</AvatarFallback>
                                </Avatar>
                                <span className='text-xs'>
                                    <span className='font-semibold'>{member.name}</span>
                                    <span className='text-muted-foreground'> · {member.role}</span>
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {metadata.links && metadata.links.length > 0 && (
                <div className='flex flex-wrap gap-3'>
                    {metadata.links.map((link, i) => {
                        const isPrivate = link.icon === 'lock' || link.url === '#';
                        const Icon = isPrivate ? Lock : ExternalLink;
                        return (
                            <Link
                                key={i}
                                href={isPrivate ? '#' : link.url}
                                target={isPrivate ? undefined : '_blank'}
                                rel={isPrivate ? undefined : 'noopener noreferrer'}
                                className={
                                    'inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm font-medium transition-colors ' +
                                    (isPrivate
                                        ? 'text-muted-foreground cursor-not-allowed opacity-60'
                                        : 'hover:bg-white/5')
                                }
                            >
                                <Icon className='h-4 w-4' />
                                {link.label}
                            </Link>
                        );
                    })}
                </div>
            )}

            <div className='prose prose-invert max-w-none prose-headings:tracking-tight prose-p:text-muted-foreground prose-a:text-primary'>
                <MDXRemote source={project.content} />
            </div>
        </article>
    );
}
```

⚠️ **Note importante** : dans `src/lib/mdx.ts` actuel, `content` est le `compiledSource` (JS compilé). Pour utiliser `MDXRemote` de `next-mdx-remote/rsc`, il faut la **source brute** MDX, pas la compilée. **Action** : modifier `readMDXFile` pour retourner le `content` brut (pas `mdxSource.compiledSource`), et renommer la propriété si besoin. Ou mieux : créer `getProjectBySlug` qui retourne la source brute directement, sans passer par `serialize`.

**Approche choisie** : ne pas toucher à `readMDXFile` (qui sert à la liste). Dans `getProjectBySlug`, lire le fichier et retourner le contenu brut post-frontmatter :

```ts
export async function getProjectBySlug(
    slug: string,
    locale: string = 'fr'
): Promise<Project | null> {
    const projectsDir = path.join(
        process.cwd(),
        'src', 'app', '[locale]', 'work', 'projects', locale
    );
    const filePath = path.join(projectsDir, `${slug}.mdx`);
    try {
        const rawContent = await fs.readFile(filePath, 'utf-8');
        const { data, content } = matter(rawContent);
        const parsed = ProjectMetadataSchema.safeParse(data);
        const metadata: ProjectMetadata = parsed.success ? parsed.data : {
            title: String(data.title ?? ''),
            publishedAt: String(data.publishedAt ?? new Date().toISOString()),
            summary: String(data.summary ?? ''),
            images: Array.isArray(data.images) ? data.images : [],
            tag: data.tag,
            team: Array.isArray(data.team) ? data.team : [],
            link: data.link,
            links: Array.isArray(data.links) ? data.links : [],
        };
        return { metadata, slug, content }; // content = source brute MDX
    } catch {
        return null;
    }
}
```

- [ ] **Step 3 : Page `/work/[slug]`**

```tsx
// src/app/[locale]/work/[slug]/page.tsx
import { ProjectDetail } from '@/components/work/project-detail';
import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbSchema, softwareAppSchema } from '@/lib/seo/schemas';
import { SITE_URL } from '@/config/site';
import { getProjectBySlug, getProjectSlugs } from '@/lib/mdx';
import { routing } from '@/i18n/routing';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
    params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
    const all = await Promise.all(
        routing.locales.map(async (locale) => {
            const slugs = await getProjectSlugs(locale);
            return slugs.map((slug) => ({ locale, slug }));
        })
    );
    return all.flat();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, slug } = await params;
    const project = await getProjectBySlug(slug, locale);
    if (!project) return { title: 'Not found' };
    const { metadata } = project;
    const ogImage = `${SITE_URL}/og?title=${encodeURIComponent(metadata.title)}&subtitle=${encodeURIComponent(metadata.summary.slice(0, 120))}`;
    return {
        title: `${metadata.title} — Yann THOBENA`,
        description: metadata.summary,
        openGraph: {
            title: metadata.title,
            description: metadata.summary,
            url: `${SITE_URL}/${locale}/work/${slug}`,
            type: 'article',
            publishedTime: metadata.publishedAt,
            images: [{ url: ogImage, alt: metadata.title }],
        },
        twitter: {
            card: 'summary_large_image',
            title: metadata.title,
            description: metadata.summary,
            images: [ogImage],
        },
        alternates: {
            canonical: `${SITE_URL}/${locale}/work/${slug}`,
            languages: routing.locales.reduce(
                (acc, l) => ({ ...acc, [l]: `${SITE_URL}/${l}/work/${slug}` }),
                {}
            ),
        },
    };
}

export default async function WorkSlugPage({ params }: Props) {
    const { locale, slug } = await params;
    setRequestLocale(locale);
    const project = await getProjectBySlug(slug, locale);
    if (!project) notFound();
    const tNav = await getTranslations({ locale, namespace: 'Navigation' });
    const tWork = await getTranslations({ locale, namespace: 'Work' });

    return (
        <>
            <JsonLd
                data={[
                    softwareAppSchema({
                        locale,
                        slug,
                        title: project.metadata.title,
                        summary: project.metadata.summary,
                        datePublished: project.metadata.publishedAt,
                        image: project.metadata.images[0],
                        applicationUrl: project.metadata.link,
                    }),
                    breadcrumbSchema([
                        { name: tNav('home'), url: `${SITE_URL}/${locale}` },
                        { name: tWork('title'), url: `${SITE_URL}/${locale}/work` },
                        { name: project.metadata.title, url: `${SITE_URL}/${locale}/work/${slug}` },
                    ]),
                ]}
            />
            <ProjectDetail project={project} locale={locale} />
        </>
    );
}
```

- [ ] **Step 4 : Vérifier la build**

Run `pnpm build 2>&1 | tail -25`.
Expected : `✓ Compiled successfully`, routes `/[locale]/work/[slug]` apparaissent en SSG (●) avec tous les slugs générés (6 en tout).

- [ ] **Step 5 : Commit**

```bash
git add src/lib/mdx.ts src/components/work/ src/app/[locale]/work/[slug]/
git commit -m "feat: add /work/[slug] detail route with MDX rendering and JSON-LD"
```

---

## Task 5 — Enrichir `/work` : `generateMetadata` + hero

**Files:** Modify `src/app/[locale]/work/page.tsx`, `messages/fr.json`, `messages/en.json`

- [ ] **Step 1 : Ajouter clés hero dans messages**

Dans `messages/fr.json`, bloc `Work` :

```json
"Work": {
    "title": "Projets",
    "description": "...",
    "hero": {
        "title": "Mes projets",
        "subtitle": "Une sélection de mes réalisations — applications web, sites et intégrations IA."
    },
    "viewProject": "...",
    ...
}
```

Idem dans `en.json` avec traduction.

- [ ] **Step 2 : Modifier la page**

```tsx
// src/app/[locale]/work/page.tsx
import { Projects } from '@/components/ui/projects';
import { getProjects } from '@/lib/mdx';
import { routing } from '@/i18n/routing';
import { SITE_URL } from '@/config/site';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Work' });
    const ogImage = `${SITE_URL}/og?title=${encodeURIComponent(t('hero.title'))}`;
    return {
        title: t('title'),
        description: t('description'),
        openGraph: {
            title: t('title'),
            description: t('description'),
            url: `${SITE_URL}/${locale}/work`,
            images: [{ url: ogImage }],
        },
        alternates: {
            canonical: `${SITE_URL}/${locale}/work`,
            languages: routing.locales.reduce(
                (acc, l) => ({ ...acc, [l]: `${SITE_URL}/${l}/work` }),
                {}
            ),
        },
    };
}

export default async function WorkPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'Work' });
    const projects = await getProjects(locale);

    return (
        <main className='container mx-auto px-6 md:px-10 py-16 space-y-12'>
            <header className='space-y-4 max-w-2xl'>
                <h1 className='text-4xl md:text-5xl font-bold tracking-tight'>
                    {t('hero.title')}
                </h1>
                <p className='text-lg text-muted-foreground'>
                    {t('hero.subtitle')}
                </p>
            </header>
            <Projects projects={projects} locale={locale} />
        </main>
    );
}
```

- [ ] **Step 3 : Commit**

```bash
git add src/app/[locale]/work/page.tsx messages/
git commit -m "feat(seo): add generateMetadata and hero to /work list page"
```

---

## Task 6 — Fix `manifest.ts` (P1 bonus)

**Files:** Modify `src/app/manifest.ts`

- [ ] **Step 1 : Aligner theme + localisation**

```ts
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Yann Thobena · Développeur & Expert IA',
        short_name: 'Yann Thobena',
        description:
            "Portfolio de Yann Thobena, Concepteur Développeur d'Applications & Expert IA à Toulouse",
        start_url: '/',
        display: 'standalone',
        background_color: '#0a0a0f',
        theme_color: '#0a0a0f',
        icons: [
            // (identique, inchangé)
        ],
        orientation: 'portrait',
        categories: ['development', 'portfolio'],
        prefer_related_applications: false,
    };
}
```

- [ ] **Step 2 : Commit**

```bash
git add src/app/manifest.ts
git commit -m "fix(pwa): align manifest theme_color with dark UI and enrich description"
```

---

## Task 7 — Validation finale

- [ ] **Step 1 : Build complet**

Run `pnpm build 2>&1 | tail -30`. Expected : succès + routes SSG :
- `●  /[locale]` (fr, en)
- `●  /[locale]/about` (fr, en)
- `●  /[locale]/work` (fr, en)
- `●  /[locale]/work/[slug]` × 6 variantes

- [ ] **Step 2 : Lint**

Run `pnpm lint 2>&1 | tail -5`. Expected : 0 erreurs.

- [ ] **Step 3 : Smoke test dev**

Run `pnpm dev` et visiter :
- `http://localhost:3000/og?title=Test` → image PNG
- `http://localhost:3000/fr/work` → liste 3 projets, hero, metadata
- `http://localhost:3000/fr/work/atelier-du-dirigeant-web-platform` → page détail complète, MDX rendu, breadcrumb JSON-LD dans la source
- `http://localhost:3000/fr/about` → inspecter source → `<script type="application/ld+json">` avec ProfilePage

- [ ] **Step 4 : Commit de clôture (si rien d'autre à commit)**

Vérifier `git status` → si rien, fin.

---

## Summary

7 tâches, 10 commits attendus. Quand tout passe :
- ✅ 6 URLs 404 du sitemap corrigées
- ✅ Route `/og` opérationnelle → previews sociales fonctionnelles
- ✅ JSON-LD Person + WebSite injectés globalement
- ✅ JSON-LD SoftwareApplication + Breadcrumb sur chaque projet
- ✅ `/work` avec SEO + hero
- ✅ Manifest aligné dark theme
