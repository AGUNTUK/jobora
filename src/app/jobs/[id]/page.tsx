'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, MapPin, Clock, Building2, Money, Calendar,
    ExternalLink, Bookmark, Share2, Flag, CheckCircle, AlertTriangle,
    Briefcase, Users, Star, Zap, ChevronRight, Globe, Mail, Phone
} from 'lucide-react';
import { SkeuButton, SkeuCard, SkeuBadge, SkeuProgress } from '@/components/ui/skeuomorphic';
import { Job } from '@/types/database';
import { formatSalary, formatDate, formatDeadline } from '@/lib/utils';

// Sample job data for demo
const sampleJob: Job = {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'Tech Solutions BD',
    location: 'Dhaka, Bangladesh',
    salary_min: 80000,
    salary_max: 150000,
    salary_currency: 'BDT',
    salary_period: 'monthly',
    job_type: 'full-time',
    description: `We are looking for an experienced Senior Software Engineer to join our growing engineering team. You will be responsible for designing, developing, and maintaining scalable software solutions that power our core products.

As a Senior Software Engineer, you will work closely with product managers, designers, and other engineers to deliver high-quality software. You will also mentor junior team members and contribute to our technical strategy.

Key Responsibilities:
• Design and implement scalable backend services and APIs
• Write clean, maintainable, and efficient code
• Participate in code reviews and provide constructive feedback
• Collaborate with cross-functional teams to define and ship new features
• Identify and resolve performance bottlenecks
• Mentor junior developers and contribute to team growth`,
    requirements: [
        '5+ years of professional software development experience',
        'Strong proficiency in JavaScript/TypeScript and Node.js',
        'Experience with React or similar frontend frameworks',
        'Solid understanding of database design (PostgreSQL, MongoDB)',
        'Experience with cloud services (AWS, GCP, or Azure)',
        'Strong problem-solving and communication skills',
        'Experience leading technical projects or mentoring team members',
    ],
    benefits: [
        'Competitive salary with annual performance bonus',
        'Comprehensive health insurance for you and dependents',
        'Flexible working hours and remote work options',
        'Professional development budget',
        'Modern office in the heart of Dhaka',
        'Regular team events and outings',
        '25 days of paid leave annually',
    ],
    skills_required: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Git'],
    skills_preferred: ['AWS', 'Docker', 'Kubernetes', 'GraphQL', 'Redis'],
    post_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    source_name: 'Bdjobs',
    source_url: 'https://bdjobs.com/job/senior-software-engineer-1',
    source_logo: '/sources/bdjobs.png',
    category: 'Technology',
    industry: 'Software Development',
    experience_level: 'senior',
    experience_years_min: 5,
    experience_years_max: 10,
    is_remote: true,
    is_hybrid: true,
    is_fraud: false,
    relevance_score: 95,
    fraud_score: 5,
    summary: '• Senior role requiring 5+ years experience\n• Full-stack development with React & Node.js\n• Remote-friendly with competitive salary\n• Great benefits including health insurance',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
};

export default function JobDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [job, setJob] = useState<Job | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [showApplyModal, setShowApplyModal] = useState(false);

    useEffect(() => {
        // Simulate loading job data
        const loadJob = async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
            setJob(sampleJob);
            setIsLoading(false);
        };
        loadJob();
    }, [params.id]);

    if (isLoading) {
        return (
            <div className="min-h-screen pb-20 md:pb-8">
                <div className="header sticky top-0 z-40">
                    <div className="max-w-7xl mx-auto px-4 py-3">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 skeleton rounded-lg"></div>
                            <div className="flex-1">
                                <div className="h-5 w-48 skeleton rounded mb-1"></div>
                                <div className="h-4 w-32 skeleton rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="space-y-4">
                        <div className="h-40 skeleton rounded-xl"></div>
                        <div className="h-60 skeleton rounded-xl"></div>
                        <div className="h-40 skeleton rounded-xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-skeu-dark mb-4">Job Not Found</h1>
                    <SkeuButton variant="primary" onClick={() => router.push('/')}>
                        Go Back Home
                    </SkeuButton>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20 md:pb-8">
            {/* Header */}
            <header className="header sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                className="p-2 rounded-lg hover:bg-skeu-cream transition-colors"
                                onClick={() => router.back()}
                            >
                                <ArrowLeft className="w-5 h-5 text-skeu-brown" />
                            </button>
                            <div>
                                <h1 className="font-bold text-skeu-dark line-clamp-1">{job.title}</h1>
                                <p className="text-sm text-skeu-brown">{job.company}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                className={`p-2 rounded-lg transition-colors ${isSaved ? 'bg-primary-100 text-primary-600' : 'hover:bg-skeu-cream text-skeu-brown'
                                    }`}
                                onClick={() => setIsSaved(!isSaved)}
                            >
                                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-skeu-cream text-skeu-brown">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-6">
                {/* Job Header Card */}
                <SkeuCard variant="raised" className="mb-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Company Logo */}
                        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-skeu-tan to-skeu-brown flex items-center justify-center text-white text-2xl font-bold shadow-skeu-raised">
                            {job.company.charAt(0)}
                        </div>

                        {/* Job Info */}
                        <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h1 className="text-2xl font-display font-bold text-skeu-dark">{job.title}</h1>
                                    <Link href={`/companies/${job.company}`} className="text-primary-600 hover:underline font-medium">
                                        {job.company}
                                    </Link>
                                </div>
                                {job.relevance_score && job.relevance_score >= 80 && (
                                    <div className="flex items-center gap-1 px-3 py-1 bg-green-100 rounded-full">
                                        <Zap className="w-4 h-4 text-green-600" />
                                        <span className="text-sm font-bold text-green-600">{job.relevance_score}% Match</span>
                                    </div>
                                )}
                            </div>

                            {/* Meta Info */}
                            <div className="flex flex-wrap gap-4 mt-4">
                                <div className="flex items-center gap-2 text-skeu-brown">
                                    <MapPin className="w-4 h-4" />
                                    <span>{job.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-skeu-brown">
                                    <Briefcase className="w-4 h-4" />
                                    <span className="capitalize">{job.job_type.replace('-', ' ')}</span>
                                </div>
                                <div className="flex items-center gap-2 text-skeu-brown">
                                    <Clock className="w-4 h-4" />
                                    <span>{formatDate(job.post_date)}</span>
                                </div>
                                {job.deadline && (
                                    <div className="flex items-center gap-2 text-orange-600">
                                        <Calendar className="w-4 h-4" />
                                        <span>{formatDeadline(job.deadline)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Salary */}
                            <div className="mt-4">
                                <span className="text-2xl font-bold text-green-600">
                                    {formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.salary_period)}
                                </span>
                            </div>

                            {/* Remote/Hybrid Tags */}
                            <div className="flex gap-2 mt-4">
                                {job.is_remote && (
                                    <SkeuBadge variant="default" size="sm">Remote</SkeuBadge>
                                )}
                                {job.is_hybrid && (
                                    <SkeuBadge variant="default" size="sm">Hybrid</SkeuBadge>
                                )}
                                <SkeuBadge variant="default" size="sm" className="capitalize">
                                    {job.experience_level} Level
                                </SkeuBadge>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-skeu-tan">
                        <SkeuButton
                            variant="primary"
                            size="lg"
                            className="flex-1"
                            onClick={() => setShowApplyModal(true)}
                        >
                            Apply Now
                            <ExternalLink className="w-5 h-5 ml-2" />
                        </SkeuButton>
                        <SkeuButton
                            variant="secondary"
                            size="lg"
                            onClick={() => setIsSaved(!isSaved)}
                        >
                            {isSaved ? 'Saved' : 'Save Job'}
                            <Bookmark className={`w-5 h-5 ml-2 ${isSaved ? 'fill-current' : ''}`} />
                        </SkeuButton>
                    </div>
                </SkeuCard>

                {/* AI Summary */}
                {job.summary && (
                    <SkeuCard variant="raised" className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                                <Zap className="w-4 h-4 text-white" />
                            </div>
                            <h2 className="font-bold text-lg text-skeu-dark">AI Summary</h2>
                        </div>
                        <div className="text-skeu-dark whitespace-pre-line">{job.summary}</div>
                    </SkeuCard>
                )}

                {/* Fraud Detection */}
                {job.fraud_score !== undefined && job.fraud_score > 20 && (
                    <SkeuCard variant="raised" className="mb-6 border-2 border-orange-300 bg-orange-50">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-bold text-orange-800">Security Notice</h3>
                                <p className="text-sm text-orange-700 mt-1">
                                    This job posting has been flagged for review. Please verify the company details before applying.
                                </p>
                            </div>
                        </div>
                    </SkeuCard>
                )}

                {/* Job Description */}
                <SkeuCard variant="raised" className="mb-6">
                    <h2 className="font-bold text-lg text-skeu-dark mb-4">Job Description</h2>
                    <div className="text-skeu-dark whitespace-pre-line leading-relaxed">
                        {job.description}
                    </div>
                </SkeuCard>

                {/* Requirements */}
                <SkeuCard variant="raised" className="mb-6">
                    <h2 className="font-bold text-lg text-skeu-dark mb-4">Requirements</h2>
                    <ul className="space-y-3">
                        {job.requirements.map((req, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className="text-skeu-dark">{req}</span>
                            </li>
                        ))}
                    </ul>
                </SkeuCard>

                {/* Skills */}
                <SkeuCard variant="raised" className="mb-6">
                    <h2 className="font-bold text-lg text-skeu-dark mb-4">Required Skills</h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills_required.map((skill, i) => (
                            <span
                                key={i}
                                className="px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg font-medium text-sm"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>

                    {job.skills_preferred.length > 0 && (
                        <>
                            <h3 className="font-medium text-skeu-brown mb-2">Preferred Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {job.skills_preferred.map((skill, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1.5 bg-skeu-cream text-skeu-brown rounded-lg font-medium text-sm"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </>
                    )}
                </SkeuCard>

                {/* Benefits */}
                <SkeuCard variant="raised" className="mb-6">
                    <h2 className="font-bold text-lg text-skeu-dark mb-4">Benefits & Perks</h2>
                    <div className="grid sm:grid-cols-2 gap-3">
                        {job.benefits.map((benefit, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-skeu-cream rounded-lg">
                                <Star className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                                <span className="text-skeu-dark">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </SkeuCard>

                {/* Job Source */}
                <SkeuCard variant="flat" className="mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Globe className="w-5 h-5 text-skeu-brown" />
                            <div>
                                <p className="text-sm text-skeu-brown">Source</p>
                                <p className="font-medium text-skeu-dark">{job.source_name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 rounded-lg hover:bg-skeu-cream text-skeu-brown">
                                <Flag className="w-5 h-5" />
                            </button>
                            <SkeuButton
                                variant="secondary"
                                size="sm"
                                onClick={() => window.open(job.source_url, '_blank')}
                            >
                                View Original
                                <ExternalLink className="w-4 h-4 ml-1" />
                            </SkeuButton>
                        </div>
                    </div>
                </SkeuCard>

                {/* Similar Jobs */}
                <div className="mt-8">
                    <h2 className="font-bold text-xl text-skeu-dark mb-4">Similar Jobs</h2>
                    <div className="grid gap-4">
                        {[1, 2, 3].map((i) => (
                            <SkeuCard key={i} variant="raised" className="hover:shadow-lg transition-shadow cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-skeu-tan to-skeu-brown flex items-center justify-center text-white font-bold">
                                        T
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-skeu-dark">Software Engineer</h3>
                                        <p className="text-sm text-skeu-brown">Tech Company • Dhaka</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-skeu-brown" />
                                </div>
                            </SkeuCard>
                        ))}
                    </div>
                </div>
            </main>

            {/* Apply Modal */}
            {showApplyModal && (
                <div className="modal-overlay" onClick={() => setShowApplyModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold text-skeu-dark mb-4">Apply for this Job</h2>
                        <p className="text-skeu-brown mb-6">
                            You will be redirected to the original job posting on {job.source_name} to complete your application.
                        </p>
                        <div className="flex gap-3">
                            <SkeuButton variant="secondary" className="flex-1" onClick={() => setShowApplyModal(false)}>
                                Cancel
                            </SkeuButton>
                            <SkeuButton
                                variant="primary"
                                className="flex-1"
                                onClick={() => {
                                    window.open(job.source_url, '_blank');
                                    setShowApplyModal(false);
                                }}
                            >
                                Continue to Apply
                                <ExternalLink className="w-4 h-4 ml-2" />
                            </SkeuButton>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Bottom Action */}
            <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-skeu-tan p-4 safe-bottom">
                <div className="flex gap-3">
                    <SkeuButton
                        variant="secondary"
                        size="lg"
                        className="flex-1"
                        onClick={() => setIsSaved(!isSaved)}
                    >
                        <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                    </SkeuButton>
                    <SkeuButton
                        variant="primary"
                        size="lg"
                        className="flex-[2]"
                        onClick={() => window.open(job.source_url, '_blank')}
                    >
                        Apply Now
                        <ExternalLink className="w-5 h-5 ml-2" />
                    </SkeuButton>
                </div>
            </div>
        </div>
    );
}
