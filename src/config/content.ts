// Configuration des informations personnelles
import { HomeContent, Person } from '@/types/content';

const person: Person = {
    firstName: 'Yann',
    lastName: 'THOBENA',
    get name() {
        return `${this.firstName} ${this.lastName}`;
    },
    role: 'Application Designer & Developer',
    avatar: '/images/avatar.svg',
    timezone: 'Europe/Paris', // Expecting the IANA time zone identifier
    location: 'Toulouse, France',
    languages: ['French', 'English'], // optional: Leave the array empty if you don't want to display languages
    company: 'IPANOVA',
};

const home: HomeContent = {
    label: 'Home',
    title: `${person.name}'s Portfolio`,
    description: `Portfolio website showcasing my work as a ${person.role}`,
    headline: 'Application Designer & Developer',
    subline: `I'm ${person.firstName}, an application designer at ${person.company}, where I craft intuitive user experiences. I am also a fullstack web developer, creating robust and scalable web applications.`,
};

export { home, person };
