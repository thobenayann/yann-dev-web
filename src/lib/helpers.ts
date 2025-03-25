/**
 * Converts plain URLs in a text into clickable HTML links
 * @param text - The text containing URLs to be converted
 * @returns The text with URLs converted to HTML anchor tags
 * @example
 * makeUrlsExternal("Visit https://example.com")
 * // Returns: 'Visit <a class="hover:underline" href="https://example.com" target="_blank">https://example.com</a>'
 */
export function makeUrlsExternal(text: string) {
    const urlPattern = /(https?:\/\/[^\s]+)/g;

    return text.replace(urlPattern, function (url) {
        return `<a class="hover:underline" href="${url}" target="_blank">${url}</a>`;
    });
}

/**
 * Capitalizes the first letter of each word in a string
 * @param input - The string to be capitalized
 * @returns The string with the first letter of each word capitalized
 * @example
 * capitalize("hello world")
 * // Returns: "Hello World"
 *
 * capitalize("")
 * // Returns: ""
 */
export const capitalize = (input: string) => {
    if (!input) return '';
    return input
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};
