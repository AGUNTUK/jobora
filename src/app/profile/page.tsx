'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    User, Mail, Phone, MapPin, Briefcase, GraduationCap,
    Settings, LogOut, Edit2, Award, TrendingUp, Calendar,
    FileText, Bell, Shield, ChevronRight, Plus, X, Save
} from 'lucide-react';
import { SkeuButton, SkeuCard, SkeuInput, SkeuTextarea, SkeuBadge, SkeuProgress, SkeuAvatar } from '@/components/ui/skeuomorphic';
import { useAuthStore } from '@/store';
import { calculateLevel } from '@/lib/utils';

export default function ProfilePage() {
    const { user, isAuthenticated } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    // Mock user data for demo
    const mockUser = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+880 1712-345678',
        location: 'Dhaka, Bangladesh',
        avatar_url: null,
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python'],
        experience: [
            {
                id: '1',
                title: 'Software Engineer',
                company: 'Tech Company',
                location: 'Dhaka',
                start_date: '2021-01',
                current: true,
                description: 'Building web applications',
                skills: ['React', 'Node.js'],
            },
        ],
        education: [
            {
                id: '1',
                degree: 'BSc in Computer Science',
                institution: 'University of Dhaka',
                location: 'Dhaka',
                start_date: '2016',
                end_date: '2020',
                current: false,
                field_of_study: 'Computer Science',
                gpa: 3.75,
            },
        ],
        preferred_locations: ['Dhaka', 'Remote'],
        salary_expectation: {
            min: 80000,
            max: 120000,
            currency: 'BDT',
            period: 'monthly' as const,
        },
        job_types: ['full-time', 'remote'],
        created_at: new Date().toISOString(),
    };

    const mockGamification = {
        total_points: 1250,
        current_level: 4,
        streak_days: 7,
        badges: [
            { id: '1', name: 'Early Bird', icon: '🌅', tier: 'gold' as const },
            { id: '2', name: 'Job Hunter', icon: '🎯', tier: 'silver' as const },
            { id: '3', name: 'Streak Master', icon: '🔥', tier: 'bronze' as const },
        ],
    };

    const levelInfo = calculateLevel(mockGamification.total_points);

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'experience', label: 'Experience', icon: Briefcase },
        { id: 'education', label: 'Education', icon: GraduationCap },
        { id: 'preferences', label: 'Preferences', icon: Settings },
    ];

    return (
        <div className="min-h-screen pb-20 md:pb-8">
            {/* Header */}
            <header className="header sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold text-skeu-dark">Profile</h1>
                        <div className="flex items-center gap-2">
                            <Link href="/settings" className="p-2 rounded-lg hover:bg-skeu-cream transition-colors">
                                <Settings className="w-5 h-5 text-skeu-brown" />
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-6">
                {/* Profile Header Card */}
                <SkeuCard variant="raised" className="mb-6">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            <SkeuAvatar name={mockUser.name} size="xl" />
                            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-lg">
                                <Edit2 className="w-4 h-4" />
                            </button>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-2xl font-bold text-skeu-dark">{mockUser.name}</h1>
                            <p className="text-skeu-brown">{mockUser.email}</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                                <span className="inline-flex items-center gap-1 text-sm text-skeu-brown">
                                    <MapPin className="w-4 h-4" />
                                    {mockUser.location}
                                </span>
                                <span className="inline-flex items-center gap-1 text-sm text-skeu-brown">
                                    <Phone className="w-4 h-4" />
                                    {mockUser.phone}
                                </span>
                            </div>

                            {/* Level Progress */}
                            <div className="mt-4">
                                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                    <span className="level-badge">{levelInfo.level}</span>
                                    <span className="font-medium text-skeu-dark">{levelInfo.title}</span>
                                </div>
                                <SkeuProgress
                                    value={mockGamification.total_points}
                                    max={levelInfo.nextLevelPoints}
                                    variant="gold"
                                    showValue={false}
                                />
                                <p className="text-xs text-skeu-brown mt-1">
                                    {mockGamification.total_points} / {levelInfo.nextLevelPoints} points to next level
                                </p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-4 md:flex-col md:items-end">
                            <div className="text-center">
                                <div className="points-display">
                                    <Award className="w-4 h-4" />
                                    {mockGamification.total_points}
                                </div>
                                <p className="text-xs text-skeu-brown mt-1">Points</p>
                            </div>
                            <div className="text-center">
                                <div className="streak-badge">
                                    🔥 {mockGamification.streak_days}
                                </div>
                                <p className="text-xs text-skeu-brown mt-1">Day Streak</p>
                            </div>
                        </div>
                    </div>

                    {/* Badges */}
                    <div className="mt-6 pt-6 border-t border-skeu-tan">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-skeu-dark">Badges Earned</h3>
                            <Link href="/gamification" className="text-sm text-primary-600 hover:underline">
                                View All
                            </Link>
                        </div>
                        <div className="flex gap-3">
                            {mockGamification.badges.map((badge) => (
                                <div
                                    key={badge.id}
                                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-skeu-tan to-skeu-brown flex items-center justify-center text-2xl shadow-skeu-raised"
                                    title={badge.name}
                                >
                                    {badge.icon}
                                </div>
                            ))}
                        </div>
                    </div>
                </SkeuCard>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${activeTab === tab.id
                                    ? 'bg-gradient-to-b from-white to-skeu-light text-skeu-dark shadow-skeu-raised'
                                    : 'text-skeu-brown hover:bg-skeu-cream'
                                }`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'profile' && (
                    <div className="space-y-4">
                        {/* Skills */}
                        <SkeuCard variant="raised">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-bold text-lg text-skeu-dark">Skills</h2>
                                <SkeuButton variant="secondary" size="sm">
                                    <Plus className="w-4 h-4 mr-1" />
                                    Add
                                </SkeuButton>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {mockUser.skills.map((skill, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg font-medium text-sm"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </SkeuCard>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <SkeuCard variant="raised" className="text-center">
                                <Briefcase className="w-8 h-8 mx-auto text-primary-500 mb-2" />
                                <div className="text-2xl font-bold text-skeu-dark">12</div>
                                <div className="text-sm text-skeu-brown">Jobs Applied</div>
                            </SkeuCard>
                            <SkeuCard variant="raised" className="text-center">
                                <FileText className="w-8 h-8 mx-auto text-green-500 mb-2" />
                                <div className="text-2xl font-bold text-skeu-dark">2</div>
                                <div className="text-sm text-skeu-brown">Resumes</div>
                            </SkeuCard>
                        </div>
                    </div>
                )}

                {activeTab === 'experience' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-bold text-lg text-skeu-dark">Work Experience</h2>
                            <SkeuButton variant="primary" size="sm">
                                <Plus className="w-4 h-4 mr-1" />
                                Add Experience
                            </SkeuButton>
                        </div>

                        {mockUser.experience.map((exp) => (
                            <SkeuCard key={exp.id} variant="raised">
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-skeu-tan to-skeu-brown flex items-center justify-center text-white font-bold">
                                            {exp.company.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-skeu-dark">{exp.title}</h3>
                                            <p className="text-skeu-brown">{exp.company}</p>
                                            <p className="text-sm text-skeu-brown">
                                                {exp.start_date} - {exp.current ? 'Present' : ''}
                                            </p>
                                            <p className="text-sm text-skeu-brown">{exp.location}</p>
                                        </div>
                                    </div>
                                    <button className="p-2 rounded-lg hover:bg-skeu-cream text-skeu-brown">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </SkeuCard>
                        ))}

                        {mockUser.experience.length === 0 && (
                            <SkeuCard variant="flat" className="text-center py-8">
                                <Briefcase className="w-12 h-12 mx-auto text-skeu-brown mb-3" />
                                <p className="text-skeu-brown">No work experience added yet</p>
                                <SkeuButton variant="primary" size="sm" className="mt-4">
                                    Add Your First Experience
                                </SkeuButton>
                            </SkeuCard>
                        )}
                    </div>
                )}

                {activeTab === 'education' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-bold text-lg text-skeu-dark">Education</h2>
                            <SkeuButton variant="primary" size="sm">
                                <Plus className="w-4 h-4 mr-1" />
                                Add Education
                            </SkeuButton>
                        </div>

                        {mockUser.education.map((edu) => (
                            <SkeuCard key={edu.id} variant="raised">
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white">
                                            <GraduationCap className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-skeu-dark">{edu.degree}</h3>
                                            <p className="text-skeu-brown">{edu.institution}</p>
                                            <p className="text-sm text-skeu-brown">
                                                {edu.start_date} - {edu.end_date}
                                            </p>
                                            {edu.gpa && (
                                                <p className="text-sm text-skeu-brown">GPA: {edu.gpa}</p>
                                            )}
                                        </div>
                                    </div>
                                    <button className="p-2 rounded-lg hover:bg-skeu-cream text-skeu-brown">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </SkeuCard>
                        ))}
                    </div>
                )}

                {activeTab === 'preferences' && (
                    <div className="space-y-4">
                        {/* Job Preferences */}
                        <SkeuCard variant="raised">
                            <h2 className="font-bold text-lg text-skeu-dark mb-4">Job Preferences</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-skeu-brown mb-2">
                                        Preferred Locations
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {mockUser.preferred_locations.map((loc, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1.5 bg-skeu-cream text-skeu-dark rounded-lg font-medium text-sm"
                                            >
                                                {loc}
                                            </span>
                                        ))}
                                        <button className="px-3 py-1.5 border-2 border-dashed border-skeu-tan text-skeu-brown rounded-lg text-sm hover:border-skeu-brown transition-colors">
                                            + Add
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-skeu-brown mb-2">
                                        Salary Expectation
                                    </label>
                                    <div className="flex gap-4">
                                        <SkeuInput
                                            type="number"
                                            placeholder="Min"
                                            value={mockUser.salary_expectation.min}
                                        />
                                        <SkeuInput
                                            type="number"
                                            placeholder="Max"
                                            value={mockUser.salary_expectation.max}
                                        />
                                        <select className="skeu-input w-32">
                                            <option value="monthly">Monthly</option>
                                            <option value="yearly">Yearly</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-skeu-brown mb-2">
                                        Job Types
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Full-time', 'Part-time', 'Contract', 'Remote', 'Hybrid'].map((type) => (
                                            <button
                                                key={type}
                                                className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${mockUser.job_types.includes(type.toLowerCase())
                                                        ? 'bg-primary-500 text-white'
                                                        : 'bg-skeu-cream text-skeu-brown hover:bg-skeu-tan'
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-skeu-tan">
                                <SkeuButton variant="primary">
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Preferences
                                </SkeuButton>
                            </div>
                        </SkeuCard>

                        {/* Notification Settings */}
                        <SkeuCard variant="raised">
                            <h2 className="font-bold text-lg text-skeu-dark mb-4">Notification Settings</h2>

                            <div className="space-y-3">
                                {[
                                    { label: 'Job match alerts', enabled: true },
                                    { label: 'Application updates', enabled: true },
                                    { label: 'Weekly job digest', enabled: false },
                                    { label: 'Promotional emails', enabled: false },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between py-2">
                                        <span className="text-skeu-dark">{item.label}</span>
                                        <button
                                            className={`w-12 h-6 rounded-full transition-colors ${item.enabled ? 'bg-green-500' : 'bg-gray-300'
                                                }`}
                                        >
                                            <div
                                                className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${item.enabled ? 'translate-x-6' : 'translate-x-0.5'
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </SkeuCard>
                    </div>
                )}

                {/* Account Actions */}
                <div className="mt-8 pt-6 border-t border-skeu-tan">
                    <SkeuButton variant="leather" className="w-full">
                        <LogOut className="w-5 h-5 mr-2" />
                        Sign Out
                    </SkeuButton>
                </div>
            </main>
        </div>
    );
}
