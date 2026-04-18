# About Page & Career Timeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete `/about` page with Hero Bio, neon career timeline, skills section, and CTA — showcasing the dual CDA + AI Expert identity.

**Architecture:** Data-first approach — typed milestone data in `timeline.ts` feeds a client-side `CareerTimeline` component animated with Framer Motion. A `useExperienceCounter` hook computes live "X ans Y mois" badges. The page is assembled server-side via the Next.js App Router and hydrated on the client.

**Tech Stack:** Next.js 16.2.4 · React 19 · Tailwind CSS 4 · Framer Motion 12 · next-intl 4.9.1 · TypeScript 5 · pnpm

---

## File Map

| Action | Path | Responsibility |
|--------|------|---------------|
| Delete | `src/components/ui/bento/BentoCard.tsx` | Doublon inutilisé |
| Delete | `src/components/ui/bento/BentoGrid.tsx` | Doublon inutilisé |
| Delete | `src/components/ui/bento/BentoPillList.tsx` | Doublon inutilisé |
| Modify | `src/config/content.ts` | Ajouter `roles` dual identity |
| Create | `src/config/timeline.ts` | Types + 9 jalons + 3 tracks |
| Create | `src/hooks/use-experience-counter.ts` | Hook calcul durée dynamique |
| Create | `src/components/ui/career-timeline.tsx` | Composant timeline complet |
| Modify | `messages/fr.json` | Clés About enrichies |
| Modify | `messages/en.json` | Clés About enrichies (EN) |
| Build | `src/app/[locale]/about/page.tsx` | Page complète (4 sections) |

---

## Task 1: Supprimer les composants bento dupliqués

**Files:**
- Delete: `src/components/ui/bento/BentoCard.tsx`
- Delete: `src/components/ui/bento/BentoGrid.tsx`
- Delete: `src/components/ui/bento/BentoPillList.tsx`

- [ ] **Step 1: Supprimer les 3 fichiers**

```bash
rm src/components/ui/bento/BentoCard.tsx
rm src/components/ui/bento/BentoGrid.tsx
rm src/components/ui/bento/BentoPillList.tsx
```

- [ ] **Step 2: Vérifier qu'aucun import ne casse**

```bash
pnpm build 2>&1 | grep -i "error\|failed"
```

Résultat attendu : aucune ligne d'erreur, build passe.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove unused ui/bento duplicate components"
```

---

## Task 2: Mettre à jour content.ts — double identité

**Files:**
- Modify: `src/config/content.ts`

- [ ] **Step 1: Mettre à jour le fichier**

Remplacer le contenu de `src/config/content.ts` par :

```typescript
// Configuration des informations personnelles
import { HomeContent, Person } from '@/types/content';

const person: Person = {
    firstName: 'Yann',
    lastName: 'THOBENA',
    get name() {
        return `${this.firstName} ${this.lastName}`;
    },
    role: 'Concepteur Développeur d\'Applications & Expert IA',
    avatar: '/images/avatar.svg',
    timezone: 'Europe/Paris',
    location: 'Toulouse, France',
    languages: ['French', 'English'],
    company: 'IPANOVA',
};

const home: HomeContent = {
    label: 'Home',
    title: `${person.name}'s Portfolio`,
    description: `Portfolio website showcasing my work as a ${person.role}`,
    headline: 'Application Designer & Developer\n& AI Expert',
    subline: `I'm ${person.firstName}, a fullstack developer and AI Expert at ${person.company}. I design and build web applications while leading AI transformation at enterprise scale.`,
};

export { home, person };
```

- [ ] **Step 2: Vérifier que TypeScript compile**

```bash
pnpm build 2>&1 | grep -i "type error"
```

Résultat attendu : aucune ligne "Type error".

- [ ] **Step 3: Commit**

```bash
git add src/config/content.ts
git commit -m "feat: update person config with dual CDA + AI Expert identity"
```

---

## Task 3: Créer timeline.ts — données typées

**Files:**
- Create: `src/config/timeline.ts`

- [ ] **Step 1: Créer le fichier avec types et données**

```typescript
// src/config/timeline.ts

export type TimelinePhase =
    | 'formation'
    | 'cda-transition'
    | 'cda'
    | 'ai-curious'
    | 'ai-expert';

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

export type ExperienceTrack = {
    id: string;
    startDate: Date;
    labelFr: string;
    labelEn: string;
    color: 'purple' | 'cyan';
    emoji: string;
};

export const MILESTONES: TimelineMilestone[] = [
    {
        id: 'formation-start',
        date: new Date(2020, 7, 1), // Août 2020
        labelFr: "Début formation O'Clock — Bac+2",
        labelEn: "Start O'Clock training — Bac+2",
        descriptionFr:
            'Lancement de la reconversion professionnelle dans le développement web, en plein COVID.',
        descriptionEn:
            'Starting a career change into web development, during COVID.',
        phase: 'formation',
        size: 'normal',
    },
    {
        id: 'diplome-bac2',
        date: new Date(2021, 0, 1), // Janvier 2021
        labelFr: 'Diplôme Développeur Web & Mobile — Bac+2',
        labelEn: 'Web & Mobile Developer Degree — Bac+2',
        descriptionFr:
            "Obtention du titre professionnel Développeur Web et Web Mobile niveau 5.",
        descriptionEn:
            'Awarded the Web and Mobile Developer professional certificate (level 5).',
        phase: 'formation',
        size: 'normal',
    },
    {
        id: 'alternance-ipanova',
        date: new Date(2021, 9, 1), // Octobre 2021
        labelFr: 'Alternance CDA Bac+3 — Ipanova',
        labelEn: 'CDA Apprenticeship Bac+3 — Ipanova',
        descriptionFr:
            "Intégration d'Ipanova en alternance pour le titre Concepteur Développeur d'Applications.",
        descriptionEn:
            'Joined Ipanova as an apprentice for the Application Designer & Developer degree.',
        phase: 'cda-transition',
        size: 'normal',
    },
    {
        id: 'chatgpt-ia',
        date: new Date(2022, 11, 1), // Décembre 2022
        labelFr: 'ChatGPT — la curiosité IA commence',
        labelEn: 'ChatGPT — AI curiosity begins',
        descriptionFr:
            "Découverte de ChatGPT dès sa sortie. Début de l'exploration autonome : Cursor, vibe coding, automatisations IA, Make, n8n.",
        descriptionEn:
            'Discovered ChatGPT at launch. Started autonomous exploration: Cursor, vibe coding, AI automations, Make, n8n.',
        phase: 'ai-curious',
        size: 'normal',
    },
    {
        id: 'diplome-cda',
        date: new Date(2023, 0, 1), // Janvier 2023
        labelFr: "Diplôme CDA — Bac+3",
        labelEn: 'CDA Degree — Bac+3',
        descriptionFr:
            "Obtention du titre professionnel Concepteur Développeur d'Applications niveau 6.",
        descriptionEn:
            'Awarded the Application Designer & Developer professional certificate (level 6).',
        phase: 'cda',
        size: 'normal',
    },
    {
        id: 'senior-ipanova',
        date: new Date(2023, 9, 1), // Octobre 2023
        labelFr: 'Fullstack senior — Ipanova',
        labelEn: 'Senior Fullstack Developer — Ipanova',
        descriptionFr:
            'Poste fullstack senior : React, NestJS, Angular, PHP/Symfony. Support, avant-vente et formation des équipes.',
        descriptionEn:
            'Senior fullstack role: React, NestJS, Angular, PHP/Symfony. Support, pre-sales and team coaching.',
        phase: 'cda',
        size: 'normal',
    },
    {
        id: 'projets-ia-autonomes',
        date: new Date(2024, 9, 1), // Octobre 2024
        labelFr: 'Projets IA autonomes',
        labelEn: 'Autonomous AI Projects',
        descriptionFr:
            "Applications avec Make et n8n, design IA pour Ipanova, analyse d'appels d'offres IA, vibe coding.",
        descriptionEn:
            'Applications with Make and n8n, AI design for Ipanova, AI-powered tender analysis, vibe coding.',
        phase: 'ai-curious',
        size: 'normal',
    },
    {
        id: 'airbus-mission',
        date: new Date(2025, 6, 1), // Juillet 2025
        labelFr: 'Mission Airbus — Expert IA officiel',
        labelEn: 'Airbus Mission — Official AI Expert',
        descriptionFr:
            "Transformation ARP USA chez Airbus : Gemini Workspace, prompt engineering, GEMs SAP/supply chain, formation de centaines d'utilisateurs, applications de visualisation de données critiques.",
        descriptionEn:
            'ARP USA transformation at Airbus: Gemini Workspace, prompt engineering, SAP/supply chain GEMs, training hundreds of users, critical data visualization apps.',
        phase: 'ai-expert',
        size: 'large',
    },
];

export const EXPERIENCE_TRACKS: ExperienceTrack[] = [
    {
        id: 'cda',
        startDate: new Date(2021, 9, 1), // Octobre 2021
        labelFr: "Concepteur Développeur d'Applications",
        labelEn: 'Application Designer & Developer',
        color: 'purple',
        emoji: '💜',
    },
    {
        id: 'ai-curious',
        startDate: new Date(2022, 11, 1), // Décembre 2022
        labelFr: 'Curiosité & pratique IA',
        labelEn: 'AI curiosity & practice',
        color: 'cyan',
        emoji: '🤖',
    },
    {
        id: 'ai-expert',
        startDate: new Date(2025, 6, 1), // Juillet 2025
        labelFr: 'Expert IA — mission Airbus',
        labelEn: 'AI Expert — Airbus mission',
        color: 'cyan',
        emoji: '🚀',
    },
];
```

- [ ] **Step 2: Vérifier que le fichier compile (pas d'erreur TS)**

```bash
pnpm build 2>&1 | grep -i "type error"
```

Résultat attendu : aucune ligne "Type error".

- [ ] **Step 3: Commit**

```bash
git add src/config/timeline.ts
git commit -m "feat: add typed timeline data with 8 milestones and 3 experience tracks"
```

---

## Task 4: Créer use-experience-counter.ts

**Files:**
- Create: `src/hooks/use-experience-counter.ts`

- [ ] **Step 1: Créer le hook**

```typescript
// src/hooks/use-experience-counter.ts
'use client';

import { useEffect, useState } from 'react';

export type ExperienceDuration = {
    years: number;
    months: number;
};

function calculateDuration(startDate: Date): ExperienceDuration {
    const now = new Date();
    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();

    if (months < 0) {
        years -= 1;
        months += 12;
    }

    return { years, months };
}

export function useExperienceCounter(startDate: Date): ExperienceDuration {
    const [duration, setDuration] = useState<ExperienceDuration>(() =>
        calculateDuration(startDate)
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setDuration(calculateDuration(startDate));
        }, 60_000); // recalcule chaque minute

        return () => clearInterval(interval);
    }, [startDate]);

    return duration;
}
```

- [ ] **Step 2: Vérifier la compilation**

```bash
pnpm build 2>&1 | grep -i "type error"
```

Résultat attendu : aucune ligne "Type error".

- [ ] **Step 3: Commit**

```bash
git add src/hooks/use-experience-counter.ts
git commit -m "feat: add useExperienceCounter hook for live career duration badges"
```

---

## Task 5: Créer career-timeline.tsx

**Files:**
- Create: `src/components/ui/career-timeline.tsx`

Ce composant contient trois sous-composants internes : `TimelineNode`, `MilestoneCard`, `ExperienceBadge`.

- [ ] **Step 1: Créer le composant complet**

```typescript
// src/components/ui/career-timeline.tsx
'use client';

import {
    EXPERIENCE_TRACKS,
    MILESTONES,
    type ExperienceTrack,
    type TimelineMilestone,
    type TimelinePhase,
} from '@/config/timeline';
import { useExperienceCounter } from '@/hooks/use-experience-counter';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';

// ─── Couleurs par phase ───────────────────────────────────────────────────────

const NODE_STYLES: Record<TimelinePhase, string> = {
    formation:
        'bg-teal-400 shadow-[0_0_12px_2px_oklch(0.70_0.15_185/0.7)] border-teal-300',
    'cda-transition':
        'bg-gradient-to-b from-teal-400 to-purple-500 shadow-[0_0_14px_3px_oklch(0.60_0.22_240/0.6)] border-purple-400',
    cda: 'bg-purple-500 shadow-[0_0_14px_3px_oklch(0.541_0.281_293/0.7)] border-purple-400',
    'ai-curious':
        'bg-gradient-to-b from-purple-500 to-cyan-400 shadow-[0_0_16px_4px_oklch(0.65_0.20_255/0.6)] border-cyan-400',
    'ai-expert':
        'bg-cyan-400 shadow-[0_0_20px_6px_oklch(0.75_0.18_210/0.8)] border-cyan-300',
};

const DATE_COLOR: Record<TimelinePhase, string> = {
    formation: 'text-teal-400',
    'cda-transition': 'text-purple-400',
    cda: 'text-purple-400',
    'ai-curious': 'text-cyan-400',
    'ai-expert': 'text-cyan-300',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(date: Date, locale: string): string {
    return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
        month: 'long',
        year: 'numeric',
    });
}

// ─── TimelineNode ─────────────────────────────────────────────────────────────

function TimelineNode({
    phase,
    size,
    index,
}: {
    phase: TimelinePhase;
    size: 'normal' | 'large';
    index: number;
}) {
    const isLarge = size === 'large';
    return (
        <motion.div
            className={cn(
                'relative z-10 flex-shrink-0 rounded-full border-2',
                NODE_STYLES[phase],
                isLarge ? 'h-6 w-6' : 'h-4 w-4'
            )}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{
                delay: index * 0.08,
                duration: 0.4,
                type: 'spring',
                stiffness: 300,
            }}
        >
            {/* Halo pulsant pour le nœud Airbus */}
            {isLarge && (
                <span className='absolute inset-0 rounded-full bg-cyan-400 opacity-40 animate-ping' />
            )}
        </motion.div>
    );
}

// ─── MilestoneCard ────────────────────────────────────────────────────────────

function MilestoneCard({
    milestone,
    index,
    locale,
}: {
    milestone: TimelineMilestone;
    index: number;
    locale: string;
}) {
    const label =
        locale === 'fr' ? milestone.labelFr : milestone.labelEn;
    const description =
        locale === 'fr' ? milestone.descriptionFr : milestone.descriptionEn;

    return (
        <motion.div
            className={cn(
                'flex-1 rounded-xl border p-4',
                'bg-white/5 backdrop-blur-sm dark:bg-white/5',
                'border-white/10 dark:border-white/10',
                'hover:bg-white/10 transition-colors duration-200',
                milestone.size === 'large' && 'border-cyan-400/30 bg-cyan-950/20'
            )}
            initial={{ x: 24, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{
                delay: index * 0.08 + 0.1,
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
        >
            <p className={cn('text-xs font-semibold uppercase tracking-wider mb-1', DATE_COLOR[milestone.phase])}>
                {formatDate(milestone.date, locale)}
            </p>
            <h3 className='text-sm font-semibold text-foreground mb-1 leading-snug'>
                {milestone.size === 'large' && (
                    <span className='mr-1'>🚀</span>
                )}
                {label}
            </h3>
            <p className='text-xs text-muted-foreground leading-relaxed'>
                {description}
            </p>
        </motion.div>
    );
}

// ─── ExperienceBadge ──────────────────────────────────────────────────────────

function ExperienceBadge({ track, locale }: { track: ExperienceTrack; locale: string }) {
    const { years, months } = useExperienceCounter(track.startDate);
    const label = locale === 'fr' ? track.labelFr : track.labelEn;
    const yearsLabel = locale === 'fr' ? 'an' : 'yr';
    const yearsLabelPlural = locale === 'fr' ? 'ans' : 'yrs';
    const monthsLabel = locale === 'fr' ? 'mois' : 'mo';

    const durationStr =
        years > 0
            ? `${years} ${years > 1 ? yearsLabelPlural : yearsLabel} ${months > 0 ? `${months} ${monthsLabel}` : ''}`
            : `${months} ${monthsLabel}`;

    return (
        <div
            className={cn(
                'flex items-center gap-3 rounded-xl border px-4 py-3',
                'bg-white/5 backdrop-blur-sm border-white/10',
                track.color === 'purple'
                    ? 'border-purple-500/30'
                    : 'border-cyan-400/30'
            )}
        >
            <span className='text-lg'>{track.emoji}</span>
            <div>
                <p
                    className={cn(
                        'text-lg font-bold tabular-nums',
                        track.color === 'purple' ? 'text-purple-400' : 'text-cyan-400'
                    )}
                >
                    {durationStr.trim()}
                </p>
                <p className='text-xs text-muted-foreground'>{label}</p>
            </div>
        </div>
    );
}

// ─── CareerTimeline (export principal) ───────────────────────────────────────

export function CareerTimeline() {
    const locale = useLocale();

    return (
        <div className='relative w-full max-w-2xl mx-auto'>
            {/* Ligne verticale de fond */}
            <div className='absolute left-[7px] top-0 bottom-0 w-px bg-white/10' />

            {/* Ligne colorée animée (dessine de haut en bas) */}
            <motion.div
                className='absolute left-[7px] top-0 w-px origin-top'
                style={{
                    background:
                        'linear-gradient(to bottom, oklch(0.70 0.15 185), oklch(0.541 0.281 293) 45%, oklch(0.65 0.22 255) 70%, oklch(0.75 0.18 210))',
                    filter: 'blur(0.5px)',
                }}
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            />

            {/* Jalons */}
            <div className='space-y-8 relative'>
                {MILESTONES.map((milestone, index) => (
                    <div key={milestone.id} className='flex items-start gap-4'>
                        <TimelineNode
                            phase={milestone.phase}
                            size={milestone.size}
                            index={index}
                        />
                        <MilestoneCard
                            milestone={milestone}
                            index={index}
                            locale={locale}
                        />
                    </div>
                ))}
            </div>

            {/* Badges live */}
            <motion.div
                className='mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3'
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
            >
                {EXPERIENCE_TRACKS.map((track) => (
                    <ExperienceBadge key={track.id} track={track} locale={locale} />
                ))}
            </motion.div>
        </div>
    );
}
```

- [ ] **Step 2: Vérifier le build**

```bash
pnpm build 2>&1 | tail -20
```

Résultat attendu : `✓ Compiled successfully` et `✓ Generating static pages`.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/career-timeline.tsx
git commit -m "feat: add CareerTimeline component with neon nodes, animated line and live counters"
```

---

## Task 6: Mettre à jour les messages i18n

**Files:**
- Modify: `messages/fr.json`
- Modify: `messages/en.json`

- [ ] **Step 1: Ajouter les clés About dans `messages/fr.json`**

Remplacer le bloc `"About"` existant par :

```json
"About": {
    "title": "À propos de moi",
    "description": "Découvrez Yann THOBENA, Concepteur Développeur d'Applications & Expert IA basé à Toulouse, France",
    "hero": {
        "bio": "Développeur fullstack depuis 2020, j'ai fait évoluer mon expertise vers l'IA dès 2022. Aujourd'hui j'accompagne Airbus dans sa transformation IA tout en continuant à créer des applications web sur mesure chez Ipanova.",
        "location": "Toulouse, France · IPANOVA",
        "roles": {
            "cda": "Concepteur Développeur d'Applications",
            "ai": "Expert IA",
            "aiStatus": "En mission"
        }
    },
    "timeline": {
        "title": "Mon parcours"
    },
    "skills": {
        "title": "Compétences",
        "dev": "Dev Stack",
        "ai": "IA & Outils",
        "softSkills": "Savoir-faire"
    },
    "cta": {
        "title": "Discutons",
        "subtitle": "Ouvert aux opportunités, collaborations et échanges.",
        "linkedin": "LinkedIn",
        "email": "Email"
    }
}
```

- [ ] **Step 2: Ajouter les clés About dans `messages/en.json`**

Remplacer le bloc `"About"` existant par :

```json
"About": {
    "title": "About Me",
    "description": "Meet Yann THOBENA, Application Designer & Developer and AI Expert based in Toulouse, France",
    "hero": {
        "bio": "Fullstack developer since 2020, I expanded into AI expertise from 2022 onwards. Today I support Airbus in their AI transformation while continuing to build custom web applications at Ipanova.",
        "location": "Toulouse, France · IPANOVA",
        "roles": {
            "cda": "Application Designer & Developer",
            "ai": "AI Expert",
            "aiStatus": "On mission"
        }
    },
    "timeline": {
        "title": "My journey"
    },
    "skills": {
        "title": "Skills",
        "dev": "Dev Stack",
        "ai": "AI & Tools",
        "softSkills": "Soft Skills"
    },
    "cta": {
        "title": "Let's talk",
        "subtitle": "Open to opportunities, collaborations and conversations.",
        "linkedin": "LinkedIn",
        "email": "Email"
    }
}
```

- [ ] **Step 3: Vérifier que la build passe**

```bash
pnpm build 2>&1 | grep -i "error\|failed"
```

Résultat attendu : aucune ligne d'erreur.

- [ ] **Step 4: Commit**

```bash
git add messages/fr.json messages/en.json
git commit -m "feat: add enriched About i18n keys (hero, timeline, skills, cta)"
```

---

## Task 7: Construire la page About complète

**Files:**
- Build: `src/app/[locale]/about/page.tsx`

- [ ] **Step 1: Remplacer le placeholder par la page complète**

```typescript
// src/app/[locale]/about/page.tsx
import { CareerTimeline } from '@/components/ui/career-timeline';
import { person } from '@/config/content';
import { routing } from '@/i18n/routing';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Linkedin, Github } from 'lucide-react';
import type { Metadata } from 'next';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'About' });
    return {
        title: t('title'),
        description: t('description'),
    };
}

// ─── Données statiques compétences ───────────────────────────────────────────

const SKILLS = {
    dev: [
        'React', 'Next.js', 'Node.js', 'NestJS', 'TypeScript',
        'PostgreSQL', 'MySQL', 'Docker', 'CI/CD', 'Tailwind CSS',
        'GraphQL', 'Symfony', 'PHP',
    ],
    ai: [
        'Prompt Engineering', 'Claude / Gemini', 'OpenAI API',
        'RAG / Embeddings', 'Make', 'n8n', 'Cursor', 'Claude Code',
        'GEMs Workspace', 'Data Viz Apps',
    ],
    softSkills: [
        'Analyse métier', 'Gestion projet', 'Formation équipes',
        'Estimation / Chiffrage', 'UX / Figma', 'SEO / Webmarketing',
        'Support multi-niveaux', 'Avant-vente',
    ],
} as const;

// ─── PillTag ──────────────────────────────────────────────────────────────────

function PillTag({ label, color }: { label: string; color: 'purple' | 'cyan' | 'neutral' }) {
    const colorClass = {
        purple: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
        cyan: 'bg-cyan-400/10 text-cyan-300 border-cyan-400/20',
        neutral: 'bg-white/5 text-muted-foreground border-white/10',
    }[color];

    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${colorClass}`}
        >
            {label}
        </span>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AboutPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'About' });

    return (
        <main className='container mx-auto px-6 md:px-10 py-16 space-y-24'>

            {/* ── 1. HERO BIO ─────────────────────────────────────────── */}
            <section className='flex flex-col sm:flex-row items-start gap-8'>
                <Image
                    src={person.avatar}
                    alt={person.name}
                    width={80}
                    height={80}
                    className='rounded-full border-2 border-white/10 flex-shrink-0'
                />
                <div className='space-y-3'>
                    <h1 className='text-3xl font-bold tracking-tight'>
                        {person.firstName}{' '}
                        <span className='text-muted-foreground'>{person.lastName}</span>
                    </h1>

                    {/* Badges de rôle */}
                    <div className='flex flex-wrap gap-2'>
                        <span className='inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-sm font-medium text-purple-300'>
                            💜 {t('hero.roles.cda')}
                        </span>
                        <span className='inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-300'>
                            🤖 {t('hero.roles.ai')}
                            <span className='flex items-center gap-1 ml-1'>
                                <span className='h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse' />
                                <span className='text-xs text-green-400'>{t('hero.roles.aiStatus')}</span>
                            </span>
                        </span>
                    </div>

                    <p className='text-sm text-muted-foreground'>{t('hero.location')}</p>

                    <p className='text-base text-foreground/80 max-w-xl leading-relaxed'>
                        {t('hero.bio')}
                    </p>

                    {/* Liens sociaux */}
                    <div className='flex items-center gap-4 pt-1'>
                        <Link
                            href='https://www.linkedin.com/in/yann-thobena/'
                            target='_blank'
                            rel='noopener noreferrer'
                            aria-label='LinkedIn'
                            className='text-muted-foreground hover:text-foreground transition-colors'
                        >
                            <Linkedin className='h-5 w-5' />
                        </Link>
                        <Link
                            href='https://github.com/thobenayann'
                            target='_blank'
                            rel='noopener noreferrer'
                            aria-label='GitHub'
                            className='text-muted-foreground hover:text-foreground transition-colors'
                        >
                            <Github className='h-5 w-5' />
                        </Link>
                        <Link
                            href='mailto:thobena.yann@gmail.com'
                            aria-label='Email'
                            className='text-muted-foreground hover:text-foreground transition-colors'
                        >
                            <Mail className='h-5 w-5' />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── 2. CAREER TIMELINE ──────────────────────────────────── */}
            <section>
                <h2 className='text-xl font-semibold tracking-tight mb-10'>
                    {t('timeline.title')}
                </h2>
                <CareerTimeline />
            </section>

            {/* ── 3. COMPÉTENCES ──────────────────────────────────────── */}
            <section>
                <h2 className='text-xl font-semibold tracking-tight mb-8'>
                    {t('skills.title')}
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    {/* Dev Stack */}
                    <div className='rounded-xl border border-purple-500/20 bg-white/5 p-5 backdrop-blur-sm'>
                        <h3 className='text-sm font-semibold text-purple-400 mb-4'>
                            💜 {t('skills.dev')}
                        </h3>
                        <div className='flex flex-wrap gap-2'>
                            {SKILLS.dev.map((s) => (
                                <PillTag key={s} label={s} color='purple' />
                            ))}
                        </div>
                    </div>

                    {/* IA & Outils */}
                    <div className='rounded-xl border border-cyan-400/20 bg-white/5 p-5 backdrop-blur-sm'>
                        <h3 className='text-sm font-semibold text-cyan-400 mb-4'>
                            🤖 {t('skills.ai')}
                        </h3>
                        <div className='flex flex-wrap gap-2'>
                            {SKILLS.ai.map((s) => (
                                <PillTag key={s} label={s} color='cyan' />
                            ))}
                        </div>
                    </div>

                    {/* Savoir-faire */}
                    <div className='rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm'>
                        <h3 className='text-sm font-semibold text-muted-foreground mb-4'>
                            🤝 {t('skills.softSkills')}
                        </h3>
                        <div className='flex flex-wrap gap-2'>
                            {SKILLS.softSkills.map((s) => (
                                <PillTag key={s} label={s} color='neutral' />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 4. CTA CONTACT ──────────────────────────────────────── */}
            <section className='text-center space-y-4 py-8'>
                <h2 className='text-2xl font-bold'>{t('cta.title')}</h2>
                <p className='text-muted-foreground'>{t('cta.subtitle')}</p>
                <div className='flex justify-center gap-3 pt-2'>
                    <Link
                        href='https://www.linkedin.com/in/yann-thobena/'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors'
                    >
                        <Linkedin className='h-4 w-4' />
                        {t('cta.linkedin')}
                    </Link>
                    <Link
                        href='mailto:thobena.yann@gmail.com'
                        className='inline-flex items-center gap-2 rounded-lg border border-white/20 px-5 py-2.5 text-sm font-medium hover:bg-white/5 transition-colors'
                    >
                        <Mail className='h-4 w-4' />
                        {t('cta.email')}
                    </Link>
                </div>
            </section>

        </main>
    );
}
```

- [ ] **Step 2: Vérifier le build complet**

```bash
pnpm build 2>&1 | tail -25
```

Résultat attendu :
```
✓ Compiled successfully
✓ Generating static pages (9/9)
Route (app)
├ ● /[locale]
├ ƒ /[locale]/about   ← doit apparaître
...
ƒ Proxy (Middleware)
```

- [ ] **Step 3: Vérifier visuellement en dev**

```bash
pnpm dev
```

Ouvrir `http://localhost:3000/fr/about` et vérifier :
- Hero Bio avec les deux badges (purple CDA + cyan Expert IA avec point vert)
- Timeline avec 8 nœuds colorés et animation au scroll
- Badges live "X ans Y mois" en bas de la timeline
- Nœud Airbus plus grand avec animation ping cyan
- 3 colonnes de compétences
- CTA avec boutons LinkedIn et Email

- [ ] **Step 4: Commit final**

```bash
git add src/app/[locale]/about/page.tsx
git commit -m "feat: build complete About page with hero bio, neon career timeline, skills and CTA"
```

---

## Self-Review

**Spec coverage:**

| Spec requirement | Tâche couverte |
|-----------------|----------------|
| Suppression doublons bento | Task 1 ✅ |
| Double identité content.ts | Task 2 ✅ |
| 8 jalons timeline typés | Task 3 ✅ |
| Hook live counter | Task 4 ✅ |
| Composant CareerTimeline (ligne, nœuds, cards, badges) | Task 5 ✅ |
| i18n fr + en clés About | Task 6 ✅ |
| Page About 4 sections | Task 7 ✅ |
| Hero Bio (avatar, badges, bio, socials) | Task 7 ✅ |
| Badge "En mission" pulsant | Task 7 ✅ |
| Nœud Airbus large + halo | Task 5 ✅ |
| 3 colonnes compétences (pill tags) | Task 7 ✅ |
| CTA LinkedIn + Email | Task 7 ✅ |
| Pas de barres de progression | Task 7 ✅ (pill tags uniquement) |
| Mobile responsive | Task 5 + 7 ✅ (grid-cols-1 mobile) |

**Types consistency check:**
- `TimelinePhase` défini Task 3, utilisé identiquement Task 5 ✅
- `TimelineMilestone.size` (`'normal' | 'large'`) cohérent Tasks 3, 5, 7 ✅
- `ExperienceTrack.color` (`'purple' | 'cyan'`) cohérent Tasks 3, 5 ✅
- `useExperienceCounter(startDate: Date): ExperienceDuration` — signature identique Tasks 4 et 5 ✅
- `MILESTONES` et `EXPERIENCE_TRACKS` exportés Task 3, importés Task 5 ✅

**Placeholders scan:** Aucun TBD, TODO ou "implement later" détecté ✅
