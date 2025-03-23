// Configuration des routes du site

export type Routes = {
    [key: string]: boolean;
};

export type ProtectedRoutes = {
    [key: string]: boolean;
};

export type BaseURL = string;

const baseURL: BaseURL = 'yanndevweb.com/';

const routes: Routes = {
    '/': true,
    '/about': true,
    '/work': true,
    '/blog': true,
    '/contact': true,
};

// Enable password protection on selected routes
// Set password in the .env file
const protectedRoutes: ProtectedRoutes = {
    // '/admin': true,
    // '/dashboard': true,
};

export { baseURL, protectedRoutes, routes };
