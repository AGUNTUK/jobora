'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Bookmark, Search, MapPin, Clock, Building2, DollarSign,
    Calendar, ExternalLink, Trash2, Filter, X, Menu, Bell, User, Award, Briefcase
} from 'lucide-react';
import { SkeuButton, SkeuCard, SkeuBadge } from '@/components/ui/skeuomorphic';
import { useJobsStore, useAuthStore, useUIStore } from '@/store';
import { Job } from '@/types/database';
import { formatSalary, formatDate } from '@/lib/utils';

// Sample saved jobs for demo
const sampleSavedJobs: (Job & { saved_at: string })[] = [
    {
        id: '1',
        title: 'Senior Software Engineer',
        company: 'Tech Solutions BD',
        location: 'Dhaka',
        salary_min: 80000,
        salary_max: 150000,
        salary_currency: 'BDT',
        salary_period: 'monthly',
        job_type: 'full-time',
        description: 'We are looking for an experienced software engineer to join our growing team.',
        requirements: ['5+ years experience', 'React/Node.js'],
        benefits: ['Health insurance', 'Flexible hours'],
        skills_required: ['JavaScript', 'React', 'Node.js'],
        skills_preferred: ['AWS', 'Docker'],
        post_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        source_name: 'Bdjobs',
        source_url: 'https://bdjobs.com/job/1',
        category: 'Technology',
        industry: 'Software',
        experience_level: 'senior',
        is_remote: true,
        is_hybrid: false,
        is_fraud: false,
        saved_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: '2',
        title: 'Marketing Manager',
        company: 'Creative Agency',
        location: 'Chittagong',
        salary_min: 50000,
        salary_max: 80000,
        salary_currency: 'BDT',
        salary_period: 'monthly',
        job_type: 'full-time',
        description: 'Lead our marketing team to develop innovative strategies.',
        requirements: ['3+ years marketing experience'],
        benefits: ['Performance bonus'],
        skills_required: ['Digital Marketing', 'SEO'],
        skills_preferred: ['Graphic Design'],
        post_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        source_name: 'Prothom Alo Jobs',
        source_url: 'https://jobs.prothomalo.com/job/2',
        category: 'Marketing',
        industry: 'Advertising',
        experience_level: 'mid',
        is_remote: false,
        is_hybrid: true,
        is_fraud: false,
        saved_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
];

export default function SavedJobsPage() {
    const router = useRouter();
    const { savedJobs, setSavedJobs, removeSavedJob } = useJobsStore();
    const { user } = useAuthStore();
    const { isMenuOpen, toggleMenu } = useUIStore();
    const [isLoading, setIsLoading] = useState(true);
    const [filterSource, setFilterSource] = useState<string>('all');

    useEffect(() => {
        // Simulate loading saved jobs
        setTimeout(() => {
            setSavedJobs(sampleSavedJobs);
            setIsLoading(false);
        }, 500);
    }, [setSavedJobs]);

    const filteredJobs = filterSource === 'all'
        ? savedJobs
        : savedJobs.filter(job => job.source_name === filterSource);

    const sources = ['all', ...new Set(savedJobs.map(job => job.source_name))];

    const handleRemoveJob = (jobId: string) => {
        removeSavedJob(jobId);
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
                            <Link href="/saved" className="nav-item active">
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
                            <Link href="/saved" className="nav-item active" onClick={() => toggleMenu()}>
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
                        <h1 className="text-2xl font-display font-bold text-skeu-dark">Saved Jobs</h1>
                        <p className="text-skeu-brown mt-1">{savedJobs.length} jobs saved</p>
                    </div>

                    {/* Filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-skeu-brown" />
                        <select
                            value={filterSource}
                            onChange={(e) => setFilterSource(e.target.value)}
                            className="px-3 py-2 rounded-lg border border-skeu-tan/30 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            {sources.map(source => (
                                <option key={source} value={source}>
                                    {source === 'all' ? 'All Sources' : source}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Jobs List */}
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
                ) : filteredJobs.length === 0 ? (
                    <div className="text-center py-12">
                        <Bookmark className="w-16 h-16 text-skeu-tan mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-skeu-dark mb-2">No Saved Jobs</h3>
                        <p className="text-skeu-brown mb-4">Start saving jobs to view them here</p>
                        <Link href="/">
                            <SkeuButton>Browse Jobs</SkeuButton>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredJobs.map((job) => (
                            <SkeuCard key={job.id} className="hover:shadow-lg transition-shadow">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <Link href={`/jobs/${job.id}`}>
                                            <h3 className="text-lg font-semibold text-skeu-dark hover:text-primary-600 transition-colors">
                                                {job.title}
                                            </h3>
                                        </Link>
                                        <Link href={`/companies/${encodeURIComponent(job.company)}`} className="text-primary-600 hover:underline">
                                            {job.company}
                                        </Link>

                                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-skeu-brown">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {job.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <DollarSign className="w-4 h-4" />
                                                {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {job.job_type}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 mt-3">
                                            <SkeuBadge variant="secondary">{job.source_name}</SkeuBadge>
                                            <span className="text-xs text-skeu-brown">
                                                Saved {formatDate(job.saved_at)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Link href={`/jobs/${job.id}`}>
                                            <SkeuButton variant="secondary" size="sm">
                                                View Details
                                            </SkeuButton>
                                        </Link>
                                        <a href={job.source_url} target="_blank" rel="noopener noreferrer">
                                            <SkeuButton variant="ghost" size="sm">
                                                <ExternalLink className="w-4 h-4" />
                                            </SkeuButton>
                                        </a>
                                        <button
                                            onClick={() => handleRemoveJob(job.id)}
                                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </SkeuCard>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
