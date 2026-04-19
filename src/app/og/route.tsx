import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') ?? 'Yann THOBENA · Portfolio';
    const subtitle =
        searchParams.get('subtitle') ??
        'Concepteur Développeur d’Applications & Expert IA';

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '80px',
                    background:
                        'linear-gradient(135deg, #0a0a0f 0%, #1a0b2e 50%, #06202f 100%)',
                    fontFamily: 'sans-serif',
                    color: '#ffffff',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                    }}
                >
                    <div
                        style={{
                            width: '14px',
                            height: '14px',
                            borderRadius: '999px',
                            background:
                                'linear-gradient(135deg, oklch(0.541 0.281 293), oklch(0.75 0.18 210))',
                        }}
                    />
                    <div style={{ fontSize: '28px', opacity: 0.8 }}>
                        yanndevweb.com
                    </div>
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px',
                    }}
                >
                    <div
                        style={{
                            fontSize: '72px',
                            fontWeight: 700,
                            lineHeight: 1.1,
                            letterSpacing: '-0.02em',
                        }}
                    >
                        {title}
                    </div>
                    <div
                        style={{
                            fontSize: '32px',
                            opacity: 0.7,
                            maxWidth: '900px',
                        }}
                    >
                        {subtitle}
                    </div>
                </div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '24px',
                        opacity: 0.6,
                    }}
                >
                    <div>Yann THOBENA</div>
                    <div>Toulouse · France</div>
                </div>
            </div>
        ),
        { width: 1200, height: 630 }
    );
}
