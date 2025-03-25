'use client';

import { Frown } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

import { makeUrlsExternal } from '@/lib/helpers';

interface ErrorPageProps {
    error: Error & {
        digest?: string;
    };
    reset: () => void;
}

const ErrorPage = ({ error, reset }: ErrorPageProps) => {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className='relative grid min-h-dvh place-content-center'>
            <div className='absolute inset-0 -z-10 size-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]' />

            <div className='container'>
                <div className='flex flex-col items-center justify-center text-center'>
                    <Frown className='size-16 text-gray-600' />
                    <h1 className='mt-4 text-balance text-3xl font-black italic'>
                        {error?.name
                            ? error.name.replace(/([a-z])([A-Z])/g, '$1 $2')
                            : 'Internal Server Error!'}
                    </h1>
                    <p className='mx-auto my-4 max-w-xl text-center text-base'>
                        Oops! Something went wrong{' '}
                        <strong
                            dangerouslySetInnerHTML={{
                                __html: makeUrlsExternal(error.message),
                            }}
                        />
                        It looks like there is an issue with the API request, or
                        a variable might not be properly defined. Please check
                        your code or try again later .
                    </p>

                    <div className='flex items-center gap-4'>
                        <span
                            onClick={() => reset()}
                            className='text-xs md:text-base'
                        >
                            Try again
                        </span>

                        <Link href='/'>
                            <span className='text-xs md:text-base'>
                                Back to home
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
