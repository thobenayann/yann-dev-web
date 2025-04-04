import { Projects } from '@/components/ui/projects';
import { getProjects } from '@/lib/mdx';

interface PageProps {
    params: Promise<{ locale: string }>;
}

export default async function WorkPage({ params }: PageProps) {
    const { locale } = await params;
    const projects = await getProjects(locale);

    return (
        <main className='container mx-auto py-12'>
            <Projects projects={projects} locale={locale} />
        </main>
    );
}
