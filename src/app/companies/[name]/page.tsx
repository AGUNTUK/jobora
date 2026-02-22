'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
    Building2, MapPin, Globe, Mail, Phone, Users, Calendar,
    ArrowLeft, ExternalLink, Briefcase, DollarSign, Clock, Star,
    Search, Bell, User, Award, Bookmark, Menu, X
} from 'lucide-react';
import { SkeuButton, SkeuCard, SkeuBadge } from '@/components/ui/skeuomorphic';
import { useAuthStore, useUIStore } from '@/store';
import { Job } from '@/types/database';
import { formatSalary, formatDate } from '@/lib/utils';

// Sample company data
const sampleCompany = {
    name: 'Tech Solutions BD',
    logo: '',
    coverImage: '',
    industry: 'Software & Technology',
    founded: '2015',
    size: '50-200 employees',
    headquarters: 'Dhaka, Bangladesh',
    website: 'https://techsolutionsbd.com',
    email: 'careers@techsolutionsbd.com',
    phone: '+880 1234-567890',
    description: `Tech Solutions BD is a leading software development company in Bangladesh, specializing in web and mobile application development. We work with clients across the globe to deliver innovative digital solutions.

Our team of talented engineers and designers are passionate about creating products that make a difference. We believe in continuous learning, collaboration, and delivering excellence in everything we do.`,
    benefits: [
        'Competitive salary',
        'Health insurance',
        'Flexible working hours',
        'Remote work options',
        'Professional development',
        'Annual bonus',
        'Paid time off',
        'Team events',
    ],
    stats: {
        totalJobs: 12,
        avgSalary: '৳80,000 - ৳150,000',
        responseRate: '85%',
        avgResponseTime: '3 days',
    },
};

// Sample jobs from this company
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
        id: '4',
        title: 'Junior Frontend Developer',
        company: 'Tech Solutions BD',
        location: 'Dhaka',
        salary_min: 40000,
        salary_max: 60000,
        salary_currency: 'BDT',
        salary_period: 'monthly',
        job_type: 'full-time',
        description: 'Join our frontend team to build amazing user interfaces.',
        requirements: ['1+ years experience', 'HTML/CSS/JavaScript'],
        benefits: ['Training provided', 'Health insurance'],
        skills_required: ['HTML', 'CSS', 'JavaScript'],
        skills_preferred: ['React', 'Vue.js'],
        post_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        source_name: 'LinkedIn',
        source_url: 'https://linkedin.com/jobs/4',
        category: 'Technology',
        industry: 'Software',
        experience_level: 'entry',
        is_remote: false,
        is_hybrid: true,
        is_fraud: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
];

export default function CompanyProfilePage() {
    const params = useParams();
    const router = useRouter();
    const companyName = decodeURIComponent(params.name as string);

    const { user } = useAuthStore();
    const { isMenuOpen, toggleMenu } = useUIStore();
    const [company, setCompany] = useState(sampleCompany);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading company data
        setTimeout(() => {
            setCompany({ ...sampleCompany, name: companyName });
            setJobs(sampleJobs);
            setIsLoading(false);
        }, 500);
    }, [companyName]);

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
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-skeu-brown hover:text-skeu-dark mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                </button>

                {isLoading ? (
                    <div className="animate-pulse space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-skeu-raised">
                            <div className="h-8 bg-skeu-cream rounded w-1/3 mb-4"></div>
                            <div className="h-4 bg-skeu-cream rounded w-1/2 mb-2"></div>
                            <div className="h-4 bg-skeu-cream rounded w-1/4"></div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Company Header */}
                        <SkeuCard className="overflow-hidden">
                            {/* Cover Image */}
                            <div className="h-32 bg-gradient-to-r from-primary-500 to-primary-700"></div>

                            <div className="relative px-6 pb-6">
                                {/* Logo */}
                                <div className="absolute -top-10 left-6">
                                    <div className="w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center border-4 border-white">
                                        {company.logo ? (
                                            <img src={company.logo} alt={company.name} className="w-full h-full object-cover rounded-xl" />
                                        ) : (
                                            <Building2 className="w-10 h-10 text-primary-500" />
                                        )}
                                    </div>
                                </div>

                                <div className="pt-14">
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                        <div>
                                            <h1 className="text-2xl font-display font-bold text-skeu-dark">{company.name}</h1>
                                            <p className="text-skeu-brown mt-1">{company.industry}</p>

                                            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-skeu-brown">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    {company.headquarters}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    {company.size}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    Founded {company.founded}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {company.website && (
                                                <a href={company.website} target="_blank" rel="noopener noreferrer">
                                                    <SkeuButton variant="secondary" size="sm">
                                                        <Globe className="w-4 h-4 mr-1" />
                                                        Website
                                                    </SkeuButton>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SkeuCard>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <SkeuCard className="text-center">
                                <Briefcase className="w-6 h-6 text-primary-500 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-skeu-dark">{company.stats.totalJobs}</p>
                                <p className="text-sm text-skeu-brown">Open Positions</p>
                            </SkeuCard>
                            <SkeuCard className="text-center">
                                <DollarSign className="w-6 h-6 text-green-500 mx-auto mb-2" />
                                <p className="text-lg font-bold text-skeu-dark">{company.stats.avgSalary}</p>
                                <p className="text-sm text-skeu-brown">Avg. Salary</p>
                            </SkeuCard>
                            <SkeuCard className="text-center">
                                <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-skeu-dark">{company.stats.responseRate}</p>
                                <p className="text-sm text-skeu-brown">Response Rate</p>
                            </SkeuCard>
                            <SkeuCard className="text-center">
                                <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-skeu-dark">{company.stats.avgResponseTime}</p>
                                <p className="text-sm text-skeu-brown">Avg. Response</p>
                            </SkeuCard>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {/* About & Contact */}
                            <div className="md:col-span-2 space-y-6">
                                {/* About */}
                                <SkeuCard>
                                    <h2 className="text-lg font-semibold text-skeu-dark mb-4">About</h2>
                                    <p className="text-skeu-brown whitespace-pre-line">{company.description}</p>
                                </SkeuCard>

                                {/* Benefits */}
                                <SkeuCard>
                                    <h2 className="text-lg font-semibold text-skeu-dark mb-4">Benefits & Perks</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {company.benefits.map((benefit, index) => (
                                            <SkeuBadge key={index} variant="default">{benefit}</SkeuBadge>
                                        ))}
                                    </div>
                                </SkeuCard>

                                {/* Open Positions */}
                                <SkeuCard>
                                    <h2 className="text-lg font-semibold text-skeu-dark mb-4">
                                        Open Positions ({jobs.length})
                                    </h2>
                                    <div className="space-y-4">
                                        {jobs.map((job) => (
                                            <Link key={job.id} href={`/jobs/${job.id}`}>
                                                <div className="p-4 rounded-xl border border-skeu-tan/20 hover:border-primary-300 hover:bg-primary-50/50 transition-colors">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h3 className="font-semibold text-skeu-dark">{job.title}</h3>
                                                            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-skeu-brown">
                                                                <span className="flex items-center gap-1">
                                                                    <MapPin className="w-3 h-3" />
                                                                    {job.location}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <DollarSign className="w-3 h-3" />
                                                                    {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <Clock className="w-3 h-3" />
                                                                    {job.job_type}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <SkeuBadge>{job.experience_level}</SkeuBadge>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </SkeuCard>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-6">
                                <SkeuCard>
                                    <h2 className="text-lg font-semibold text-skeu-dark mb-4">Contact</h2>
                                    <div className="space-y-4">
                                        {company.website && (
                                            <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-skeu-brown hover:text-primary-600 transition-colors">
                                                <Globe className="w-5 h-5" />
                                                <span>{company.website.replace('https://', '')}</span>
                                            </a>
                                        )}
                                        {company.email && (
                                            <a href={`mailto:${company.email}`} className="flex items-center gap-3 text-skeu-brown hover:text-primary-600 transition-colors">
                                                <Mail className="w-5 h-5" />
                                                <span>{company.email}</span>
                                            </a>
                                        )}
                                        {company.phone && (
                                            <a href={`tel:${company.phone}`} className="flex items-center gap-3 text-skeu-brown hover:text-primary-600 transition-colors">
                                                <Phone className="w-5 h-5" />
                                                <span>{company.phone}</span>
                                            </a>
                                        )}
                                    </div>
                                </SkeuCard>

                                {/* Similar Companies */}
                                <SkeuCard>
                                    <h2 className="text-lg font-semibold text-skeu-dark mb-4">Similar Companies</h2>
                                    <div className="space-y-3">
                                        {['Creative Agency', 'Finance Corp', 'Startup Hub'].map((name) => (
                                            <Link key={name} href={`/companies/${encodeURIComponent(name)}`}>
                                                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-skeu-cream transition-colors">
                                                    <div className="w-10 h-10 rounded-lg bg-skeu-cream flex items-center justify-center">
                                                        <Building2 className="w-5 h-5 text-skeu-brown" />
                                                    </div>
                                                    <span className="text-skeu-dark">{name}</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </SkeuCard>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
