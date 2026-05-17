import IconCloud from '@/components/magicui/icon-cloud';

const slugs = [
    'react',
    'nextdotjs',
    'tailwindcss',
    'docker',
    'typescript',
    'linux',
    'github',
    'postgresql',
    'mysql',
    'zod',
    'openai',
    'pandas',
    'tensorflow',
    'vercel',
    'javascript',
];

type TechnologiesProps = {
    liveLinks?: boolean;
};

export default function Technologies({ liveLinks = false }: TechnologiesProps) {
    return (
        <div className=''>
            <IconCloud iconSlugs={slugs} liveLinks={liveLinks} />
        </div>
    );
}



