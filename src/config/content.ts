// Configuration des informations personnelles
import { HomeContent, Person } from '@/types/content';

const person: Person = {
    firstName: 'Yann',
    lastName: 'THOBENA',
    get name() {
        return `${this.firstName} ${this.lastName}`;
    },
    role: "Concepteur Développeur d'Applications & Expert IA",
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
