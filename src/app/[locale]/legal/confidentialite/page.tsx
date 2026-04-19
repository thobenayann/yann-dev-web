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
        title: isFr ? 'Politique de confidentialité' : 'Privacy Policy',
        description: isFr
            ? 'Politique de confidentialité du site yanndevweb.com'
            : 'Privacy policy for yanndevweb.com',
        robots: { index: false },
        alternates: {
            canonical: `${SITE_URL}/${locale}/legal/confidentialite`,
            languages: routing.locales.reduce(
                (acc, l) => ({ ...acc, [l]: `${SITE_URL}/${l}/legal/confidentialite` }),
                {}
            ),
        },
    };
}

export default async function ConfidentialitePage({ params }: Props) {
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
                {isFr ? "Retour à l'accueil" : 'Back to home'}
            </Link>

            <article className='prose prose-invert prose-lg max-w-none'>
                <h1>
                    {isFr ? 'Politique de confidentialité' : 'Privacy Policy'}
                </h1>

                {isFr ? (
                    <>
                        <h2>Données collectées</h2>
                        <p>
                            Ce site portfolio ne collecte aucune donnée personnelle via des
                            formulaires ou comptes utilisateurs. Aucun cookie de traçage ni
                            outil d'analyse comportementale n'est utilisé.
                        </p>

                        <h2>Données de navigation</h2>
                        <p>
                            L'hébergeur <strong>Vercel Inc.</strong> peut collecter
                            automatiquement des données techniques de navigation (adresse IP,
                            navigateur, pages visitées) à des fins de fonctionnement et de
                            sécurité du service. Ces données sont soumises à la{' '}
                            <a
                                href='https://vercel.com/legal/privacy-policy'
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                politique de confidentialité de Vercel
                            </a>
                            .
                        </p>

                        <h2>Formulaire de contact</h2>
                        <p>
                            Lorsque vous utilisez les liens de contact (email, LinkedIn),
                            vous êtes redirigé vers des services tiers dont les politiques de
                            confidentialité leur sont propres. Aucune donnée n'est interceptée
                            ou stockée par ce site.
                        </p>

                        <h2>Vos droits (RGPD)</h2>
                        <p>
                            Conformément au Règlement Général sur la Protection des Données
                            (RGPD), vous disposez d'un droit d'accès, de rectification et de
                            suppression de vos données. Pour exercer ces droits, contactez :{' '}
                            <a href='mailto:thobena.yann@gmail.com'>
                                thobena.yann@gmail.com
                            </a>
                        </p>

                        <h2>Cookies</h2>
                        <p>
                            Ce site utilise uniquement des cookies techniques strictement
                            nécessaires au fonctionnement (préférence de thème clair/sombre).
                            Aucun cookie publicitaire ou de profilage n'est déposé.
                        </p>

                        <p className='text-sm text-muted-foreground'>
                            Dernière mise à jour :{' '}
                            {new Date().toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>
                    </>
                ) : (
                    <>
                        <h2>Data Collected</h2>
                        <p>
                            This portfolio website does not collect any personal data through
                            forms or user accounts. No tracking cookies or behavioral analytics
                            tools are used.
                        </p>

                        <h2>Navigation Data</h2>
                        <p>
                            The hosting provider <strong>Vercel Inc.</strong> may automatically
                            collect technical navigation data (IP address, browser, pages
                            visited) for service operation and security purposes. This data is
                            subject to{' '}
                            <a
                                href='https://vercel.com/legal/privacy-policy'
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                Vercel's privacy policy
                            </a>
                            .
                        </p>

                        <h2>Contact</h2>
                        <p>
                            When you use contact links (email, LinkedIn), you are redirected
                            to third-party services with their own privacy policies. No data
                            is intercepted or stored by this site.
                        </p>

                        <h2>Your Rights (GDPR)</h2>
                        <p>
                            Under the General Data Protection Regulation (GDPR), you have the
                            right to access, correct and delete your data. To exercise these
                            rights, contact:{' '}
                            <a href='mailto:thobena.yann@gmail.com'>
                                thobena.yann@gmail.com
                            </a>
                        </p>

                        <h2>Cookies</h2>
                        <p>
                            This site only uses strictly necessary technical cookies for
                            functionality (light/dark theme preference). No advertising or
                            profiling cookies are set.
                        </p>

                        <p className='text-sm text-muted-foreground'>
                            Last updated:{' '}
                            {new Date().toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>
                    </>
                )}
            </article>
        </main>
    );
}
