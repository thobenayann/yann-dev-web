# Blog Hyper-Attractif — Design Spec

**Date :** 2026-04-18  
**Projet :** Portfolio yann-dev-web — Next.js 16.2.4 · React 19 · Tailwind 4 · Framer Motion 12 · next-intl 4.9.1  
**Branche :** home-page-bento-grid

---

## Objectifs

1. Transformer la page blog (actuellement `<h1>Blog</h1>`) en expérience de lecture premium
2. Migrer les 3 articles existants (EN) avec traductions FR
3. Mettre en place l'infrastructure SEO article-grade (JSON-LD, OG, RSS)
4. Conversion discrète vers missions freelance et /work

---

## Architecture des fichiers

### Nouveaux fichiers

```
src/app/[locale]/blog/
  page.tsx                                    ← liste featured + grille filtrée
  [slug]/
    page.tsx                                  ← page article complète SSG
  posts/
    fr/
      building-mvp-ai-nextjs.mdx
      from-sales-to-developer.mdx
      seo-with-nextjs.mdx
    en/
      building-mvp-ai-nextjs.mdx
      from-sales-to-developer.mdx
      seo-with-nextjs.mdx
  feed.xml/
    route.ts                                  ← RSS feed (locale fr + en)

src/components/blog/
  article-card-featured.tsx                   ← grande card hero (server component)
  article-card.tsx                            ← card compacte grille (server component)
  blog-filters.tsx                            ← chips de filtre sticky (client component)
  reading-progress.tsx                        ← barre de progression sticky (client)
  toc.tsx                                     ← table des matières sidebar (client)
  author-card.tsx                             ← carte auteur + CTA (server component)
  related-articles.tsx                        ← 2 articles liés (server component)

src/components/mdx/
  code-block.tsx                              ← wrapper Shiki avec copy button (client)
  mdx-components.tsx                          ← registry MDX (CodeBlock, img, etc.)

src/lib/
  blog.ts                                     ← getPostBySlug, getPostSlugs, getPosts
  reading-time.ts                             ← calcul mots ÷ 200 → "X min"
```

### Fichiers modifiés

```
src/lib/seo/schemas.ts                        ← + articleSchema() factory
messages/fr.json                              ← + clés Blog.hero.*, Blog.filters.*, Blog.article.*
messages/en.json                              ← idem
src/app/[locale]/layout.tsx                   ← + <link rel="alternate" RSS> dans <head>
```

---

## Frontmatter MDX (format cible)

```yaml
---
title: 'Titre de l'article'
publishedAt: '2025-03-15'
summary: 'Résumé court utilisé en excerpt et meta description (≤ 160 caractères)'
image: '/images/gallery/img-14.jpg'   # optionnel — fallback gradient si absent
tag: 'Web Development'                # IA & LLM | Dev | SEO | Carrière
lang: 'fr'                            # fr | en
---
```

**Tags autorisés et couleurs associées :**

| Tag | Gradient |
|---|---|
| `IA & LLM` | `violet→indigo` |
| `Dev` | `cyan→teal` |
| `SEO` | `green→emerald` |
| `Carrière` | `orange→rose` |
| `Web Development` | `cyan→teal` (alias Dev) |

---

## Page liste `/[locale]/blog`

### Layout général

```
┌──────────────────────────────────────────────────────────────┐
│  H1 "Mes articles" · compteur discret · description          │
│  ─────────────────────────────────────────────────────────── │
│  [Tous] [IA & LLM] [Dev] [SEO] [Carrière]  ← chips sticky   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  FEATURED — dernier article publié                    │   │
│  │  [Image de couverture ou gradient animé 16/9]         │   │
│  │  ┌tag badge┐ · 5 min · 15 mars 2025                  │   │
│  │  Titre H2 grand (48px)                                │   │
│  │  Excerpt sur 2-3 lignes                               │   │
│  │  [Lire l'article →]                                   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌────────────────────────┐  ┌────────────────────────┐     │
│  │ ████ bande tag (4px)   │  │ ████ bande tag (4px)   │     │
│  │ tag · 4 min · date     │  │ tag · 3 min · date     │     │
│  │ Titre bold             │  │ Titre bold             │     │
│  │ Excerpt 2 lignes...    │  │ Excerpt 2 lignes...    │     │
│  └────────────────────────┘  └────────────────────────┘     │
└──────────────────────────────────────────────────────────────┘
```

### Détail composants

**`<ArticleCardFeatured />`** (server component)
- Props : `post: Post, locale: string`
- Si `post.metadata.image` présent → `<Image>` Next.js optimisée, aspect 16/9, priority
- Si absent → `<div>` avec `background: linear-gradient(135deg, ...)` selon tag, légère animation CSS `background-position` (shimmer)
- Framer Motion `whileHover` : `y: -4`, `boxShadow` glow coloré (couleur du tag)
- Bouton "Lire l'article →" : hover avec flèche animée

**`<ArticleCard />`** (server component)
- Props : `post: Post, locale: string`
- Bande colorée top 4px (couleur du tag) + `rounded-xl` border `border-white/10`
- Fond : `bg-white/5 backdrop-blur-sm`
- Framer Motion `whileHover` : `scale: 1.02`, border glow
- Tronquage excerpt : `line-clamp-2`

**`<BlogFilters />`** (client component)
- Props : `tags: string[], posts: Post[], locale: string`
- Chips horizontaux scrollables (overflow-x auto mobile)
- `sticky top-[64px]` (sous le header)
- Framer Motion `layoutId` sur l'indicateur actif (animation fluide entre tags)
- État local `activeTag` via `useState` — filtre les posts reçus en props, pas de rechargement page. URL non modifiée (liste trop courte pour warranter les search params)
- Re-render des cards avec `AnimatePresence` + `layout` prop pour transition douce

**Animation d'entrée liste :**
```tsx
// staggerChildren sur les cards
const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }
```

---

## Page article `/[locale]/blog/[slug]`

### Layout desktop (≥ 1024px)

```
┌─────────────────────────────────────────────────────────────┐
│ [████████████████░░░░░░░░░░░░] ← reading progress bar 3px  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ← Retour au blog                                           │
│                                                             │
│  ┌─tag badge─┐ · 5 min de lecture · 15 mars 2025           │
│  H1 Titre grand (56px desktop, 36px mobile)                 │
│  [Image de couverture pleine largeur ou gradient]           │
│  Avatar + Yann THOBENA · Concepteur Dev & Expert IA         │
│                                                             │
│  ┌──────────────────────────────┐  ┌────────────────────┐  │
│  │                              │  │  TABLE DES MATIÈRES│  │
│  │  Corps MDX                   │  │  sticky top-24     │  │
│  │  max-w-2xl                   │  │  ─────────────────  │  │
│  │                              │  │  · Section 1        │  │
│  │  ┌──────────────────────┐    │  │  · Section 2        │  │
│  │  │ ```javascript         │    │  │    · Sous-section   │  │
│  │  │ [lang label] [copy ✓]│    │  │  · Section 3        │  │
│  │  │ syntax highlighted   │    │  │                     │  │
│  │  └──────────────────────┘    │  │                     │  │
│  │                              │  │                     │  │
│  └──────────────────────────────┘  └────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  [Avatar]  Yann THOBENA                              │   │
│  │            Concepteur Dev & Expert IA à Toulouse     │   │
│  │  "Besoin d'intégrer ce type de solution ?"           │   │
│  │  [→ Me contacter]  [→ Voir mes projets]              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Articles liés                                              │
│  ┌─────────────────────┐  ┌─────────────────────┐          │
│  │  card compacte       │  │  card compacte       │         │
│  └─────────────────────┘  └─────────────────────┘          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Détail composants

**`<ReadingProgress />`** (client component)
- `useScroll()` Framer Motion → `scrollYProgress` motion value
- `<motion.div>` fixed top-0, height 3px, `scaleX: scrollYProgress`, `transformOrigin: left`
- Couleur = variable CSS injectée par la page selon le tag de l'article

**`<Toc />`** (client component)
- Props : `headings: Array<{ id: string; text: string; level: 2 | 3 }>`
- Extraction des headings : fonction `extractHeadings(content: string)` dans `lib/blog.ts` — regex sur le source MDX brut (`/^#{2,3} /m`), slugification du texte → `id`. Les IDs correspondent aux ancres générées par `rehype-slug` lors de la compilation MDX.
- `useActiveHeading` hook : `IntersectionObserver` sur chaque heading → highlight actif
- Sticky `top-24`, max-height avec scroll interne
- Mobile : masqué (TOC accessible via bouton flottant ou en haut d'article)
- Smooth scroll vers le heading au clic

**`<CodeBlock />`** (client component)
- Props : `code: string, language: string, filename?: string`
- Shiki via `rehype-pretty-code` (rendu server-side dans MDX) → HTML pre/code statique
- Le client component ajoute uniquement le bouton copy par-dessus via `useRef` sur le `<pre>`
- Fond `#0d1117` (GitHub Dark Dimmed), label langage en `text-xs opacity-50` haut gauche
- Copy button : `useState` feedback `✓ Copié` 2 secondes puis reset

**`<AuthorCard />`** (server component)
- Avatar `person.avatar` + nom + titre
- CTA primaire : `"Me contacter"` → `mailto:thobena.yann@gmail.com`
- CTA secondaire : `"Voir mes projets"` → `/${locale}/work`
- Fond card avec border coloré selon tag

**`<RelatedArticles />`** (server component)
- 2 articles du même tag (ou les 2 plus récents si pas assez du même tag)
- Utilise `<ArticleCard />` existant

### Typography prose MDX

```css
/* Tailwind prose customisé */
.prose {
  --tw-prose-body: oklch(0.85 0.01 0);
  --tw-prose-headings: oklch(0.98 0 0);
  --tw-prose-links: oklch(0.75 0.18 210);    /* cyan primaire */
  --tw-prose-code: oklch(0.85 0.05 220);
  --tw-prose-quotes: oklch(0.7 0.01 0);
}
/* Blockquote : barre latérale colorée 3px */
.prose blockquote {
  border-left: 3px solid oklch(0.541 0.281 293);
  padding-left: 1rem;
  font-style: normal;
}
```

---

## lib/blog.ts

```ts
// Types
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
  content: string;        // source MDX brute (pour MDXRemote/rsc)
  readingTime: string;    // "5 min"
};

// API publique
export async function getPosts(locale: string): Promise<Post[]>
export async function getPostBySlug(slug: string, locale: string): Promise<Post | null>
  // fallback : si fr/[slug].mdx absent → tente en/[slug].mdx
export async function getPostSlugs(locale: string): Promise<string[]>
```

---

## lib/reading-time.ts

```ts
export function calcReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min`;
}
```

---

## lib/seo/schemas.ts — articleSchema()

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

---

## RSS Feed `/blog/feed.xml/route.ts`

- Route handler (non-edge) retournant `Content-Type: application/xml`
- Items : tous les posts FR triés par date desc
- Lien `<atom:link>` pour Atom compatibility
- Injecté dans le layout : `<link rel="alternate" type="application/rss+xml" href="/blog/feed.xml">`

---

## generateMetadata — page article

```ts
return {
  title: `${post.metadata.title} — Yann THOBENA`,
  description: post.metadata.summary,
  openGraph: {
    title: post.metadata.title,
    description: post.metadata.summary,
    type: 'article',
    publishedTime: post.metadata.publishedAt,
    url: `${SITE_URL}/${locale}/blog/${slug}`,
    images: [{
      url: `${SITE_URL}/og?title=${encodeURIComponent(post.metadata.title)}&subtitle=${encodeURIComponent(post.metadata.summary.slice(0, 120))}`,
      alt: post.metadata.title,
    }],
  },
  alternates: {
    canonical: `${SITE_URL}/${locale}/blog/${slug}`,
    languages: { fr: `${SITE_URL}/fr/blog/${slug}`, en: `${SITE_URL}/en/blog/${slug}` },
    types: { 'application/rss+xml': `${SITE_URL}/blog/feed.xml` },
  },
};
```

---

## Clés i18n à ajouter

### `messages/fr.json` — bloc `Blog`

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
    "cta": "Besoin d'intégrer ce type de solution ?",
    "contact": "Me contacter",
    "projects": "Voir mes projets"
  }
}
```

### `messages/en.json` — bloc `Blog`

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
    "cta": "Need to integrate this kind of solution?",
    "contact": "Contact me",
    "projects": "See my projects"
  }
}
```

---

## Migration des 3 articles

### Mappings de tags

| Article | Tag actuel | Tag normalisé |
|---|---|---|
| building-mvp-ai-nextjs | Web Development | `Dev` |
| from-sales-to-developer | Career Change | `Carrière` |
| SEO-with-Nextjs-15 | SEO | `SEO` |

### Transformations MDX

1. `<CodeBlock codeInstances={[{ code, language, label }]} copyButton />` → ` ```{language} ` fence standard (Shiki gère le reste)
2. `<br /><br />` → supprimés (paragraphes naturels)
3. Frontmatter : ajout `tag`, `lang`, suppression `image` pour les 2 sans image
4. `from-sales-to-developer` : garder `image: '/images/gallery/img-14.jpg'` (copier le fichier dans le nouveau projet)

### Versions FR

Les 3 articles EN seront traduits en français lors de l'implémentation. Le slug reste identique entre les deux langues (`building-mvp-ai-nextjs`, `from-sales-to-developer`, `seo-with-nextjs`).

---

## Dépendances à installer

```bash
pnpm add @tailwindcss/typography rehype-pretty-code shiki rehype-slug
```

- `@tailwindcss/typography` : classes `prose` pour le corps des articles
- `rehype-pretty-code` + `shiki` : syntax highlighting server-side dans MDX (thème `github-dark-dimmed`)
- `rehype-slug` : génère des IDs sur les headings H2/H3 (nécessaire pour le scroll-to-anchor du TOC)

### Config MDX (`next-mdx-remote/rsc`) dans `getPostBySlug`

```ts
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';

// Options passées à MDXRemote source prop via options:
const mdxOptions = {
  rehypePlugins: [
    rehypeSlug,
    [rehypePrettyCode, {
      theme: 'github-dark-dimmed',
      keepBackground: true,
    }],
  ],
};
```

### Image de couverture `img-14.jpg`

Le fichier `/images/gallery/img-14.jpg` provient de l'ancien portfolio. Il faut le copier dans `public/images/gallery/img-14.jpg` du projet courant.

---

## Ordre d'implémentation suggéré

1. `lib/blog.ts` + `lib/reading-time.ts` + types
2. Articles MDX (6 fichiers fr + en)
3. `articleSchema()` dans `schemas.ts`
4. Composants blog (cards, filters, progress, toc, author-card, related)
5. `components/mdx/` (code-block, mdx-components)
6. Page liste `/blog`
7. Page article `/blog/[slug]`
8. RSS feed
9. i18n keys + generateMetadata
10. Installation dépendances + config tailwind typography
11. Build + lint validation
