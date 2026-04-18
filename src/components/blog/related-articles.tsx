import { ArticleCard } from './article-card';
import { Post } from '@/lib/blog-types';

type Props = {
    posts: Post[];
    locale: string;
    title: string;
};

export function RelatedArticles({ posts, locale, title }: Props) {
    if (posts.length === 0) return null;
    return (
        <section className='space-y-6'>
            <h2 className='text-xl font-semibold'>{title}</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {posts.map((post) => (
                    <ArticleCard key={post.slug} post={post} locale={locale} />
                ))}
            </div>
        </section>
    );
}
