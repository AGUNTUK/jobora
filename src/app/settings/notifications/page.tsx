'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Bell, ArrowLeft, Search, User, Award, Bookmark, Briefcase,
    Menu, X, Mail, Smartphone, Briefcase as JobIcon, TrendingUp,
    MessageSquare, Calendar, Star, Shield, Clock
} from 'lucide-react';
import { SkeuButton, SkeuCard, SkeuBadge } from '@/components/ui/skeuomorphic';
import { useAuthStore, useUIStore } from '@/store';

export default function NotificationSettingsPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { isMenuOpen, toggleMenu } = useUIStore();

    const [settings, setSettings] = useState({
        email: {
            jobAlerts: true,
            applicationUpdates: true,
            weeklyDigest: true,
            marketing: false,
            recommendations: true,
        },
        push: {
            jobAlerts: true,
            applicationUpdates: true,
            messages: true,
            reminders: true,
        },
        frequency: 'daily', // daily, weekly, realtime
        quietHours: {
            enabled: true,
            start: '22:00',
            end: '08:00',
        },
    });

    const handleToggle = (category: 'email' | 'push', key: string) => {
        setSettings(prev => {
            const categorySettings = prev[category] as Record<string, boolean>;
            return {
                ...prev,
                [category]: {
                    ...categorySettings,
                    [key]: !categorySettings[key],
                },
            };
        });
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
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-skeu-brown hover:text-skeu-dark mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Settings</span>
                </button>

                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-display font-bold text-skeu-dark">Notification Preferences</h1>
                    <p className="text-skeu-brown mt-1">Choose how and when you want to be notified</p>
                </div>

                {/* Settings Sections */}
                <div className="space-y-6">
                    {/* Email Notifications */}
                    <SkeuCard>
                        <h2 className="text-lg font-semibold text-skeu-dark mb-4 flex items-center gap-2">
                            <Mail className="w-5 h-5" />
                            Email Notifications
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3">
                                <div className="flex items-center gap-3">
                                    <JobIcon className="w-5 h-5 text-skeu-brown" />
                                    <div>
                                        <p className="font-medium text-skeu-dark">Job Alerts</p>
                                        <p className="text-sm text-skeu-brown">New jobs matching your preferences</p>
                                    </div>
                                </div>
                                <ToggleSwitch
                                    checked={settings.email.jobAlerts}
                                    onChange={() => handleToggle('email', 'jobAlerts')}
                                />
                            </div>

                            <div className="flex items-center justify-between p-3">
                                <div className="flex items-center gap-3">
                                    <TrendingUp className="w-5 h-5 text-skeu-brown" />
                                    <div>
                                        <p className="font-medium text-skeu-dark">Application Updates</p>
                                        <p className="text-sm text-skeu-brown">Status changes on your applications</p>
                                    </div>
                                </div>
                                <ToggleSwitch
                                    checked={settings.email.applicationUpdates}
                                    onChange={() => handleToggle('email', 'applicationUpdates')}
                                />
                            </div>

                            <div className="flex items-center justify-between p-3">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-skeu-brown" />
                                    <div>
                                        <p className="font-medium text-skeu-dark">Weekly Digest</p>
                                        <p className="text-sm text-skeu-brown">Summary of new jobs and activity</p>
                                    </div>
                                </div>
                                <ToggleSwitch
                                    checked={settings.email.weeklyDigest}
                                    onChange={() => handleToggle('email', 'weeklyDigest')}
                                />
                            </div>

                            <div className="flex items-center justify-between p-3">
                                <div className="flex items-center gap-3">
                                    <Star className="w-5 h-5 text-skeu-brown" />
                                    <div>
                                        <p className="font-medium text-skeu-dark">Recommendations</p>
                                        <p className="text-sm text-skeu-brown">Personalized job suggestions</p>
                                    </div>
                                </div>
                                <ToggleSwitch
                                    checked={settings.email.recommendations}
                                    onChange={() => handleToggle('email', 'recommendations')}
                                />
                            </div>

                            <div className="flex items-center justify-between p-3">
                                <div className="flex items-center gap-3">
                                    <Shield className="w-5 h-5 text-skeu-brown" />
                                    <div>
                                        <p className="font-medium text-skeu-dark">Marketing & Promotions</p>
                                        <p className="text-sm text-skeu-brown">Special offers and announcements</p>
                                    </div>
                                </div>
                                <ToggleSwitch
                                    checked={settings.email.marketing}
                                    onChange={() => handleToggle('email', 'marketing')}
                                />
                            </div>
                        </div>
                    </SkeuCard>

                    {/* Push Notifications */}
                    <SkeuCard>
                        <h2 className="text-lg font-semibold text-skeu-dark mb-4 flex items-center gap-2">
                            <Smartphone className="w-5 h-5" />
                            Push Notifications
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3">
                                <div className="flex items-center gap-3">
                                    <JobIcon className="w-5 h-5 text-skeu-brown" />
                                    <div>
                                        <p className="font-medium text-skeu-dark">Job Alerts</p>
                                        <p className="text-sm text-skeu-brown">Instant alerts for matching jobs</p>
                                    </div>
                                </div>
                                <ToggleSwitch
                                    checked={settings.push.jobAlerts}
                                    onChange={() => handleToggle('push', 'jobAlerts')}
                                />
                            </div>

                            <div className="flex items-center justify-between p-3">
                                <div className="flex items-center gap-3">
                                    <TrendingUp className="w-5 h-5 text-skeu-brown" />
                                    <div>
                                        <p className="font-medium text-skeu-dark">Application Updates</p>
                                        <p className="text-sm text-skeu-brown">Real-time status notifications</p>
                                    </div>
                                </div>
                                <ToggleSwitch
                                    checked={settings.push.applicationUpdates}
                                    onChange={() => handleToggle('push', 'applicationUpdates')}
                                />
                            </div>

                            <div className="flex items-center justify-between p-3">
                                <div className="flex items-center gap-3">
                                    <MessageSquare className="w-5 h-5 text-skeu-brown" />
                                    <div>
                                        <p className="font-medium text-skeu-dark">Messages</p>
                                        <p className="text-sm text-skeu-brown">New messages from employers</p>
                                    </div>
                                </div>
                                <ToggleSwitch
                                    checked={settings.push.messages}
                                    onChange={() => handleToggle('push', 'messages')}
                                />
                            </div>

                            <div className="flex items-center justify-between p-3">
                                <div className="flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-skeu-brown" />
                                    <div>
                                        <p className="font-medium text-skeu-dark">Reminders</p>
                                        <p className="text-sm text-skeu-brown">Application deadlines and follow-ups</p>
                                    </div>
                                </div>
                                <ToggleSwitch
                                    checked={settings.push.reminders}
                                    onChange={() => handleToggle('push', 'reminders')}
                                />
                            </div>
                        </div>
                    </SkeuCard>

                    {/* Alert Frequency */}
                    <SkeuCard>
                        <h2 className="text-lg font-semibold text-skeu-dark mb-4">Alert Frequency</h2>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-skeu-cream cursor-pointer">
                                <input
                                    type="radio"
                                    name="frequency"
                                    value="realtime"
                                    checked={settings.frequency === 'realtime'}
                                    onChange={(e) => setSettings(prev => ({ ...prev, frequency: e.target.value }))}
                                    className="w-4 h-4 text-primary-500"
                                />
                                <div>
                                    <p className="font-medium text-skeu-dark">Real-time</p>
                                    <p className="text-sm text-skeu-brown">Get notified immediately</p>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-skeu-cream cursor-pointer">
                                <input
                                    type="radio"
                                    name="frequency"
                                    value="daily"
                                    checked={settings.frequency === 'daily'}
                                    onChange={(e) => setSettings(prev => ({ ...prev, frequency: e.target.value }))}
                                    className="w-4 h-4 text-primary-500"
                                />
                                <div>
                                    <p className="font-medium text-skeu-dark">Daily Digest</p>
                                    <p className="text-sm text-skeu-brown">Receive a daily summary</p>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-skeu-cream cursor-pointer">
                                <input
                                    type="radio"
                                    name="frequency"
                                    value="weekly"
                                    checked={settings.frequency === 'weekly'}
                                    onChange={(e) => setSettings(prev => ({ ...prev, frequency: e.target.value }))}
                                    className="w-4 h-4 text-primary-500"
                                />
                                <div>
                                    <p className="font-medium text-skeu-dark">Weekly Digest</p>
                                    <p className="text-sm text-skeu-brown">Receive a weekly summary</p>
                                </div>
                            </label>
                        </div>
                    </SkeuCard>

                    {/* Quiet Hours */}
                    <SkeuCard>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-skeu-dark">Quiet Hours</h2>
                            <ToggleSwitch
                                checked={settings.quietHours.enabled}
                                onChange={() => setSettings(prev => ({
                                    ...prev,
                                    quietHours: {
                                        ...prev.quietHours,
                                        enabled: !prev.quietHours.enabled,
                                    },
                                }))}
                            />
                        </div>
                        {settings.quietHours.enabled && (
                            <div className="flex items-center gap-4 p-3 bg-skeu-cream rounded-lg">
                                <div>
                                    <label className="text-sm text-skeu-brown">From</label>
                                    <input
                                        type="time"
                                        value={settings.quietHours.start}
                                        onChange={(e) => setSettings(prev => ({
                                            ...prev,
                                            quietHours: {
                                                ...prev.quietHours,
                                                start: e.target.value,
                                            },
                                        }))}
                                        className="ml-2 px-3 py-2 rounded-lg border border-skeu-tan/30 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-skeu-brown">To</label>
                                    <input
                                        type="time"
                                        value={settings.quietHours.end}
                                        onChange={(e) => setSettings(prev => ({
                                            ...prev,
                                            quietHours: {
                                                ...prev.quietHours,
                                                end: e.target.value,
                                            },
                                        }))}
                                        className="ml-2 px-3 py-2 rounded-lg border border-skeu-tan/30 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                            </div>
                        )}
                        <p className="text-sm text-skeu-brown mt-3">
                            Notifications will be paused during these hours
                        </p>
                    </SkeuCard>

                    {/* Save Button */}
                    <SkeuButton className="w-full">
                        Save Preferences
                    </SkeuButton>
                </div>
            </main>
        </div>
    );
}

// Toggle Switch Component
function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
    return (
        <label className="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
        </label>
    );
}
