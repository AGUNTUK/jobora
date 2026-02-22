import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
    display: 'swap',
})

export const metadata: Metadata = {
    metadataBase: new URL('https://jobora.app'),
    title: {
        default: 'Jobora - Find Your Dream Job in Bangladesh',
        template: '%s | Jobora',
    },
    description: 'AI-powered job aggregator for Bangladesh. Find jobs from Bdjobs, LinkedIn, newspapers, and more. Get AI-ranked recommendations and fraud detection.',
    keywords: [
        'jobs in Bangladesh',
        'job search Bangladesh',
        'Bdjobs',
        'career Bangladesh',
        'employment Bangladesh',
        'job aggregator',
        'AI job matching',
        'remote jobs Bangladesh',
        'Dhaka jobs',
        'Chittagong jobs',
        'tech jobs Bangladesh',
        'government jobs Bangladesh',
    ],
    authors: [{ name: 'Jobora Team', url: 'https://jobora.app' }],
    creator: 'Jobora',
    publisher: 'Jobora',
    applicationName: 'Jobora',
    generator: 'Next.js',
    referrer: 'origin-when-cross-origin',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Jobora',
        startupImage: '/apple-touch-icon.png',
    },
    formatDetection: {
        telephone: true,
        email: true,
        address: true,
        date: true,
    },
    openGraph: {
        type: 'website',
        locale: 'en_BD',
        alternateLocale: ['bn_BD'],
        url: 'https://jobora.app',
        siteName: 'Jobora',
        title: 'Jobora - Find Your Dream Job in Bangladesh',
        description: 'AI-powered job aggregator for Bangladesh. Find jobs from Bdjobs, LinkedIn, newspapers, and more. Get AI-ranked recommendations and fraud detection.',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Jobora - Job Aggregator for Bangladesh',
                type: 'image/png',
            },
            {
                url: '/og-image-square.png',
                width: 600,
                height: 600,
                alt: 'Jobora Logo',
                type: 'image/png',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        site: '@jobora_bd',
        creator: '@jobora_bd',
        title: 'Jobora - Find Your Dream Job in Bangladesh',
        description: 'AI-powered job aggregator for Bangladesh',
        images: ['/og-image.png'],
    },
    alternates: {
        canonical: 'https://jobora.app',
        languages: {
            'en-BD': 'https://jobora.app',
            'bn-BD': 'https://jobora.app/bn',
        },
    },
    bookmarks: ['https://jobora.app/saved', 'https://jobora.app/alerts'],
    category: 'Employment',
    classification: 'Job Search Engine',
    assets: ['/og-image.png', '/favicon.ico'],
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: 'any' },
            { url: '/icon.svg', type: 'image/svg+xml' },
        ],
        apple: [
            { url: '/apple-touch-icon.png', sizes: '180x180' },
        ],
        other: [
            { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#f97316' },
        ],
    },
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    minimumScale: 1,
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#f97316' },
        { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
    ],
    colorScheme: 'light',
}

// JSON-LD structured data for SEO
const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Jobora',
    description: 'AI-powered job aggregator for Bangladesh',
    url: 'https://jobora.app',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'BDT',
    },
    aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '1250',
    },
    author: {
        '@type': 'Organization',
        name: 'Jobora',
        url: 'https://jobora.app',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body className="font-body">
                {children}
            </body>
        </html>
    )
}
