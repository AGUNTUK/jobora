'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Trophy, Star, Flame, Gift, Users, Target, Award, Zap,
    Calendar, ChevronRight, Lock, CheckCircle, Share2, Copy
} from 'lucide-react';
import { SkeuButton, SkeuCard, SkeuBadge, SkeuProgress, Skeu3DBadge } from '@/components/ui/skeuomorphic';
import { calculateLevel, getBadgeTier } from '@/lib/utils';

export default function GamificationPage() {
    const [activeTab, setActiveTab] = useState('overview');

    // Mock gamification data
    const gamificationData = {
        total_points: 1250,
        current_level: 4,
        streak_days: 7,
        last_activity_date: new Date().toISOString(),
        badges: [
            { id: '1', name: 'Early Bird', description: 'Apply to 5 jobs before 9 AM', icon: '🌅', tier: 'gold' as const, earned_at: '2024-01-15', category: 'activity' },
            { id: '2', name: 'Job Hunter', description: 'Apply to 10 jobs in a week', icon: '🎯', tier: 'silver' as const, earned_at: '2024-01-10', category: 'applications' },
            { id: '3', name: 'Streak Master', description: '7 day login streak', icon: '🔥', tier: 'bronze' as const, earned_at: '2024-01-20', category: 'streak' },
            { id: '4', name: 'Profile Pro', description: 'Complete your profile 100%', icon: '✨', tier: 'gold' as const, earned_at: '2024-01-05', category: 'profile' },
            { id: '5', name: 'Network Builder', description: 'Refer 3 friends', icon: '🤝', tier: 'silver' as const, earned_at: '2024-01-18', category: 'social' },
        ],
        achievements: [
            { id: '1', name: 'First Application', description: 'Applied to your first job', points: 50, icon: '📝', earned_at: '2024-01-01', category: 'milestone' },
            { id: '2', name: 'Resume Ready', description: 'Created your first resume', points: 30, icon: '📄', earned_at: '2024-01-02', category: 'milestone' },
            { id: '3', name: 'Job Searcher', description: 'Viewed 50 jobs', points: 20, icon: '🔍', earned_at: '2024-01-08', category: 'activity' },
            { id: '4', name: 'Consistent', description: 'Logged in 7 days in a row', points: 100, icon: '📅', earned_at: '2024-01-20', category: 'streak' },
        ],
        referrals: [
            { id: '1', referred_email: 'friend1@example.com', status: 'active', points_earned: 100, created_at: '2024-01-15' },
            { id: '2', referred_email: 'friend2@example.com', status: 'registered', points_earned: 50, created_at: '2024-01-18' },
        ],
    };

    const levelInfo = calculateLevel(gamificationData.total_points);

    // Available badges to earn
    const availableBadges = [
        { id: '6', name: 'Interview Ready', description: 'Get 5 interview calls', icon: '💼', tier: 'platinum' as const, progress: 60 },
        { id: '7', name: 'Super Connector', description: 'Refer 10 friends', icon: '🌟', tier: 'platinum' as const, progress: 30 },
        { id: '8', name: 'Job Master', description: 'Apply to 100 jobs', icon: '🏆', tier: 'platinum' as const, progress: 45 },
    ];

    // Daily challenges
    const dailyChallenges = [
        { id: '1', name: 'Apply to 3 jobs', points: 30, progress: 2, target: 3, completed: false },
        { id: '2', name: 'Update your profile', points: 20, progress: 1, target: 1, completed: true },
        { id: '3', name: 'Share a job listing', points: 15, progress: 0, target: 1, completed: false },
    ];

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Trophy },
        { id: 'badges', label: 'Badges', icon: Award },
        { id: 'challenges', label: 'Challenges', icon: Target },
        { id: 'referrals', label: 'Referrals', icon: Users },
    ];

    return (
        <div className="min-h-screen pb-20 md:pb-8">
            {/* Header */}
            <header className="header sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold text-skeu-dark">Rewards & Achievements</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-6">
                {/* Level Progress Card */}
                <SkeuCard variant="raised" className="mb-6 overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full -translate-y-1/2 translate-x-1/2" />
                    </div>

                    <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-skeu-raised">
                                        <span className="text-2xl font-bold text-white">{levelInfo.level}</span>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-skeu-dark">{levelInfo.title}</h2>
                                        <p className="text-skeu-brown">Level {levelInfo.level}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="points-display text-lg">
                                    <Star className="w-5 h-5" />
                                    {gamificationData.total_points.toLocaleString()}
                                </div>
                                <p className="text-sm text-skeu-brown mt-1">
                                    {levelInfo.nextLevelPoints - gamificationData.total_points} pts to next level
                                </p>
                            </div>
                        </div>

                        <SkeuProgress
                            value={gamificationData.total_points}
                            max={levelInfo.nextLevelPoints}
                            variant="gold"
                            showValue={false}
                        />

                        {/* Streak */}
                        <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-skeu-tan">
                            <div className="flex items-center gap-2">
                                <Flame className="w-6 h-6 text-orange-500" />
                                <span className="text-2xl font-bold text-skeu-dark">{gamificationData.streak_days}</span>
                                <span className="text-skeu-brown">day streak</span>
                            </div>
                            <div className="h-6 w-px bg-skeu-tan" />
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-green-500" />
                                <span className="text-skeu-brown">Keep it going!</span>
                            </div>
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
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Daily Challenges Preview */}
                        <SkeuCard variant="raised">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-bold text-lg text-skeu-dark">Today's Challenges</h2>
                                <button
                                    className="text-sm text-primary-600 hover:underline"
                                    onClick={() => setActiveTab('challenges')}
                                >
                                    View All
                                </button>
                            </div>
                            <div className="space-y-3">
                                {dailyChallenges.slice(0, 2).map((challenge) => (
                                    <div
                                        key={challenge.id}
                                        className={`flex items-center justify-between p-3 rounded-lg ${challenge.completed ? 'bg-green-50' : 'bg-skeu-cream'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {challenge.completed ? (
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                            ) : (
                                                <Target className="w-5 h-5 text-skeu-brown" />
                                            )}
                                            <div>
                                                <p className={`font-medium ${challenge.completed ? 'text-green-700' : 'text-skeu-dark'}`}>
                                                    {challenge.name}
                                                </p>
                                                <p className="text-sm text-skeu-brown">
                                                    {challenge.progress}/{challenge.target} completed
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-bold text-primary-600">+{challenge.points} pts</span>
                                    </div>
                                ))}
                            </div>
                        </SkeuCard>

                        {/* Recent Badges */}
                        <SkeuCard variant="raised">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-bold text-lg text-skeu-dark">Recent Badges</h2>
                                <button
                                    className="text-sm text-primary-600 hover:underline"
                                    onClick={() => setActiveTab('badges')}
                                >
                                    View All
                                </button>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                {gamificationData.badges.slice(0, 3).map((badge) => (
                                    <Skeu3DBadge
                                        key={badge.id}
                                        icon={badge.icon}
                                        title={badge.name}
                                        description={badge.description}
                                        tier={badge.tier}
                                        earned
                                    />
                                ))}
                            </div>
                        </SkeuCard>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <SkeuCard variant="raised" className="text-center">
                                <Award className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
                                <div className="text-2xl font-bold text-skeu-dark">{gamificationData.badges.length}</div>
                                <div className="text-sm text-skeu-brown">Badges Earned</div>
                            </SkeuCard>
                            <SkeuCard variant="raised" className="text-center">
                                <Target className="w-8 h-8 mx-auto text-green-500 mb-2" />
                                <div className="text-2xl font-bold text-skeu-dark">{gamificationData.achievements.length}</div>
                                <div className="text-sm text-skeu-brown">Achievements</div>
                            </SkeuCard>
                        </div>
                    </div>
                )}

                {activeTab === 'badges' && (
                    <div className="space-y-6">
                        {/* Earned Badges */}
                        <div>
                            <h2 className="font-bold text-lg text-skeu-dark mb-4">Earned Badges</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {gamificationData.badges.map((badge) => (
                                    <Skeu3DBadge
                                        key={badge.id}
                                        icon={badge.icon}
                                        title={badge.name}
                                        description={badge.description}
                                        tier={badge.tier}
                                        earned
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Available Badges */}
                        <div>
                            <h2 className="font-bold text-lg text-skeu-dark mb-4">Badges to Unlock</h2>
                            <div className="grid gap-4">
                                {availableBadges.map((badge) => (
                                    <SkeuCard key={badge.id} variant="flat" className="opacity-75">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-xl bg-gray-200 flex items-center justify-center text-2xl relative">
                                                <span className="opacity-50">{badge.icon}</span>
                                                <Lock className="w-4 h-4 absolute -bottom-1 -right-1 text-gray-500" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-skeu-dark">{badge.name}</h3>
                                                <p className="text-sm text-skeu-brown">{badge.description}</p>
                                                <div className="mt-2">
                                                    <SkeuProgress value={badge.progress} max={100} showValue={false} />
                                                </div>
                                            </div>
                                            <SkeuBadge variant={badge.tier}>{badge.progress}%</SkeuBadge>
                                        </div>
                                    </SkeuCard>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'challenges' && (
                    <div className="space-y-4">
                        <h2 className="font-bold text-lg text-skeu-dark">Daily Challenges</h2>
                        <p className="text-skeu-brown">Complete challenges to earn points and badges!</p>

                        {dailyChallenges.map((challenge) => (
                            <SkeuCard key={challenge.id} variant="raised">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${challenge.completed
                                                ? 'bg-gradient-to-br from-green-400 to-green-600'
                                                : 'bg-gradient-to-br from-skeu-tan to-skeu-brown'
                                            }`}>
                                            {challenge.completed ? (
                                                <CheckCircle className="w-6 h-6 text-white" />
                                            ) : (
                                                <Target className="w-6 h-6 text-white" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className={`font-bold ${challenge.completed ? 'text-green-600' : 'text-skeu-dark'}`}>
                                                {challenge.name}
                                            </h3>
                                            <p className="text-sm text-skeu-brown">
                                                Progress: {challenge.progress}/{challenge.target}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-lg font-bold text-primary-600">+{challenge.points}</span>
                                        <p className="text-xs text-skeu-brown">points</p>
                                    </div>
                                </div>
                                {!challenge.completed && challenge.progress > 0 && (
                                    <div className="mt-3 pt-3 border-t border-skeu-tan">
                                        <SkeuProgress value={challenge.progress} max={challenge.target} showValue={false} />
                                    </div>
                                )}
                            </SkeuCard>
                        ))}

                        {/* Weekly Challenge */}
                        <SkeuCard variant="raised" className="border-2 border-primary-300">
                            <div className="flex items-center gap-2 mb-3">
                                <Zap className="w-5 h-5 text-primary-500" />
                                <span className="text-sm font-bold text-primary-600">WEEKLY CHALLENGE</span>
                            </div>
                            <h3 className="font-bold text-lg text-skeu-dark mb-2">Apply to 20 Jobs This Week</h3>
                            <p className="text-skeu-brown mb-4">Complete this challenge to earn the "Weekly Warrior" badge!</p>
                            <SkeuProgress value={12} max={20} label="Progress" />
                            <div className="flex items-center justify-between mt-4">
                                <span className="text-skeu-brown">12/20 applications</span>
                                <span className="font-bold text-primary-600">+200 pts</span>
                            </div>
                        </SkeuCard>
                    </div>
                )}

                {activeTab === 'referrals' && (
                    <div className="space-y-6">
                        {/* Referral Code */}
                        <SkeuCard variant="raised" className="text-center">
                            <Gift className="w-12 h-12 mx-auto text-primary-500 mb-3" />
                            <h2 className="font-bold text-lg text-skeu-dark mb-2">Invite Friends & Earn Points</h2>
                            <p className="text-skeu-brown mb-4">
                                Share your referral code and earn 100 points for each friend who signs up!
                            </p>

                            <div className="bg-skeu-cream rounded-lg p-4 mb-4">
                                <p className="text-sm text-skeu-brown mb-1">Your Referral Code</p>
                                <div className="flex items-center justify-center gap-2">
                                    <span className="text-2xl font-bold text-skeu-dark font-mono">JOHORA2024</span>
                                    <button className="p-2 rounded-lg hover:bg-skeu-tan transition-colors">
                                        <Copy className="w-5 h-5 text-skeu-brown" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <SkeuButton variant="primary" className="flex-1">
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Share Link
                                </SkeuButton>
                                <SkeuButton variant="secondary" className="flex-1">
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copy Code
                                </SkeuButton>
                            </div>
                        </SkeuCard>

                        {/* Referral Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            <SkeuCard variant="raised" className="text-center">
                                <div className="text-2xl font-bold text-skeu-dark">{gamificationData.referrals.length}</div>
                                <div className="text-sm text-skeu-brown">Invited</div>
                            </SkeuCard>
                            <SkeuCard variant="raised" className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {gamificationData.referrals.filter(r => r.status === 'active').length}
                                </div>
                                <div className="text-sm text-skeu-brown">Active</div>
                            </SkeuCard>
                            <SkeuCard variant="raised" className="text-center">
                                <div className="text-2xl font-bold text-primary-600">
                                    {gamificationData.referrals.reduce((sum, r) => sum + r.points_earned, 0)}
                                </div>
                                <div className="text-sm text-skeu-brown">Points Earned</div>
                            </SkeuCard>
                        </div>

                        {/* Referral List */}
                        <div>
                            <h2 className="font-bold text-lg text-skeu-dark mb-4">Your Referrals</h2>
                            {gamificationData.referrals.length > 0 ? (
                                <div className="space-y-3">
                                    {gamificationData.referrals.map((ref) => (
                                        <SkeuCard key={ref.id} variant="flat">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-skeu-tan flex items-center justify-center text-skeu-dark font-bold">
                                                        {ref.referred_email.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-skeu-dark">{ref.referred_email}</p>
                                                        <p className="text-sm text-skeu-brown">
                                                            {new Date(ref.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${ref.status === 'active'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {ref.status}
                                                    </span>
                                                    <p className="text-sm font-bold text-primary-600 mt-1">+{ref.points_earned} pts</p>
                                                </div>
                                            </div>
                                        </SkeuCard>
                                    ))}
                                </div>
                            ) : (
                                <SkeuCard variant="flat" className="text-center py-8">
                                    <Users className="w-12 h-12 mx-auto text-skeu-brown mb-3" />
                                    <p className="text-skeu-brown">No referrals yet. Start sharing your code!</p>
                                </SkeuCard>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
