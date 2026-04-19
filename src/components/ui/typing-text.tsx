'use client';

import * as React from 'react';
import { motion, useInView, type HTMLMotionProps } from 'framer-motion';

// ─── Context ──────────────────────────────────────────────────────────────────

type TypingTextContextType = {
    isTyping: boolean;
    setIsTyping: (v: boolean) => void;
};

const TypingTextCtx = React.createContext<TypingTextContextType | null>(null);

function useTypingText() {
    const ctx = React.useContext(TypingTextCtx);
    if (!ctx) throw new Error('useTypingText must be inside <TypingText>');
    return ctx;
}

// ─── TypingText ───────────────────────────────────────────────────────────────

type TypingTextProps = React.ComponentProps<'span'> & {
    text: string | string[];
    duration?: number;
    delay?: number;
    loop?: boolean;
    holdDelay?: number;
    inViewOnce?: boolean;
};

function TypingText({
    children,
    text,
    duration = 55,
    delay = 0,
    loop = false,
    holdDelay = 1500,
    inViewOnce = true,
    ...props
}: TypingTextProps) {
    const ref = React.useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref as React.RefObject<Element>, {
        once: inViewOnce,
        margin: '-40px',
    });

    const [isTyping, setIsTyping] = React.useState(false);
    const [started, setStarted] = React.useState(false);
    const [displayedText, setDisplayedText] = React.useState('');

    React.useEffect(() => {
        if (!isInView) return;
        const id = setTimeout(() => setStarted(true), delay);
        return () => clearTimeout(id);
    }, [isInView, delay]);

    React.useEffect(() => {
        if (!started) return;
        const ids: ReturnType<typeof setTimeout>[] = [];
        const texts = typeof text === 'string' ? [text] : text;

        const typeText = (str: string, onComplete: () => void) => {
            setIsTyping(true);
            let i = 0;
            const tick = () => {
                if (i <= str.length) {
                    setDisplayedText(str.substring(0, i++));
                    ids.push(setTimeout(tick, duration));
                } else {
                    setIsTyping(false);
                    onComplete();
                }
            };
            tick();
        };

        const eraseText = (str: string, onComplete: () => void) => {
            setIsTyping(true);
            let i = str.length;
            const tick = () => {
                if (i >= 0) {
                    setDisplayedText(str.substring(0, i--));
                    ids.push(setTimeout(tick, duration));
                } else {
                    setIsTyping(false);
                    onComplete();
                }
            };
            tick();
        };

        const animate = (index: number) => {
            typeText(texts[index] ?? '', () => {
                const isLast = index === texts.length - 1;
                if (isLast && !loop) return;
                const id = setTimeout(() => {
                    eraseText(texts[index] ?? '', () =>
                        animate(isLast ? 0 : index + 1)
                    );
                }, holdDelay);
                ids.push(id);
            });
        };

        animate(0);
        return () => ids.forEach(clearTimeout);
    }, [text, duration, started, loop, holdDelay]);

    return (
        <TypingTextCtx.Provider value={{ isTyping, setIsTyping }}>
            <span ref={ref} data-slot='typing-text' {...props}>
                <motion.span>{displayedText}</motion.span>
                {children}
            </span>
        </TypingTextCtx.Provider>
    );
}

// ─── TypingTextCursor ─────────────────────────────────────────────────────────

type TypingTextCursorProps = Omit<HTMLMotionProps<'span'>, 'children'>;

function TypingTextCursor({ style, variants, ...props }: TypingTextCursorProps) {
    const { isTyping } = useTypingText();

    return (
        <motion.span
            data-slot='typing-text-cursor'
            variants={{
                blinking: {
                    opacity: [0, 0, 1, 1],
                    transition: {
                        duration: 1,
                        repeat: Infinity,
                        repeatDelay: 0,
                        ease: 'linear',
                        times: [0, 0.5, 0.5, 1],
                    },
                },
                visible: { opacity: 1 },
                ...variants,
            }}
            animate={isTyping ? 'visible' : 'blinking'}
            style={{
                display: 'inline-block',
                height: '0.9em',
                transform: 'translateY(1px)',
                width: '2px',
                borderRadius: '1px',
                backgroundColor: 'currentColor',
                marginLeft: '2px',
                ...style,
            }}
            {...props}
        />
    );
}

export { TypingText, TypingTextCursor };
