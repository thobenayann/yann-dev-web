'use client';

type BentoPillListProps = {
    items: string[];
};

export function BentoPillList(props: BentoPillListProps) {
    return (
        <div className='flex flex-wrap gap-2'>
            {props.items.map((label) => (
                <span
                    key={label}
                    className='inline-flex items-center rounded-full border px-3 py-1 text-sm text-foreground/90 bg-background/60 dark:bg-foreground/5'
                >
                    {label}
                </span>
            ))}
        </div>
    );
}

