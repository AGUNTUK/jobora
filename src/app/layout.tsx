import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
})

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
})

export const metadata: Metadata = {
    title: 'Jobora - Find Your Dream Job in Bangladesh',
    description: 'AI-powered job aggregator for Bangladesh. Find jobs from Bdjobs, LinkedIn, newspapers, and more. Get AI-ranked recommendations and fraud detection.',
    keywords: ['jobs', 'Bangladesh', 'job search', 'career', 'employment', 'Bdjobs', 'job aggregator'],
    authors: [{ name: 'Jobora Team' }],
    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Jobora',
    },
    formatDetection: {
        telephone: true,
        email: true,
    },
    openGraph: {
        type: 'website',
        locale: 'en_BD',
        url: 'https://jobora.app',
        siteName: 'Jobora',
        title: 'Jobora - Find Your Dream Job in Bangladesh',
        description: 'AI-powered job aggregator for Bangladesh',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Jobora - Job Aggregator for Bangladesh',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Jobora - Find Your Dream Job in Bangladesh',
        description: 'AI-powered job aggregator for Bangladesh',
        images: ['/og-image.png'],
    },
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    themeColor: '#f97316',
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
            </head>
            <body className="font-body">
                {children}
            </body>
        </html>
    )
}
