'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Briefcase, Search, MapPin, Clock, Building2, DollarSign,
    Calendar, ExternalLink, Filter, X, Menu, Bell, User, Award, Bookmark,
    CheckCircle, XCircle, Clock as ClockIcon, AlertCircle
} from 'lucide-react';
import { SkeuButton, SkeuCard, SkeuBadge } from '@/components/ui/skeuomorphic';
import { useJobsStore, useAuthStore, useUIStore } from '@/store';
import { Job, AppliedJob } from '@/types/database';
import { formatSalary, formatDate } from '@/lib/utils';

// Sample applications for demo
const sampleApplications: (AppliedJob & { job: Job })[] = [
    {
        id: '1',
        user_id: 'user1',
        job_id: '1',
        status: 'applied',
        applied_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Very excited about this opportunity!',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        job: {
            id: '1',
            title: 'Senior Software Engineer',
            company: 'Tech Solutions BD',
            location: 'Dhaka',
            salary_min: 80000,
            salary_max: 150000,
            salary_currency: 'BDT',
            salary_period: 'monthly',
            job_type: 'full-time',
            description: 'We are looking for an experienced software engineer.',
            requirements: ['5+ years experience', 'React/Node.js'],
            benefits: ['Health insurance', 'Flexible hours'],
            skills_required: ['JavaScript', 'React', 'Node.js'],
            skills_preferred: ['AWS', 'Docker'],
            post_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            source_name: 'Bdjobs',
            source_url: 'https://bdjobs.com/job/1',
            category: 'Technology',
            industry: 'Software',
            experience_level: 'senior',
            is_remote: true,
            is_hybrid: false,
            is_fraud: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
    },
    {
        id: '2',
        user_id: 'user1',
        job_id: '2',
        status: 'interviewing',
        applied_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Interview scheduled for next week',
        reminder_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        job: {
            id: '2',
            title: 'Marketing Manager',
            company: 'Creative Agency',
            location: 'Chittagong',
            salary_min: 50000,
            salary_max: 80000,
            salary_currency: 'BDT',
            salary_period: 'monthly',
            job_type: 'full-time',
            description: 'Lead our marketing team.',
            requirements: ['3+ years marketing experience'],
            benefits: ['Performance bonus'],
            skills_required: ['Digital Marketing', 'SEO'],
            skills_preferred: ['Graphic Design'],
            post_date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            source_name: 'Prothom Alo Jobs',
            source_url: 'https://jobs.prothomalo.com/job/2',
            category: 'Marketing',
            industry: 'Advertising',
            experience_level: 'mid',
            is_remote: false,
            is_hybrid: true,
            is_fraud: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
    },
    {
        id: '3',
        user_id: 'user1',
        job_id: '3',
        status: 'saved',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        job: {
            id: '3',
            title: 'Data Analyst',
            company: 'Finance Corp',
            location: 'Dhaka',
            salary_min: 40000,
            salary_max: 60000,
            salary_currency: 'BDT',
            salary_period: 'monthly',
            job_type: 'full-time',
            description: 'Analyze financial data.',
            requirements: ['2+ years experience', 'SQL proficiency'],
            benefits: ['Health insurance'],
            skills_required: ['SQL', 'Excel', 'Python'],
            skills_preferred: ['Power BI'],
            post_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            source_name: 'LinkedIn',
            source_url: 'https://linkedin.com/jobs/3',
            category: 'Data',
            industry: 'Finance',
            experience_level: 'mid',
            is_remote: false,
            is_hybrid: false,
            is_fraud: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
    },
];

const statusConfig = {
    saved: { label: 'Saved', color: 'bg-gray-100 text-gray-700', icon: Bookmark },
    applied: { label: 'Applied', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
    interviewing: { label: 'Interviewing', color: 'bg-yellow-100 text-yellow-700', icon: ClockIcon },
    offered: { label: 'Offered', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: XCircle },
    withdrawn: { label: 'Withdrawn', color: 'bg-gray-100 text-gray-500', icon: AlertCircle },
};

export default function ApplicationsPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { isMenuOpen, toggleMenu } = useUIStore();
    const [applications, setApplications] = useState<(AppliedJob & { job: Job })[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    useEffect(() => {
        // Simulate loading applications
        setTimeout(() => {
            setApplications(sampleApplications);
            setIsLoading(false);
        }, 500);
    }, []);

    const filteredApplications = filterStatus === 'all'
        ? applications
        : applications.filter(app => app.status === filterStatus);

    const statusCounts = applications.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

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
                            <Link href="/applications" className="nav-item active">
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
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
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
                            <Link href="/applications" className="nav-item active" onClick={() => toggleMenu()}>
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
                <div className="mb-6">
                    <h1 className="text-2xl font-display font-bold text-skeu-dark">My Applications</h1>
                    <p className="text-skeu-brown mt-1">Track your job applications</p>
                </div>

                {/* Status Tabs */}
                <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
                    <button
                        onClick={() => setFilterStatus('all')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filterStatus === 'all'
                            ? 'bg-primary-500 text-white'
                            : 'bg-white text-skeu-brown hover:bg-skeu-cream'
                            }`}
                    >
                        All ({applications.length})
                    </button>
                    {Object.entries(statusConfig).map(([status, config]) => {
                        const count = statusCounts[status] || 0;
                        if (count === 0) return null;
                        return (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filterStatus === status
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-white text-skeu-brown hover:bg-skeu-cream'
                                    }`}
                            >
                                {config.label} ({count})
                            </button>
                        );
                    })}
                </div>

                {/* Applications List */}
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-white rounded-2xl p-6 shadow-skeu-raised">
                                    <div className="h-6 bg-skeu-cream rounded w-1/3 mb-4"></div>
                                    <div className="h-4 bg-skeu-cream rounded w-1/2 mb-2"></div>
                                    <div className="h-4 bg-skeu-cream rounded w-1/4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredApplications.length === 0 ? (
                    <div className="text-center py-12">
                        <Briefcase className="w-16 h-16 text-skeu-tan mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-skeu-dark mb-2">No Applications Yet</h3>
                        <p className="text-skeu-brown mb-4">Start applying to jobs to track them here</p>
                        <Link href="/">
                            <SkeuButton>Browse Jobs</SkeuButton>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredApplications.map((application) => {
                            const status = statusConfig[application.status];
                            const StatusIcon = status.icon;

                            return (
                                <SkeuCard key={application.id} className="hover:shadow-lg transition-shadow">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${status.color}`}>
                                                    <StatusIcon className="w-3 h-3" />
                                                    {status.label}
                                                </span>
                                            </div>

                                            <Link href={`/jobs/${application.job.id}`}>
                                                <h3 className="text-lg font-semibold text-skeu-dark hover:text-primary-600 transition-colors">
                                                    {application.job.title}
                                                </h3>
                                            </Link>
                                            <Link href={`/companies/${encodeURIComponent(application.job.company)}`} className="text-primary-600 hover:underline">
                                                {application.job.company}
                                            </Link>

                                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-skeu-brown">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    {application.job.location}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <DollarSign className="w-4 h-4" />
                                                    {formatSalary(application.job.salary_min, application.job.salary_max, application.job.salary_currency)}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 mt-3 text-xs text-skeu-brown">
                                                {application.applied_at && (
                                                    <span>Applied {formatDate(application.applied_at)}</span>
                                                )}
                                                {application.reminder_date && (
                                                    <span className="flex items-center gap-1 text-yellow-600">
                                                        <Calendar className="w-3 h-3" />
                                                        Reminder: {formatDate(application.reminder_date)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Link href={`/jobs/${application.job.id}`}>
                                                <SkeuButton variant="secondary" size="sm">
                                                    View Details
                                                </SkeuButton>
                                            </Link>
                                            <a href={application.job.source_url} target="_blank" rel="noopener noreferrer">
                                                <SkeuButton variant="secondary" size="sm">
                                                    <ExternalLink className="w-4 h-4" />
                                                </SkeuButton>
                                            </a>
                                        </div>
                                    </div>

                                    {application.notes && (
                                        <div className="mt-4 pt-4 border-t border-skeu-tan/20">
                                            <p className="text-sm text-skeu-brown">
                                                <span className="font-medium">Notes:</span> {application.notes}
                                            </p>
                                        </div>
                                    )}
                                </SkeuCard>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
