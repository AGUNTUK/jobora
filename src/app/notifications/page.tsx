'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Bell, Briefcase, Calendar, CheckCircle, AlertCircle, Gift,
    Star, Filter, Check, Trash2, Settings, ChevronRight
} from 'lucide-react';
import { SkeuButton, SkeuCard, SkeuBadge } from '@/components/ui/skeuomorphic';
import { useNotificationsStore } from '@/store';
import { formatDate } from '@/lib/utils';

export default function NotificationsPage() {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationsStore();
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    // Mock notifications for demo
    const mockNotifications = [
        {
            id: '1',
            type: 'job_match' as const,
            title: 'New Job Match!',
            message: 'Senior Software Engineer at Tech Solutions BD matches your profile 95%.',
            read: false,
            created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            action_url: '/jobs/1',
            action_text: 'View Job',
        },
        {
            id: '2',
            type: 'application_update' as const,
            title: 'Application Viewed',
            message: 'Your application for Marketing Manager at Creative Agency was viewed by the employer.',
            read: false,
            created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            action_url: '/applications',
            action_text: 'View Application',
        },
        {
            id: '3',
            type: 'achievement' as const,
            title: 'Achievement Unlocked! 🎉',
            message: 'You earned the "Job Hunter" badge for applying to 10 jobs in a week.',
            read: false,
            created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            action_url: '/gamification',
            action_text: 'View Badge',
        },
        {
            id: '4',
            type: 'reminder' as const,
            title: 'Application Deadline Reminder',
            message: 'The deadline for Data Analyst at Finance Corp is in 2 days. Don\'t miss out!',
            read: true,
            created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            action_url: '/jobs/3',
            action_text: 'Apply Now',
        },
        {
            id: '5',
            type: 'system' as const,
            title: 'Profile Incomplete',
            message: 'Complete your profile to get better job matches. Add your skills and experience.',
            read: true,
            created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            action_url: '/profile',
            action_text: 'Complete Profile',
        },
        {
            id: '6',
            type: 'promotion' as const,
            title: 'Premium Features Available!',
            message: 'Get priority listing and AI resume reviews with Jobora Premium. Try free for 7 days.',
            read: true,
            created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
            action_url: '/premium',
            action_text: 'Learn More',
        },
    ];

    const filteredNotifications = filter === 'unread'
        ? mockNotifications.filter(n => !n.read)
        : mockNotifications;

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'job_match':
                return <Briefcase className="w-5 h-5 text-blue-500" />;
            case 'application_update':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'achievement':
                return <Gift className="w-5 h-5 text-yellow-500" />;
            case 'reminder':
                return <Calendar className="w-5 h-5 text-orange-500" />;
            case 'system':
                return <AlertCircle className="w-5 h-5 text-purple-500" />;
            case 'promotion':
                return <Star className="w-5 h-5 text-pink-500" />;
            default:
                return <Bell className="w-5 h-5 text-skeu-brown" />;
        }
    };

    const getNotificationBg = (type: string) => {
        switch (type) {
            case 'job_match':
                return 'bg-blue-50';
            case 'application_update':
                return 'bg-green-50';
            case 'achievement':
                return 'bg-yellow-50';
            case 'reminder':
                return 'bg-orange-50';
            case 'system':
                return 'bg-purple-50';
            case 'promotion':
                return 'bg-pink-50';
            default:
                return 'bg-skeu-cream';
        }
    };

    return (
        <div className="min-h-screen pb-20 md:pb-8">
            {/* Header */}
            <header className="header sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-skeu-dark">Notifications</h1>
                            {unreadCount > 0 && (
                                <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                                    {unreadCount}
                                </span>
                            )}
                        </div>
                        <Link href="/settings/notifications" className="p-2 rounded-lg hover:bg-skeu-cream transition-colors">
                            <Settings className="w-5 h-5 text-skeu-brown" />
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-6">
                {/* Filter & Actions */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex gap-2">
                        <button
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'all'
                                    ? 'bg-gradient-to-b from-white to-skeu-light text-skeu-dark shadow-skeu-raised'
                                    : 'text-skeu-brown hover:bg-skeu-cream'
                                }`}
                            onClick={() => setFilter('all')}
                        >
                            All
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'unread'
                                    ? 'bg-gradient-to-b from-white to-skeu-light text-skeu-dark shadow-skeu-raised'
                                    : 'text-skeu-brown hover:bg-skeu-cream'
                                }`}
                            onClick={() => setFilter('unread')}
                        >
                            Unread
                            {mockNotifications.filter(n => !n.read).length > 0 && (
                                <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                                    {mockNotifications.filter(n => !n.read).length}
                                </span>
                            )}
                        </button>
                    </div>
                    <SkeuButton variant="secondary" size="sm" onClick={() => markAllAsRead()}>
                        <Check className="w-4 h-4 mr-1" />
                        Mark All Read
                    </SkeuButton>
                </div>

                {/* Notifications List */}
                <div className="space-y-3">
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map((notification) => (
                            <SkeuCard
                                key={notification.id}
                                variant="raised"
                                className={`cursor-pointer transition-all ${!notification.read ? 'border-l-4 border-l-primary-500' : ''
                                    }`}
                                onClick={() => markAsRead(notification.id)}
                            >
                                <div className="flex gap-4">
                                    {/* Icon */}
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getNotificationBg(notification.type)}`}>
                                        {getNotificationIcon(notification.type)}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className={`font-bold ${!notification.read ? 'text-skeu-dark' : 'text-skeu-brown'}`}>
                                                    {notification.title}
                                                </h3>
                                                <p className="text-sm text-skeu-brown mt-1">{notification.message}</p>
                                            </div>
                                            {!notification.read && (
                                                <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0 mt-2" />
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between mt-3">
                                            <span className="text-xs text-skeu-brown">
                                                {formatDate(notification.created_at)}
                                            </span>
                                            {notification.action_url && (
                                                <Link
                                                    href={notification.action_url}
                                                    className="text-sm font-medium text-primary-600 hover:underline flex items-center gap-1"
                                                >
                                                    {notification.action_text}
                                                    <ChevronRight className="w-4 h-4" />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </SkeuCard>
                        ))
                    ) : (
                        <SkeuCard variant="flat" className="text-center py-12">
                            <Bell className="w-16 h-16 mx-auto text-skeu-tan mb-4" />
                            <h3 className="text-lg font-bold text-skeu-dark mb-2">
                                {filter === 'unread' ? 'All caught up!' : 'No notifications'}
                            </h3>
                            <p className="text-skeu-brown">
                                {filter === 'unread'
                                    ? 'You have no unread notifications.'
                                    : 'We\'ll notify you when something important happens.'}
                            </p>
                        </SkeuCard>
                    )}
                </div>

                {/* Load More */}
                {filteredNotifications.length > 0 && (
                    <div className="text-center mt-6">
                        <SkeuButton variant="secondary">
                            Load More
                        </SkeuButton>
                    </div>
                )}
            </main>
        </div>
    );
}
