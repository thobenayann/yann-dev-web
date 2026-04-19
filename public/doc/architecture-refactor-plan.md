### Plan d'architecture et de refactor Next.js 15 — i18n, MDX, SEO, UI

Ce document propose un plan d’action séquencé, testable et réversible pour uniformiser l’i18n, consolider le pipeline MDX, améliorer le SEO, simplifier la navigation, factoriser l’UI et appliquer les conventions de nommage. Chaque étape contient: Objectif, Actions, Fichiers impactés et Test rapide.

---

### Décisions globales

-   **defaultLocale**: `fr`
-   **localePrefix**: `always` (URLs stables et canoniques par langue, meilleur SEO)
-   **Source de vérité i18n**: centralisée dans `src/i18n/config.ts`
-   **MDX**: pipeline unique basé sur `gray-matter` (+ `next-mdx-remote` uniquement si rendu MDX côté page)
-   **SEO**: centraliser `SITE_URL` dans `src/config/site.ts` + `config/seo.ts` pour défauts

---

### Étape 1 — Unifier i18n (source de vérité + SEO)

-   **Objectif**: Une seule config i18n cohérente.
-   **Actions**:

    -   Créer `src/i18n/config.ts`:

        ```ts
        export const locales = ['en', 'fr'] as const;
        export type Locale = (typeof locales)[number];

        export const defaultLocale: Locale = 'fr';
        export const localePrefix = 'always' as const; // SEO: URLs toujours préfixées

        export const languages: Record<Locale, string> = {
            en: 'English',
            fr: 'Français',
        } as const;
        ```

    -   Modifier `src/i18n/routing.ts` pour importer `locales`, `defaultLocale`, `localePrefix` depuis `src/i18n/config.ts`.
    -   Modifier `src/middleware.ts` pour réutiliser la même config (surtout `defaultLocale` et `localePrefix`).
    -   Déprécier `src/config/i18n.ts` (ou le faire déléguer vers `src/i18n/config.ts`).

-   **Fichiers impactés**: `src/i18n/config.ts` (nouveau), `src/i18n/routing.ts`, `src/middleware.ts`, `src/config/i18n.ts` (à déprécier).
-   **Test rapide**: `/fr` et `/en` répondent; URLs toujours préfixées par la locale; aucune redirection incohérente.

---

### Étape 2 — Unifier le chargement des messages (supprimer l’import manuel)

-   **Objectif**: Une seule voie de chargement robuste sans `try/catch` manuel.
-   **Actions**:
    -   Dans `src/app/[locale]/layout.tsx`:
        -   Utiliser `setRequestLocale(locale)` (déjà présent).
        -   Remplacer l’import dynamique manuel par `getMessages()` de `next-intl/server`:
            ```ts
            import { getMessages, setRequestLocale } from 'next-intl/server';
            // ...
            const messages = await getMessages();
            // <NextIntlClientProvider messages={messages} locale={locale}>...
            ```
    -   Conserver `src/i18n/request.ts` comme config centrale (`getRequestConfig`).
-   **Fichiers impactés**: `src/app/[locale]/layout.tsx`, `src/i18n/request.ts` (inchangé).
-   **Test rapide**: Changer de langue via le switch → traductions OK, pas d’erreurs console.

---

### Étape 3 — MDX: consolider le pipeline et nettoyer les dépendances

-   **Objectif**: Une seule approche MDX, DRY et fiable.
-   **Choix recommandé**:
    -   Garder `gray-matter` pour lire le frontmatter.
    -   Conserver `next-mdx-remote` seulement si vous rendez du MDX (composants dans le contenu). Sinon, retirer.
-   **Actions**:
    -   Supprimer les paquets redondants:
        ```bash
        pnpm remove @mdx-js/mdx @mdx-js/loader @next/mdx
        ```
    -   Supprimer ou migrer `src/utils/mdx-content-manager.ts` vers `fs/promises` + `gray-matter` (ou s’appuyer uniquement sur `src/lib/mdx.ts`).
    -   Uniformiser l’accès MDX via `src/lib/mdx.ts` (asynchrone, `gray-matter`, option `remark-gfm`).
-   **Fichiers impactés**: `src/lib/mdx.ts`, `src/utils/mdx-content-manager.ts` (à supprimer après migration).
-   **Test rapide**: Page d’accueil charge les projets; rendu MDX (si utilisé) fonctionne.

---

### Étape 4 — Valider le frontmatter avec Zod

-   **Objectif**: Type-safety du contenu, erreurs claires.
-   **Actions**:

    -   Ajouter `zod` si absent:
        ```bash
        pnpm add zod
        ```
    -   Créer `src/types/mdx.schema.ts`:

        ```ts
        import { z } from 'zod';

        export const ProjectLinkSchema = z.object({
            label: z.string(),
            url: z.string().url(),
            icon: z.string().optional(),
        });

        export const TeamSchema = z.object({
            name: z.string(),
            role: z.string(),
            avatar: z.string().optional(),
            linkedIn: z.string().url().optional(),
        });

        export const ProjectMetadataSchema = z.object({
            title: z.string(),
            publishedAt: z.string(),
            summary: z.string(),
            image: z.string().optional(),
            images: z.array(z.string()).default([]),
            tag: z.string().optional(),
            team: z.array(TeamSchema).default([]),
            link: z.string().url().optional(),
            links: z.array(ProjectLinkSchema).default([]),
        });
        ```

    -   Dans `src/lib/mdx.ts`, après `gray-matter`, valider: `ProjectMetadataSchema.parse(frontmatter)`.

-   **Fichiers impactés**: `src/types/mdx.schema.ts` (nouveau), `src/lib/mdx.ts` (ajustement parse/validate).
-   **Test rapide**: Frontmatter invalide → message explicite + fallback contrôlé.

---

### Étape 5 — `PageParams`: revenir au modèle Next 15 standard

-   **Objectif**: Retirer `params: Promise<T>` et l’attente inutile.
-   **Actions**:
    -   Signatures pages/layouts: `({ params }: { params: { locale: string } })`.
    -   Remplacer `const { locale } = await params;` par `const { locale } = params;`.
    -   Supprimer `src/types/next.ts` si plus utilisé.
-   **Fichiers impactés**: `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx`, `src/types/next.ts` (à supprimer).
-   **Test rapide**: Build type-check OK; navigation correcte.

---

### Étape 6 — Routes et navigation: simplifier et dédupliquer

-   **Objectif**: S’appuyer sur l’app router et `next-intl` pour les URLs localisées.
-   **Actions**:
    -   Déprécier `src/config/routes.ts` (retirer la map figée); conserver uniquement les items de navigation.
    -   Créer `src/data/navigation.ts` (items, clés de traduction, chemins sans locale).
    -   Utiliser `Link` depuis `next-intl/navigation` pour composer les URLs.
-   **Fichiers impactés**: `src/components/layout/header.tsx`, `src/data/navigation.ts` (nouveau), `src/config/routes.ts` (à supprimer/vider).
-   **Test rapide**: Le menu construit des URLs localisées correctes (fr/en).

---

### Étape 7 — Base URL et SEO: centraliser et rendre configurable

-   **Objectif**: Une seule source de vérité pour l’URL du site.
-   **Actions**:
    -   Créer `src/config/site.ts`:
        ```ts
        export const SITE_URL =
            process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yanndevweb.com';
        ```
    -   Remplacer les usages hardcodés (`baseURL`) par `SITE_URL`.
    -   Mettre à jour `sitemap.ts`, `robots.ts`, `manifest.ts`, `generateMetadata`.
-   **Fichiers impactés**: `src/config/site.ts` (nouveau), `src/app/[locale]/page.tsx`, `src/app/[locale]/layout.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/manifest.ts`.
-   **Test rapide**: OG/Twitter/alternates corrects dans le HTML de la home.

---

### Étape 8 — Metadata: factoriser les defaults

-   **Objectif**: Éviter duplication layout/page.
-   **Actions**:
    -   Créer `src/config/seo.ts` avec defaults (title, description, openGraph, twitter, alternates de base à partir de `SITE_URL`).
    -   Dans chaque page: override minimal (ex: `title`, `description`, `images`).
    -   Option: alléger la metadata du layout si la page définit déjà ses tags.
-   **Fichiers impactés**: `src/config/seo.ts` (nouveau), pages/layouts qui définissent `generateMetadata`.
-   **Test rapide**: DevTools → balises `<meta>` cohérentes, sans doublons.

---

### Étape 9 — Refactor UI: `Integrations` et conteneurs

-   **Objectif**: Composants courts, DRY, lisibles.
-   **Actions**:
    -   Scinder `src/components/ui/integrations.tsx` en:
        -   `src/data/INTEGRATIONS.ts` (tableaux statiques, `SCREAMING_SNAKE_CASE`).
        -   `src/components/ui/IntegrationItem.tsx` (item).
        -   `src/components/ui/IntegrationsGrid.tsx` (grille).
        -   `src/components/ui/Integrations.tsx` (orchestrateur).
    -   Créer `src/components/ui/Section.tsx` (ou `Container.tsx`) pour évacuer les répétitions `container mx-auto px-6 md:px-10` et standardiser les espacements.
-   **Fichiers impactés**: fichiers ci-dessus.
-   **Test rapide**: UI identique; composants plus courts; pas d’erreurs de layout.

---

### Étape 10 — Unifier la librairie d’icônes

-   **Objectif**: Réduire le bundle, simplifier.
-   **Actions**:
    -   Standardiser sur `lucide-react` (déjà présent).
    -   Migrer les imports `react-icons` → `lucide-react`, puis:
        ```bash
        pnpm remove react-icons
        ```
-   **Fichiers impactés**: Composants utilisant `react-icons`.
-   **Test rapide**: Icônes rendues, bundle plus léger.

---

### Étape 11 — Client vs Server: usage minimal de client components

-   **Objectif**: Minimiser `use client`, éviter hydratation inutile.
-   **Actions**:
    -   Conserver `use client` uniquement si nécessaire (DOM, events, `useEffect`).
    -   Envelopper ces composants dans `Suspense` avec fallback léger.
    -   `dynamic(import, { ssr: false })` pour composants lourds non critiques.
-   **Fichiers impactés**: `src/components/ui/*`, `src/components/theme/*`.
-   **Test rapide**: Aucune erreur d’hydratation; UX fluide.

---

### Étape 12 — Nommage, structure et nettoyage

-   **Objectif**: Appliquer 100-naming-conventions et supprimer la dette.
-   **Actions**:
    -   Préférer `type` à `interface`.
    -   Fichiers de types: `kebab-case.ts`.
    -   Données statiques: `SCREAMING_SNAKE_CASE.ts` dans `src/data/`.
    -   Migrer `fs` sync → `fs/promises`.
    -   Supprimer après migration: `src/config/routes.ts`, `src/utils/mdx-content-manager.ts`.
-   **Fichiers impactés**: `src/types/*`, `src/data/*`, `src/lib/*`, suppressions listées.
-   **Test rapide**: Lint OK, build OK.

---

### Étape 13 — Images et performance

-   **Objectif**: Améliorer LCP/CLS.
-   **Actions**:
    -   Utiliser `next/image` avec `width`/`height` et `sizes` adaptés.
    -   Convertir progressivement `public/images/gallery/*.jpg` en WebP.
    -   Lazy-loading par défaut; attr `priority` pour LCP principal.
-   **Fichiers impactés**: Composants d’image, `public/images/*` (progressif).
-   **Test rapide**: Lighthouse → LCP/CLS en amélioration.

---

### Étape 14 — Documentation (README) et DX

-   **Objectif**: Onboarding clair et durable.
-   **Actions**:
    -   Documenter:
        -   i18n: `defaultLocale`, `localePrefix`, ajout d’une nouvelle langue.
        -   Pipeline MDX choisi, schéma Zod, où ranger le contenu (`/src/content` recommandé).
        -   `SITE_URL` et SEO.
        -   Conventions de nommage (100-naming-conventions).
    -   Ajouter exemples Next 15 backend (`headers()`, `cookies()`) si utiles.
-   **Fichiers impactés**: `README.md`.
-   **Test rapide**: Lecture externe: tout est clair sans contexte oral.

---

### Étape 15 — Petits éléments finaux

-   **Objectif**: Finitions de qualité.
-   **Actions**:
    -   Ordre d’imports (ESLint `import/order`).
    -   Dates via `next-intl` pour respecter la locale.
    -   `ThemeProvider`/`BackgroundCursor` sous `Suspense` si client-only.
    -   Centraliser `Container` spacing (éviter répétitions utilitaires Tailwind).
-   **Test rapide**: Zéro warning, UX stable.

---

### Timeline suggérée

1. Étapes 1 → 2 (i18n + messages)
2. Étapes 3 → 4 (MDX + Zod)
3. Étape 5 (PageParams)
4. Étapes 6 → 8 (Routes, SITE_URL, SEO)
5. Étapes 9 → 11 (UI refactor, icônes, client/server)
6. Étapes 12 → 13 (naming/structure, images)
7. Étape 14 → 15 (docs + finitions)

---

### Récap dépendances

-   **Supprimer**: `@mdx-js/mdx`, `@mdx-js/loader`, `@next/mdx`, `react-icons` (après migration)
-   **Garder**: `gray-matter`, `remark-gfm` (optionnel), `next-mdx-remote` (si rendu MDX)
-   **Ajouter**: `zod` (si absent)

---

### Annexes — Extraits prêts à l’emploi

1. `src/config/site.ts`

```ts
export const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yanndevweb.com';
```

2. `src/config/seo.ts` (exemple minimal)

```ts
import { SITE_URL } from './site';

export const DEFAULT_SEO = {
    title: "Yann's Portfolio",
    description: 'Portfolio website showcasing my work.',
    openGraph: {
        type: 'website',
        url: SITE_URL,
        siteName: "Yann's Portfolio",
    },
    twitter: {
        card: 'summary_large_image',
    },
};
```

3. `src/i18n/routing.ts` (esquisse)

```ts
import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';
import { locales, defaultLocale, localePrefix } from './config';

export const routing = defineRouting({ locales, defaultLocale, localePrefix });
export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing);
```

4. `src/middleware.ts` (esquisse)

```ts
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale, localePrefix } from './i18n/config';

export default createMiddleware({ locales, defaultLocale, localePrefix });

export const config = {
    matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)'],
};
```

5. `src/app/[locale]/layout.tsx` (extrait messages)

```ts
import { getMessages, setRequestLocale } from 'next-intl/server';
// ...
const { locale } = params;
setRequestLocale(locale);
const messages = await getMessages();
// <NextIntlClientProvider messages={messages} locale={locale}> ...
```

6. `src/types/mdx.schema.ts` (repris de l’étape 4)

```ts
// Voir Étape 4 pour le contenu complet
```

---

Bon courage pour la mise en œuvre ! Procédez par petites PRs, en validant chaque Étape via les tests rapides pour avancer sereinement.
