import { CodeBlockWrapper } from './code-block';
import Image from 'next/image';
import type { MDXComponents } from 'mdx/types';

export function getMDXComponents(): MDXComponents {
    return {
        pre: (props) => <CodeBlockWrapper {...(props as React.ComponentPropsWithoutRef<'pre'>)} />,
        img: ({ src, alt, ...props }) => (
            <span className='block my-6 rounded-xl overflow-hidden'>
                <Image
                    src={src ?? ''}
                    alt={alt ?? ''}
                    width={800}
                    height={450}
                    className='w-full h-auto rounded-xl'
                    {...(props as object)}
                />
            </span>
        ),
    };
}
