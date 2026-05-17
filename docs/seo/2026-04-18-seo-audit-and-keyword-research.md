# Audit SEO & Recherche de mots-clés — Portfolio Yann Thobena

> **Date** : 2026-04-18
> **Portée** : yanndevweb.com (fr/en)
> **Méthode** : audit technique du code + recherche web (SERPs françaises) sur 3 axes (dev freelance Toulouse, expert IA France, portfolio longue traîne)
> **Auteur** : Claude Sonnet 4.6, co-piloté par Yann Thobena

---

## 1. Profil & objectifs

**Identité double à faire ressortir :**
- **Concepteur Développeur d'Applications** (CDA diplômé, employé chez IPANOVA) — 4+ ans d'expérience fullstack
- **Expert IA** depuis juillet 2025 (mission Airbus, transformation IA)

**Objectifs du portfolio par ordre de priorité :**
1. **Vitrine projets personnels** (JKD Self-Defense, Atelier du Dirigeant, Wine Store, futurs projets)
2. **Partage d'expertise technique** via blog (~1 article/mois, incluant cas d'usage Airbus anonymisés)
3. **Attirer de petites missions freelance** (apps web / sites pour PME)

**Stack clé :**
- Web : Next.js 16, React 19, TypeScript, Tailwind 4, NestJS, PostgreSQL, Symfony/PHP, Docker
- IA : OpenAI API, Claude/Gemini, RAG/Embeddings, Cursor, Claude Code, n8n, Make

---

## 2. Audit technique SEO — Home page & global

### ✅ Points forts déjà en place
- `generateMetadata` async par page
- `alternates.canonical` + `alternates.languages` (fr/en)
- `robots` configuré (`index: true`, `follow: true`, `max-image-preview: 'large'`)
- `sitemap.ts`, `robots.ts`, `manifest.ts` présents
- Build SSG avec `generateStaticParams` pour home et about
- OG dynamique référencé (`/og?title=...`)

### ❌ Problèmes détectés (par priorité)

#### 🔴 P0 — Bloquants

| # | Problème | Localisation | Conséquence |
|---|----------|--------------|-------------|
| 1 | **Route `/work/[slug]` inexistante** mais `sitemap.ts` y pointe pour 6 MDX (3 projets × 2 locales) | `src/app/[locale]/work/` | 6 URLs 404 indexées, pénalité SEO, projets invisibles |
| 2 | **Zéro JSON-LD / structured data** (Person, WebSite, Article, SoftwareApp) | Aucune page | Google ne peut pas construire de panneau connaissance, E-E-A-T nul |
| 3 | **Route `/og` introuvable** dans l'arborescence `src/app/` | — | Previews LinkedIn / Twitter / Discord potentiellement vides |

#### 🟠 P1 — Importants

| # | Problème | Localisation | Conséquence |
|---|----------|--------------|-------------|
| 4 | **H1 sans mots-clés géographiques ni stack** : "Application Designer & Developer & AI Expert" | `messages/fr.json`, `messages/en.json` (`Home.headline`) | Recherches locales "Toulouse" perdues, pas de capture du trafic `Next.js` |
| 5 | **`/work/page.tsx` sans `generateMetadata`** | `src/app/[locale]/work/page.tsx` | Page projets sans SEO spécifique |
| 6 | **Manifest incohérent** : `theme_color: '#ffffff'` alors que le site est en dark mode, `description` FR-only | `src/app/manifest.ts` | PWA dégradée, couleur UA incorrecte |
| 7 | **`DEFAULT_SEO` sans `keywords`** ni déclaration structurée des thématiques | `src/config/seo.ts` | Moins pénalisant qu'avant mais utile |

#### 🟡 P2 — Enrichissement

| # | Problème | Localisation | Conséquence |
|---|----------|--------------|-------------|
| 8 | **Meta descriptions génériques** ("Portfolio website showcasing my work") | `messages/*/*.json` | CTR faible dans SERP |
| 9 | **Subline Home peu dense sémantiquement** | `messages/*/*.json` (`Home.subline`) | Mots-clés stack absents |
| 10 | **`SecondaryTitle` à vérifier** : est-ce bien un `<h2>` ? | `src/components/ui/secondary-title.tsx` | Hiérarchie Hn à valider |
| 11 | **Images sans `alt` descriptif détaillé** | home-content, bento | Accessibilité + SEO image |

---

## 3. Analyse concurrentielle

### Concurrents directs — Toulouse / Next.js-React

| Site | Angle | Forces | Faiblesses vs Yann |
|------|-------|--------|--------------------|
| [pierrefournier.dev](https://www.pierrefournier.dev/) | Dev fullstack Toulouse (React, Vue, Node, Next.js) | Positionnement local clair | Aucune mention IA |
| [theo-larrue.dev](https://theo-larrue.dev/) | Dev web Toulouse (JS, React, Vue, Nuxt, Node) | Portfolio propre, site vitrine → web app | Aucune mention IA |
| [amauryduval.com](https://amauryduval.com/freelance-nextjs/) | Freelance Next.js | Landing page ciblée Next.js | Pas local, pas IA |
| [franckwebpro.com](https://www.franckwebpro.com/) | Next.js + SEO | Gros focus SEO | Pas IA, national |
| [antoinechedebois.com](https://antoinechedebois.com/) | Lead Dev Cloud | Profil senior | Pas local, pas IA |

**🎯 Constat-clé : aucun des concurrents directs locaux ne couvre l'angle IA.** C'est l'avantage différenciant à exploiter.

### Plateformes à couvrir en parallèle
- **Malt** ([tags nextjs](https://www.malt.fr/s/tags/nextjs-5f5621d13225bb000720b63a)) — incontournable pour le freelance en France
- **Free-Work** (missions Next.js + IA)
- **Codeur.com** (mission rapide)
- **LinkedIn** (publication d'articles en miroir du blog)

---

## 4. Stratégie mots-clés

### A. Haute intention commerciale

| Mot-clé FR | Volume est. | Cible sur site | Intention |
|-----------|-------------|----------------|-----------|
| `développeur web Toulouse` | Moyen-fort | Home H1 + About | Local, commercial |
| `développeur freelance Toulouse` | Moyen | About + Contact | Local, commercial |
| `développeur Next.js freelance` | Moyen | Home + Work/[slug] | National, commercial |
| `création application web sur mesure` | Moyen | Home + Work | Service, commercial |
| `développeur fullstack TypeScript freelance` | Faible | Home sub-copy | National, qualifié |
| `expert IA freelance France` | Faible (ultra-qualifié) | About + Contact | Niche, commercial |
| `intégration LLM entreprise` | Faible | Blog | B2B, info→commercial |
| `consultant transformation IA PME` | Faible | About CTA | B2B |

### B. Local SEO (Toulouse)

| Mot-clé FR | Volume est. | Intention |
|-----------|-------------|-----------|
| `développeur web Toulouse` | Moyen-fort | Commercial local |
| `création site web Toulouse` | Moyen | Commercial local |
| `développeur fullstack Toulouse` | Faible | Commercial local |
| `expert intelligence artificielle Toulouse` | Très faible (sans concurrence) | Niche locale |

> 💡 **Conseil** : créer une section "Services · Toulouse" sur la page `/contact` avec mention explicite de disponibilité sur place + en remote France entière.

### C. Anglais (cible secondaire)

| Keyword EN | Volume | Cible |
|-----------|--------|-------|
| `Next.js developer freelance` | Moyen | Home (en) |
| `AI engineer freelance Europe` | Faible | About (en) |
| `RAG integration consultant` | Très faible | Blog articles EN |
| `fullstack developer Toulouse` | Très faible | About (en) |

### D. Longue traîne blog (12 articles pour 2026)

Mix **IA use cases** / **Next.js tutoriels** / **dev process** / **parcours** :

| # | Titre | Cible mot-clé | Angle |
|---|-------|---------------|-------|
| 1 | Comment j'ai industrialisé un système RAG sur une base documentaire industrielle (anonymisé) | `RAG production entreprise`, `LangChain Next.js` | IA use case, authoritative |
| 2 | Next.js 16 : migration réelle d'un projet en production | `Next.js 16 migration`, `proxy.ts middleware` | Dev tutoriel |
| 3 | Claude Code vs Cursor : 6 mois de dual usage, le verdict | `Claude Code vs Cursor 2026` | IA outils, fort volume |
| 4 | Intégrer l'IA dans une PME sans data scientist : méthode concrète | `IA pour PME`, `automatisation IA entreprise` | B2B prospection |
| 5 | n8n vs Make pour l'automatisation IA : comparatif terrain | `n8n vs Make`, `automatisation IA` | Outils, longue traîne |
| 6 | Prompt engineering pour développeurs : au-delà du chat | `prompt engineering développeur` | IA, audience dev |
| 7 | Architecturer une app Next.js + NestJS : retours de prod | `Next.js NestJS architecture` | Dev senior, recruteurs |
| 8 | Intégrer OpenAI dans une app NestJS : guide complet | `OpenAI NestJS integration` | Dev tutoriel |
| 9 | RAG vs fine-tuning : critères de choix pour un projet réel | `RAG vs fine-tuning` | B2B, IA |
| 10 | De CDA à Expert IA : mon parcours en 4 ans | `reconversion développeur IA` | Personal branding, E-E-A-T |
| 11 | Combien coûte une appli web sur mesure en 2026 ? | `prix développement application web` | Commercial, PME |
| 12 | Automatisation documentaire avec Claude et n8n : cas pratique | `automatisation documentaire IA` | Outils + B2B |

**Cadence recommandée** : 1 article par mois (janvier = #10 personal branding, rentrée = #4 B2B, etc.).

---

## 5. Rich results / structured data à implémenter

| Schema | Page | Bénéfice attendu |
|--------|------|-----------------|
| `Person` | `/about` | Panneau connaissance Google, E-E-A-T |
| `ProfilePage` | `/about` | Signal "page profil officielle" |
| `WebSite` + `SearchAction` | layout root | Sitelinks search box dans SERP |
| `CreativeWork` ou `SoftwareApplication` | `/work/[slug]` | Rich snippet projet (image + titre + auteur) |
| `Article` / `BlogPosting` | `/blog/[slug]` | Rich snippet article + date + auteur |
| `BreadcrumbList` | toutes les pages profondes | Navigation Google dans SERP |
| `Organization` (IPANOVA) | mention dans Person | Lier ton identité à ton employeur |

**Implémentation** : composant `<JsonLd />` réutilisable dans `src/components/seo/json-ld.tsx`, injection par page via balise `<script type="application/ld+json">`.

---

## 6. Quick wins SEO (< 1 semaine)

1. **Créer `/work/[slug]/page.tsx`** qui rend les 6 MDX existants avec `generateMetadata` complète → corrige les 6 × 404 du sitemap
2. **Injecter JSON-LD** `Person` sur `/about` + `WebSite` sur layout root
3. **Vérifier la route `/og`** : si cassée, créer `src/app/og/route.tsx` avec `ImageResponse` de `next/og`
4. **Enrichir le H1 de la Home** avec "Toulouse" + "Next.js" + "IA" dans une proposition non intrusive (ex: sous-titre)
5. **Fixer le `manifest.ts`** : `theme_color` aligné avec la palette (cyan/purple OKLCH), description localisée, `background_color: '#0a0a0a'`
6. **Ajouter `keywords`** dans `DEFAULT_SEO` (non bloquant mais bon hygiène)
7. **Vérifier que `SecondaryTitle` rend bien un `<h2>`** (hiérarchie Hn propre)

---

## 7. Tarification de référence (contexte marché)

Source : sondage 2026 agrégé sur le marché français (cf. sources bas de doc).

| Profil | TJM freelance France 2026 |
|--------|---------------------------|
| Dev fullstack junior | 350–500 €/j |
| Dev fullstack senior (5+ ans) | 500–750 €/j |
| Dev fullstack + IA (LLM/RAG) | 700–1 200 €/j |
| Expert IA générative (LLM, RAG, fine-tuning) | 1 000–1 800 €/j |

> Progression sectorielle : **+25 % depuis 2024** sur les profils NLP/LLM. L'IA générative (LLM, RAG) peut atteindre 1 800 €/j.

---

## 8. Roadmap d'implémentation

### Phase 1 — SEO critique (urgent)
- [ ] `/work/[slug]/page.tsx` avec `generateStaticParams` + `generateMetadata` + JSON-LD `SoftwareApplication`
- [ ] `<JsonLd />` composant réutilisable
- [ ] `Person` + `ProfilePage` sur `/about`, `WebSite` dans layout root
- [ ] Vérification / création route `/og`
- [ ] Fix `manifest.ts`

### Phase 2 — Vitrine projets (objectif #1)
- [ ] Enrichir le design de `/work/[slug]` : galerie d'images, tech stack chips colorées, résultats chiffrés, liens live + repo, CTA "Discuter d'un projet similaire"
- [ ] Page `/work` enrichie : filtres par catégorie (Web / IA / App), search, hero, SEO metadata
- [ ] Compléter les 3 MDX existants (Atelier du Dirigeant, JKD, Wine Store) avec plus de détails

### Phase 3 — Acquisition
- [ ] Page `/contact` dédiée, très visuelle (form, disponibilité, CTA LinkedIn/Email, mention Toulouse + remote France)
- [ ] Structure `/blog` complète (liste + `/blog/[slug]` MDX)
- [ ] Premier article (recommandation : #10 "De CDA à Expert IA" pour lancer avec un contenu personal branding qui exploite l'existant)

### Phase 4 — Contenu régulier
- [ ] Plan éditorial 12 mois
- [ ] Templates MDX (Article, Tutoriel, Retour d'expérience)
- [ ] OG image par article (auto-générée via `/og`)

### Phase 5 — Hobbies (quand contenu prêt)
- [ ] Réactiver `/hobbies` dans `routes.ts` + `navigation.ts`

---

## 9. Sources consultées

- [Développeur React Toulouse — Codeur.com](https://www.codeur.com/developpeur/react/toulouse)
- [Pierre Fournier — Développeur fullstack freelance Toulouse](https://www.pierrefournier.dev/)
- [Théo Larrue — Développeur web freelance Toulouse](https://theo-larrue.dev/)
- [Amaury Duval — Freelance Next.js](https://amauryduval.com/freelance-nextjs/)
- [Malt — Tag Next.js](https://www.malt.fr/s/tags/nextjs-5f5621d13225bb000720b63a)
- [Missions freelance Next.js — Free-Work](https://www.free-work.com/fr/tech-it/jobs/next-js)
- [Missions freelance IA — Free-Work](https://www.free-work.com/fr/tech-it/jobs/ia)
- [Tarifs consultant IA 2026 — Plateya](https://www.plateya.fr/blog/detail/tarif-consultant-ia-en-2026-guide-complet-fourchettes-et-conseils)
- [Expert IA : métier le plus recherché 2026 — IDHD](https://www.idhd.fr/expert-ia-le-metier-le-plus-recherche/)
- [15 métiers IA qui recrutent 2026 — BGB Formation](https://bgbformation.fr/metiers-ia-2026)
- [Prix d'un expert IA freelance — Digital Unicorn](https://digitalunicorn.fr/le-prix-dun-expert-ia-freelance-pour-entreprise/)
- [Mots-clés SEO longue traîne 2026 — Aurélien Bassemayousse](https://www.aurelien-bassemayousse.fr/ressources/comprendre-utiliser-mots-cle-seo)
- [Mots-clés longue traîne — Axiom Marketing](https://www.axiom-marketing.io/blog/mots-cles-de-longue-traine/)
- [Comment créer un portfolio développeur — Free-Work](https://www.free-work.com/fr/tech-it/blog/free-workers-life/comment-creer-un-portfolio-de-developpeur-web)
- [Comment réussir un portfolio développeur — Coda School](https://www.coda.school/blog/portfolio-developpeur-web)

---

**Prochain pas recommandé** : attaquer la Phase 1 en priorisant `/work/[slug]` qui corrige 6 URLs 404 actuellement présentes dans le sitemap et débloque la Phase 2 (vitrine projets = objectif #1).
