// Database types for Firebase Firestore

export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    avatar_url?: string;
    skills: string[];
    experience: Experience[];
    education: Education[];
    preferred_locations: string[];
    salary_expectation: SalaryExpectation;
    job_types: string[];
    created_at: string;
    updated_at: string;
    last_active: string;
    onboarding_completed: boolean;
}

export interface Experience {
    id: string;
    title: string;
    company: string;
    location: string;
    start_date: string;
    end_date?: string;
    current: boolean;
    description: string;
    skills: string[];
}

export interface Education {
    id: string;
    degree: string;
    institution: string;
    location: string;
    start_date: string;
    end_date?: string;
    current: boolean;
    field_of_study: string;
    gpa?: number;
}

export interface SalaryExpectation {
    min: number;
    max: number;
    currency: string;
    period: 'hourly' | 'monthly' | 'yearly';
}

export interface Job {
    id: string;
    title: string;
    company: string;
    company_logo?: string;
    location: string;
    salary_min?: number;
    salary_max?: number;
    salary_currency: string;
    salary_period: 'hourly' | 'monthly' | 'yearly';
    job_type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
    description: string;
    requirements: string[];
    benefits: string[];
    skills_required: string[];
    skills_preferred: string[];
    post_date: string;
    deadline?: string;
    source_name: string;
    source_url: string;
    source_logo?: string;
    category: string;
    industry: string;
    experience_level: 'entry' | 'mid' | 'senior' | 'executive';
    experience_years_min?: number;
    experience_years_max?: number;
    is_remote: boolean;
    is_hybrid: boolean;
    is_fraud: boolean;
    // AI-generated fields
    relevance_score?: number;
    fraud_score?: number;
    recommendation_notes?: string;
    summary?: string;
    duplicate_of?: string;
    created_at: string;
    updated_at: string;
}

export interface AppliedJob {
    id: string;
    user_id: string;
    job_id: string;
    status: 'saved' | 'applied' | 'interviewing' | 'offered' | 'rejected' | 'withdrawn';
    applied_at?: string;
    notes?: string;
    reminder_date?: string;
    created_at: string;
    updated_at: string;
    job?: Job;
}

export interface Resume {
    id: string;
    user_id: string;
    title: string;
    content: ResumeContent;
    file_url?: string;
    is_primary: boolean;
    created_at: string;
    updated_at: string;
}

export interface ResumeContent {
    summary: string;
    skills: string[];
    experience: Experience[];
    education: Education[];
    certifications: Certification[];
    languages: Language[];
    projects: Project[];
    references: Reference[];
}

export interface Certification {
    id: string;
    name: string;
    issuer: string;
    date: string;
    expiry_date?: string;
    credential_id?: string;
    credential_url?: string;
}

export interface Language {
    name: string;
    proficiency: 'basic' | 'conversational' | 'professional' | 'native';
}

export interface Project {
    id: string;
    name: string;
    description: string;
    url?: string;
    start_date?: string;
    end_date?: string;
    technologies: string[];
}

export interface Reference {
    id: string;
    name: string;
    title: string;
    company: string;
    email: string;
    phone?: string;
    relationship: string;
}

export interface Notification {
    id: string;
    user_id: string;
    type: 'job_match' | 'application_update' | 'reminder' | 'achievement' | 'system' | 'promotion';
    title: string;
    message: string;
    data?: Record<string, unknown>;
    read: boolean;
    read_at?: string;
    created_at: string;
    action_url?: string;
    action_text?: string;
}

export interface Gamification {
    id: string;
    user_id: string;
    total_points: number;
    current_level: number;
    streak_days: number;
    last_activity_date: string;
    badges: Badge[];
    achievements: Achievement[];
    referrals: Referral[];
    created_at: string;
    updated_at: string;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
    earned_at: string;
    category: string;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    points: number;
    icon: string;
    earned_at: string;
    category: string;
}

export interface Referral {
    id: string;
    referred_user_id: string;
    referred_email: string;
    status: 'pending' | 'registered' | 'active';
    points_earned: number;
    created_at: string;
}

export interface JobAlert {
    id: string;
    user_id: string;
    name: string;
    keywords: string[];
    locations: string[];
    job_types: string[];
    salary_min?: number;
    salary_max?: number;
    frequency: 'instant' | 'daily' | 'weekly';
    is_active: boolean;
    last_triggered?: string;
    created_at: string;
    updated_at: string;
}

export interface ScraperLog {
    id: string;
    source_name: string;
    source_type: 'portal' | 'facebook' | 'linkedin' | 'newspaper' | 'company_website';
    status: 'running' | 'completed' | 'failed';
    jobs_found: number;
    jobs_added: number;
    duplicates_found: number;
    errors: string[];
    started_at: string;
    completed_at?: string;
}

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
}

// Search and Filter types
export interface JobFilters {
    keywords?: string;
    location?: string;
    job_type?: string[];
    salary_min?: number;
    salary_max?: number;
    experience_level?: string[];
    category?: string;
    industry?: string;
    is_remote?: boolean;
    posted_within?: number; // days
    source?: string[];
}

export interface SearchParams {
    query: string;
    filters: JobFilters;
    sort_by: 'relevance' | 'date' | 'salary';
    sort_order: 'asc' | 'desc';
    page: number;
    per_page: number;
}
