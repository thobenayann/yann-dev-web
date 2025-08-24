import type { IconType } from 'react-icons';
import { AiFillHome } from 'react-icons/ai';
import { BsFillPersonFill } from 'react-icons/bs';
import { FaBlog } from 'react-icons/fa';
import { IoGameController } from 'react-icons/io5';
import { MdWork } from 'react-icons/md';

export type SeparatorTab = { type: 'separator' };
export type NavTab = {
    title: string;
    icon: IconType;
    path: `/${string}` | '/';
};
export type NavigationTab = SeparatorTab | NavTab;

export const navigationTabs: readonly NavigationTab[] = [
    {
        title: '',
        icon: AiFillHome,
        path: '/',
    },
    { type: 'separator' },
    {
        title: 'About',
        icon: BsFillPersonFill,
        path: '/about',
    },
    {
        title: 'Work',
        icon: MdWork,
        path: '/work',
    },
    {
        title: 'Blog',
        icon: FaBlog,
        path: '/blog',
    },
    {
        title: 'Hobbies',
        icon: IoGameController,
        path: '/hobbies',
    },
];
