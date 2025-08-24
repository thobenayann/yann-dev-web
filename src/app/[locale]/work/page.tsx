import { Projects } from '@/components/ui/projects';
import { getProjects } from '@/lib/mdx';

export default async function WorkPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const projects = await getProjects(locale);

    return (
        <main className='container mx-auto py-12'>
            <Projects projects={projects} locale={locale} />
        </main>
    );
}
