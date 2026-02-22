'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Settings as SettingsIcon, Search, Bell, User, Award, Bookmark, Briefcase,
    Menu, X, Moon, Sun, Globe, Shield, HelpCircle, LogOut, ChevronRight,
    Mail, Smartphone, Lock, Eye, Trash2
} from 'lucide-react';
import { SkeuButton, SkeuCard, SkeuBadge } from '@/components/ui/skeuomorphic';
import { useAuthStore, useUIStore } from '@/store';

export default function SettingsPage() {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const { isMenuOpen, toggleMenu } = useUIStore();
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        jobAlerts: true,
        marketing: false,
    });

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-skeu-cream">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-skeu-cream/95 backdrop-blur-sm border-b border-skeu-tan/20">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-skeu-raised">
                                <span className="text-white font-bold text-lg">J</span>
                            </div>
                            <span className="font-display font-bold text-xl text-skeu-dark hidden sm:block">Jobora</span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-1">
                            <Link href="/" className="nav-item">
                                <Search className="w-4 h-4" />
                                <span>Search</span>
                            </Link>
                            <Link href="/saved" className="nav-item">
                                <Bookmark className="w-4 h-4" />
                                <span>Saved</span>
                            </Link>
                            <Link href="/applications" className="nav-item">
                                <Briefcase className="w-4 h-4" />
                                <span>Applications</span>
                            </Link>
                            <Link href="/gamification" className="nav-item">
                                <Award className="w-4 h-4" />
                                <span>Rewards</span>
                            </Link>
                        </nav>

                        <div className="flex items-center gap-2">
                            <Link href="/notifications" className="p-2 rounded-lg hover:bg-skeu-cream transition-colors relative">
                                <Bell className="w-5 h-5 text-skeu-brown" />
                            </Link>
                            <Link href="/profile" className="hidden md:flex">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-skeu-tan to-skeu-brown flex items-center justify-center text-white font-semibold shadow-skeu-raised">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                            </Link>
                            <button onClick={toggleMenu} className="md:hidden p-2 rounded-lg hover:bg-skeu-cream">
                                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <nav className="flex flex-col p-4 gap-2 md:hidden">
                            <Link href="/" className="nav-item" onClick={() => toggleMenu()}>
                                <Search className="w-4 h-4" />
                                <span>Search</span>
                            </Link>
                            <Link href="/saved" className="nav-item" onClick={() => toggleMenu()}>
                                <Bookmark className="w-4 h-4" />
                                <span>Saved</span>
                            </Link>
                            <Link href="/applications" className="nav-item" onClick={() => toggleMenu()}>
                                <Briefcase className="w-4 h-4" />
                                <span>Applications</span>
                            </Link>
                            <Link href="/gamification" className="nav-item" onClick={() => toggleMenu()}>
                                <Award className="w-4 h-4" />
                                <span>Rewards</span>
                            </Link>
                            <Link href="/profile" className="nav-item" onClick={() => toggleMenu()}>
                                <User className="w-4 h-4" />
                                <span>Profile</span>
                            </Link>
                        </nav>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-3xl mx-auto px-4 py-6">
                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-display font-bold text-skeu-dark">Settings</h1>
                    <p className="text-skeu-brown mt-1">Manage your account preferences</p>
                </div>

                {/* Settings Sections */}
                <div className="space-y-6">
                    {/* Account Settings */}
                    <SkeuCard>
                        <h2 className="text-lg font-semibold text-skeu-dark mb-4 flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Account
                        </h2>
                        <div className="space-y-4">
                            <Link href="/settings/profile" className="flex items-center justify-between p-3 rounded-lg hover:bg-skeu-cream transition-colors">
                                <div className="flex items-center gap-3">
                                    <User className="w-5 h-5 text-skeu-brown" />
                                    <div>
                                        <p className="font-medium text-skeu-dark">Profile Information</p>
                                        <p className="text-sm text-skeu-brown">Update your personal details</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-skeu-brown" />
                            </Link>

                            <Link href="/settings/security" className="flex items-center justify-between p-3 rounded-lg hover:bg-skeu-cream transition-colors">
                                <div className="flex items-center gap-3">
                                    <Lock className="w-5 h-5 text-skeu-brown" />
                                    <div>
                                        <p className="font-medium text-skeu-dark">Security</p>
                                        <p className="text-sm text-skeu-brown">Password and authentication</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-skeu-brown" />
                            </Link>

                            <Link href="/settings/privacy" className="flex items-center justify-between p-3 rounded-lg hover:bg-skeu-cream transition-colors">
                                <div className="flex items-center gap-3">
                                    <Eye className="w-5 h-5 text-skeu-brown" />
                                    <div>
                                        <p className="font-medium text-skeu-dark">Privacy</p>
                                        <p className="text-sm text-skeu-brown">Control your visibility</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-skeu-brown" />
                            </Link>
                        </div>
                    </SkeuCard>

                    {/* Notification Settings */}
                    <SkeuCard>
                        <h2 className="text-lg font-semibold text-skeu-dark mb-4 flex items-center gap-2">
                            <Bell className="w-5 h-5" />
                            Notifications
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-skeu-brown" />
                                    <div>
                                        <p className="font-medium text-skeu-dark">Email Notifications</p>
                                        <p className="text-sm text-skeu-brown">Receive updates via email</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notifications.email}
                                        onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-3">
                                <div className="flex items-center gap-3">
                                    <Smartphone className="w-5 h-5 text-skeu-brown" />
                                    <div>
                                        <p className="font-medium text-skeu-dark">Push Notifications</p>
                                        <p className="text-sm text-skeu-brown">Get alerts on your device</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notifications.push}
                                        onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-3">
                                <div className="flex items-center gap-3">
                                    <Briefcase className="w-5 h-5 text-skeu-brown" />
                                    <div>
                                        <p className="font-medium text-skeu-dark">Job Alerts</p>
                                        <p className="text-sm text-skeu-brown">New jobs matching your preferences</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notifications.jobAlerts}
                                        onChange={(e) => setNotifications({ ...notifications, jobAlerts: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                                </label>
                            </div>
                        </div>
                    </SkeuCard>

                    {/* Appearance */}
                    <SkeuCard>
                        <h2 className="text-lg font-semibold text-skeu-dark mb-4 flex items-center gap-2">
                            <Sun className="w-5 h-5" />
                            Appearance
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3">
                                <div className="flex items-center gap-3">
                                    {darkMode ? <Moon className="w-5 h-5 text-skeu-brown" /> : <Sun className="w-5 h-5 text-skeu-brown" />}
                                    <div>
                                        <p className="font-medium text-skeu-dark">Dark Mode</p>
                                        <p className="text-sm text-skeu-brown">Switch to dark theme</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={darkMode}
                                        onChange={(e) => setDarkMode(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-3">
                                <div className="flex items-center gap-3">
                                    <Globe className="w-5 h-5 text-skeu-brown" />
                                    <div>
                                        <p className="font-medium text-skeu-dark">Language</p>
                                        <p className="text-sm text-skeu-brown">Choose your preferred language</p>
                                    </div>
                                </div>
                                <select className="px-3 py-2 rounded-lg border border-skeu-tan/30 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                                    <option>English</option>
                                    <option>বাংলা (Bengali)</option>
                                </select>
                            </div>
                        </div>
                    </SkeuCard>

                    {/* Support */}
                    <SkeuCard>
                        <h2 className="text-lg font-semibold text-skeu-dark mb-4 flex items-center gap-2">
                            <HelpCircle className="w-5 h-5" />
                            Support
                        </h2>
                        <div className="space-y-4">
                            <Link href="/help" className="flex items-center justify-between p-3 rounded-lg hover:bg-skeu-cream transition-colors">
                                <div className="flex items-center gap-3">
                                    <HelpCircle className="w-5 h-5 text-skeu-brown" />
                                    <div>
                                        <p className="font-medium text-skeu-dark">Help Center</p>
                                        <p className="text-sm text-skeu-brown">Get help with Jobora</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-skeu-brown" />
                            </Link>

                            <Link href="/terms" className="flex items-center justify-between p-3 rounded-lg hover:bg-skeu-cream transition-colors">
                                <div className="flex items-center gap-3">
                                    <Shield className="w-5 h-5 text-skeu-brown" />
                                    <div>
                                        <p className="font-medium text-skeu-dark">Terms & Privacy</p>
                                        <p className="text-sm text-skeu-brown">Read our policies</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-skeu-brown" />
                            </Link>
                        </div>
                    </SkeuCard>

                    {/* Danger Zone */}
                    <SkeuCard className="border-red-200">
                        <h2 className="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2">
                            <Trash2 className="w-5 h-5" />
                            Danger Zone
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3">
                                <div>
                                    <p className="font-medium text-skeu-dark">Delete Account</p>
                                    <p className="text-sm text-skeu-brown">Permanently delete your account and all data</p>
                                </div>
                                <SkeuButton variant="secondary" className="text-red-600 border-red-300 hover:bg-red-50">
                                    Delete
                                </SkeuButton>
                            </div>
                        </div>
                    </SkeuCard>

                    {/* Logout */}
                    <SkeuButton
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2"
                        variant="secondary"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </SkeuButton>
                </div>
            </main>
        </div>
    );
}
