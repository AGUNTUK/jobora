'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Bell, Plus, Trash2, Edit, Pause, Play, Search, User, Award, Bookmark, Briefcase,
    Menu, X, MapPin, DollarSign, Clock, Filter, Check, ChevronDown
} from 'lucide-react';
import { SkeuButton, SkeuCard, SkeuBadge } from '@/components/ui/skeuomorphic';
import { useAuthStore, useUIStore } from '@/store';
import { JobAlert } from '@/types/alerts';

const jobTypes = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
    { value: 'freelance', label: 'Freelance' },
];

const experienceLevels = [
    { value: 'entry', label: 'Entry Level' },
    { value: 'mid', label: 'Mid Level' },
    { value: 'senior', label: 'Senior Level' },
    { value: 'executive', label: 'Executive' },
];

const frequencies = [
    { value: 'instant', label: 'Instant' },
    { value: 'daily', label: 'Daily Digest' },
    { value: 'weekly', label: 'Weekly Digest' },
];

const popularLocations = [
    'Dhaka', 'Chittagong', 'Khulna', 'Sylhet', 'Rajshahi', 'Remote'
];

const popularCategories = [
    'Technology', 'Marketing', 'Finance', 'Design', 'Sales', 'HR', 'Operations'
];

export default function JobAlertsPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { isMenuOpen, toggleMenu } = useUIStore();
    const [alerts, setAlerts] = useState<JobAlert[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingAlert, setEditingAlert] = useState<JobAlert | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        keywords: '',
        locations: [] as string[],
        job_types: [] as string[],
        experience_levels: [] as string[],
        salary_min: '',
        salary_max: '',
        categories: [] as string[],
        is_remote: false,
        frequency: 'daily' as 'instant' | 'daily' | 'weekly',
        notification_channels: ['email'] as string[],
    });

    useEffect(() => {
        // Simulate loading alerts
        setTimeout(() => {
            setAlerts([
                {
                    id: '1',
                    user_id: 'user1',
                    name: 'Software Engineer Jobs',
                    keywords: ['software engineer', 'developer', 'programmer'],
                    locations: ['Dhaka', 'Remote'],
                    job_types: ['full-time'],
                    experience_levels: ['mid', 'senior'],
                    salary_min: 80000,
                    salary_max: 200000,
                    categories: ['Technology'],
                    is_remote: true,
                    frequency: 'daily',
                    is_active: true,
                    notification_channels: ['email', 'push'],
                    last_triggered: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                    updated_at: new Date().toISOString(),
                },
                {
                    id: '2',
                    user_id: 'user1',
                    name: 'Marketing Roles',
                    keywords: ['marketing', 'digital marketing', 'social media'],
                    locations: ['Dhaka'],
                    job_types: ['full-time', 'part-time'],
                    experience_levels: ['entry', 'mid'],
                    categories: ['Marketing'],
                    is_remote: false,
                    frequency: 'weekly',
                    is_active: true,
                    notification_channels: ['email'],
                    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
                    updated_at: new Date().toISOString(),
                },
            ]);
            setIsLoading(false);
        }, 500);
    }, []);

    const handleCreateAlert = async () => {
        const newAlert: JobAlert = {
            id: `${Date.now()}`,
            user_id: user?.id || 'user1',
            name: formData.name,
            keywords: formData.keywords.split(',').map(k => k.trim()).filter(Boolean),
            locations: formData.locations,
            job_types: formData.job_types as any,
            experience_levels: formData.experience_levels as any,
            salary_min: formData.salary_min ? parseInt(formData.salary_min) : undefined,
            salary_max: formData.salary_max ? parseInt(formData.salary_max) : undefined,
            categories: formData.categories,
            is_remote: formData.is_remote,
            frequency: formData.frequency,
            is_active: true,
            notification_channels: formData.notification_channels as any,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        setAlerts([...alerts, newAlert]);
        setShowCreateModal(false);
        resetForm();
    };

    const handleUpdateAlert = async () => {
        if (!editingAlert) return;

        const updatedAlerts = alerts.map(alert =>
            alert.id === editingAlert.id
                ? {
                    ...alert,
                    name: formData.name,
                    keywords: formData.keywords.split(',').map(k => k.trim()).filter(Boolean),
                    locations: formData.locations,
                    job_types: formData.job_types as any,
                    experience_levels: formData.experience_levels as any,
                    salary_min: formData.salary_min ? parseInt(formData.salary_min) : undefined,
                    salary_max: formData.salary_max ? parseInt(formData.salary_max) : undefined,
                    categories: formData.categories,
                    is_remote: formData.is_remote,
                    frequency: formData.frequency,
                    notification_channels: formData.notification_channels as any,
                    updated_at: new Date().toISOString(),
                }
                : alert
        );

        setAlerts(updatedAlerts);
        setEditingAlert(null);
        resetForm();
    };

    const handleDeleteAlert = (alertId: string) => {
        setAlerts(alerts.filter(alert => alert.id !== alertId));
    };

    const handleToggleAlert = (alertId: string) => {
        setAlerts(alerts.map(alert =>
            alert.id === alertId
                ? { ...alert, is_active: !alert.is_active, updated_at: new Date().toISOString() }
                : alert
        ));
    };

    const resetForm = () => {
        setFormData({
            name: '',
            keywords: '',
            locations: [],
            job_types: [],
            experience_levels: [],
            salary_min: '',
            salary_max: '',
            categories: [],
            is_remote: false,
            frequency: 'daily',
            notification_channels: ['email'],
        });
    };

    const openEditModal = (alert: JobAlert) => {
        setEditingAlert(alert);
        setFormData({
            name: alert.name,
            keywords: alert.keywords.join(', '),
            locations: alert.locations,
            job_types: alert.job_types,
            experience_levels: alert.experience_levels,
            salary_min: alert.salary_min?.toString() || '',
            salary_max: alert.salary_max?.toString() || '',
            categories: alert.categories,
            is_remote: alert.is_remote || false,
            frequency: alert.frequency,
            notification_channels: alert.notification_channels,
        });
    };

    const toggleArrayItem = (array: string[], item: string, setter: (arr: string[]) => void) => {
        if (array.includes(item)) {
            setter(array.filter(i => i !== item));
        } else {
            setter([...array, item]);
        }
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
            <main className="max-w-4xl mx-auto px-4 py-6">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-skeu-dark">Job Alerts</h1>
                        <p className="text-skeu-brown mt-1">Get notified when new jobs match your criteria</p>
                    </div>
                    <SkeuButton onClick={() => setShowCreateModal(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Alert
                    </SkeuButton>
                </div>

                {/* Alerts List */}
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <SkeuCard key={i} className="animate-pulse">
                                <div className="h-6 bg-skeu-cream rounded w-1/3 mb-4"></div>
                                <div className="h-4 bg-skeu-cream rounded w-1/2 mb-2"></div>
                                <div className="h-4 bg-skeu-cream rounded w-1/4"></div>
                            </SkeuCard>
                        ))}
                    </div>
                ) : alerts.length === 0 ? (
                    <SkeuCard className="text-center py-12">
                        <Bell className="w-16 h-16 text-skeu-tan mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-skeu-dark mb-2">No job alerts yet</h3>
                        <p className="text-skeu-brown mb-4">Create your first alert to get notified about new jobs</p>
                        <SkeuButton onClick={() => setShowCreateModal(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Your First Alert
                        </SkeuButton>
                    </SkeuCard>
                ) : (
                    <div className="space-y-4">
                        {alerts.map((alert) => (
                            <SkeuCard key={alert.id} className={!alert.is_active ? 'opacity-60' : ''}>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-semibold text-skeu-dark">{alert.name}</h3>
                                            <SkeuBadge variant={alert.is_active ? 'default' : 'bronze'}>
                                                {alert.frequency}
                                            </SkeuBadge>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {alert.keywords.slice(0, 3).map((kw, i) => (
                                                <span key={i} className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs">
                                                    {kw}
                                                </span>
                                            ))}
                                            {alert.keywords.length > 3 && (
                                                <span className="px-2 py-1 bg-skeu-cream text-skeu-brown rounded text-xs">
                                                    +{alert.keywords.length - 3} more
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-skeu-brown">
                                            {alert.locations.length > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    {alert.locations.join(', ')}
                                                </span>
                                            )}
                                            {alert.salary_min && alert.salary_max && (
                                                <span className="flex items-center gap-1">
                                                    <DollarSign className="w-4 h-4" />
                                                    ৳{alert.salary_min.toLocaleString()} - ৳{alert.salary_max.toLocaleString()}
                                                </span>
                                            )}
                                            {alert.is_remote && (
                                                <span className="flex items-center gap-1 text-green-600">
                                                    <Check className="w-4 h-4" />
                                                    Remote OK
                                                </span>
                                            )}
                                        </div>

                                        {alert.last_triggered && (
                                            <p className="text-xs text-skeu-brown mt-2">
                                                Last triggered: {new Date(alert.last_triggered).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleToggleAlert(alert.id)}
                                            className="p-2 rounded-lg hover:bg-skeu-cream transition-colors"
                                            title={alert.is_active ? 'Pause alert' : 'Activate alert'}
                                        >
                                            {alert.is_active ? (
                                                <Pause className="w-5 h-5 text-skeu-brown" />
                                            ) : (
                                                <Play className="w-5 h-5 text-green-500" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => openEditModal(alert)}
                                            className="p-2 rounded-lg hover:bg-skeu-cream transition-colors"
                                            title="Edit alert"
                                        >
                                            <Edit className="w-5 h-5 text-skeu-brown" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteAlert(alert.id)}
                                            className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                                            title="Delete alert"
                                        >
                                            <Trash2 className="w-5 h-5 text-red-500" />
                                        </button>
                                    </div>
                                </div>
                            </SkeuCard>
                        ))}
                    </div>
                )}
            </main>

            {/* Create/Edit Modal */}
            {(showCreateModal || editingAlert) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <SkeuCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-skeu-dark">
                                {editingAlert ? 'Edit Alert' : 'Create Job Alert'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setEditingAlert(null);
                                    resetForm();
                                }}
                                className="p-2 rounded-lg hover:bg-skeu-cream"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Alert Name */}
                            <div>
                                <label className="block text-sm font-medium text-skeu-dark mb-2">
                                    Alert Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Software Engineer Jobs in Dhaka"
                                    className="w-full px-4 py-3 rounded-lg border border-skeu-tan/30 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>

                            {/* Keywords */}
                            <div>
                                <label className="block text-sm font-medium text-skeu-dark mb-2">
                                    Keywords (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    value={formData.keywords}
                                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                                    placeholder="e.g., software engineer, developer, react"
                                    className="w-full px-4 py-3 rounded-lg border border-skeu-tan/30 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>

                            {/* Locations */}
                            <div>
                                <label className="block text-sm font-medium text-skeu-dark mb-2">
                                    Locations
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {popularLocations.map((loc) => (
                                        <button
                                            key={loc}
                                            onClick={() => toggleArrayItem(formData.locations, loc, (arr) => setFormData({ ...formData, locations: arr }))}
                                            className={`px-3 py-2 rounded-lg text-sm transition-colors ${formData.locations.includes(loc)
                                                    ? 'bg-primary-500 text-white'
                                                    : 'bg-skeu-cream text-skeu-brown hover:bg-primary-100'
                                                }`}
                                        >
                                            {loc}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Job Types */}
                            <div>
                                <label className="block text-sm font-medium text-skeu-dark mb-2">
                                    Job Types
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {jobTypes.map((type) => (
                                        <button
                                            key={type.value}
                                            onClick={() => toggleArrayItem(formData.job_types, type.value, (arr) => setFormData({ ...formData, job_types: arr }))}
                                            className={`px-3 py-2 rounded-lg text-sm transition-colors ${formData.job_types.includes(type.value)
                                                    ? 'bg-primary-500 text-white'
                                                    : 'bg-skeu-cream text-skeu-brown hover:bg-primary-100'
                                                }`}
                                        >
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Experience Levels */}
                            <div>
                                <label className="block text-sm font-medium text-skeu-dark mb-2">
                                    Experience Levels
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {experienceLevels.map((level) => (
                                        <button
                                            key={level.value}
                                            onClick={() => toggleArrayItem(formData.experience_levels, level.value, (arr) => setFormData({ ...formData, experience_levels: arr }))}
                                            className={`px-3 py-2 rounded-lg text-sm transition-colors ${formData.experience_levels.includes(level.value)
                                                    ? 'bg-primary-500 text-white'
                                                    : 'bg-skeu-cream text-skeu-brown hover:bg-primary-100'
                                                }`}
                                        >
                                            {level.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Salary Range */}
                            <div>
                                <label className="block text-sm font-medium text-skeu-dark mb-2">
                                    Salary Range (BDT, monthly)
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="number"
                                        value={formData.salary_min}
                                        onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
                                        placeholder="Min"
                                        className="flex-1 px-4 py-3 rounded-lg border border-skeu-tan/30 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                    <span className="text-skeu-brown">to</span>
                                    <input
                                        type="number"
                                        value={formData.salary_max}
                                        onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
                                        placeholder="Max"
                                        className="flex-1 px-4 py-3 rounded-lg border border-skeu-tan/30 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                            </div>

                            {/* Remote Toggle */}
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-skeu-dark">
                                    Include Remote Jobs
                                </label>
                                <button
                                    onClick={() => setFormData({ ...formData, is_remote: !formData.is_remote })}
                                    className={`w-12 h-6 rounded-full transition-colors ${formData.is_remote ? 'bg-primary-500' : 'bg-gray-300'
                                        }`}
                                >
                                    <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${formData.is_remote ? 'translate-x-6' : 'translate-x-0.5'
                                        }`} />
                                </button>
                            </div>

                            {/* Frequency */}
                            <div>
                                <label className="block text-sm font-medium text-skeu-dark mb-2">
                                    Alert Frequency
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {frequencies.map((freq) => (
                                        <button
                                            key={freq.value}
                                            onClick={() => setFormData({ ...formData, frequency: freq.value as any })}
                                            className={`px-4 py-2 rounded-lg text-sm transition-colors ${formData.frequency === freq.value
                                                    ? 'bg-primary-500 text-white'
                                                    : 'bg-skeu-cream text-skeu-brown hover:bg-primary-100'
                                                }`}
                                        >
                                            {freq.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Notification Channels */}
                            <div>
                                <label className="block text-sm font-medium text-skeu-dark mb-2">
                                    Notification Channels
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {['email', 'push', 'sms'].map((channel) => (
                                        <button
                                            key={channel}
                                            onClick={() => toggleArrayItem(formData.notification_channels, channel, (arr) => setFormData({ ...formData, notification_channels: arr }))}
                                            className={`px-4 py-2 rounded-lg text-sm transition-colors capitalize ${formData.notification_channels.includes(channel)
                                                    ? 'bg-primary-500 text-white'
                                                    : 'bg-skeu-cream text-skeu-brown hover:bg-primary-100'
                                                }`}
                                        >
                                            {channel}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <SkeuButton
                                variant="secondary"
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setEditingAlert(null);
                                    resetForm();
                                }}
                            >
                                Cancel
                            </SkeuButton>
                            <SkeuButton
                                onClick={editingAlert ? handleUpdateAlert : handleCreateAlert}
                                disabled={!formData.name}
                            >
                                {editingAlert ? 'Update Alert' : 'Create Alert'}
                            </SkeuButton>
                        </div>
                    </SkeuCard>
                </div>
            )}
        </div>
    );
}
