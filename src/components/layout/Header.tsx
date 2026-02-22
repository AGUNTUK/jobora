'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Search, Bell, User, Briefcase, Award, Bookmark,
    Menu, X, Settings, LogOut, ChevronDown
} from 'lucide-react';
import { useAuthStore, useUIStore } from '@/store';
import { useOnlineStatus } from '@/lib/hooks';

interface HeaderProps {
    showNavigation?: boolean;
    title?: string;
}

export default function Header({ showNavigation = true, title }: HeaderProps) {
    const pathname = usePathname();
    const { isAuthenticated, user } = useAuthStore();
    const { isMenuOpen, toggleMenu } = useUIStore();
    const isOnline = useOnlineStatus();
    const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    // Check for unread notifications
    useEffect(() => {
        const checkNotifications = () => {
            setHasUnreadNotifications(Math.random() > 0.5);
        };
        checkNotifications();
    }, []);

    const navItems = [
        { id: 'home', icon: Search, label: 'Find Jobs', href: '/' },
        { id: 'saved', icon: Bookmark, label: 'Saved', href: '/saved' },
        { id: 'applications', icon: Briefcase, label: 'Applications', href: '/applications' },
        { id: 'rewards', icon: Award, label: 'Rewards', href: '/gamification' },
    ];

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <>
            {/* Offline Banner */}
            {!isOnline && (
                <div className="bg-yellow-500 text-white text-center py-2 px-4 text-sm font-medium flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    You're offline. Some features may be limited.
                </div>
            )}

            <header className="header sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-skeu-raised">
                                <Briefcase className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-display font-bold text-skeu-dark">Jobora</span>
                        </Link>

                        {/* Desktop Navigation */}
                        {showNavigation && (
                            <nav className="hidden md:flex items-center gap-1">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>
                        )}

                        {/* Page Title (for pages without navigation) */}
                        {title && !showNavigation && (
                            <h1 className="hidden md:block text-xl font-bold text-skeu-dark">{title}</h1>
                        )}

                        {/* Right Actions */}
                        <div className="flex items-center gap-2">
                            {/* Notifications */}
                            <Link
                                href="/notifications"
                                className="relative p-2 rounded-lg hover:bg-skeu-cream transition-colors"
                            >
                                <Bell className="w-5 h-5 text-skeu-brown" />
                                {hasUnreadNotifications && (
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                                )}
                            </Link>

                            {/* User Menu (Desktop) */}
                            <div className="relative hidden md:block">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-skeu-cream transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-skeu-tan to-skeu-brown flex items-center justify-center text-white font-semibold text-sm shadow-skeu-raised">
                                        {user?.name?.charAt(0) || 'U'}
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-skeu-brown transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-skeu-tan overflow-hidden z-50">
                                        <div className="p-3 border-b border-skeu-tan">
                                            <p className="font-medium text-skeu-dark">{user?.name || 'Guest User'}</p>
                                            <p className="text-sm text-skeu-brown">{user?.email || 'guest@example.com'}</p>
                                        </div>
                                        <div className="py-1">
                                            <Link
                                                href="/profile"
                                                className="flex items-center gap-2 px-4 py-2 text-skeu-dark hover:bg-skeu-cream transition-colors"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                <User className="w-4 h-4" />
                                                Profile
                                            </Link>
                                            <Link
                                                href="/settings"
                                                className="flex items-center gap-2 px-4 py-2 text-skeu-dark hover:bg-skeu-cream transition-colors"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                <Settings className="w-4 h-4" />
                                                Settings
                                            </Link>
                                            <hr className="my-1 border-skeu-tan" />
                                            <button
                                                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full"
                                                onClick={() => {
                                                    setShowUserMenu(false);
                                                    // Handle logout
                                                }}
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Mobile Menu Toggle */}
                            <button
                                className="md:hidden p-2 rounded-lg hover:bg-skeu-cream transition-colors"
                                onClick={toggleMenu}
                            >
                                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-skeu-tan bg-skeu-light animate-fade-in">
                        <nav className="flex flex-col p-4 gap-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
                                    onClick={() => toggleMenu()}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </Link>
                            ))}
                            <hr className="my-2 border-skeu-tan" />
                            <Link
                                href="/profile"
                                className="nav-item"
                                onClick={() => toggleMenu()}
                            >
                                <User className="w-4 h-4" />
                                Profile
                            </Link>
                            <Link
                                href="/settings"
                                className="nav-item"
                                onClick={() => toggleMenu()}
                            >
                                <Settings className="w-4 h-4" />
                                Settings
                            </Link>
                            <button
                                className="nav-item text-red-600 hover:bg-red-50"
                                onClick={() => {
                                    toggleMenu();
                                    // Handle logout
                                }}
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </nav>
                    </div>
                )}
            </header>

            {/* Click outside to close user menu */}
            {showUserMenu && (
                <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowUserMenu(false)}
                />
            )}
        </>
    );
}
