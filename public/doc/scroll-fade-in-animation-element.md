# How to nicely implement scroll animation in a web page

c.f : https://www.ui-layouts.com/components/scroll-animation

## Requirements :

-   install framer motion with :
    `pnpm install framer-motion`

## Basic page exemple :

```ts
'use client';
import React from 'react';
import ScrollElement from '@/components/core/scroll-element';

function index() {
    return (
        <>
            <div className='h-[500px] grid place-content-center'>
                <h1 className='text-6xl font-semibold text-center py-8'>
                    Scroll Down 👇{' '}
                </h1>
            </div>
            <div className='py-2'>
                <div className=' columns-3'>
                    <ScrollElement
                        viewport={{
                            once: true,
                            amount: 0.5,
                            margin: '0px 0px 0px 0px',
                        }}
                    >
                        <img
                            src='https://images.unsplash.com/photo-1724690416947-3cdc197ffab1?q=80&w=600&auto=format&fit=crop'
                            alt=''
                            className='w-full mb-2'
                        />
                    </ScrollElement>
                    <ScrollElement
                        viewport={{
                            once: true,
                            amount: 0.5,
                            margin: '0px 0px 0px 0px',
                        }}
                    >
                        <img
                            src='https://images.unsplash.com/photo-1695763594594-31505b18b58a?q=80&w=600&auto=format&fit=crop'
                            alt=''
                            className='w-full mb-2'
                        />
                    </ScrollElement>
                    <ScrollElement
                        viewport={{
                            once: true,
                            amount: 0.5,
                            margin: '0px 0px 0px 0px',
                        }}
                    >
                        <img
                            src='https://images.unsplash.com/photo-1724888861686-ad3f706ab067?q=80&w=600&auto=format&fit=crop'
                            alt=''
                            className='w-full mb-2'
                        />
                    </ScrollElement>

                    <ScrollElement
                        viewport={{
                            once: true,
                            amount: 0.5,
                            margin: '0px 0px 0px 0px',
                        }}
                        // @ts-ignore
                    >
                        <img
                            src='https://images.unsplash.com/photo-1724884564497-f5024b7e2f93?q=80&w=600&auto=format&fit=crop'
                            alt=''
                            className='w-full mb-2'
                        />
                    </ScrollElement>
                    <ScrollElement
                        viewport={{
                            once: true,
                            amount: 0.5,
                            margin: '0px 0px 0px 0px',
                        }}
                    >
                        <img
                            src='https://images.unsplash.com/photo-1460999158988-6f0380f81f4d?q=80&w=600&auto=format&fit=crop'
                            alt=''
                            className='w-full mb-2'
                        />
                    </ScrollElement>
                    <ScrollElement
                        viewport={{
                            once: true,
                            amount: 0.5,
                            margin: '0px 0px 0px 0px',
                        }}
                    >
                        <img
                            src='https://images.unsplash.com/photo-1478028928718-7bfdb1b32095?q=80&w=600&auto=format&fit=crop'
                            alt=''
                            className='w-full mb-2'
                        />
                    </ScrollElement>
                    <ScrollElement
                        viewport={{
                            once: true,
                            amount: 0.5,
                            margin: '0px 0px 0px 0px',
                        }}
                    >
                        <img
                            src='https://images.unsplash.com/photo-1460999158988-6f0380f81f4d?q=80&w=600&auto=format&fit=crop'
                            alt=''
                            className='w-full mb-2'
                        />
                    </ScrollElement>
                    <ScrollElement
                        viewport={{
                            once: true,
                            amount: 0.5,
                            margin: '0px 0px 0px 0px',
                        }}
                    >
                        <img
                            src='https://images.unsplash.com/photo-1478028928718-7bfdb1b32095?q=80&w=600&auto=format&fit=crop'
                            alt=''
                            className='w-full mb-2'
                        />
                    </ScrollElement>
                    <ScrollElement
                        viewport={{
                            once: true,
                            amount: 0.5,
                            margin: '0px 0px 0px 0px',
                        }}
                    >
                        <img
                            src='https://images.unsplash.com/photo-1460999158988-6f0380f81f4d?q=80&w=600&auto=format&fit=crop'
                            alt=''
                            className='w-full mb-2'
                        />
                    </ScrollElement>
                    <ScrollElement
                        viewport={{
                            once: true,
                            amount: 0.5,
                            margin: '0px 0px 0px 0px',
                        }}
                    >
                        <img
                            src='https://images.unsplash.com/photo-1478028928718-7bfdb1b32095?q=80&w=600&auto=format&fit=crop'
                            alt=''
                            className='w-full mb-2'
                        />
                    </ScrollElement>
                </div>
            </div>
        </>
    );
}

export default index;
```

## Scroll element component :

```ts
import { cn } from '@/src/app/lib/utils';
import {
    motion,
    HTMLMotionProps,
    SVGMotionProps,
    ForwardRefComponent,
    Variant,
    useAnimation,
} from 'framer-motion';
import React from 'react';
type Direction = 'up' | 'down' | 'left' | 'right';

const generateVariants = (
    direction: Direction
): { hidden: Variant; visible: Variant } => {
    const axis = direction === 'left' || direction === 'right' ? 'x' : 'y';
    const value = direction === 'right' || direction === 'down' ? 100 : -100;

    return {
        hidden: { filter: 'blur(10px)', opacity: 0, [axis]: value },
        visible: {
            filter: 'blur(0px)',
            opacity: 1,
            [axis]: 0,
            transition: {
                duration: 0.5,
                ease: 'easeOut',
            },
        },
    };
};

const defaultViewport = { amount: 0.3, margin: '0px 0px -200px 0px' };
type MotionComponentProps = HTMLMotionProps<any> & SVGMotionProps<any>;

interface ScrollElementProps extends Omit<MotionComponentProps, 'children'> {
    children: React.ReactNode;
    className?: string;
    variants?: {
        hidden?: any;
        visible?: any;
    };
    viewport?: {
        amount?: number;
        margin?: string;
        once?: boolean;
    };
    delay?: number;
    direction?: Direction;
}

function ScrollElement({
    children,
    className,
    variants,
    viewport = defaultViewport,
    delay = 0, // Default delay is 0
    direction = 'down',
    ...rest
}: ScrollElementProps) {
    const baseVariants = variants || generateVariants(direction);
    const modifiedVariants = {
        hidden: baseVariants.hidden,
        visible: {
            ...baseVariants.visible,
            transition: {
                ...baseVariants.visible.transition,
                delay, // Apply custom delay here
            },
        },
    };

    return (
        <motion.div
            whileInView='visible'
            initial='hidden'
            variants={modifiedVariants}
            viewport={viewport}
            className={cn(className)}
            {...rest}
        >
            {children}
        </motion.div>
    );
}
export default ScrollElement;
```

## How to customize with Props

| Prop      | Type            | Default                                    | Description                                                                |
| --------- | --------------- | ------------------------------------------ | -------------------------------------------------------------------------- |
| children  | React.ReactNode |                                            | Le contenu à afficher à l'intérieur de l'élément de défilement.            |
| className | string          |                                            | Classe CSS optionnelle pour styliser l'élément de défilement.              |
| variants  | object          |                                            | Variantes d'animation pour différents états de défilement (caché/visible). |
| viewport  | object          | { amount: 0.5, margin: '0px', once: true } | Paramètres déterminant quand l'élément est considéré comme visible.        |
| delay     | number          | 0                                          | Délai avant le démarrage de l'animation, en millisecondes.                 |
| direction | Direction       | 'down'                                     | La direction de défilement pour l'animation (par exemple, 'down', 'up').   |
