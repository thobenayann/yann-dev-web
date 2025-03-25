// Configuration des informations personnelles
import { Person } from '@/types/content';

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
};

export default person;
