import { ReactNode } from 'react';

export interface Person {
    firstName: string;
    lastName: string;
    name: string;
    role: string;
    avatar: string;
    timezone: string;
    location: string;
    languages: string[];
    company: string;
}

export interface HomeContent {
    label: string;
    title: string;
    description: string;
    headline: ReactNode;
    subline: ReactNode;
}
