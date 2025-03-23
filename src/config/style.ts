// Configuration du style général du site

export type ThemeType = 'dark' | 'light' | 'system';
export type NeutralType = 'gray' | 'slate' | 'sand';
export type ColorType =
    | 'blue'
    | 'indigo'
    | 'violet'
    | 'magenta'
    | 'pink'
    | 'red'
    | 'orange'
    | 'yellow'
    | 'moss'
    | 'green'
    | 'emerald'
    | 'aqua'
    | 'cyan';
export type SolidType = 'color' | 'contrast';
export type SolidStyleType = 'flat' | 'plastic';
export type BorderType = 'rounded' | 'playful' | 'conservative';
export type SurfaceType = 'filled' | 'translucent';
export type TransitionType = 'all' | 'micro' | 'macro';
export type ScalingType = '90' | '95' | '100' | '105' | '110';

export type StyleConfig = {
    theme: ThemeType;
    neutral: NeutralType;
    brand: ColorType;
    accent: ColorType;
    solid: SolidType;
    solidStyle: SolidStyleType;
    border: BorderType;
    surface: SurfaceType;
    transition: TransitionType;
    scaling: ScalingType;
};

const style: StyleConfig = {
    theme: 'dark',
    neutral: 'gray',
    brand: 'violet',
    accent: 'orange',
    solid: 'contrast',
    solidStyle: 'flat',
    border: 'playful',
    surface: 'translucent',
    transition: 'all',
    scaling: '100',
};

export default style;
