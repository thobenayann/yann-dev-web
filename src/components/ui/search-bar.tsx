'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { CircleDot, Search, X } from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

const GooeyFilter = () => (
    <svg
        style={{ position: 'absolute', width: 0, height: 0 }}
        aria-hidden='true'
    >
        <defs>
            <filter id='gooey-effect'>
                <feGaussianBlur in='SourceGraphic' stdDeviation='7' result='blur' />
                <feColorMatrix
                    in='blur'
                    type='matrix'
                    values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -8'
                    result='goo'
                />
                <feComposite in='SourceGraphic' in2='goo' operator='atop' />
            </filter>
        </defs>
    </svg>
);

interface SearchBarProps {
    placeholder?: string;
    suggestions?: string[];
    defaultValue?: string;
    onSearch?: (query: string) => void;
}

export function SearchBar({
    placeholder = 'Search…',
    suggestions: suggestionsProp = [],
    defaultValue = '',
    onSearch,
}: SearchBarProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState(defaultValue);
    const [isAnimating, setIsAnimating] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [isClicked, setIsClicked] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const isUnsupportedBrowser = useMemo(() => {
        if (typeof window === 'undefined') return false;
        const ua = navigator.userAgent.toLowerCase();
        const isSafari =
            ua.includes('safari') &&
            !ua.includes('chrome') &&
            !ua.includes('chromium');
        return isSafari || ua.includes('crios');
    }, []);

    // Debounce: notify parent 300 ms after last keystroke
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch?.(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        const filtered = value.trim()
            ? suggestionsProp
                  .filter((item) =>
                      item.toLowerCase().includes(value.toLowerCase())
                  )
                  .slice(0, 6)
            : [];
        setFilteredSuggestions(filtered);
    };

    const handleClear = () => {
        setSearchQuery('');
        setFilteredSuggestions([]);
        onSearch?.('');
        inputRef.current?.focus();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            onSearch?.(searchQuery);
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 1000);
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isFocused) {
            const rect = e.currentTarget.getBoundingClientRect();
            setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }
    };

    const handleClick = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 800);
    };

    useEffect(() => {
        if (isFocused) inputRef.current?.focus();
    }, [isFocused]);

    const searchIconVariants = {
        initial: { scale: 1 },
        animate: {
            rotate: isAnimating ? [0, -15, 15, -10, 10, 0] : 0,
            scale: isAnimating ? [1, 1.3, 1] : 1,
            transition: { duration: 0.6, ease: 'easeInOut' },
        },
    };

    const suggestionVariants = {
        hidden: (i: number) => ({
            opacity: 0, y: -10, scale: 0.95,
            transition: { duration: 0.15, delay: i * 0.05 },
        }),
        visible: (i: number) => ({
            opacity: 1, y: 0, scale: 1,
            transition: { type: 'spring', stiffness: 300, damping: 15, delay: i * 0.07 },
        }),
        exit: (i: number) => ({
            opacity: 0, y: -5, scale: 0.9,
            transition: { duration: 0.1, delay: i * 0.03 },
        }),
    };

    const particles = Array.from({ length: isFocused ? 18 : 0 }, (_, i) => (
        <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{
                x: [0, (Math.random() - 0.5) * 40],
                y: [0, (Math.random() - 0.5) * 40],
                scale: [0, Math.random() * 0.8 + 0.4],
                opacity: [0, 0.8, 0],
            }}
            transition={{
                duration: Math.random() * 1.5 + 1.5,
                ease: 'easeInOut',
                repeat: Number.POSITIVE_INFINITY,
                repeatType: 'reverse',
            }}
            className='absolute w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400'
            style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                filter: 'blur(2px)',
            }}
        />
    ));

    const clickParticles = isClicked
        ? Array.from({ length: 14 }, (_, i) => (
              <motion.div
                  key={`click-${i}`}
                  initial={{ x: mousePosition.x, y: mousePosition.y, scale: 0, opacity: 1 }}
                  animate={{
                      x: mousePosition.x + (Math.random() - 0.5) * 160,
                      y: mousePosition.y + (Math.random() - 0.5) * 160,
                      scale: Math.random() * 0.8 + 0.2,
                      opacity: [1, 0],
                  }}
                  transition={{ duration: Math.random() * 0.8 + 0.5, ease: 'easeOut' }}
                  className='absolute w-3 h-3 rounded-full'
                  style={{
                      background: `rgba(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 200) + 55},${Math.floor(Math.random() * 255)},0.8)`,
                      boxShadow: '0 0 8px rgba(255,255,255,0.8)',
                  }}
              />
          ))
        : null;

    return (
        <div className='relative w-full'>
            <GooeyFilter />
            <motion.form
                onSubmit={handleSubmit}
                className='relative flex items-center w-full'
                initial={{ width: '280px' }}
                animate={{ width: isFocused ? '400px' : '280px', scale: isFocused ? 1.02 : 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                onMouseMove={handleMouseMove}
            >
                <motion.div
                    className={cn(
                        'flex items-center w-full rounded-full border relative overflow-hidden backdrop-blur-md',
                        isFocused
                            ? 'border-transparent shadow-xl'
                            : 'border-white/15 bg-white/5'
                    )}
                    animate={{
                        boxShadow: isClicked
                            ? '0 0 40px rgba(139,92,246,0.5), 0 0 15px rgba(236,72,153,0.7) inset'
                            : isFocused
                              ? '0 15px 35px rgba(0,0,0,0.3)'
                              : '0 0 0 rgba(0,0,0,0)',
                    }}
                    onClick={handleClick}
                >
                    {isFocused && (
                        <motion.div
                            className='absolute inset-0 -z-10'
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: 0.1,
                                background: [
                                    'linear-gradient(90deg,#7c3aed 0%,#ec4899 100%)',
                                    'linear-gradient(90deg,#6366f1 0%,#8b5cf6 100%)',
                                    'linear-gradient(90deg,#7c3aed 0%,#ec4899 100%)',
                                ],
                            }}
                            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
                        />
                    )}

                    <div
                        className='absolute inset-0 overflow-hidden rounded-full -z-5'
                        style={{ filter: isUnsupportedBrowser ? 'none' : 'url(#gooey-effect)' }}
                    >
                        {particles}
                    </div>

                    {isClicked && (
                        <>
                            <motion.div
                                className='absolute inset-0 -z-5 rounded-full bg-purple-400/10'
                                initial={{ scale: 0, opacity: 0.7 }}
                                animate={{ scale: 2, opacity: 0 }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                            />
                            <motion.div
                                className='absolute inset-0 -z-5 rounded-full bg-white/10'
                                initial={{ opacity: 0.5 }}
                                animate={{ opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                            />
                        </>
                    )}

                    {clickParticles}

                    {/* Search icon */}
                    <motion.div
                        className='pl-4 pr-3 py-3 flex-shrink-0'
                        variants={searchIconVariants}
                        initial='initial'
                        animate='animate'
                    >
                        <Search
                            size={16}
                            strokeWidth={isFocused ? 2.5 : 2}
                            className={cn(
                                'transition-all duration-300',
                                isAnimating
                                    ? 'text-purple-400'
                                    : isFocused
                                      ? 'text-purple-400'
                                      : 'text-muted-foreground'
                            )}
                        />
                    </motion.div>

                    {/* Input */}
                    <input
                        ref={inputRef}
                        type='text'
                        placeholder={placeholder}
                        value={searchQuery}
                        onChange={handleSearch}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                        className={cn(
                            'w-full py-3 bg-transparent outline-none placeholder:text-muted-foreground/50 font-medium text-sm relative z-10',
                            isFocused
                                ? 'text-foreground tracking-wide'
                                : 'text-muted-foreground'
                        )}
                    />

                    {/* Clear (×) button */}
                    <AnimatePresence>
                        {searchQuery && (
                            <motion.button
                                type='button'
                                onClick={handleClear}
                                initial={{ opacity: 0, scale: 0.7 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.7 }}
                                transition={{ duration: 0.15 }}
                                className='mr-3 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors cursor-pointer flex-shrink-0 relative z-10'
                                aria-label='Clear search'
                            >
                                <X size={14} strokeWidth={2.5} />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.form>

            {/* Suggestions dropdown */}
            <AnimatePresence>
                {isFocused && filteredSuggestions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: 10, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className='absolute z-20 w-full mt-2 overflow-hidden bg-background/90 backdrop-blur-md rounded-xl shadow-xl border border-white/10'
                        style={{ maxHeight: '280px', overflowY: 'auto' }}
                    >
                        <div className='p-2'>
                            {filteredSuggestions.map((suggestion, index) => (
                                <motion.div
                                    key={suggestion}
                                    custom={index}
                                    variants={suggestionVariants}
                                    initial='hidden'
                                    animate='visible'
                                    exit='exit'
                                    onClick={() => {
                                        setSearchQuery(suggestion);
                                        onSearch?.(suggestion);
                                        setFilteredSuggestions([]);
                                        setIsFocused(false);
                                    }}
                                    className='flex items-center gap-2 px-4 py-2 cursor-pointer rounded-lg hover:bg-purple-500/10 group'
                                >
                                    <motion.div
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: index * 0.06 }}
                                    >
                                        <CircleDot
                                            size={13}
                                            className='text-purple-400 group-hover:text-purple-300'
                                        />
                                    </motion.div>
                                    <motion.span
                                        className='text-sm text-muted-foreground group-hover:text-foreground'
                                        initial={{ x: -5, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: index * 0.08 }}
                                    >
                                        {suggestion}
                                    </motion.span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
