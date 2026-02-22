'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Bookmark, Briefcase, Award, User } from 'lucide-react';
import { useUIStore } from '@/store';

export default function MobileNav() {
    const pathname = usePathname();
    const { activeTab, setActiveTab } = useUIStore();

    const navItems = [
        { id: 'home', icon: Search, label: 'Jobs', href: '/' },
        { id: 'saved', icon: Bookmark, label: 'Saved', href: '/saved' },
        { id: 'applications', icon: Briefcase, label: 'Applied', href: '/applications' },
        { id: 'rewards', icon: Award, label: 'Rewards', href: '/gamification' },
        { id: 'profile', icon: User, label: 'Profile', href: '/profile' },
    ];

    const isActive = (href: string, id: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <nav className="mobile-nav md:hidden safe-bottom">
            <div className="flex justify-around">
                {navItems.map((item) => (
                    <Link
                        key={item.id}
                        href={item.href}
                        className={`mobile-nav-item ${isActive(item.href, item.id) ? 'active' : ''}`}
                        onClick={() => setActiveTab(item.id)}
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </Link>
                ))}
            </div>
        </nav>
    );
}
