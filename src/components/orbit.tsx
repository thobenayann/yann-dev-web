import OrbitingCircles from '@/components/magicui/orbiting-circles';
type IconProps = React.SVGProps<SVGSVGElement>;
import { motion } from 'framer-motion';
import { AiOutlineDocker } from 'react-icons/ai';
import { FaGithub, FaLaptop } from 'react-icons/fa';
import {
    SiFastapi,
    SiJavascript,
    SiNextdotjs,
    SiNginx,
    SiOpenai,
    SiPocketbase,
    SiPython,
    SiReact,
    SiSvelte,
    SiTypescript,
    SiUbuntu,
    SiVercel,
} from 'react-icons/si';

export default function Orbit() {
    return (
        <div className='relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-background md:shadow-xl'>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2.5 }}
            >
                <OrbitingCircles
                    className='h-[20px] w-[20px] border-none bg-transparent'
                    duration={3}
                    delay={10}
                    radius={10}
                >
                    <Icons.gitHub />
                </OrbitingCircles>

                <OrbitingCircles
                    className='h-[20px] w-[20px] border-none bg-transparent'
                    duration={20}
                    radius={50}
                    delay={66}
                >
                    <Icons.python />
                </OrbitingCircles>
                <OrbitingCircles
                    className='h-[20px] w-[20px] border-none bg-transparent'
                    duration={20}
                    radius={50}
                    delay={132}
                >
                    <Icons.svelte />
                </OrbitingCircles>
                <OrbitingCircles
                    className='h-[20px] w-[20px] border-none bg-transparent'
                    duration={20}
                    radius={50}
                    delay={198}
                >
                    <Icons.typescript />
                </OrbitingCircles>

                <OrbitingCircles
                    className='h-[30px] w-[40px] border-none bg-transparent'
                    reverse
                    radius={100}
                    delay={20}
                    duration={20}
                >
                    <Icons.vercel />
                </OrbitingCircles>
                <OrbitingCircles
                    className='h-[30px] w-[40px] border-none bg-transparent'
                    reverse
                    radius={100}
                    delay={25}
                    duration={20}
                >
                    <Icons.ubuntu />
                </OrbitingCircles>
                <OrbitingCircles
                    className='h-[30px] w-[40px] border-none bg-transparent'
                    reverse
                    radius={100}
                    delay={30}
                    duration={20}
                >
                    <Icons.docker />
                </OrbitingCircles>
                <OrbitingCircles
                    className='h-[30px] w-[40px] border-none bg-transparent'
                    reverse
                    radius={100}
                    delay={35}
                    duration={20}
                >
                    <Icons.nginx />
                </OrbitingCircles>

                <OrbitingCircles
                    className='h-[40px] w-[40px] border-none bg-transparent'
                    radius={150}
                    duration={40}
                    delay={0}
                >
                    <Icons.fastapi />
                </OrbitingCircles>
                <OrbitingCircles
                    className='h-[40px] w-[40px] border-none bg-transparent'
                    radius={150}
                    duration={40}
                    delay={50}
                >
                    <Icons.openai />
                </OrbitingCircles>
                <OrbitingCircles
                    className='h-[40px] w-[40px] border-none bg-transparent'
                    radius={150}
                    duration={40}
                    delay={100}
                >
                    <Icons.pocketbase />
                </OrbitingCircles>
                <OrbitingCircles
                    className='h-[40px] w-[40px] border-none bg-transparent'
                    radius={150}
                    duration={40}
                    delay={150}
                >
                    <Icons.laptop />
                </OrbitingCircles>
            </motion.div>
        </div>
    );
}

const Icons = {
    gitHub: (props: IconProps) => <FaGithub className='w-full h-full' />,
    docker: (props: IconProps) => <AiOutlineDocker className='w-full h-full' />,
    ubuntu: (props: IconProps) => <SiUbuntu className='w-full h-full' />,
    vercel: (props: IconProps) => <SiVercel className='w-full h-full' />,
    nginx: (props: IconProps) => <SiNginx className='w-full h-full' />,
    react: (props: IconProps) => <SiReact className='w-full h-full' />,
    nextjs: (props: IconProps) => <SiNextdotjs className='w-full h-full' />,
    pocketbase: (props: IconProps) => (
        <SiPocketbase className='w-full h-full' />
    ),
    python: (props: IconProps) => <SiPython className='w-full h-full' />,
    svelte: (props: IconProps) => <SiSvelte className='w-full h-full' />,
    typescript: (props: IconProps) => (
        <SiTypescript className='w-full h-full' />
    ),
    javascript: (props: IconProps) => (
        <SiJavascript className='w-full h-full' />
    ),
    fastapi: (props: IconProps) => <SiFastapi className='w-full h-full' />,
    openai: (props: IconProps) => <SiOpenai className='w-full h-full' />,
    laptop: (props: IconProps) => <FaLaptop className='w-full h-full' />,
};



