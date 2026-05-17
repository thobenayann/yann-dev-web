# Design Spec — Page About & Career Timeline Néon

**Date:** 2026-04-18  
**Projet:** Portfolio Yann THOBENA (yann-dev-web)  
**Stack:** Next.js 16.2.4 · React 19 · Tailwind CSS 4 · Framer Motion 12 · next-intl 4.9.1

---

## Contexte

La page `/about` est actuellement un placeholder vide (`<h1>About</h1>`). L'objectif est de la construire entièrement pour :

1. Valoriser la **double identité professionnelle** : Concepteur Développeur d'Applications + Expert IA
2. Narrer le **parcours chronologique** via une timeline néon dynamique (Approche B)
3. Présenter les **compétences** de façon différenciée par rapport à la BentoGrid homepage

En parallèle : nettoyage du composant `BentoCard` doublon (`src/components/ui/bento/`) et mise à jour de l'identité dans `content.ts`.

---

## Périmètre

### Dans le scope
- Page `src/app/[locale]/about/page.tsx` (construction complète)
- Composant `CareerTimeline` (nouveau)
- Hook `useExperienceCounter` (nouveau)
- Données timeline dans `src/config/timeline.ts` (nouveau)
- Mise à jour `src/config/content.ts` (rôle dual)
- Mise à jour `messages/fr.json` + `messages/en.json` (clés About enrichies)
- Suppression de `src/components/ui/bento/BentoCard.tsx` et `BentoGrid.tsx` (inutilisés)

### Hors scope
- Homepage BentoGrid (inchangée)
- Pages Blog, Hobbies, Work
- Nouveau design de la page d'accueil

---

## Structure de la page About

Quatre sections dans l'ordre vertical :

```
1. Hero Bio        — Avatar + double identité + bio courte + liens sociaux
2. Career Timeline — Ligne néon chromée avec jalons et badge live
3. Compétences     — 3 colonnes pill tags (Dev / IA / Savoir-faire)
4. CTA Contact     — Appel à l'action vers LinkedIn / email
```

---

## Section 1 — Hero Bio

### Layout
- Avatar à gauche (SVG existant `/images/avatar.svg`)
- Nom + deux badges de rôle colorés côte à côte
- Localisation + entreprise
- Bio courte 2-3 phrases (i18n)
- 3 icônes sociales (LinkedIn, GitHub, Email) via Lucide

### Badges de rôle
| Badge | Couleur | Détail |
|-------|---------|--------|
| Concepteur Développeur d'Applications | `purple` (brand oklch 0.541 0.281 293) | Statique |
| Expert IA | `cyan` (oklch 0.75 0.18 210) | + indicateur `● En mission` pulsant (vert) |

### Bio (bilingual)
- **FR :** "Développeur fullstack depuis 2020, j'ai fait évoluer mon expertise vers l'IA dès 2022. Aujourd'hui j'accompagne Airbus dans sa transformation IA tout en continuant à créer des applications web sur mesure chez Ipanova."
- **EN :** "Fullstack developer since 2020, I expanded into AI expertise from 2022 onwards. Today I support Airbus in their AI transformation while continuing to build custom web applications at Ipanova."

---

## Section 2 — Career Timeline Néon (Approche B)

### Principe
Ligne verticale unique qui **change de couleur** selon la phase de carrière. Les jalons sont des cards glassmorphiques. La ligne se dessine au scroll (Framer Motion `scaleY`).

### Palette de couleurs par phase

| Phase | Couleur | OKLCH |
|-------|---------|-------|
| Formation | Teal | `oklch(0.70 0.15 185)` |
| Transition teal→purple | Dégradé | gradient CSS |
| CDA Pro | Purple (brand) | `oklch(0.541 0.281 293)` |
| CDA + IA cohabitent | Purple+Cyan dégradé | gradient CSS |
| Expert IA officiel | Cyan | `oklch(0.75 0.18 210)` |

### Jalons (9 nœuds)

| # | Date | Label | Phase | Taille nœud |
|---|------|-------|-------|-------------|
| 1 | Août 2020 | Début formation O'Clock — Bac+2 | Teal | Normal |
| 2 | Jan 2021 | Diplôme Développeur Web Bac+2 | Teal | Normal |
| 3 | Oct 2021 | Alternance CDA Bac+3 + intégration Ipanova | Teal→Purple | Normal |
| 4 | Déc 2022 | ChatGPT — curiosité IA démarre | Purple+Cyan | Normal |
| 5 | Jan 2023 | Diplôme CDA Bac+3 | Purple | Normal |
| 6 | Oct 2023 | Poste fullstack senior Ipanova | Purple | Normal |
| 7 | Oct 2024 | Projets IA autonomes (Make, n8n, vibe coding, apps) | Purple+Cyan fort | Normal |
| 8 | **Juil 2025** | **Mission Airbus — Expert IA officiel** | Cyan | **Large + halo double** |
| 9 | Aujourd'hui | Badge live double | Terminal | Terminal |

### Animations (Framer Motion 12 — déjà installé)

| Élément | Animation |
|---------|-----------|
| Ligne verticale | `scaleY: 0→1`, `transformOrigin: top`, durée 1.5s, easing `[0.25, 0.46, 0.45, 0.94]` |
| Nœud standard ◉ | `scale: 0→1` + `opacity` en `whileInView`, délai échelonné par index |
| Nœud Airbus 🚀 | 2× taille standard + halo CSS `@keyframes` pulse cyan |
| Cards glassmorphiques | Slide-in `x: 30→0` + `opacity` en `whileInView` |

### Badge live (compteur dynamique)

En bas de la timeline, 3 badges calculés côté client via `useExperienceCounter` :

```
💜  X ans Y mois  ·  Concepteur Développeur d'Applications   (depuis Oct 2021)
🤖  X ans Y mois  ·  Curiosité & pratique IA                (depuis Déc 2022)
🚀  X mois        ·  Expert IA — mission Airbus              (depuis Juil 2025)
```

Le hook recalcule toutes les 60 secondes. Start dates hardcodées dans `timeline.ts`.

---

## Section 3 — Compétences Techniques

### Layout
3 cards glassmorphiques côte à côte (desktop) / empilées (mobile).

### Colonnes

| Colonne | Couleur titre | Contenu |
|---------|---------------|---------|
| 💜 Dev Stack | Purple | React, Next.js, Node/NestJS, TypeScript, PostgreSQL, Docker/CI-CD, Tailwind CSS, GraphQL, Symfony/PHP |
| 🤖 IA & Outils | Cyan | Prompt Engineering, Claude/Gemini/OpenAI, RAG/Embeddings, Make/n8n, Cursor/Claude Code, GEMs Workspace, Apps data viz |
| 🤝 Savoir-faire | Neutre | Analyse métier, Gestion projet, Formation équipes, Estimation/chiffrage, UX/Figma, SEO/Webmarketing, Support multi-niveaux |

### Rendu
- Chaque compétence = pill tag (style `BentoPillList` existant)
- Pas de barres de progression
- Données dans `content.ts` (objet TypeScript statique, pas d'i18n nécessaire)

---

## Section 4 — CTA Contact

- Titre court : "Discutons" / "Let's talk"
- Sous-titre : "Ouvert aux opportunités, collaborations et échanges"
- 2 boutons : `[LinkedIn]` (primary) `[Email]` (outline)
- Style cohérent avec les boutons existants (`src/components/ui/button.tsx`)

---

## Architecture des fichiers

### Nouveaux fichiers
```
src/
├── config/
│   └── timeline.ts                    ← données typées (jalons, dates, couleurs)
├── hooks/
│   └── use-experience-counter.ts      ← hook calcul dynamique X ans Y mois
└── components/
    └── ui/
        └── career-timeline.tsx        ← composant principal (client)
```

### Fichiers modifiés
```
src/
├── app/[locale]/about/
│   └── page.tsx                       ← construction complète (remplace placeholder)
├── config/
│   └── content.ts                     ← role dual CDA + Expert IA
└── messages/
    ├── fr.json                        ← clés About enrichies (bio, sections)
    └── en.json                        ← idem EN

docs/superpowers/specs/
└── 2026-04-18-about-page-career-timeline-design.md  ← ce fichier
```

### Fichiers supprimés
```
src/components/ui/bento/BentoCard.tsx  ← doublon inutilisé
src/components/ui/bento/BentoGrid.tsx  ← doublon inutilisé
```

### Pas de nouvelle dépendance
Framer Motion 12 est déjà installé. Aucun package supplémentaire requis.

---

## Types TypeScript

```typescript
// src/config/timeline.ts

export type TimelinePhase = 'formation' | 'cda' | 'ai-curious' | 'ai-expert';

export type TimelineMilestone = {
  id: string;
  date: Date;
  labelFr: string;
  labelEn: string;
  descriptionFr: string;
  descriptionEn: string;
  phase: TimelinePhase;
  size: 'normal' | 'large';
};

export type ExperienceCounter = {
  startDate: Date;
  labelFr: string;
  labelEn: string;
  color: 'purple' | 'cyan';
  emoji: string;
};
```

---

## Internationalisation

Nouvelles clés à ajouter dans `messages/fr.json` et `messages/en.json` :

```json
"About": {
  "hero": {
    "bio": "...",
    "location": "Toulouse, France · IPANOVA",
    "roles": {
      "cda": "Concepteur Développeur d'Applications",
      "ai": "Expert IA",
      "aiStatus": "En mission"
    }
  },
  "timeline": {
    "title": "Mon parcours",
    "liveCounter": {
      "cda": "Concepteur Développeur d'Applications",
      "aiCurious": "Curiosité & pratique IA",
      "aiExpert": "Expert IA — mission Airbus"
    }
  },
  "skills": {
    "title": "Compétences",
    "dev": "Dev Stack",
    "ai": "IA & Outils",
    "softSkills": "Savoir-faire"
  },
  "cta": {
    "title": "Discutons",
    "subtitle": "Ouvert aux opportunités, collaborations et échanges",
    "linkedin": "LinkedIn",
    "email": "Email"
  }
}
```

---

## Décisions de conception

| Décision | Justification |
|----------|--------------|
| Timeline sur About (pas Homepage) | Homepage = "ce que je fais". About = "qui je suis et d'où je viens". Pas de double emploi avec BentoGrid. |
| Ligne unique avec dégradé (pas Gantt) | Narrative > objectivité. Le dégradé purple→cyan raconte que l'IA a émergé du dev. |
| Pas de barres de progression | Anti-pattern : subjectif, infantilisant, jamais calibré. |
| Badge "En mission" pulsant | Signal fort qu'Airbus est une mission active, pas passée. |
| Colonne Savoir-faire | Différenciateur réel vs. autres devs. Passé commercial = force. |
| `useRef` nullable (`T \| null`) | React 19 breaking change — déjà corrigé dans l'upgrade. |
