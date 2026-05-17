# Blog Hyper-Attractif — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformer la page blog vide en expérience de lecture premium bilingue fr/en avec 3 articles migrés, syntax highlighting Shiki, TOC sticky, progress bar et SEO article-grade.

**Architecture:** `lib/blog.ts` (même pattern que `lib/mdx.ts`) fournit `getPosts`, `getPostBySlug` (avec fallback locale), `getPostSlugs`, `extractHeadings`. Les composants blog sont client-side pour Framer Motion (`ArticleCard`, `ArticleCardFeatured`, `BlogFilters`). MDXRemote/rsc côté serveur avec rehype-pretty-code (Shiki server-side).

**Tech Stack:** Next.js 16 App Router · next-mdx-remote/rsc · rehype-pretty-code + shiki · rehype-slug · @tailwindcss/typography · Framer Motion 12 · next-intl 4.9.1 · gray-matter

---

## File Structure

```
CRÉER :
src/lib/blog.ts
src/lib/reading-time.ts
src/app/[locale]/blog/posts/en/building-mvp-ai-nextjs.mdx
src/app/[locale]/blog/posts/en/from-sales-to-developer.mdx
src/app/[locale]/blog/posts/en/seo-with-nextjs.mdx
src/app/[locale]/blog/posts/fr/building-mvp-ai-nextjs.mdx
src/app/[locale]/blog/posts/fr/from-sales-to-developer.mdx
src/app/[locale]/blog/posts/fr/seo-with-nextjs.mdx
src/components/mdx/code-block.tsx
src/components/mdx/mdx-components.tsx
src/components/blog/article-card.tsx
src/components/blog/article-card-featured.tsx
src/components/blog/blog-filters.tsx
src/components/blog/reading-progress.tsx
src/components/blog/toc.tsx
src/components/blog/author-card.tsx
src/components/blog/related-articles.tsx
src/app/[locale]/blog/[slug]/page.tsx
src/app/blog/feed.xml/route.ts

MODIFIER :
src/app/[locale]/blog/page.tsx
src/lib/seo/schemas.ts
messages/fr.json
messages/en.json
src/app/globals.css
```

---

## Task 1 — Installer les dépendances + Tailwind Typography

**Files:** `src/app/globals.css`

- [ ] **Step 1 : Installer les paquets**

```bash
pnpm add @tailwindcss/typography rehype-pretty-code shiki rehype-slug
```

Expected: packages installed, no peer dep errors.

- [ ] **Step 2 : Activer le plugin Tailwind Typography dans globals.css**

Dans `src/app/globals.css`, ajouter après `@import 'tw-animate-css';` :

```css
@import 'tailwindcss';
@import 'tw-animate-css';
@plugin '@tailwindcss/typography';
```

- [ ] **Step 3 : Ajouter les customisations prose dark dans globals.css**

Ajouter dans le bloc `@layer base` (ou à la fin du fichier si pas de @layer base) :

```css
/* ── Prose dark theme customisations ─────────────────────────── */
.prose {
    --tw-prose-body: oklch(0.85 0.01 0);
    --tw-prose-headings: oklch(0.98 0 0);
    --tw-prose-links: oklch(0.75 0.18 210);
    --tw-prose-code: oklch(0.85 0.05 220);
    --tw-prose-quotes: oklch(0.7 0.01 0);
    --tw-prose-counters: oklch(0.7 0.01 0);
    --tw-prose-bullets: oklch(0.5 0.01 0);
    --tw-prose-hr: oklch(0.25 0.01 0);
    --tw-prose-th-borders: oklch(0.3 0.01 0);
    --tw-prose-td-borders: oklch(0.2 0.01 0);
}

.prose blockquote {
    border-left: 3px solid oklch(0.541 0.281 293);
    padding-left: 1rem;
    font-style: normal;
    color: oklch(0.75 0.01 0);
}

/* Shiki code blocks — retirer le background inline (géré par nous) */
.prose pre {
    background: transparent !important;
    padding: 0 !important;
    margin: 0 !important;
}
```

- [ ] **Step 4 : Vérifier que la build passe**

```bash
pnpm build 2>&1 | tail -5
```

Expected: `✓ Compiled successfully` ou `✓ Generating static pages`.

- [ ] **Step 5 : Commit**

```bash
git add src/app/globals.css package.json pnpm-lock.yaml
git commit -m "feat(blog): install typography + shiki deps, configure prose dark theme"
```

---

## Task 2 — `lib/reading-time.ts` + `lib/blog.ts`

**Files:** Create `src/lib/reading-time.ts`, `src/lib/blog.ts`

- [ ] **Step 1 : Créer `src/lib/reading-time.ts`**

```ts
export function calcReadingTime(content: string): string {
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} min`;
}
```

- [ ] **Step 2 : Créer `src/lib/blog.ts`**

```ts
import fs from 'fs/promises';
import matter from 'gray-matter';
import path from 'path';
import { calcReadingTime } from './reading-time';

// ── Types ─────────────────────────────────────────────────────────

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

// ── Helpers ───────────────────────────────────────────────────────

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

function postsDir(locale: string): string {
    return path.join(
        process.cwd(),
        'src',
        'app',
        '[locale]',
        'blog',
        'posts',
        locale
    );
}

async function getMDXFiles(dir: string): Promise<string[]> {
    try {
        const files = await fs.readdir(dir);
        return files.filter((f) => path.extname(f) === '.mdx');
    } catch {
        return [];
    }
}

async function readPost(filePath: string, slug: string): Promise<Post> {
    const raw = await fs.readFile(filePath, 'utf-8');
    const { data, content } = matter(raw);
    const metadata: PostMetadata = {
        title: String(data.title ?? ''),
        publishedAt: String(data.publishedAt ?? new Date().toISOString()),
        summary: String(data.summary ?? ''),
        image: data.image ? String(data.image) : undefined,
        tag: String(data.tag ?? 'Dev'),
        lang: String(data.lang ?? 'fr'),
    };
    return { metadata, slug, content, readingTime: calcReadingTime(content) };
}

// ── Public API ────────────────────────────────────────────────────

export async function getPostSlugs(locale: string): Promise<string[]> {
    const files = await getMDXFiles(postsDir(locale));
    return files.map((f) => path.basename(f, '.mdx'));
}

export async function getPostBySlug(
    slug: string,
    locale: string
): Promise<Post | null> {
    // Try requested locale first, fallback to other locale
    const locales = [locale, locale === 'fr' ? 'en' : 'fr'];
    for (const l of locales) {
        const filePath = path.join(postsDir(l), `${slug}.mdx`);
        try {
            await fs.access(filePath);
            return await readPost(filePath, slug);
        } catch {
            // file not found, try next locale
        }
    }
    return null;
}

export async function getPosts(locale: string): Promise<Post[]> {
    const slugs = await getPostSlugs(locale);
    const posts = await Promise.all(
        slugs.map(async (slug) => {
            const filePath = path.join(postsDir(locale), `${slug}.mdx`);
            return readPost(filePath, slug);
        })
    );
    return posts.sort(
        (a, b) =>
            new Date(b.metadata.publishedAt).getTime() -
            new Date(a.metadata.publishedAt).getTime()
    );
}
```

- [ ] **Step 3 : Vérifier TypeScript**

```bash
pnpm tsc --noEmit 2>&1 | grep -i "blog\|reading" | head -10
```

Expected: no errors on the new files.

- [ ] **Step 4 : Commit**

```bash
git add src/lib/blog.ts src/lib/reading-time.ts
git commit -m "feat(blog): add blog lib with getPosts, getPostBySlug, extractHeadings"
```

---

## Task 3 — Articles MDX (versions EN)

**Files:** Create `src/app/[locale]/blog/posts/en/*.mdx`

- [ ] **Step 1 : Créer le répertoire**

```bash
mkdir -p "src/app/[locale]/blog/posts/en"
mkdir -p "src/app/[locale]/blog/posts/fr"
```

- [ ] **Step 2 : Créer `src/app/[locale]/blog/posts/en/building-mvp-ai-nextjs.mdx`**

```mdx
---
title: 'Building a Web App MVP in 24 Hours with AI & Next.js'
publishedAt: '2025-03-15'
summary: 'How I leveraged AI and Next.js to build a working MVP demo in just one day for a wine tasting startup.'
tag: 'Dev'
lang: 'en'
---

As a **Web Developer at Ipanova**, I love tackling technical challenges. It all started with a call from an old client who had built a **React app for wine tasting** as part of a wine tasting experience box. Their app was still running, but they were looking into a **new B2B business model** powered by AI.

## The Unexpected Callback

When I first reached out to catch up, the answer was expected: no budget for their current app's evolution. Instead, they had a new idea: a **PWA (Progressive Web App)** aimed at delivering an ultra-immersive experience, leveraging AI **without going through the App Stores**.

Their **technical co-founder was already using Next.js and AI tools like Cursor** — my preferred stack. The call ended with the usual "We'll handle the MVP internally for now." No surprise. Still, I was glad to reconnect.

## A Weekend Later… Change of Plans!

Monday morning, I get a call back. "Hey, let's set up a **scoping workshop** and get a quote for the MVP!" The door was open.

### The Challenge: Build a Working MVP Demo in 24 Hours

From past experience as both a **developer and former sales rep**, I knew something crucial: if the client can **see and interact with a real prototype**, they will be much more likely to **commit to the project**.

Why not **challenge myself to build a working MVP demo in just one day**? Not wireframes — a real **clickable, testable version**. Two purposes:

1. **Give the client a real feel of the application.**
2. **Ensure we gather solid requirements in the process.**

## The Tech Stack: AI-Powered Development

My secret weapons: **Cursor, Next.js, ShadcnUI, and Vercel AI SDK**.

### 1. Defining Clear Rules & Context

Cursor allows developers to **define rules in `.mdc` files** so the AI understands the syntax, frameworks, and conventions in use.

### 2. Structured AI Prompts for Each Feature

Instead of just "asking AI to code", I **carefully prepared prompts** for every feature providing feature details, user interactions, and UI behaviour. Each prompt acted as a blueprint for efficient **AI-assisted pair programming**.

### 3. Rapid AI-Powered Development

Armed with **ChatGPT and Cursor**, I iterated fast. The AI handled repetitive coding while I **fine-tuned logic, integrations, and UI tweaks**. The highlight: **integrating an OpenAI-powered chat feature** with Next.js and Vercel AI SDK — surprisingly simple, with outstanding results.

## The Final Touch

After a day of coding I fixed bugs, polished interactions, and prepared a structured demo walkthrough. The biggest takeaway wasn't just **how fast AI can boost development**, but how **critical well-defined specs and user projection** are for any project.

## Lessons Learned

1. **AI-assisted development is a game changer** if you know how to guide it.
2. **A structured approach (rules, prompts, context) leads to significantly better output.**
3. **Clients love seeing tangible results** — not just pitch decks.
4. **Having a technical conversation with someone using the same stack is rare and priceless.**

Taking risks and pushing for innovative approaches is what makes this job **so exciting**. 🚀
```

- [ ] **Step 3 : Créer `src/app/[locale]/blog/posts/en/from-sales-to-developer.mdx`**

```mdx
---
title: 'From Sales to Developer: My Career Change Journey'
publishedAt: '2025-03-01'
image: '/images/gallery/img-14.jpg'
summary: "At 30, I left my job as a store manager to embark on a career change journey into web development. Here's my story."
tag: 'Career'
lang: 'en'
---

At 30, I made a decision that would change my life: leaving my job as a store manager to become a web developer. Today I want to share this adventure — its challenges and successes.

## Who Am I?

I'm Yann THOBENA, 34 years old. At 30 I left my position as store manager at a small welding equipment company in Toulouse. I had always been determined, but it took a long time to accept I had chosen the wrong path. It took even more courage to leave the stability of a job and go back to school.

## Finding My New Path

I wanted a job that excited me every morning. I had always spent a lot of time on my PC, gaming, streaming — so why not turn this into a career?

That's when I discovered coding. I took a few HTML and CSS courses online and it felt like a revelation. Without any state financial support or severance package, I quit my job to start fresh.

```javascript
const myCareerChange = () => {
  const passion = "web development";
  const courage = true;

  if (courage && passion) {
    return "New professional life";
  }
};
```

## Training: A Risky but Rewarding Bet

I found O'Clock, an online coding school, passed their tests (including a motivation video — not easy!), and got accepted. For six months I followed an intensive bootcamp right in the middle of COVID and lockdown. I fell in love with coding and extended my training with 16 months of apprenticeship to earn my Software Developer degree.

## Breaking Into the Industry

The hardest part? Finding a company. But in the end, the company found me — Marie from Ipanova reached out and I joined their team specialising in SAP ERP, Data, and custom web applications. My biggest challenge was imposter syndrome, even surrounded by supportive colleagues.

## My Growth

Today I've built end-to-end applications and explored DevOps. I've mastered:

- UI/UX design with Figma 🎨
- Database architecture 🗄️
- Tech stack selection 🔍
- SEO optimisation 📈
- CI/CD deployment with Docker 🐳

## Combining Development and Sales Background

My sales background deepened my knowledge in web marketing and SEO — skills I now apply at Ipanova. If you're thinking about switching careers, feel free to reach out. I love helping others take the leap. 🚀
```

- [ ] **Step 4 : Créer `src/app/[locale]/blog/posts/en/seo-with-nextjs.mdx`**

```mdx
---
title: 'SEO with Next.js: How to Optimize Your Web Applications?'
publishedAt: '2025-03-10'
summary: 'Learn how to improve the SEO of your Next.js applications with advanced optimisation techniques.'
tag: 'SEO'
lang: 'en'
---

As a web developer at **Ipanova**, my daily work involves building custom web applications, integrating ERP systems like SAP Business One, and working on Business Intelligence solutions. One of my ongoing challenges is optimising **Ipanova's** website for better search engine ranking.

Even in B2B, SEO remains essential. Let's dive into how to do it efficiently with Next.js.

## SEO: A Must for B2B Visibility

SEO (Search Engine Optimisation) helps improve your website's visibility in search results, making it easier for potential customers to find you — without paid ads.

> **The best place to hide a dead body? Page 2 of Google search results!** 😂

In B2B, buying cycles are longer, decisions involve multiple stakeholders, and financial stakes are higher. A solid SEO strategy reassures potential clients of your expertise.

## Next.js: Your SEO Powerhouse

### Clean URLs with File-Based Routing

Next.js uses file-based routing to structure URLs effectively:

```jsx
// app/services/[service]/page.js
export default function ServicePage({ params }) {
    return <h1>Our expertise in {params.service}</h1>;
}
```

This generates clean URLs: **yoursite.com/services/erp-sap-integration**

### Dynamic Metadata for Maximum Impact

```jsx
export const metadata = {
    title: 'Ipanova - SAP Business One & Web Development Experts',
    description: 'We build custom web applications and integrate SAP Business One.',
    openGraph: {
        title: 'Ipanova - SAP Business One & Web Development Experts',
        images: ['/images/og-image-ipanova.jpg'],
    },
};
```

### Rendering Strategies: SSR, SSG, and ISR

- **SSR** for highly dynamic content.
- **SSG** for pages with fixed content.
- **ISR** for semi-dynamic content updated periodically.

### Auto-Generate Your Sitemap

A structured sitemap helps search engines index your site properly. Next.js supports sitemap generation via the `app/sitemap.ts` convention.

### Robots.txt: Guide Search Engine Crawlers

```txt
User-agent: *
Allow: /
Disallow: /admin
Sitemap: https://yoursite.com/sitemap.xml
```

## Must-Have SEO Tools

- [**SERPmantics**](https://www.serpmantics.com/) — semantic content analysis
- [**Google Search Console**](https://search.google.com/search-console) — indexing and performance tracking
- [**Ubersuggest**](https://app.neilpatel.com/en/ubersuggest/) — keyword research

Do you want to optimise your website's SEO or build a custom Next.js application? [Contact me](mailto:thobena.yann@gmail.com) — let's discuss your project!
```

- [ ] **Step 5 : Commit**

```bash
git add "src/app/[locale]/blog/posts/en/"
git commit -m "feat(blog): add 3 EN blog articles (migrated + cleaned)"
```

---

## Task 4 — Articles MDX (versions FR)

**Files:** Create `src/app/[locale]/blog/posts/fr/*.mdx`

- [ ] **Step 1 : Créer `src/app/[locale]/blog/posts/fr/building-mvp-ai-nextjs.mdx`**

```mdx
---
title: "Construire un MVP web en 24h avec l'IA et Next.js"
publishedAt: '2025-03-15'
summary: "Comment j'ai exploité l'IA et Next.js pour construire un MVP fonctionnel en une seule journée pour une startup de dégustation de vin."
tag: 'Dev'
lang: 'fr'
---

En tant que **développeur web chez Ipanova**, j'adore relever des défis techniques. Tout a commencé par un appel d'un ancien client qui avait construit une **application React pour la dégustation de vin**. Son app fonctionnait toujours, mais il cherchait un **nouveau modèle B2B** piloté par l'IA.

## Le rappel inattendu

Quand je l'ai contacté pour prendre des nouvelles, la réponse était prévisible : pas de budget pour faire évoluer son application. À la place, il avait une nouvelle idée : une **PWA** visant une expérience ultra-immersive avec l'IA, **sans passer par les App Stores**.

Son **co-fondateur technique utilisait déjà Next.js et Cursor** — ma stack préférée. L'appel s'est terminé par le classique "On gère le MVP en interne pour l'instant."

## Un weekend plus tard… Changement de plan !

Lundi matin, rappel surprise. "Hey, organisons un **atelier de cadrage** et faites-nous un devis pour le MVP !" La porte était ouverte.

### Le défi : construire un MVP fonctionnel en 24h

D'expérience passée comme **développeur et ancien commercial**, je savais : si le client peut **voir et interagir avec un vrai prototype**, il s'engagera bien plus facilement.

Pourquoi ne pas me **challenger à construire un MVP fonctionnel en une journée** ? Pas des wireframes — une vraie **version cliquable et testable**. Deux objectifs :

1. **Donner au client un vrai ressenti de l'application.**
2. **Recueillir des exigences solides dans le processus.**

## La stack technique : développement assisté par IA

Mes armes secrètes : **Cursor, Next.js, ShadcnUI et Vercel AI SDK**.

### 1. Définir des règles et du contexte clairs

Cursor permet de **définir des règles dans des fichiers `.mdc`** pour que l'IA comprenne la syntaxe, les frameworks et les conventions utilisées.

### 2. Des prompts structurés pour chaque fonctionnalité

Au lieu de simplement "demander à l'IA de coder", j'ai **soigneusement préparé des prompts** pour chaque fonctionnalité : détails, interactions utilisateur, comportement UI. Chaque prompt fonctionnait comme un blueprint pour un **pair-programming IA très efficace**.

### 3. Développement rapide

Armé de **ChatGPT et Cursor**, j'ai enchaîné les itérations. L'IA gérait le code répétitif pendant que je **peaufinais la logique et les ajustements UI**. Point fort : **intégrer un chat OpenAI** avec Next.js et Vercel AI SDK — étonnamment simple, avec des résultats bluffants.

## La touche finale

Après une journée de code : correction des bugs, polish des interactions, préparation d'une démo structurée. La vraie leçon : pas juste **la rapidité de l'IA**, mais l'importance des **specs bien définies et de la projection utilisateur**.

## Leçons apprises

1. **Le développement assisté par IA change la donne** si vous savez le guider.
2. **Une approche structurée (règles, prompts, contexte) améliore significativement l'output.**
3. **Les clients adorent les résultats tangibles** — pas juste des slides.
4. **Partager la même stack qu'un client, c'est rare et précieux.**

Prendre des risques et pousser des approches innovantes : c'est ce qui rend ce métier **si passionnant**. 🚀
```

- [ ] **Step 2 : Créer `src/app/[locale]/blog/posts/fr/from-sales-to-developer.mdx`**

```mdx
---
title: 'Du commerce au développement : mon parcours de reconversion'
publishedAt: '2025-03-01'
image: '/images/gallery/img-14.jpg'
summary: "À 30 ans, j'ai quitté mon poste de gérant pour me reconvertir dans le développement web. Voici mon histoire."
tag: 'Carrière'
lang: 'fr'
---

À 30 ans, j'ai pris une décision qui allait changer ma vie : quitter mon poste de gérant pour devenir développeur web. Aujourd'hui, je veux partager cette aventure — ses défis et ses réussites.

## Qui suis-je ?

Je m'appelle Yann THOBENA, j'ai 34 ans. À 30 ans, j'ai quitté mon poste de gérant dans une petite entreprise de matériel de soudure à Toulouse. J'avais toujours été déterminé, mais il m'a fallu du temps pour accepter avoir choisi la mauvaise voie. Il m'a fallu encore plus de courage pour quitter la stabilité d'un emploi et retourner sur les bancs de l'école.

## Trouver ma nouvelle voie

Je voulais un métier qui me donne envie de me lever chaque matin. J'ai toujours passé beaucoup de temps sur mon PC — gaming, streaming… Alors pourquoi ne pas en faire un métier ?

C'est là que j'ai découvert le code. Quelques cours HTML et CSS en ligne, et ce fut une révélation. Sans aucun soutien financier de l'État, j'ai quitté mon poste pour recommencer à zéro.

```javascript
const maReconversion = () => {
  const passion = "développement web";
  const courage = true;

  if (courage && passion) {
    return "Nouvelle vie professionnelle";
  }
};
```

## La formation : un pari risqué mais gagnant

J'ai trouvé O'Clock, une école de code en ligne. Tests passés, vidéo de motivation enregistrée, et j'ai été accepté. Pendant six mois, bootcamp intensif en plein COVID et confinement — j'avais la meilleure excuse pour rester chez moi ! Je suis tombé amoureux du code au point d'étendre ma formation par 16 mois d'alternance pour obtenir mon diplôme de développeur logiciel.

## Décrocher son premier poste

La partie la plus difficile ? Trouver une entreprise. Au final, c'est l'entreprise qui m'a trouvé — Marie d'Ipanova m'a contacté et j'ai rejoint leur équipe spécialisée en SAP ERP, Data et applications web sur mesure. Mon plus grand défi : le syndrome de l'imposteur, même entouré de collègues bienveillants.

## Ma progression

Aujourd'hui j'ai construit des applications de bout en bout et exploré le DevOps. J'ai maîtrisé :

- Le design UI/UX avec Figma 🎨
- L'architecture de bases de données 🗄️
- La sélection de stack technique 🔍
- L'optimisation SEO 📈
- Le déploiement CI/CD avec Docker 🐳

## Combiner développement et background commercial

Mon expérience commerciale a approfondi mes connaissances en webmarketing et SEO — des compétences que j'applique aujourd'hui chez Ipanova. Si vous envisagez une reconversion, n'hésitez pas à me contacter. J'aime aider les autres à franchir le pas. 🚀
```

- [ ] **Step 3 : Créer `src/app/[locale]/blog/posts/fr/seo-with-nextjs.mdx`**

```mdx
---
title: 'SEO avec Next.js : Comment optimiser vos applications web ?'
publishedAt: '2025-03-10'
summary: "Apprenez à améliorer le référencement de vos applications Next.js avec des techniques d'optimisation avancées."
tag: 'SEO'
lang: 'fr'
---

En tant que développeur web chez **Ipanova**, mon quotidien consiste à construire des applications web personnalisées et à intégrer des ERP comme SAP Business One. L'un de mes défis actuels est l'optimisation du site d'**Ipanova** pour améliorer son référencement.

Même en B2B, le SEO reste essentiel. Voyons comment le faire efficacement avec Next.js.

## Le SEO : incontournable pour la visibilité B2B

Le SEO aide à améliorer la visibilité de votre site dans les résultats Google, sans publicité payante.

> **Le meilleur endroit pour cacher un cadavre ? La page 2 des résultats Google !** 😂

En B2B, les cycles d'achat sont plus longs et les enjeux financiers plus élevés. Une stratégie SEO solide rassure vos clients potentiels sur votre expertise.

## Next.js : votre arme SEO

### Des URLs propres avec le routage basé sur les fichiers

```jsx
// app/services/[service]/page.js
export default function ServicePage({ params }) {
    return <h1>Notre expertise en {params.service}</h1>;
}
```

Ce qui génère : **votresite.com/services/integration-erp-sap**

### Des métadonnées dynamiques pour un impact maximum

```jsx
export const metadata = {
    title: 'Ipanova - Experts SAP Business One & Développement Web',
    description: 'Applications web sur mesure et intégration SAP Business One.',
    openGraph: {
        title: 'Ipanova - Experts SAP Business One & Développement Web',
        images: ['/images/og-image-ipanova.jpg'],
    },
};
```

### Stratégies de rendu : SSR, SSG et ISR

- **SSR** pour le contenu très dynamique.
- **SSG** pour les pages au contenu fixe.
- **ISR** pour le contenu semi-dynamique mis à jour périodiquement.

### Générer votre sitemap automatiquement

Next.js supporte la génération de sitemap via la convention `app/sitemap.ts`.

### Robots.txt : guidez les crawlers

```txt
User-agent: *
Allow: /
Disallow: /admin
Sitemap: https://votresite.com/sitemap.xml
```

## Outils SEO indispensables

- [**SERPmantics**](https://www.serpmantics.com/) — analyse sémantique de contenu
- [**Google Search Console**](https://search.google.com/search-console) — suivi indexation et performances
- [**Ubersuggest**](https://app.neilpatel.com/en/ubersuggest/) — recherche de mots-clés

Vous souhaitez optimiser votre SEO ou construire une application Next.js ? [Contactez-moi](mailto:thobena.yann@gmail.com) — discutons de votre projet !
```

- [ ] **Step 4 : Commit**

```bash
git add "src/app/[locale]/blog/posts/fr/"
git commit -m "feat(blog): add 3 FR blog articles (translated from EN)"
```

---

## Task 5 — `articleSchema()` dans `src/lib/seo/schemas.ts`

**Files:** Modify `src/lib/seo/schemas.ts`

- [ ] **Step 1 : Ajouter la factory à la fin de `src/lib/seo/schemas.ts`**

```ts
export function articleSchema(params: {
    locale: string;
    slug: string;
    title: string;
    summary: string;
    datePublished: string;
    image?: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: params.title,
        description: params.summary,
        url: `${SITE_URL}/${params.locale}/blog/${params.slug}`,
        datePublished: params.datePublished,
        image: params.image
            ? `${SITE_URL}${params.image}`
            : `${SITE_URL}/og?title=${encodeURIComponent(params.title)}`,
        inLanguage: params.locale === 'fr' ? 'fr-FR' : 'en-US',
        author: { '@id': `${SITE_URL}/#person` },
        publisher: { '@id': `${SITE_URL}/#person` },
    };
}
```

- [ ] **Step 2 : Commit**

```bash
git add src/lib/seo/schemas.ts
git commit -m "feat(seo): add articleSchema factory for blog posts"
```

---

## Task 6 — Clés i18n (fr.json + en.json)

**Files:** Modify `messages/fr.json`, `messages/en.json`

- [ ] **Step 1 : Ajouter le bloc `Blog` dans `messages/fr.json`**

Trouver le bloc `"Work": {` et ajouter AVANT lui (ou à la fin du JSON avant le `}` final) :

```json
    "Blog": {
        "title": "Blog",
        "description": "Articles sur le développement web, l'IA et les retours d'expérience.",
        "hero": {
            "title": "Mes articles",
            "subtitle": "Retours d'expérience, techniques et cas pratiques — 1 article par mois.",
            "count": "{count, plural, =1 {# article} other {# articles}}"
        },
        "filters": {
            "all": "Tous",
            "ia": "IA & LLM",
            "dev": "Dev",
            "seo": "SEO",
            "career": "Carrière"
        },
        "article": {
            "backToBlog": "Retour au blog",
            "readingTime": "{time} de lecture",
            "publishedAt": "Publié le {date}",
            "relatedTitle": "Articles liés"
        },
        "authorCard": {
            "cta": "Ce cas vous parle ? Discutons de votre projet.",
            "contact": "Me contacter",
            "projects": "Voir mes projets"
        }
    },
```

- [ ] **Step 2 : Ajouter le bloc `Blog` dans `messages/en.json`**

```json
    "Blog": {
        "title": "Blog",
        "description": "Articles on web development, AI and hands-on experience.",
        "hero": {
            "title": "Articles",
            "subtitle": "Experience reports, techniques and real-world cases — 1 article per month.",
            "count": "{count, plural, =1 {# article} other {# articles}}"
        },
        "filters": {
            "all": "All",
            "ia": "AI & LLM",
            "dev": "Dev",
            "seo": "SEO",
            "career": "Career"
        },
        "article": {
            "backToBlog": "Back to blog",
            "readingTime": "{time} read",
            "publishedAt": "Published {date}",
            "relatedTitle": "Related articles"
        },
        "authorCard": {
            "cta": "Does this case resonate with you? Let's talk about your project.",
            "contact": "Contact me",
            "projects": "See my projects"
        }
    },
```

- [ ] **Step 3 : Commit**

```bash
git add messages/fr.json messages/en.json
git commit -m "feat(blog): add Blog i18n keys (fr + en)"
```

---

## Task 7 — Composants MDX (`code-block.tsx` + `mdx-components.tsx`)

**Files:** Create `src/components/mdx/code-block.tsx`, `src/components/mdx/mdx-components.tsx`

- [ ] **Step 1 : Créer `src/components/mdx/code-block.tsx`**

```tsx
'use client';

import { Check, Copy } from 'lucide-react';
import { useRef, useState } from 'react';

type CodeBlockWrapperProps = React.ComponentPropsWithoutRef<'pre'> & {
    'data-language'?: string;
};

export function CodeBlockWrapper({
    children,
    'data-language': language,
    ...props
}: CodeBlockWrapperProps) {
    const preRef = useRef<HTMLPreElement>(null);
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        const code =
            preRef.current?.querySelector('code')?.innerText ?? '';
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // clipboard not available
        }
    };

    return (
        <div className='relative group my-6 rounded-xl overflow-hidden border border-white/10'>
            {/* Header bar */}
            <div className='flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-white/10'>
                <span className='text-xs text-white/40 font-mono'>
                    {language ?? 'code'}
                </span>
                <button
                    onClick={handleCopy}
                    aria-label='Copy code'
                    className='flex items-center gap-1.5 text-xs text-white/40 hover:text-white/80 transition-colors'
                >
                    {copied ? (
                        <>
                            <Check className='h-3.5 w-3.5 text-green-400' />
                            <span className='text-green-400'>Copié</span>
                        </>
                    ) : (
                        <>
                            <Copy className='h-3.5 w-3.5' />
                            <span>Copier</span>
                        </>
                    )}
                </button>
            </div>
            {/* Code */}
            <pre
                ref={preRef}
                {...props}
                className='overflow-x-auto p-4 text-sm leading-relaxed bg-[#0d1117] m-0 rounded-none'
            >
                {children}
            </pre>
        </div>
    );
}
```

- [ ] **Step 2 : Créer `src/components/mdx/mdx-components.tsx`**

```tsx
import { CodeBlockWrapper } from './code-block';
import Image from 'next/image';
import type { MDXComponents } from 'mdx/types';

export function getMDXComponents(): MDXComponents {
    return {
        pre: (props) => <CodeBlockWrapper {...(props as React.ComponentPropsWithoutRef<'pre'>)} />,
        img: ({ src, alt, ...props }) => (
            <span className='block my-6 rounded-xl overflow-hidden'>
                <Image
                    src={src ?? ''}
                    alt={alt ?? ''}
                    width={800}
                    height={450}
                    className='w-full h-auto rounded-xl'
                    {...(props as object)}
                />
            </span>
        ),
    };
}
```

- [ ] **Step 3 : Commit**

```bash
git add src/components/mdx/
git commit -m "feat(blog): add MDX components (CodeBlock with copy button, img)"
```

---

## Task 8 — Composants blog server (`article-card.tsx`, `article-card-featured.tsx`, `author-card.tsx`, `related-articles.tsx`)

**Files:** Create `src/components/blog/article-card.tsx`, `article-card-featured.tsx`, `author-card.tsx`, `related-articles.tsx`

- [ ] **Step 1 : Créer `src/components/blog/article-card.tsx`**

```tsx
'use client';

import { Post, getTagConfig } from '@/lib/blog';
import { motion } from 'framer-motion';
import Link from 'next/link';

type Props = { post: Post; locale: string };

export function ArticleCard({ post, locale }: Props) {
    const { metadata, slug, readingTime } = post;
    const tag = getTagConfig(metadata.tag);

    const date = new Date(metadata.publishedAt).toLocaleDateString(
        locale === 'fr' ? 'fr-FR' : 'en-US',
        { year: 'numeric', month: 'short', day: 'numeric' }
    );

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
            <Link
                href={`/${locale}/blog/${slug}`}
                className={`block rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden hover:border-white/20 transition-colors h-full`}
            >
                {/* Bande colorée tag */}
                <div
                    className={`h-[4px] w-full bg-gradient-to-r ${tag.gradient}`}
                />
                <div className='p-5 space-y-3'>
                    {/* Meta */}
                    <div className='flex items-center gap-2 flex-wrap'>
                        <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${tag.badge}`}
                        >
                            {metadata.tag}
                        </span>
                        <span className='text-xs text-muted-foreground'>
                            {readingTime}
                        </span>
                        <span className='text-xs text-muted-foreground'>
                            · {date}
                        </span>
                    </div>
                    {/* Titre */}
                    <h3 className='font-semibold text-foreground leading-snug'>
                        {metadata.title}
                    </h3>
                    {/* Excerpt */}
                    <p className='text-sm text-muted-foreground line-clamp-2 leading-relaxed'>
                        {metadata.summary}
                    </p>
                </div>
            </Link>
        </motion.div>
    );
}
```

- [ ] **Step 2 : Créer `src/components/blog/article-card-featured.tsx`**

```tsx
'use client';

import { Post, getTagConfig } from '@/lib/blog';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type Props = { post: Post; locale: string; readLabel: string };

export function ArticleCardFeatured({ post, locale, readLabel }: Props) {
    const { metadata, slug, readingTime } = post;
    const tag = getTagConfig(metadata.tag);

    const date = new Date(metadata.publishedAt).toLocaleDateString(
        locale === 'fr' ? 'fr-FR' : 'en-US',
        { year: 'numeric', month: 'long', day: 'numeric' }
    );

    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
            <Link
                href={`/${locale}/blog/${slug}`}
                className='block rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden hover:border-white/20 transition-colors'
            >
                {/* Cover image ou gradient */}
                <div className='relative w-full aspect-[16/9] overflow-hidden'>
                    {metadata.image ? (
                        <Image
                            src={metadata.image}
                            alt={metadata.title}
                            fill
                            className='object-cover'
                            priority
                        />
                    ) : (
                        <div
                            className={`w-full h-full bg-gradient-to-br ${tag.gradient} opacity-80`}
                        />
                    )}
                    {/* Overlay gradient pour lisibilité */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />
                </div>

                {/* Content */}
                <div className='p-6 md:p-8 space-y-4'>
                    {/* Meta */}
                    <div className='flex items-center gap-3 flex-wrap'>
                        <span
                            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${tag.badge}`}
                        >
                            {metadata.tag}
                        </span>
                        <span className='text-sm text-muted-foreground'>
                            {readingTime}
                        </span>
                        <span className='text-sm text-muted-foreground'>
                            · {date}
                        </span>
                    </div>

                    {/* Titre */}
                    <h2 className='text-2xl md:text-4xl font-bold tracking-tight leading-tight'>
                        {metadata.title}
                    </h2>

                    {/* Excerpt */}
                    <p className='text-muted-foreground leading-relaxed max-w-2xl line-clamp-3'>
                        {metadata.summary}
                    </p>

                    {/* CTA */}
                    <div className='flex items-center gap-2 text-sm font-medium text-foreground/80 group-hover:text-foreground'>
                        <span>{readLabel}</span>
                        <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
```

- [ ] **Step 3 : Créer `src/components/blog/author-card.tsx`**

```tsx
import { person } from '@/config/content';
import { Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
    locale: string;
    cta: string;
    contactLabel: string;
    projectsLabel: string;
    tag?: string;
};

export function AuthorCard({
    locale,
    cta,
    contactLabel,
    projectsLabel,
}: Props) {
    return (
        <div className='rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 md:p-8 space-y-4'>
            <div className='flex items-center gap-4'>
                <Image
                    src={person.avatar}
                    alt={person.name}
                    width={56}
                    height={56}
                    className='rounded-full border border-white/20'
                />
                <div>
                    <p className='font-semibold text-foreground'>
                        {person.name}
                    </p>
                    <p className='text-sm text-muted-foreground'>
                        {person.role}
                    </p>
                </div>
            </div>

            <p className='text-muted-foreground leading-relaxed'>{cta}</p>

            <div className='flex flex-wrap gap-3'>
                <Link
                    href='mailto:thobena.yann@gmail.com'
                    className='inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors'
                >
                    <Mail className='h-4 w-4' />
                    {contactLabel}
                </Link>
                <Link
                    href={`/${locale}/work`}
                    className='inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm font-medium hover:bg-white/5 transition-colors'
                >
                    {projectsLabel}
                </Link>
            </div>
        </div>
    );
}
```

- [ ] **Step 4 : Créer `src/components/blog/related-articles.tsx`**

```tsx
import { ArticleCard } from './article-card';
import { Post } from '@/lib/blog';

type Props = {
    posts: Post[];
    locale: string;
    title: string;
};

export function RelatedArticles({ posts, locale, title }: Props) {
    if (posts.length === 0) return null;
    return (
        <section className='space-y-6'>
            <h2 className='text-xl font-semibold'>{title}</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {posts.map((post) => (
                    <ArticleCard key={post.slug} post={post} locale={locale} />
                ))}
            </div>
        </section>
    );
}
```

- [ ] **Step 5 : Commit**

```bash
git add src/components/blog/article-card.tsx src/components/blog/article-card-featured.tsx src/components/blog/author-card.tsx src/components/blog/related-articles.tsx
git commit -m "feat(blog): add blog card components and author card"
```

---

## Task 9 — Composants blog client (`blog-filters.tsx`, `reading-progress.tsx`, `toc.tsx`)

**Files:** Create `src/components/blog/blog-filters.tsx`, `reading-progress.tsx`, `toc.tsx`

- [ ] **Step 1 : Créer `src/components/blog/reading-progress.tsx`**

```tsx
'use client';

import { motion, useScroll } from 'framer-motion';

type Props = { color: string };

export function ReadingProgress({ color }: Props) {
    const { scrollYProgress } = useScroll();
    return (
        <motion.div
            className='fixed top-0 left-0 right-0 z-50 h-[3px] origin-left'
            style={{ scaleX: scrollYProgress, backgroundColor: color }}
        />
    );
}
```

- [ ] **Step 2 : Créer `src/components/blog/toc.tsx`**

```tsx
'use client';

import { Heading } from '@/lib/blog';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

type Props = { headings: Heading[] };

function useActiveHeading(ids: string[]): string {
    const [activeId, setActiveId] = useState('');

    useEffect(() => {
        if (ids.length === 0) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-20% 0% -70% 0%' }
        );
        ids.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, [ids]);

    return activeId;
}

export function Toc({ headings }: Props) {
    const ids = headings.map((h) => h.id);
    const activeId = useActiveHeading(ids);

    if (headings.length === 0) return null;

    return (
        <nav className='hidden lg:block sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto space-y-1 text-sm'>
            <p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3'>
                Table des matières
            </p>
            {headings.map((h) => (
                <a
                    key={h.id}
                    href={`#${h.id}`}
                    onClick={(e) => {
                        e.preventDefault();
                        document
                            .getElementById(h.id)
                            ?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={cn(
                        'block py-1 transition-colors leading-snug',
                        h.level === 3 && 'pl-3',
                        activeId === h.id
                            ? 'text-foreground font-medium'
                            : 'text-muted-foreground hover:text-foreground'
                    )}
                >
                    {h.text}
                </a>
            ))}
        </nav>
    );
}
```

- [ ] **Step 3 : Créer `src/components/blog/blog-filters.tsx`**

```tsx
'use client';

import { ArticleCard } from './article-card';
import { ArticleCardFeatured } from './article-card-featured';
import { Post } from '@/lib/blog';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

type Props = {
    posts: Post[];
    locale: string;
    tags: string[];
    allLabel: string;
    readLabel: string;
};

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
};
const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function BlogFilters({
    posts,
    locale,
    tags,
    allLabel,
    readLabel,
}: Props) {
    const [activeTag, setActiveTag] = useState<string | null>(null);

    const filtered = activeTag
        ? posts.filter((p) => p.metadata.tag === activeTag)
        : posts;

    const featured = filtered[0] ?? null;
    const rest = filtered.slice(1);

    return (
        <div className='space-y-10'>
            {/* Chips filtres sticky */}
            <div className='sticky top-16 z-30 -mx-6 px-6 py-3 bg-background/80 backdrop-blur-sm border-b border-white/5 flex gap-2 overflow-x-auto scrollbar-none'>
                <button
                    onClick={() => setActiveTag(null)}
                    className={`relative flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                        activeTag === null
                            ? 'text-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    {activeTag === null && (
                        <motion.span
                            layoutId='filter-pill'
                            className='absolute inset-0 rounded-full bg-white/10'
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                    )}
                    <span className='relative'>{allLabel}</span>
                </button>
                {tags.map((tag) => (
                    <button
                        key={tag}
                        onClick={() =>
                            setActiveTag(activeTag === tag ? null : tag)
                        }
                        className={`relative flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                            activeTag === tag
                                ? 'text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        {activeTag === tag && (
                            <motion.span
                                layoutId='filter-pill'
                                className='absolute inset-0 rounded-full bg-white/10'
                                transition={{
                                    type: 'spring',
                                    stiffness: 400,
                                    damping: 30,
                                }}
                            />
                        )}
                        <span className='relative'>{tag}</span>
                    </button>
                ))}
            </div>

            {/* Featured */}
            <AnimatePresence mode='wait'>
                {featured && (
                    <motion.div
                        key={featured.slug}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ArticleCardFeatured
                            post={featured}
                            locale={locale}
                            readLabel={readLabel}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Grille compacte */}
            {rest.length > 0 && (
                <motion.div
                    variants={container}
                    initial='hidden'
                    animate='show'
                    className='grid grid-cols-1 sm:grid-cols-2 gap-4'
                >
                    <AnimatePresence>
                        {rest.map((post) => (
                            <motion.div key={post.slug} variants={item} layout>
                                <ArticleCard
                                    post={post}
                                    locale={locale}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {filtered.length === 0 && (
                <p className='text-center text-muted-foreground py-12'>
                    Aucun article pour ce filtre.
                </p>
            )}
        </div>
    );
}
```

- [ ] **Step 4 : Commit**

```bash
git add src/components/blog/blog-filters.tsx src/components/blog/reading-progress.tsx src/components/blog/toc.tsx
git commit -m "feat(blog): add client components (BlogFilters, ReadingProgress, Toc)"
```

---

## Task 10 — Page liste `/[locale]/blog`

**Files:** Modify `src/app/[locale]/blog/page.tsx`

- [ ] **Step 1 : Réécrire `src/app/[locale]/blog/page.tsx`**

```tsx
import { BlogFilters } from '@/components/blog/blog-filters';
import { SITE_URL } from '@/config/site';
import { routing } from '@/i18n/routing';
import { getPosts } from '@/lib/blog';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Blog' });
    const ogImage = `${SITE_URL}/og?title=${encodeURIComponent(t('hero.title'))}&subtitle=${encodeURIComponent(t('hero.subtitle'))}`;
    return {
        title: t('title'),
        description: t('description'),
        openGraph: {
            title: t('title'),
            description: t('description'),
            url: `${SITE_URL}/${locale}/blog`,
            images: [{ url: ogImage }],
        },
        alternates: {
            canonical: `${SITE_URL}/${locale}/blog`,
            languages: routing.locales.reduce(
                (acc, l) => ({ ...acc, [l]: `${SITE_URL}/${l}/blog` }),
                {}
            ),
            types: { 'application/rss+xml': `${SITE_URL}/blog/feed.xml` },
        },
    };
}

export default async function BlogPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'Blog' });
    const posts = await getPosts(locale);

    // Unique tags from posts
    const tags = [...new Set(posts.map((p) => p.metadata.tag))];

    return (
        <main className='container mx-auto px-6 md:px-10 py-16 space-y-8'>
            {/* Hero header */}
            <header className='space-y-3 max-w-2xl'>
                <h1 className='text-4xl md:text-5xl font-bold tracking-tight'>
                    {t('hero.title')}
                </h1>
                <p className='text-lg text-muted-foreground'>
                    {t('hero.subtitle')}
                </p>
                <p className='text-sm text-muted-foreground'>
                    {t('hero.count', { count: posts.length })}
                </p>
            </header>

            {/* Filters + articles */}
            <BlogFilters
                posts={posts}
                locale={locale}
                tags={tags}
                allLabel={t('filters.all')}
                readLabel={t('viewProject' as never) ?? 'Lire →'}
            />
        </main>
    );
}
```

⚠️ Note : `t('filters.all')` est une clé du namespace `Blog`. Vérifier que les namespaces next-intl sont bien déclarés dans `src/i18n/request.ts` si erreur TypeScript.

- [ ] **Step 2 : Vérifier la build**

```bash
pnpm build 2>&1 | grep -E "blog|error|Error" | head -20
```

Expected: `/[locale]/blog` apparaît en `●` (SSG).

- [ ] **Step 3 : Commit**

```bash
git add "src/app/[locale]/blog/page.tsx"
git commit -m "feat(blog): build list page with featured + grid + tag filters"
```

---

## Task 11 — Page article `/[locale]/blog/[slug]`

**Files:** Create `src/app/[locale]/blog/[slug]/page.tsx`

- [ ] **Step 1 : Créer `src/app/[locale]/blog/[slug]/page.tsx`**

```tsx
import { AuthorCard } from '@/components/blog/author-card';
import { ReadingProgress } from '@/components/blog/reading-progress';
import { RelatedArticles } from '@/components/blog/related-articles';
import { Toc } from '@/components/blog/toc';
import { JsonLd } from '@/components/seo/json-ld';
import { getMDXComponents } from '@/components/mdx/mdx-components';
import { SITE_URL } from '@/config/site';
import { routing } from '@/i18n/routing';
import {
    extractHeadings,
    getPostBySlug,
    getPostSlugs,
    getPosts,
    getTagConfig,
} from '@/lib/blog';
import { articleSchema, breadcrumbSchema } from '@/lib/seo/schemas';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import { ArrowLeft } from 'lucide-react';

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
    const all = await Promise.all(
        routing.locales.map(async (locale) => {
            const slugs = await getPostSlugs(locale);
            return slugs.map((slug) => ({ locale, slug }));
        })
    );
    return all.flat();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, slug } = await params;
    const post = await getPostBySlug(slug, locale);
    if (!post) return { title: 'Not found' };
    const { metadata } = post;
    const ogImage = `${SITE_URL}/og?title=${encodeURIComponent(metadata.title)}&subtitle=${encodeURIComponent(metadata.summary.slice(0, 120))}`;
    return {
        title: `${metadata.title} — Yann THOBENA`,
        description: metadata.summary,
        openGraph: {
            title: metadata.title,
            description: metadata.summary,
            type: 'article',
            publishedTime: metadata.publishedAt,
            url: `${SITE_URL}/${locale}/blog/${slug}`,
            images: [{ url: ogImage, alt: metadata.title }],
        },
        twitter: {
            card: 'summary_large_image',
            title: metadata.title,
            description: metadata.summary,
            images: [ogImage],
        },
        alternates: {
            canonical: `${SITE_URL}/${locale}/blog/${slug}`,
            languages: routing.locales.reduce(
                (acc, l) => ({
                    ...acc,
                    [l]: `${SITE_URL}/${l}/blog/${slug}`,
                }),
                {}
            ),
            types: { 'application/rss+xml': `${SITE_URL}/blog/feed.xml` },
        },
    };
}

const mdxOptions = {
    mdxOptions: {
        rehypePlugins: [
            rehypeSlug,
            [
                rehypePrettyCode,
                {
                    theme: 'github-dark-dimmed',
                    keepBackground: true,
                },
            ],
        ] as never[],
    },
};

export default async function BlogSlugPage({ params }: Props) {
    const { locale, slug } = await params;
    setRequestLocale(locale);

    const post = await getPostBySlug(slug, locale);
    if (!post) notFound();

    const { metadata, content, readingTime } = post;
    const tag = getTagConfig(metadata.tag);
    const headings = extractHeadings(content);
    const t = await getTranslations({ locale, namespace: 'Blog' });
    const tNav = await getTranslations({ locale, namespace: 'Navigation' });

    // Related articles: same tag, different slug, max 2
    const allPosts = await getPosts(locale);
    const related = allPosts
        .filter((p) => p.slug !== slug && p.metadata.tag === metadata.tag)
        .slice(0, 2);

    const date = new Date(metadata.publishedAt).toLocaleDateString(
        locale === 'fr' ? 'fr-FR' : 'en-US',
        { year: 'numeric', month: 'long', day: 'numeric' }
    );

    return (
        <>
            {/* Reading progress bar */}
            <ReadingProgress color={tag.progressColor} />

            {/* JSON-LD */}
            <JsonLd
                data={[
                    articleSchema({
                        locale,
                        slug,
                        title: metadata.title,
                        summary: metadata.summary,
                        datePublished: metadata.publishedAt,
                        image: metadata.image,
                    }),
                    breadcrumbSchema([
                        { name: tNav('home'), url: `${SITE_URL}/${locale}` },
                        {
                            name: t('title'),
                            url: `${SITE_URL}/${locale}/blog`,
                        },
                        {
                            name: metadata.title,
                            url: `${SITE_URL}/${locale}/blog/${slug}`,
                        },
                    ]),
                ]}
            />

            <div className='container mx-auto px-6 md:px-10 py-16'>
                {/* Back link */}
                <Link
                    href={`/${locale}/blog`}
                    className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10'
                >
                    <ArrowLeft className='h-4 w-4' />
                    {t('article.backToBlog')}
                </Link>

                {/* Article header */}
                <header className='max-w-3xl space-y-4 mb-8'>
                    <div className='flex items-center gap-3 flex-wrap'>
                        <span
                            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${tag.badge}`}
                        >
                            {metadata.tag}
                        </span>
                        <span className='text-sm text-muted-foreground'>
                            {t('article.readingTime', { time: readingTime })}
                        </span>
                        <span className='text-sm text-muted-foreground'>
                            · {t('article.publishedAt', { date })}
                        </span>
                    </div>
                    <h1 className='text-3xl md:text-5xl font-bold tracking-tight leading-tight'>
                        {metadata.title}
                    </h1>
                </header>

                {/* Cover image */}
                {metadata.image ? (
                    <div className='relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-10 max-w-3xl'>
                        <Image
                            src={metadata.image}
                            alt={metadata.title}
                            fill
                            className='object-cover'
                            priority
                        />
                    </div>
                ) : (
                    <div
                        className={`w-full max-w-3xl aspect-[16/9] rounded-2xl bg-gradient-to-br ${tag.gradient} opacity-30 mb-10`}
                    />
                )}

                {/* Two-column layout: article + TOC */}
                <div className='flex gap-12 items-start'>
                    {/* Article body */}
                    <article className='min-w-0 flex-1 max-w-2xl space-y-10'>
                        <div className='prose prose-invert max-w-none'>
                            <MDXRemote
                                source={content}
                                components={getMDXComponents()}
                                options={mdxOptions}
                            />
                        </div>

                        {/* Author card */}
                        <AuthorCard
                            locale={locale}
                            cta={t('authorCard.cta')}
                            contactLabel={t('authorCard.contact')}
                            projectsLabel={t('authorCard.projects')}
                            tag={metadata.tag}
                        />

                        {/* Related articles */}
                        {related.length > 0 && (
                            <RelatedArticles
                                posts={related}
                                locale={locale}
                                title={t('article.relatedTitle')}
                            />
                        )}
                    </article>

                    {/* TOC sidebar (desktop only, hidden via CSS in Toc component) */}
                    <aside className='w-56 flex-shrink-0'>
                        <Toc headings={headings} />
                    </aside>
                </div>
            </div>
        </>
    );
}
```

- [ ] **Step 2 : Vérifier la build**

```bash
pnpm build 2>&1 | grep -E "blog|slug|error|Error" | head -20
```

Expected: `/[locale]/blog/[slug]` apparaît en `●` (SSG) avec les 3 slugs × 2 locales = 6 routes.

- [ ] **Step 3 : Commit**

```bash
git add "src/app/[locale]/blog/[slug]/"
git commit -m "feat(blog): add article page SSG with MDX, TOC, reading progress, JSON-LD"
```

---

## Task 12 — RSS Feed + lien layout

**Files:** Create `src/app/blog/feed.xml/route.ts`

- [ ] **Step 1 : Créer `src/app/blog/feed.xml/route.ts`**

```ts
import { getPosts } from '@/lib/blog';
import { SITE_URL } from '@/config/site';

export const dynamic = 'force-static';

export async function GET() {
    const posts = await getPosts('fr');

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Yann THOBENA · Blog</title>
    <link>${SITE_URL}/fr/blog</link>
    <description>Articles sur le développement web, l'IA et les retours d'expérience.</description>
    <language>fr-FR</language>
    <atom:link href="${SITE_URL}/blog/feed.xml" rel="self" type="application/rss+xml"/>
    ${posts
        .map(
            (post) => `
    <item>
      <title><![CDATA[${post.metadata.title}]]></title>
      <link>${SITE_URL}/fr/blog/${post.slug}</link>
      <guid>${SITE_URL}/fr/blog/${post.slug}</guid>
      <pubDate>${new Date(post.metadata.publishedAt).toUTCString()}</pubDate>
      <description><![CDATA[${post.metadata.summary}]]></description>
    </item>`
        )
        .join('')}
  </channel>
</rss>`;

    return new Response(rss, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
        },
    });
}
```

- [ ] **Step 2 : Commit**

```bash
git add src/app/blog/feed.xml/
git commit -m "feat(blog): add RSS feed at /blog/feed.xml"
```

---

## Task 13 — Build + lint final

- [ ] **Step 1 : Build complet**

```bash
pnpm build 2>&1 | tail -35
```

Expected :
```
● /[locale]/blog          (fr, en)
● /[locale]/blog/[slug]   × 6 (3 slugs × 2 locales)
○ /blog/feed.xml
```

- [ ] **Step 2 : Lint**

```bash
pnpm lint 2>&1 | tail -5
```

Expected: 0 erreurs.

- [ ] **Step 3 : Vérification manuelle (dev server)**

```bash
pnpm dev
```

Visiter :
- `http://localhost:3000/fr/blog` → liste avec featured + grille + filtres
- `http://localhost:3000/fr/blog/from-sales-to-developer` → article avec image, TOC, progress bar, code block
- `http://localhost:3000/fr/blog/seo-with-nextjs` → article avec code blocks Shiki
- `http://localhost:3000/blog/feed.xml` → XML RSS valide

- [ ] **Step 4 : Commit final si nécessaire**

```bash
git status
# Si fichiers non commités :
git add -A
git commit -m "feat(blog): finalize blog implementation — all pages SSG, lint clean"
```

---

## Résumé

13 tâches · ~15 commits attendus.

**Checklist finale :**
- ✅ Page liste `/blog` : featured + grille + filtres Framer Motion
- ✅ Page article `/blog/[slug]` : progress bar, TOC sticky, Shiki, author card, articles liés
- ✅ 6 articles MDX bilingues (3 fr + 3 en)
- ✅ JSON-LD `Article` + `BreadcrumbList` par article
- ✅ OG images dynamiques via `/og`
- ✅ RSS Feed `/blog/feed.xml`
- ✅ i18n fr/en complet
- ✅ Build SSG + lint 0 erreur
