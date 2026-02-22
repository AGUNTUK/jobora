'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    BarChart3, TrendingUp, TrendingDown, Clock, CheckCircle, XCircle, Target, Search, Bell, User, Award, Bookmark, Briefcase,
    Menu, X, Calendar, MapPin, Building2, ChevronRight, Filter
} from 'lucide-react';
import { SkeuButton, SkeuCard, SkeuBadge } from '@/components/ui/skeuomorphic';
import { useAuthStore, useUIStore } from '@/store';

// Sample analytics data
const analyticsData = {
    overview: {
        totalApplications: 24,
        responseRate: 42,
        interviewRate: 25,
        offerRate: 8,
        avgResponseTime: 5.2,
    },
    monthlyTrend: [
        { month: 'Jan', applications: 3, responses: 1, interviews: 0 },
        { month: 'Feb', applications: 5, responses: 2, interviews: 1 },
        { month: 'Mar', applications: 4, responses: 3, interviews: 1 },
        { month: 'Apr', applications: 6, responses: 2, interviews: 2 },
        { month: 'May', applications: 3, responses: 1, interviews: 1 },
        { month: 'Jun', applications: 3, responses: 1, interviews: 0 },
    ],
    byStatus: [
        { status: 'Saved', count: 8, color: 'bg-gray-400' },
        { status: 'Applied', count: 12, color: 'bg-blue-400' },
        { status: 'Interviewing', count: 3, color: 'bg-yellow-400' },
        { status: 'Offered', count: 1, color: 'bg-green-400' },
    ],
    topCompanies: [
        { company: 'Tech Solutions BD', applications: 3, status: 'Interviewing' },
        { company: 'StartupXYZ', applications: 2, status: 'Applied' },
        { company: 'Creative Agency', applications: 2, status: 'Rejected' },
        { company: 'Finance Corp', applications: 1, status: 'Offered' },
    ],
    recentActivity: [
        { type: 'applied', company: 'Tech Solutions BD', role: 'Senior Developer', date: '2 hours ago' },
        { type: 'interview', company: 'StartupXYZ', role: 'Product Manager', date: '1 day ago' },
        { type: 'response', company: 'Finance Corp', role: 'Data Analyst', date: '2 days ago' },
        { type: 'rejected', company: 'Creative Agency', role: 'UX Designer', date: '3 days ago' },
    ],
    skillsGap: [
        { skill: 'React', demand: 85, yourLevel: 70 },
        { skill: 'Node.js', demand: 75, yourLevel: 80 },
        { skill: 'Python', demand: 70, yourLevel: 40 },
        { skill: 'AWS', demand: 65, yourLevel: 30 },
        { skill: 'Docker', demand: 60, yourLevel: 50 },
    ],
};

export default function AnalyticsDashboardPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { isMenuOpen, toggleMenu } = useUIStore();
    const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

    const getStatusIcon = (type: string) => {
        switch (type) {
            case 'applied':
                return <CheckCircle className="w-4 h-4 text-blue-500" />;
            case 'interview':
                return <Calendar className="w-4 h-4 text-yellow-500" />;
            case 'response':
                return <TrendingUp className="w-4 h-4 text-green-500" />;
            case 'rejected':
                return <XCircle className="w-4 h-4 text-red-500" />;
            default:
                return <Clock className="w-4 h-4 text-gray-500" />;
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
            <main className="max-w-7xl mx-auto px-4 py-6">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-skeu-dark">Application Analytics</h1>
                        <p className="text-skeu-brown mt-1">Track your job search progress</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {(['week', 'month', 'year'] as const).map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${timeRange === range
                                        ? 'bg-primary-500 text-white'
                                        : 'bg-white text-skeu-brown border border-skeu-tan/30'
                                    }`}
                            >
                                {range.charAt(0).toUpperCase() + range.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <SkeuCard className="text-center">
                        <p className="text-3xl font-bold text-skeu-dark">{analyticsData.overview.totalApplications}</p>
                        <p className="text-sm text-skeu-brown">Total Applications</p>
                    </SkeuCard>
                    <SkeuCard className="text-center">
                        <p className="text-3xl font-bold text-blue-500">{analyticsData.overview.responseRate}%</p>
                        <p className="text-sm text-skeu-brown">Response Rate</p>
                    </SkeuCard>
                    <SkeuCard className="text-center">
                        <p className="text-3xl font-bold text-yellow-500">{analyticsData.overview.interviewRate}%</p>
                        <p className="text-sm text-skeu-brown">Interview Rate</p>
                    </SkeuCard>
                    <SkeuCard className="text-center">
                        <p className="text-3xl font-bold text-green-500">{analyticsData.overview.offerRate}%</p>
                        <p className="text-sm text-skeu-brown">Offer Rate</p>
                    </SkeuCard>
                    <SkeuCard className="text-center">
                        <p className="text-3xl font-bold text-purple-500">{analyticsData.overview.avgResponseTime}</p>
                        <p className="text-sm text-skeu-brown">Avg. Response (days)</p>
                    </SkeuCard>
                </div>

                <div className="grid lg:grid-cols-2 gap-6 mb-8">
                    {/* Application Trend */}
                    <SkeuCard>
                        <h2 className="text-lg font-semibold text-skeu-dark mb-4">Application Trend</h2>
                        <div className="h-48 flex items-end justify-between gap-2">
                            {analyticsData.monthlyTrend.map((data) => (
                                <div key={data.month} className="flex-1 flex flex-col items-center gap-1">
                                    <div className="w-full flex flex-col gap-1">
                                        <div
                                            className="w-full bg-green-400 rounded-t"
                                            style={{ height: `${data.interviews * 20}px` }}
                                            title={`Interviews: ${data.interviews}`}
                                        />
                                        <div
                                            className="w-full bg-blue-400"
                                            style={{ height: `${data.responses * 15}px` }}
                                            title={`Responses: ${data.responses}`}
                                        />
                                        <div
                                            className="w-full bg-primary-300 rounded-b"
                                            style={{ height: `${data.applications * 10}px` }}
                                            title={`Applications: ${data.applications}`}
                                        />
                                    </div>
                                    <span className="text-xs text-skeu-brown">{data.month}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-center gap-4 mt-4 text-xs">
                            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-primary-300 rounded" /> Applications</span>
                            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-400 rounded" /> Responses</span>
                            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-green-400 rounded" /> Interviews</span>
                        </div>
                    </SkeuCard>

                    {/* Status Distribution */}
                    <SkeuCard>
                        <h2 className="text-lg font-semibold text-skeu-dark mb-4">Status Distribution</h2>
                        <div className="space-y-4">
                            {analyticsData.byStatus.map((item) => (
                                <div key={item.status}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium text-skeu-dark">{item.status}</span>
                                        <span className="text-sm text-skeu-brown">{item.count} applications</span>
                                    </div>
                                    <div className="h-3 bg-skeu-cream rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${item.color} rounded-full transition-all`}
                                            style={{ width: `${(item.count / analyticsData.overview.totalApplications) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SkeuCard>
                </div>

                <div className="grid lg:grid-cols-2 gap-6 mb-8">
                    {/* Top Companies */}
                    <SkeuCard>
                        <h2 className="text-lg font-semibold text-skeu-dark mb-4">Top Companies Applied</h2>
                        <div className="space-y-3">
                            {analyticsData.topCompanies.map((item) => (
                                <div key={item.company} className="flex items-center justify-between p-3 rounded-lg hover:bg-skeu-cream transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-skeu-cream flex items-center justify-center">
                                            <Building2 className="w-5 h-5 text-skeu-brown" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-skeu-dark">{item.company}</p>
                                            <p className="text-xs text-skeu-brown">{item.applications} application{item.applications > 1 ? 's' : ''}</p>
                                        </div>
                                    </div>
                                    <SkeuBadge variant={item.status === 'Offered' ? 'gold' : item.status === 'Interviewing' ? 'silver' : 'default'}>
                                        {item.status}
                                    </SkeuBadge>
                                </div>
                            ))}
                        </div>
                    </SkeuCard>

                    {/* Skills Gap Analysis */}
                    <SkeuCard>
                        <h2 className="text-lg font-semibold text-skeu-dark mb-4">Skills Gap Analysis</h2>
                        <div className="space-y-4">
                            {analyticsData.skillsGap.map((skill) => (
                                <div key={skill.skill}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium text-skeu-dark">{skill.skill}</span>
                                        <span className="text-xs text-skeu-brown">
                                            You: {skill.yourLevel}% | Demand: {skill.demand}%
                                        </span>
                                    </div>
                                    <div className="relative h-2 bg-skeu-cream rounded-full overflow-hidden">
                                        <div
                                            className="absolute h-full bg-gray-300 rounded-full"
                                            style={{ width: `${skill.demand}%` }}
                                        />
                                        <div
                                            className="absolute h-full bg-primary-500 rounded-full"
                                            style={{ width: `${skill.yourLevel}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-skeu-brown mt-4">
                            <Target className="w-3 h-3 inline mr-1" />
                            Focus on improving Python and AWS skills to match market demand
                        </p>
                    </SkeuCard>
                </div>

                {/* Recent Activity */}
                <SkeuCard>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-skeu-dark">Recent Activity</h2>
                        <Link href="/applications">
                            <SkeuButton variant="secondary" size="sm">
                                View All
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </SkeuButton>
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {analyticsData.recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-skeu-cream transition-colors">
                                {getStatusIcon(activity.type)}
                                <div className="flex-1">
                                    <p className="font-medium text-skeu-dark">
                                        {activity.type === 'applied' && 'Applied to'}
                                        {activity.type === 'interview' && 'Interview scheduled at'}
                                        {activity.type === 'response' && 'Received response from'}
                                        {activity.type === 'rejected' && 'Rejected by'}
                                        {' '}{activity.company}
                                    </p>
                                    <p className="text-sm text-skeu-brown">{activity.role}</p>
                                </div>
                                <span className="text-xs text-skeu-brown">{activity.date}</span>
                            </div>
                        ))}
                    </div>
                </SkeuCard>

                {/* Tips Banner */}
                <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 text-white">
                    <h3 className="font-semibold mb-2">💡 Tips to Improve Your Success Rate</h3>
                    <ul className="text-sm space-y-1 text-white/90">
                        <li>• Tailor your resume for each application to increase response rate by 30%</li>
                        <li>• Apply within the first 3 days of job posting for better visibility</li>
                        <li>• Follow up after 1 week if you haven't heard back</li>
                    </ul>
                </div>
            </main>
        </div>
    );
}
