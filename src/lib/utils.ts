import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function sanitizeSlug(input: string): string {
    return input
        .toLowerCase()
        .replace(/\./g, 'dot')
        .replace(/\+/g, 'plus')
        .replace(/#/g, 'sharp')
        .replace(/\s+/g, '-');
}
