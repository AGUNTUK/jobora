'use client';

import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import MobileNav from './MobileNav';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface MainLayoutProps {
    children: ReactNode;
    showFooter?: boolean;
    showNavigation?: boolean;
}

export default function MainLayout({
    children,
    showFooter = true,
    showNavigation = true,
}: MainLayoutProps) {
    return (
        <ErrorBoundary>
            <div className="min-h-screen flex flex-col">
                <Header showNavigation={showNavigation} />
                <main className="flex-1 pb-20 md:pb-0">
                    {children}
                </main>
                {showFooter && <Footer />}
                <MobileNav />
            </div>
        </ErrorBoundary>
    );
}
