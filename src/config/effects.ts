// Configuration des effets visuels du site

/**
 * Configuration du masque qui suit le curseur
 *
 * @param cursor - Si true, le masque suit le curseur de la souris
 * @param x - Position X du masque (en pourcentage) quand cursor est false
 * @param y - Position Y du masque (en pourcentage) quand cursor est false
 * @param radius - Rayon du masque (en vh)
 */
export type MaskConfig = {
    cursor: boolean;
    x: number;
    y: number;
    radius: number;
};

/**
 * Configuration du dégradé de fond
 *
 * @param display - Si true, affiche le dégradé
 * @param x - Position X du centre du dégradé (en pourcentage)
 * @param y - Position Y du centre du dégradé (en pourcentage)
 * @param width - Largeur du dégradé (en pourcentage)
 * @param height - Hauteur du dégradé (en pourcentage)
 * @param tilt - Rotation du dégradé (en degrés)
 * @param colorStart - Couleur de départ du dégradé (format CSS valide)
 * @param colorEnd - Couleur de fin du dégradé (format CSS valide)
 * @param opacity - Opacité du dégradé (0-100)
 */
export type GradientConfig = {
    display: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
    tilt: number;
    colorStart: string;
    colorEnd: string;
    opacity: number;
};

/**
 * Configuration des points d'arrière-plan
 *
 * @param display - Si true, affiche les points
 * @param size - Taille des points (sera multipliée par 12px)
 * @param color - Couleur des points (format CSS valide)
 * @param opacity - Opacité des points (0-100)
 */
export type DotsConfig = {
    display: boolean;
    size: number;
    color: string;
    opacity: number;
};

/**
 * Configuration des lignes diagonales
 *
 * @param display - Si true, affiche les lignes diagonales
 * @param color - Couleur des lignes (format CSS valide)
 * @param opacity - Opacité des lignes (0-100)
 */
export type LinesConfig = {
    display: boolean;
    color: string;
    opacity: number;
};

/**
 * Configuration de la grille
 *
 * @param display - Si true, affiche la grille
 * @param color - Couleur de la grille (format CSS valide)
 * @param opacity - Opacité de la grille (0-100)
 */
export type GridConfig = {
    display: boolean;
    color: string;
    opacity: number;
};

/**
 * Configuration complète des effets visuels
 */
export type EffectsConfig = {
    mask: MaskConfig;
    gradient: GradientConfig;
    dots: DotsConfig;
    lines: LinesConfig;
    grid: GridConfig;
};

/**
 * Configuration des effets visuels par défaut
 *
 * - mask: crée un effet de "trou" qui suit le curseur
 * - gradient: ajoute un dégradé de couleur qui se diffuse sur tout l'arrière-plan
 * - dots: crée un motif de points sur tout l'arrière-plan
 * - lines: ajoute des lignes diagonales à 45° sur l'arrière-plan
 * - grid: ajoute une grille de lignes horizontales et verticales
 */
const effects: EffectsConfig = {
    mask: {
        cursor: true,
        x: 0,
        y: 0,
        radius: 75,
    },
    gradient: {
        display: true,
        x: 50,
        y: 0,
        width: 100,
        height: 100,
        tilt: 0,
        colorStart: 'oklch(0.541 0.281 293.009)',
        colorEnd: 'transparent',
        opacity: 50,
    },
    dots: {
        display: true,
        size: 2,
        color: 'oklch(0.894 0.057 293.283)',
        opacity: 20,
    },
    lines: {
        display: false,
        color: 'oklch(0.894 0.057 293.283)',
        opacity: 50,
    },
    grid: {
        display: false,
        color: 'oklch(0.894 0.057 293.283)',
        opacity: 30,
    },
};

export default effects;
