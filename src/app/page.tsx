'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Search, MapPin, Briefcase, Clock, Star, ChevronRight,
    Bell, User, TrendingUp, Award, Zap, Menu, X, Filter,
    Building2, DollarSign, Calendar, ExternalLink, Bookmark
} from 'lucide-react';
import { SkeuButton, SkeuCard, SkeuInput, SkeuBadge } from '@/components/ui/skeuomorphic';
import { useJobsStore, useAuthStore, useUIStore } from '@/store';
import { Job } from '@/types/database';
import { formatSalary, formatDate, formatDeadline } from '@/lib/utils';

// Sample job data for demo
const sampleJobs: Job[] = [
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
        description: 'We are looking for an experienced software engineer to join our growing team. You will be responsible for designing and implementing scalable software solutions.',
        requirements: ['5+ years experience', 'React/Node.js', 'Database design', 'Team leadership'],
        benefits: ['Health insurance', 'Flexible hours', 'Remote work'],
        skills_required: ['JavaScript', 'React', 'Node.js', 'PostgreSQL'],
        skills_preferred: ['AWS', 'Docker', 'Kubernetes'],
        post_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        source_name: 'Bdjobs',
        source_url: 'https://bdjobs.com/job/1',
        category: 'Technology',
        industry: 'Software',
        experience_level: 'senior',
        experience_years_min: 5,
        experience_years_max: 10,
        is_remote: true,
        is_hybrid: false,
        is_fraud: false,
        relevance_score: 95,
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
        description: 'Lead our marketing team to develop and execute innovative marketing strategies for our clients.',
        requirements: ['3+ years marketing experience', 'Team management', 'Digital marketing'],
        benefits: ['Performance bonus', 'Training'],
        skills_required: ['Digital Marketing', 'SEO', 'Content Strategy'],
        skills_preferred: ['Graphic Design', 'Video Editing'],
        post_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        source_name: 'Prothom Alo Jobs',
        source_url: 'https://jobs.prothomalo.com/job/2',
        category: 'Marketing',
        industry: 'Advertising',
        experience_level: 'mid',
        experience_years_min: 3,
        experience_years_max: 5,
        is_remote: false,
        is_hybrid: true,
        is_fraud: false,
        relevance_score: 88,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: '3',
        title: 'Data Analyst',
        company: 'Finance Corp',
        location: 'Dhaka',
        salary_min: 40000,
        salary_max: 60000,
        salary_currency: 'BDT',
        salary_period: 'monthly',
        job_type: 'full-time',
        description: 'Analyze financial data and create reports to support business decisions.',
        requirements: ['2+ years experience', 'SQL proficiency', 'Excel advanced'],
        benefits: ['Health insurance', 'Annual bonus'],
        skills_required: ['SQL', 'Excel', 'Python', 'Data Visualization'],
        skills_preferred: ['Power BI', 'Tableau'],
        post_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        source_name: 'LinkedIn',
        source_url: 'https://linkedin.com/jobs/3',
        category: 'Data',
        industry: 'Finance',
        experience_level: 'mid',
        experience_years_min: 2,
        experience_years_max: 4,
        is_remote: false,
        is_hybrid: false,
        is_fraud: false,
        relevance_score: 82,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: '4',
        title: 'UI/UX Designer',
        company: 'Startup Hub',
        location: 'Remote',
        salary_min: 60000,
        salary_max: 100000,
        salary_currency: 'BDT',
        salary_period: 'monthly',
        job_type: 'full-time',
        description: 'Design beautiful and intuitive user interfaces for web and mobile applications.',
        requirements: ['3+ years design experience', 'Figma expertise', 'Portfolio required'],
        benefits: ['Remote work', 'Flexible hours', 'Learning budget'],
        skills_required: ['Figma', 'UI Design', 'UX Research', 'Prototyping'],
        skills_preferred: ['Motion Design', 'HTML/CSS'],
        post_date: new Date().toISOString(),
        source_name: 'Chakri.com',
        source_url: 'https://chakri.com/job/4',
        category: 'Design',
        industry: 'Technology',
        experience_level: 'mid',
        experience_years_min: 3,
        experience_years_max: 6,
        is_remote: true,
        is_hybrid: false,
        is_fraud: false,
        relevance_score: 90,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
];

export default function HomePage() {
    const router = useRouter();
    const { jobs, setJobs, savedJobs, toggleSaveJob } = useJobsStore();
    const { isAuthenticated } = useAuthStore();
    const { activeTab, setActiveTab, isMenuOpen, toggleMenu } = useUIStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedJobType, setSelectedJobType] = useState('');

    useEffect(() => {
        // Load sample jobs
        setJobs(sampleJobs);
    }, [setJobs]);

    const handleSearch = async () => {
        setIsLoading(true);
        // Simulate search
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsLoading(false);
    };

    const locations = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Remote'];
    const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];

    return (
        <div className="min-h-screen pb-20 md:pb-0">
            {/* Header */}
            <header className="header sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-skeu-raised">
                                <Briefcase className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-display font-bold text-skeu-dark">Jobora</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-1">
                            <Link href="/" className="nav-item active">
                                <Search className="w-4 h-4" />
                                Find Jobs
                            </Link>
                            <Link href="/saved" className="nav-item">
                                <Bookmark className="w-4 h-4" />
                                Saved
                            </Link>
                            <Link href="/applications" className="nav-item">
                                <Briefcase className="w-4 h-4" />
                                Applications
                            </Link>
                            <Link href="/gamification" className="nav-item">
                                <Award className="w-4 h-4" />
                                Rewards
                            </Link>
                        </nav>

                        {/* Right Actions */}
                        <div className="flex items-center gap-2">
                            <button className="relative p-2 rounded-lg hover:bg-skeu-cream transition-colors">
                                <Bell className="w-5 h-5 text-skeu-brown" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                            <Link href="/profile" className="hidden md:flex">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-skeu-tan to-skeu-brown flex items-center justify-center text-white font-semibold shadow-skeu-raised">
                                    U
                                </div>
                            </Link>
                            <button
                                className="md:hidden p-2 rounded-lg hover:bg-skeu-cream transition-colors"
                                onClick={toggleMenu}
                            >
                                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-skeu-tan bg-skeu-light animate-fade-in">
                        <nav className="flex flex-col p-4 gap-2">
                            <Link href="/" className="nav-item active" onClick={() => toggleMenu()}>
                                <Search className="w-4 h-4" />
                                Find Jobs
                            </Link>
                            <Link href="/saved" className="nav-item" onClick={() => toggleMenu()}>
                                <Bookmark className="w-4 h-4" />
                                Saved Jobs
                            </Link>
                            <Link href="/applications" className="nav-item" onClick={() => toggleMenu()}>
                                <Briefcase className="w-4 h-4" />
                                Applications
                            </Link>
                            <Link href="/gamification" className="nav-item" onClick={() => toggleMenu()}>
                                <Award className="w-4 h-4" />
                                Rewards
                            </Link>
                            <Link href="/profile" className="nav-item" onClick={() => toggleMenu()}>
                                <User className="w-4 h-4" />
                                Profile
                            </Link>
                        </nav>
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <section className="relative py-8 md:py-12 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl md:text-5xl font-display font-bold text-skeu-dark mb-4">
                        Find Your Dream Job in Bangladesh
                    </h1>
                    <p className="text-lg text-skeu-brown mb-8">
                        AI-powered job aggregator with smart recommendations and fraud detection
                    </p>

                    {/* Search Box */}
                    <SkeuCard variant="raised" className="p-4 md:p-6">
                        <div className="flex flex-col md:flex-row gap-3">
                            <div className="flex-1">
                                <SkeuInput
                                    placeholder="Job title, company, or keywords"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    icon={<Search className="w-5 h-5" />}
                                />
                            </div>
                            <div className="w-full md:w-48">
                                <select
                                    className="skeu-input w-full"
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                >
                                    <option value="">All Locations</option>
                                    {locations.map(loc => (
                                        <option key={loc} value={loc}>{loc}</option>
                                    ))}
                                </select>
                            </div>
                            <SkeuButton variant="primary" size="lg" onClick={handleSearch}>
                                <Search className="w-5 h-5 mr-2" />
                                Search
                            </SkeuButton>
                        </div>

                        {/* Quick Filters */}
                        <div className="flex flex-wrap gap-2 mt-4">
                            {jobTypes.map(type => (
                                <button
                                    key={type}
                                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${selectedJobType === type
                                        ? 'bg-primary-500 text-white shadow-skeu-badge'
                                        : 'bg-skeu-cream text-skeu-brown hover:bg-skeu-tan'
                                        }`}
                                    onClick={() => setSelectedJobType(selectedJobType === type ? '' : type)}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </SkeuCard>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-6 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Active Jobs', value: '12,500+', icon: Briefcase, color: 'from-blue-400 to-blue-600' },
                            { label: 'Companies', value: '2,300+', icon: Building2, color: 'from-green-400 to-green-600' },
                            { label: 'Job Seekers', value: '150K+', icon: User, color: 'from-purple-400 to-purple-600' },
                            { label: 'Success Rate', value: '89%', icon: TrendingUp, color: 'from-orange-400 to-orange-600' },
                        ].map((stat, i) => (
                            <SkeuCard key={i} variant="raised" className="text-center p-4">
                                <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2 shadow-skeu-raised`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-2xl font-bold text-skeu-dark">{stat.value}</div>
                                <div className="text-sm text-skeu-brown">{stat.label}</div>
                            </SkeuCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* Job Feed */}
            <section className="py-6 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-display font-bold text-skeu-dark">
                            AI-Ranked Jobs for You
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-skeu-brown">Sort by:</span>
                            <select className="skeu-input py-1 px-3 text-sm">
                                <option value="relevance">Relevance</option>
                                <option value="date">Most Recent</option>
                                <option value="salary">Salary</option>
                            </select>
                        </div>
                    </div>

                    {/* Job Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {jobs.map((job) => (
                            <JobCard
                                key={job.id}
                                job={job}
                                isSaved={savedJobs.includes(job.id)}
                                onToggleSave={() => toggleSaveJob(job.id)}
                            />
                        ))}
                    </div>

                    {/* Load More */}
                    <div className="text-center mt-8">
                        <SkeuButton variant="secondary" size="lg">
                            Load More Jobs
                            <ChevronRight className="w-5 h-5 ml-2" />
                        </SkeuButton>
                    </div>
                </div>
            </section>

            {/* Gamification Preview */}
            <section className="py-8 px-4 bg-gradient-to-b from-skeu-cream to-skeu-light">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-display font-bold text-skeu-dark">
                            Earn Rewards While Job Hunting
                        </h2>
                        <Link href="/gamification" className="text-primary-600 font-medium hover:underline">
                            View All →
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        <SkeuCard variant="raised" className="p-6 text-center">
                            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center mb-4 shadow-skeu-raised">
                                <Zap className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Daily Streaks</h3>
                            <p className="text-skeu-brown text-sm">Check in daily to earn bonus points and unlock special badges</p>
                        </SkeuCard>

                        <SkeuCard variant="raised" className="p-6 text-center">
                            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-4 shadow-skeu-raised">
                                <Award className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Achievements</h3>
                            <p className="text-skeu-brown text-sm">Complete challenges and earn badges to showcase your dedication</p>
                        </SkeuCard>

                        <SkeuCard variant="raised" className="p-6 text-center">
                            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-4 shadow-skeu-raised">
                                <Star className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Referral Bonus</h3>
                            <p className="text-skeu-brown text-sm">Invite friends and earn points when they sign up and apply</p>
                        </SkeuCard>
                    </div>
                </div>
            </section>

            {/* Mobile Bottom Navigation */}
            <nav className="mobile-nav md:hidden safe-bottom">
                <div className="flex justify-around">
                    {[
                        { id: 'home', icon: Search, label: 'Jobs', href: '/' },
                        { id: 'saved', icon: Bookmark, label: 'Saved', href: '/saved' },
                        { id: 'applications', icon: Briefcase, label: 'Applied', href: '/applications' },
                        { id: 'rewards', icon: Award, label: 'Rewards', href: '/gamification' },
                        { id: 'profile', icon: User, label: 'Profile', href: '/profile' },
                    ].map((item) => (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={`mobile-nav-item ${activeTab === item.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(item.id)}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    ))}
                </div>
            </nav>
        </div>
    );
}

// Job Card Component
function JobCard({ job, isSaved, onToggleSave }: { job: Job; isSaved: boolean; onToggleSave: () => void }) {
    const router = useRouter();

    return (
        <SkeuCard
            variant="raised"
            className="hover:shadow-xl transition-all duration-200 cursor-pointer group"
            onClick={() => router.push(`/jobs/${job.id}`)}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="font-bold text-lg text-skeu-dark group-hover:text-primary-600 transition-colors line-clamp-1">
                        {job.title}
                    </h3>
                    <p className="text-skeu-brown font-medium">{job.company}</p>
                </div>
                <button
                    className={`p-2 rounded-lg transition-all ${isSaved
                        ? 'bg-primary-100 text-primary-600'
                        : 'hover:bg-skeu-cream text-skeu-brown'
                        }`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave();
                    }}
                >
                    <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                </button>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-2 mb-3">
                <span className="inline-flex items-center gap-1 text-sm text-skeu-brown">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                </span>
                <span className="inline-flex items-center gap-1 text-sm text-skeu-brown">
                    <Clock className="w-4 h-4" />
                    {formatDate(job.post_date)}
                </span>
                {job.is_remote && (
                    <SkeuBadge variant="default" size="sm">Remote</SkeuBadge>
                )}
            </div>

            {/* Salary */}
            <div className="mb-3">
                <span className="text-lg font-bold text-green-600">
                    {formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.salary_period)}
                </span>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1 mb-3">
                {job.skills_required.slice(0, 3).map((skill, i) => (
                    <span
                        key={i}
                        className="px-2 py-0.5 bg-skeu-cream rounded text-xs font-medium text-skeu-brown"
                    >
                        {skill}
                    </span>
                ))}
                {job.skills_required.length > 3 && (
                    <span className="px-2 py-0.5 text-xs text-skeu-brown">
                        +{job.skills_required.length - 3} more
                    </span>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-skeu-tan">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-skeu-brown">via</span>
                    <span className="text-xs font-medium text-skeu-dark">{job.source_name}</span>
                </div>
                <div className="flex items-center gap-2">
                    {job.relevance_score && job.relevance_score >= 80 && (
                        <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                            <Zap className="w-3 h-3" />
                            {job.relevance_score}% match
                        </span>
                    )}
                    <SkeuButton
                        variant="primary"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            window.open(job.source_url, '_blank');
                        }}
                    >
                        Apply
                        <ExternalLink className="w-3 h-3 ml-1" />
                    </SkeuButton>
                </div>
            </div>
        </SkeuCard>
    );
}
