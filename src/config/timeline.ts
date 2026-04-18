// Données typées de la timeline de carrière

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
            'Obtention du titre professionnel Développeur Web et Web Mobile niveau 5.',
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
        labelFr: 'Diplôme CDA — Bac+3',
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
