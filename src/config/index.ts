// Point d'entrée pour toutes les configurations
import effects, { EffectsConfig } from './effects';
import { baseURL, routes } from './routes';
import style, { StyleConfig } from './style';

// Types d'affichage
export type DisplayConfig = {
    location: boolean;
    time: boolean;
};

const display: DisplayConfig = {
    location: true,
    time: true,
};

// Configuration principale
export { baseURL, display, effects, routes, style };

// Export des types
export type { EffectsConfig, StyleConfig };
