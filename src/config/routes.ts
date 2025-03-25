// Configuration des routes du site

export type Route = {
    path: string;
    isEnabled: boolean;
    isProtected?: boolean;
};

export type Routes = {
    [K in '/' | '/about' | '/work' | '/blog' | '/hobbies']: Route;
};

export const baseURL = 'yanndevweb.com' as const;

export const routes: Routes = {
    '/': {
        path: '/',
        isEnabled: true,
    },
    '/about': {
        path: '/about',
        isEnabled: true,
    },
    '/work': {
        path: '/work',
        isEnabled: true,
    },
    '/blog': {
        path: '/blog',
        isEnabled: true,
    },
    '/hobbies': {
        path: '/hobbies',
        isEnabled: true,
    },
} as const;

// Utilitaire pour vérifier si une route est valide
export const isValidRoute = (path: string): path is keyof Routes => {
    return path in routes;
};

// Utilitaire pour obtenir toutes les routes activées
export const getEnabledRoutes = () => {
    return Object.values(routes).filter((route) => route.isEnabled);
};

// Utilitaire pour obtenir toutes les routes protégées
export const getProtectedRoutes = () => {
    return Object.values(routes).filter((route) => route.isProtected);
};
