// Configuration des informations personnelles

export type PersonConfig = {
    firstName: string;
    lastName?: string;
    email?: string;
    location?: string;
    timeZone?: string;
};

const person: PersonConfig = {
    firstName: 'Yann',
    lastName: '',
    email: '',
    location: 'Paris, France',
    timeZone: 'Europe/Paris',
};

export default person;
