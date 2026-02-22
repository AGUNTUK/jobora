'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Bookmark, Search, Bell, User, Award, Briefcase,
    Menu, X, MapPin, DollarSign, Clock, ExternalLink,
    Trash2, Filter
} from 'lucide-react';
import { SkeuButton, SkeuCard, SkeuBadge } from '@/components/ui/skeuomorphic';
import { useAuthStore, useUIStore, useJobsStore } from '@/store';
import { Job } from '@/types/database';
import { formatSalary, formatDate } from '@/lib/utils';

// Sample saved jobs for demo
const sampleSavedJobs: Job[] = [
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
        description: 'We are looking for an experienced software engineer.',
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
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: '2',
        title: 'Product Manager',
        company: 'StartupXYZ',
        location: 'Dhaka',
        salary_min: 100000,
        salary_max: 180000,
        salary_currency: 'BDT',
        salary_period: 'monthly',
        job_type: 'full-time',
        description: 'Lead product development initiatives.',
        requirements: ['3+ years PM experience', 'Agile methodology'],
        benefits: ['Stock options', 'Remote work'],
        skills_required: ['Product Management', 'Agile', 'Data Analysis'],
        skills_preferred: ['Figma', 'SQL'],
        post_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        source_name: 'LinkedIn',
        source_url: 'https://linkedin.com/jobs/2',
        category: 'Product',
        industry: 'Technology',
        experience_level: 'mid',
        is_remote: false,
        is_hybrid: true,
        is_fraud: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: '3',
        title: 'UI/UX Designer',
        company: 'Creative Agency',
        location: 'Chittagong',
        salary_min: 50000,
        salary_max: 80000,
        salary_currency: 'BDT',
        salary_period: 'monthly',
        job_type: 'full-time',
        description: 'Design beautiful user interfaces.',
        requirements: ['2+ years design experience', 'Figma proficiency'],
        benefits: ['Creative environment', 'Learning budget'],
        skills_required: ['Figma', 'UI Design', 'UX Research'],
        skills_preferred: ['Animation', 'Prototyping'],
        post_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        source_name: 'Prothom Alo',
        source_url: 'https://prothomalo.com/jobs/3',
        category: 'Design',
        industry: 'Creative',
        experience_level: 'mid',
        is_remote: false,
        is_hybrid: false,
        is_fraud: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
];

export default function SavedJobsPage() {
    const router = useRouter();
    const { savedJobs: savedJobIds, toggleSaveJob, jobs } = useJobsStore();
    const { user } = useAuthStore();
    const { isMenuOpen, toggleMenu } = useUIStore();
    const [isLoading, setIsLoading] = useState(true);
    const [filterSource, setFilterSource] = useState<string>('all');
    const [savedJobsList, setSavedJobsList] = useState<Job[]>([]);

    useEffect(() => {
        // Simulate loading saved jobs
        setTimeout(() => {
            setSavedJobsList(sampleSavedJobs);
            setIsLoading(false);
        }, 500);
    }, []);

    const filteredJobs = filterSource === 'all'
        ? savedJobsList
        : savedJobsList.filter(job => job.source_name === filterSource);

    const sources = ['all', ...Array.from(new Set(savedJobsList.map(job => job.source_name)))];

    const handleRemoveJob = (jobId: string) => {
        setSavedJobsList(prev => prev.filter(job => job.id !== jobId));
        toggleSaveJob(jobId);
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
                            <Link href="/saved" className="nav-item-active">
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
                        <h1 className="text-2xl font-display font-bold text-skeu-dark">Saved Jobs</h1>
                        <p className="text-skeu-brown mt-1">{savedJobsList.length} jobs saved</p>
                    </div>
                </div>

                {/* Source Filter */}
                <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                    <Filter className="w-5 h-5 text-skeu-brown flex-shrink-0" />
                    {sources.map((source) => (
                        <button
                            key={source}
                            onClick={() => setFilterSource(source)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filterSource === source
                                ? 'bg-primary-500 text-white shadow-skeu-pressed'
                                : 'bg-white text-skeu-brown border border-skeu-tan/30 hover:border-primary-300'
                                }`}
                        >
                            {source === 'all' ? 'All Sources' : source}
                        </button>
                    ))}
                </div>

                {/* Jobs List */}
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <SkeuCard key={i} className="animate-pulse">
                                <div className="h-6 bg-skeu-cream rounded w-1/3 mb-4"></div>
                                <div className="h-4 bg-skeu-cream rounded w-1/2 mb-2"></div>
                                <div className="h-4 bg-skeu-cream rounded w-1/4"></div>
                            </SkeuCard>
                        ))}
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <SkeuCard className="text-center py-12">
                        <Bookmark className="w-16 h-16 text-skeu-tan mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-skeu-dark mb-2">No saved jobs</h3>
                        <p className="text-skeu-brown mb-4">Start saving jobs to see them here</p>
                        <Link href="/">
                            <SkeuButton>Browse Jobs</SkeuButton>
                        </Link>
                    </SkeuCard>
                ) : (
                    <div className="space-y-4">
                        {filteredJobs.map((job) => (
                            <SkeuCard key={job.id} className="hover:shadow-lg transition-shadow">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <Link href={`/jobs/${job.id}`}>
                                                    <h3 className="text-lg font-semibold text-skeu-dark hover:text-primary-600 transition-colors">
                                                        {job.title}
                                                    </h3>
                                                </Link>
                                                <Link href={`/companies/${encodeURIComponent(job.company)}`}>
                                                    <p className="text-skeu-brown hover:text-primary-600 transition-colors">
                                                        {job.company}
                                                    </p>
                                                </Link>
                                            </div>
                                            <SkeuBadge variant="default">{job.source_name}</SkeuBadge>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-skeu-brown">
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

                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {job.skills_required?.slice(0, 3).map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 bg-skeu-cream rounded text-xs text-skeu-brown"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                            {job.skills_required && job.skills_required.length > 3 && (
                                                <span className="px-2 py-1 bg-skeu-cream rounded text-xs text-skeu-brown">
                                                    +{job.skills_required.length - 3} more
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-xs text-skeu-brown mt-3">
                                            Posted {formatDate(job.post_date)}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Link href={`/jobs/${job.id}`}>
                                            <SkeuButton variant="secondary" size="sm">
                                                View Details
                                            </SkeuButton>
                                        </Link>
                                        <a href={job.source_url} target="_blank" rel="noopener noreferrer">
                                            <SkeuButton variant="secondary" size="sm">
                                                <ExternalLink className="w-4 h-4" />
                                            </SkeuButton>
                                        </a>
                                        <SkeuButton
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => handleRemoveJob(job.id)}
                                            className="text-red-500"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </SkeuButton>
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
