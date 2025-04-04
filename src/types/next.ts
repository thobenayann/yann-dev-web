export type PageParams<T extends Record<string, string>> = {
    params: Promise<T>;
};
