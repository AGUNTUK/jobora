import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, Job } from '@/types/database';
import { getAdminDb } from '@/lib/firebase/admin';
import { runAllScrapers } from '@/lib/scraper';
import { getAIService } from '@/lib/ai';

interface ScrapedJob {
    id?: string;
    title: string;
    company: string;
    location?: string;
    description?: string;
    requirements?: string[];
    benefits?: string[];
    skills_required?: string[];
    skills_preferred?: string[];
    salary_min?: number;
    salary_max?: number;
    salary_currency?: string;
    salary_period?: 'hourly' | 'monthly' | 'yearly';
    job_type?: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
    experience_level?: 'entry' | 'mid' | 'senior' | 'executive';
    category?: string;
    industry?: string;
    is_remote?: boolean;
    is_hybrid?: boolean;
    is_fraud?: boolean;
    fraud_score?: number;
    fraud_indicators?: string[];
    post_date?: string;
    source_name?: string;
    source_url?: string;
    created_at?: string;
    updated_at?: string;
}

// Cron endpoint for scheduled job scraping
// This can be called by Vercel Cron Jobs or external schedulers
export async function GET(request: NextRequest) {
    const startTime = Date.now();
    console.log('Cron job started at:', new Date().toISOString());

    try {
        // Verify cron secret for security
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;

        // Check for secret in header or query param (for services that don't support headers)
        const { searchParams } = new URL(request.url);
        const secretParam = searchParams.get('secret');

        if (cronSecret) {
            const isValidHeader = authHeader === `Bearer ${cronSecret}`;
            const isValidParam = secretParam === cronSecret;

            if (!isValidHeader && !isValidParam) {
                console.error('Unauthorized cron attempt');
                return NextResponse.json<ApiResponse<null>>(
                    { success: false, error: 'Unauthorized - Invalid cron secret' },
                    { status: 401 }
                );
            }
        }

        console.log('Authorization passed, starting scrape...');

        // Initialize services
        let db;
        try {
            db = getAdminDb();
            console.log('Firebase Admin initialized successfully');
        } catch (dbError) {
            console.error('Failed to initialize Firebase Admin:', dbError);
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: `Database initialization failed: ${dbError}` },
                { status: 500 }
            );
        }

        const aiService = getAIService();
        console.log('AI Service initialized');

        // Run all scrapers
        let scrapedJobs: Partial<Job>[] = [];
        try {
            console.log('Starting job scrapers...');
            scrapedJobs = await runAllScrapers();
            console.log(`Scraped ${scrapedJobs.length} jobs total`);
        } catch (scrapeError) {
            console.error('Scraping failed:', scrapeError);
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: `Scraping failed: ${scrapeError}` },
                { status: 500 }
            );
        }

        if (scrapedJobs.length === 0) {
            const duration = Date.now() - startTime;
            console.log('No jobs found to scrape');
            return NextResponse.json<ApiResponse<{ message: string; duration: number }>>(
                { success: true, data: { message: 'No jobs found to scrape', duration } }
            );
        }

        // Get existing jobs to check for duplicates
        let existingJobs: Job[] = [];
        try {
            const existingJobsSnapshot = await db.collection('jobs').limit(1000).get();
            existingJobs = existingJobsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Job[];
            console.log(`Found ${existingJobs.length} existing jobs for duplicate check`);
        } catch (fetchError) {
            console.error('Failed to fetch existing jobs:', fetchError);
            // Continue without duplicate check
        }

        // Process and enhance jobs with AI
        const processedJobs: ScrapedJob[] = [];
        let newJobsCount = 0;
        let duplicateCount = 0;
        let errorCount = 0;

        for (const job of scrapedJobs) {
            try {
                if (!job.title || !job.company) {
                    console.log('Skipping job with missing title or company');
                    errorCount++;
                    continue;
                }

                // Check for duplicates (same title and company)
                const isDuplicate = existingJobs.some(
                    existing =>
                        existing.title?.toLowerCase() === job.title?.toLowerCase() &&
                        existing.company?.toLowerCase() === job.company?.toLowerCase()
                );

                if (isDuplicate) {
                    duplicateCount++;
                    console.log(`Duplicate job found: ${job.title} at ${job.company}`);
                    continue;
                }

                // Create processed job
                const processedJob: ScrapedJob = {
                    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    title: job.title,
                    company: job.company,
                    location: job.location || 'Bangladesh',
                    description: job.description || '',
                    requirements: job.requirements || [],
                    benefits: job.benefits || [],
                    skills_required: job.skills_required || [],
                    skills_preferred: job.skills_preferred || [],
                    salary_min: job.salary_min,
                    salary_max: job.salary_max,
                    salary_currency: job.salary_currency || 'BDT',
                    salary_period: job.salary_period || 'monthly',
                    job_type: job.job_type || 'full-time',
                    experience_level: job.experience_level || 'mid',
                    category: job.category || 'General',
                    industry: job.industry || 'General',
                    is_remote: job.is_remote || false,
                    is_hybrid: job.is_hybrid || false,
                    is_fraud: false,
                    fraud_score: 0,
                    fraud_indicators: [],
                    post_date: job.post_date || new Date().toISOString(),
                    source_name: job.source_name || 'Unknown',
                    source_url: job.source_url || '',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                };

                // AI Enhancement - Fraud Detection
                try {
                    const fraudCheck = await aiService.detectFraud({
                        jobTitle: job.title,
                        company: job.company,
                        description: job.description || '',
                        salaryMin: job.salary_min,
                        salaryMax: job.salary_max,
                        sourceUrl: job.source_url || '',
                    });

                    if (fraudCheck.success && fraudCheck.data) {
                        processedJob.fraud_score = fraudCheck.data.fraudScore;
                        processedJob.fraud_indicators = fraudCheck.data.redFlags;
                        processedJob.is_fraud = fraudCheck.data.riskLevel === 'high';
                    }
                } catch (aiError) {
                    console.error('AI fraud detection failed for job:', job.title, aiError);
                    // Continue without AI enhancement
                }

                // Skip if fraud detected with high score
                if (processedJob.is_fraud && (processedJob.fraud_score || 0) > 70) {
                    console.log(`Skipping fraudulent job: ${job.title} (score: ${processedJob.fraud_score})`);
                    errorCount++;
                    continue;
                }

                // Save to Firestore
                try {
                    const jobId = processedJob.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                    await db.collection('jobs').doc(jobId).set(processedJob);
                    processedJobs.push(processedJob);
                    newJobsCount++;
                    console.log(`Saved job: ${job.title} at ${job.company}`);
                } catch (saveError) {
                    console.error(`Failed to save job ${job.title}:`, saveError);
                    errorCount++;
                }
            } catch (jobError) {
                console.error(`Error processing job:`, jobError);
                errorCount++;
            }
        }

        const duration = Date.now() - startTime;
        const result = {
            total_scraped: scrapedJobs.length,
            new_jobs: newJobsCount,
            duplicates: duplicateCount,
            errors: errorCount,
            duration_ms: duration,
        };

        console.log('Cron scrape completed:', result);

        return NextResponse.json<ApiResponse<typeof result>>(
            {
                success: true,
                data: result,
                message: 'Scheduled scraping completed successfully'
            }
        );
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error('Cron job error:', error);
        return NextResponse.json<ApiResponse<{ error: string; duration: number }>>(
            { success: false, error: `Cron job failed: ${error}`, data: { error: String(error), duration } },
            { status: 500 }
        );
    }
}

// Also support POST for manual triggers
export async function POST(request: NextRequest) {
    return GET(request);
}
