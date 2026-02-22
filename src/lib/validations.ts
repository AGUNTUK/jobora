import { z } from 'zod';

// ============================================
// Job-related validations
// ============================================

export const JobTypeSchema = z.enum(['full-time', 'part-time', 'contract', 'internship', 'freelance']);
export const ExperienceLevelSchema = z.enum(['entry', 'mid', 'senior', 'executive']);
export const SalaryPeriodSchema = z.enum(['hourly', 'monthly', 'yearly']);

export const JobSearchSchema = z.object({
    keywords: z.string().max(200).optional(),
    location: z.string().max(100).optional(),
    job_type: z.array(JobTypeSchema).optional(),
    salary_min: z.number().min(0).max(10000000).optional(),
    salary_max: z.number().min(0).max(10000000).optional(),
    experience_level: z.array(ExperienceLevelSchema).optional(),
    category: z.string().max(100).optional(),
    industry: z.string().max(100).optional(),
    is_remote: z.boolean().optional(),
    posted_within: z.number().min(1).max(365).optional(),
    source: z.array(z.string().max(100)).optional(),
    page: z.number().min(1).max(1000).default(1),
    per_page: z.number().min(1).max(100).default(20),
    sort_by: z.enum(['relevance', 'date', 'salary']).default('relevance'),
    sort_order: z.enum(['asc', 'desc']).default('desc'),
});

export const JobIdSchema = z.object({
    id: z.string().min(1).max(100),
});

// ============================================
// User-related validations
// ============================================

export const SalaryExpectationSchema = z.object({
    min: z.number().min(0).max(10000000),
    max: z.number().min(0).max(10000000),
    currency: z.string().length(3).default('BDT'),
    period: SalaryPeriodSchema.default('monthly'),
});

export const ExperienceSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1).max(200),
    company: z.string().min(1).max(200),
    location: z.string().max(200).optional(),
    start_date: z.string().datetime(),
    end_date: z.string().datetime().optional(),
    current: z.boolean().default(false),
    description: z.string().max(5000).optional(),
    skills: z.array(z.string().max(100)).optional(),
});

export const EducationSchema = z.object({
    id: z.string().optional(),
    degree: z.string().min(1).max(200),
    institution: z.string().min(1).max(200),
    location: z.string().max(200).optional(),
    start_date: z.string().datetime(),
    end_date: z.string().datetime().optional(),
    current: z.boolean().default(false),
    field_of_study: z.string().max(200).optional(),
    gpa: z.number().min(0).max(4).optional(),
});

export const UserProfileSchema = z.object({
    name: z.string().min(1).max(100),
    email: z.string().email().max(255),
    phone: z.string().max(20).optional(),
    avatar_url: z.string().url().max(500).optional(),
    skills: z.array(z.string().max(100)).max(50).optional(),
    experience: z.array(ExperienceSchema).max(20).optional(),
    education: z.array(EducationSchema).max(10).optional(),
    preferred_locations: z.array(z.string().max(100)).max(20).optional(),
    salary_expectation: SalaryExpectationSchema.optional(),
    job_types: z.array(JobTypeSchema).max(10).optional(),
});

// ============================================
// Application-related validations
// ============================================

export const ApplicationStatusSchema = z.enum(['saved', 'applied', 'interviewing', 'offered', 'rejected', 'withdrawn']);

export const CreateApplicationSchema = z.object({
    job_id: z.string().min(1).max(100),
    notes: z.string().max(2000).optional(),
    reminder_date: z.string().datetime().optional(),
});

export const UpdateApplicationSchema = z.object({
    status: ApplicationStatusSchema.optional(),
    notes: z.string().max(2000).optional(),
    reminder_date: z.string().datetime().optional(),
});

// ============================================
// Alert-related validations
// ============================================

export const AlertFrequencySchema = z.enum(['instant', 'daily', 'weekly']);

export const JobAlertSchema = z.object({
    name: z.string().min(1).max(100),
    keywords: z.array(z.string().max(100)).max(20),
    locations: z.array(z.string().max(100)).max(20),
    job_types: z.array(JobTypeSchema).max(10).optional(),
    salary_min: z.number().min(0).max(10000000).optional(),
    salary_max: z.number().min(0).max(10000000).optional(),
    frequency: AlertFrequencySchema.default('daily'),
    is_active: z.boolean().default(true),
});

// ============================================
// AI-related validations
// ============================================

export const ChatMessageSchema = z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string().min(1).max(10000),
});

export const AIChatRequestSchema = z.object({
    message: z.string().min(1).max(5000),
    conversation_history: z.array(ChatMessageSchema).max(20).optional(),
});

export const JobRankingRequestSchema = z.object({
    job_id: z.string().min(1).max(100),
    user_skills: z.array(z.string().max(100)).max(50).optional(),
    user_experience: z.string().max(2000).optional(),
});

export const FraudDetectionRequestSchema = z.object({
    job_id: z.string().min(1).max(100),
});

export const ResumeParseRequestSchema = z.object({
    resume_text: z.string().min(50).max(50000),
});

// ============================================
// Notification-related validations
// ============================================

export const NotificationTypeSchema = z.enum(['job_match', 'application_update', 'reminder', 'achievement', 'system', 'promotion']);

export const NotificationCreateSchema = z.object({
    user_id: z.string().min(1).max(100),
    type: NotificationTypeSchema,
    title: z.string().min(1).max(200),
    message: z.string().min(1).max(1000),
    data: z.record(z.string(), z.unknown()).optional(),
    action_url: z.string().url().max(500).optional(),
    action_text: z.string().max(50).optional(),
});

// ============================================
// Scraper-related validations
// ============================================

export const ScraperSourceSchema = z.enum(['portal', 'facebook', 'linkedin', 'newspaper', 'company_website', 'google', 'instagram']);

export const ScraperConfigSchema = z.object({
    source_name: z.string().min(1).max(100),
    source_type: ScraperSourceSchema,
    base_url: z.string().url().max(500),
    max_pages: z.number().min(1).max(100).default(10),
    max_jobs: z.number().min(1).max(1000).default(100),
});

// ============================================
// Pagination & Query validations
// ============================================

export const PaginationSchema = z.object({
    page: z.number().min(1).max(10000).default(1),
    per_page: z.number().min(1).max(100).default(20),
});

export const SortSchema = z.object({
    sort_by: z.string().max(50).default('created_at'),
    sort_order: z.enum(['asc', 'desc']).default('desc'),
});

// ============================================
// Helper functions
// ============================================

/**
 * Validates data against a Zod schema and returns typed result or error
 */
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
    const result = schema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    return {
        success: false,
        error: result.error.issues.map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`).join(', ')
    };
}

/**
 * Validates data and throws a formatted error on failure
 */
export function validateOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
    const result = schema.safeParse(data);
    if (!result.success) {
        const errorMessage = result.error.issues.map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`).join(', ');
        throw new Error(`Validation error: ${errorMessage}`);
    }
    return result.data;
}

/**
 * Sanitizes a string by trimming and removing potentially dangerous characters
 */
export function sanitizeString(input: string, maxLength: number = 1000): string {
    return input
        .trim()
        .slice(0, maxLength)
        .replace(/[<>]/g, ''); // Basic XSS prevention
}

/**
 * Validates and sanitizes search query
 */
export function sanitizeSearchQuery(query: string): string {
    return query
        .trim()
        .slice(0, 200)
        .replace(/[<>\"\'\\]/g, '')
        .replace(/\s+/g, ' ');
}

export default {
    // Job validations
    JobSearchSchema,
    JobIdSchema,
    JobTypeSchema,
    ExperienceLevelSchema,
    SalaryPeriodSchema,

    // User validations
    UserProfileSchema,
    SalaryExpectationSchema,
    ExperienceSchema,
    EducationSchema,

    // Application validations
    ApplicationStatusSchema,
    CreateApplicationSchema,
    UpdateApplicationSchema,

    // Alert validations
    JobAlertSchema,
    AlertFrequencySchema,

    // AI validations
    AIChatRequestSchema,
    ChatMessageSchema,
    JobRankingRequestSchema,
    FraudDetectionRequestSchema,
    ResumeParseRequestSchema,

    // Notification validations
    NotificationTypeSchema,
    NotificationCreateSchema,

    // Scraper validations
    ScraperSourceSchema,
    ScraperConfigSchema,

    // Pagination
    PaginationSchema,
    SortSchema,

    // Helpers
    validate,
    validateOrThrow,
    sanitizeString,
    sanitizeSearchQuery,
};
