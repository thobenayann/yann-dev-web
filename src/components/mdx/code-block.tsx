'use client';

import { Check, Copy } from 'lucide-react';
import { useRef, useState } from 'react';

type CodeBlockWrapperProps = React.ComponentPropsWithoutRef<'pre'> & {
    'data-language'?: string;
};

export function CodeBlockWrapper({
    children,
    'data-language': language,
    ...props
}: CodeBlockWrapperProps) {
    const preRef = useRef<HTMLPreElement>(null);
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        const code =
            preRef.current?.querySelector('code')?.innerText ?? '';
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // clipboard not available
        }
    };

    return (
        <div className='relative group my-6 rounded-xl overflow-hidden border border-white/10'>
            {/* Header bar */}
            <div className='flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-white/10'>
                <span className='text-xs text-white/40 font-mono'>
                    {language ?? 'code'}
                </span>
                <button
                    onClick={handleCopy}
                    aria-label='Copy code'
                    className='flex items-center gap-1.5 text-xs text-white/40 hover:text-white/80 transition-colors'
                >
                    {copied ? (
                        <>
                            <Check className='h-3.5 w-3.5 text-green-400' />
                            <span className='text-green-400'>Copié</span>
                        </>
                    ) : (
                        <>
                            <Copy className='h-3.5 w-3.5' />
                            <span>Copier</span>
                        </>
                    )}
                </button>
            </div>
            {/* Code */}
            <pre
                ref={preRef}
                {...props}
                className='overflow-x-auto p-4 text-sm leading-relaxed bg-[#0d1117] m-0 rounded-none'
            >
                {children}
            </pre>
        </div>
    );
}
