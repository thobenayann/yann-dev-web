import { SITE_URL } from '@/config/site';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isFr = locale === 'fr';
    return {
        title: isFr ? 'Mentions légales' : 'Legal Notice',
        description: isFr
            ? 'Mentions légales du site yanndevweb.com'
            : 'Legal notice for yanndevweb.com',
        robots: { index: false },
        alternates: {
            canonical: `${SITE_URL}/${locale}/legal/mentions-legales`,
            languages: routing.locales.reduce(
                (acc, l) => ({ ...acc, [l]: `${SITE_URL}/${l}/legal/mentions-legales` }),
                {}
            ),
        },
    };
}

export default async function MentionsLegalesPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const isFr = locale === 'fr';

    return (
        <main className='container mx-auto px-6 md:px-10 pt-24 pb-16 max-w-3xl'>
            <Link
                href={`/${locale}`}
                className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10'
            >
                <ArrowLeft className='h-4 w-4' />
                {isFr ? 'Retour à l\'accueil' : 'Back to home'}
            </Link>

            <article className='prose prose-invert prose-lg max-w-none'>
                <h1>{isFr ? 'Mentions légales' : 'Legal Notice'}</h1>

                {isFr ? (
                    <>
                        <h2>Éditeur du site</h2>
                        <p>
                            Le site <strong>yanndevweb.com</strong> est édité par :<br />
                            <strong>Yann THOBENA</strong><br />
                            Développeur Fullstack & Expert IA<br />
                            Toulouse, France<br />
                            Email :{' '}
                            <a href='mailto:thobena.yann@gmail.com'>
                                thobena.yann@gmail.com
                            </a>
                        </p>

                        <h2>Hébergement</h2>
                        <p>
                            Ce site est hébergé par :<br />
                            <strong>Vercel Inc.</strong><br />
                            340 Pine Street, Suite 704<br />
                            San Francisco, CA 94104, USA<br />
                            Site : <a href='https://vercel.com' target='_blank' rel='noopener noreferrer'>vercel.com</a>
                        </p>

                        <h2>Propriété intellectuelle</h2>
                        <p>
                            L'ensemble du contenu de ce site (textes, images, code, design) est
                            la propriété exclusive de Yann THOBENA, sauf mention contraire.
                            Toute reproduction, distribution ou utilisation sans autorisation
                            préalable est interdite.
                        </p>

                        <h2>Responsabilité</h2>
                        <p>
                            Yann THOBENA s'efforce de maintenir les informations publiées sur
                            ce site à jour et exactes. Il ne saurait être tenu responsable des
                            erreurs ou omissions, ni de l'utilisation faite par des tiers des
                            informations présentes sur ce site.
                        </p>

                        <h2>Liens externes</h2>
                        <p>
                            Ce site peut contenir des liens vers des sites tiers. Yann THOBENA
                            n'exerce aucun contrôle sur ces sites et décline toute
                            responsabilité quant à leur contenu.
                        </p>

                        <p className='text-sm text-muted-foreground'>
                            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', {
                                year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </p>
                    </>
                ) : (
                    <>
                        <h2>Website Publisher</h2>
                        <p>
                            The website <strong>yanndevweb.com</strong> is published by:<br />
                            <strong>Yann THOBENA</strong><br />
                            Fullstack Developer & AI Expert<br />
                            Toulouse, France<br />
                            Email:{' '}
                            <a href='mailto:thobena.yann@gmail.com'>
                                thobena.yann@gmail.com
                            </a>
                        </p>

                        <h2>Hosting</h2>
                        <p>
                            This website is hosted by:<br />
                            <strong>Vercel Inc.</strong><br />
                            340 Pine Street, Suite 704<br />
                            San Francisco, CA 94104, USA<br />
                            Website:{' '}
                            <a href='https://vercel.com' target='_blank' rel='noopener noreferrer'>
                                vercel.com
                            </a>
                        </p>

                        <h2>Intellectual Property</h2>
                        <p>
                            All content on this site (text, images, code, design) is the
                            exclusive property of Yann THOBENA unless otherwise stated. Any
                            reproduction, distribution or use without prior authorization is
                            prohibited.
                        </p>

                        <h2>Liability</h2>
                        <p>
                            Yann THOBENA strives to keep the information published on this site
                            accurate and up to date. He cannot be held liable for errors or
                            omissions, or for the use made by third parties of the information
                            on this site.
                        </p>

                        <h2>External Links</h2>
                        <p>
                            This site may contain links to third-party websites. Yann THOBENA
                            has no control over these sites and accepts no responsibility for
                            their content.
                        </p>

                        <p className='text-sm text-muted-foreground'>
                            Last updated:{' '}
                            {new Date().toLocaleDateString('en-US', {
                                year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </p>
                    </>
                )}
            </article>
        </main>
    );
}
