import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { runAllScrapers, fetchJobDetails } from '@/lib/scraper';
import { getAIService } from '@/lib/ai';
import { Timestamp, Firestore } from 'firebase-admin/firestore';
import { Job, ApiResponse } from '@/types/database';

interface ScrapedJob {
    id: string;
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

// POST /api/jobs/scrape - Trigger job scraping
export async function POST(request: NextRequest) {
    try {
        console.log('Starting job scraping process...');

        // Verify authorization (in production, add proper auth)
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;

        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const db = getAdminDb();
        const aiService = getAIService();

        // Run all scrapers
        const scrapedJobs = await runAllScrapers();
        console.log(`Scraped ${scrapedJobs.length} jobs total`);

        if (scrapedJobs.length === 0) {
            return NextResponse.json<ApiResponse<{ message: string }>>(
                { success: true, data: { message: 'No jobs found to scrape' } }
            );
        }

        // Get existing jobs to check for duplicates
        const existingJobsSnapshot = await db.collection('jobs').get();
        const existingJobs = existingJobsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Job[];

        // Process and enhance jobs with AI
        const processedJobs: ScrapedJob[] = [];
        let newJobsCount = 0;
        let duplicateCount = 0;

        for (const job of scrapedJobs) {
            if (!job.title || !job.company) {
                console.log('Skipping job with missing title or company');
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

            // Fetch full job details if source URL exists
            let enhancedDescription = job.description || '';
            let enhancedRequirements = job.requirements || [];

            if (job.source_url) {
                try {
                    const details = await fetchJobDetails(job.source_url);
                    if (details.description) {
                        enhancedDescription = details.description;
                    }
                    if (details.requirements.length > 0) {
                        enhancedRequirements = details.requirements;
                    }
                } catch (error) {
                    console.log(`Could not fetch details for ${job.source_url}`);
                }
            }

            // Use AI to enhance job data
            let category = job.category || 'General';
            let industry = job.industry || 'General';
            let skillsRequired = job.skills_required || [];
            let fraudScore = 0;
            let riskLevel: 'low' | 'medium' | 'high' = 'low';
            let redFlags: string[] = [];

            try {
                // Categorize job using AI
                const categorizationPrompt = `Categorize this job into one of these categories: 
                IT/Software, Marketing, Sales, Finance/Accounting, HR/Recruitment, 
                Engineering, Healthcare, Education, Customer Service, Design/Creative, 
                Administration, Manufacturing, Retail, Hospitality, Other.
                
                Job Title: ${job.title}
                Description: ${enhancedDescription.substring(0, 500)}
                
                Respond with ONLY the category name, nothing else.`;

                const categorization = await aiService.careerGuidanceChat(categorizationPrompt, []);
                if (categorization.success && categorization.data) {
                    const validCategories = [
                        'IT/Software', 'Marketing', 'Sales', 'Finance/Accounting',
                        'HR/Recruitment', 'Engineering', 'Healthcare', 'Education',
                        'Customer Service', 'Design/Creative', 'Administration',
                        'Manufacturing', 'Retail', 'Hospitality', 'Other'
                    ];
                    const suggestedCategory = categorization.data.trim();
                    if (validCategories.includes(suggestedCategory)) {
                        category = suggestedCategory;
                    }
                }

                // Extract skills using AI
                const skillsPrompt = `Extract the required skills from this job posting.
                
                Job Title: ${job.title}
                Description: ${enhancedDescription.substring(0, 1000)}
                Requirements: ${enhancedRequirements.join(', ')}
                
                Return a JSON array of skill names only. Example: ["JavaScript", "React", "Node.js"]
                Respond with ONLY the JSON array, nothing else.`;

                const skillsResult = await aiService.careerGuidanceChat(skillsPrompt, []);
                if (skillsResult.success && skillsResult.data) {
                    try {
                        const parsed = JSON.parse(skillsResult.data);
                        if (Array.isArray(parsed)) {
                            skillsRequired = parsed.slice(0, 15); // Limit to 15 skills
                        }
                    } catch {
                        // If parsing fails, keep original skills
                    }
                }

                // Run fraud detection
                const fraudResult = await aiService.detectFraud({
                    jobTitle: job.title,
                    company: job.company,
                    description: enhancedDescription,
                    salaryMin: job.salary_min,
                    salaryMax: job.salary_max,
                    sourceUrl: job.source_url || '',
                });

                if (fraudResult.success && fraudResult.data) {
                    fraudScore = fraudResult.data.fraudScore;
                    riskLevel = fraudResult.data.riskLevel;
                    redFlags = fraudResult.data.redFlags;
                }
            } catch (aiError) {
                console.error('AI enhancement failed for job:', job.title, aiError);
                // Continue with default values
            }

            // Determine experience level from title/description
            let experienceLevel: 'entry' | 'mid' | 'senior' | 'executive' = job.experience_level || 'mid';
            const titleLower = job.title?.toLowerCase() || '';
            const descLower = enhancedDescription.toLowerCase();

            if (titleLower.includes('intern') || titleLower.includes('trainee') ||
                descLower.includes('fresh graduate') || descLower.includes('entry level')) {
                experienceLevel = 'entry';
            } else if (titleLower.includes('senior') || titleLower.includes('lead') ||
                titleLower.includes('manager') || titleLower.includes('director')) {
                experienceLevel = 'senior';
            } else if (titleLower.includes('vp') || titleLower.includes('chief') ||
                titleLower.includes('head of')) {
                experienceLevel = 'executive';
            }

            // Determine job type
            let jobType: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance' = job.job_type || 'full-time';
            if (titleLower.includes('part-time') || descLower.includes('part time')) {
                jobType = 'part-time';
            } else if (titleLower.includes('contract') || descLower.includes('contractual')) {
                jobType = 'contract';
            } else if (titleLower.includes('intern')) {
                jobType = 'internship';
            } else if (titleLower.includes('freelance')) {
                jobType = 'freelance';
            }

            // Check if remote
            const isRemote = titleLower.includes('remote') ||
                descLower.includes('work from home') ||
                descLower.includes('remote work') ||
                descLower.includes('wfh');

            // Check if hybrid
            const isHybrid = titleLower.includes('hybrid') ||
                descLower.includes('hybrid work');

            // Create enhanced job object
            const enhancedJob: ScrapedJob = {
                id: job.id!,
                title: job.title,
                company: job.company,
                location: job.location || 'Bangladesh',
                description: enhancedDescription,
                requirements: enhancedRequirements,
                benefits: job.benefits || [],
                skills_required: skillsRequired,
                skills_preferred: job.skills_preferred || [],
                salary_min: job.salary_min,
                salary_max: job.salary_max,
                salary_currency: job.salary_currency || 'BDT',
                salary_period: job.salary_period || 'monthly',
                job_type: jobType,
                experience_level: experienceLevel,
                category,
                industry,
                is_remote: isRemote,
                is_hybrid: isHybrid,
                post_date: job.post_date || new Date().toISOString(),
                source_name: job.source_name || 'Unknown',
                source_url: job.source_url || '',
                is_fraud: fraudScore > 70,
                fraud_score: fraudScore,
                fraud_indicators: redFlags,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            processedJobs.push(enhancedJob);
            newJobsCount++;
        }

        // Save processed jobs to Firestore
        const batch = db.batch();
        let savedCount = 0;

        for (const job of processedJobs) {
            if (!job.is_fraud) { // Don't save jobs flagged as fraud
                const docRef = db.collection('jobs').doc();
                const { id, ...jobWithoutId } = job;
                batch.set(docRef, {
                    ...jobWithoutId,
                    created_at: Timestamp.now(),
                    updated_at: Timestamp.now(),
                    post_date: job.post_date ? Timestamp.fromDate(new Date(job.post_date)) : Timestamp.now(),
                });
                savedCount++;
            }
        }

        await batch.commit();
        console.log(`Saved ${savedCount} new jobs to database`);

        const result = {
            totalScraped: scrapedJobs.length,
            newJobs: newJobsCount,
            duplicatesSkipped: duplicateCount,
            fraudDetected: processedJobs.filter(j => j.is_fraud).length,
            savedToDatabase: savedCount,
            sources: Array.from(new Set(scrapedJobs.map(j => j.source_name).filter(Boolean))) as string[],
        };

        return NextResponse.json<ApiResponse<typeof result>>(
            {
                success: true,
                data: result,
                message: 'Job scraping completed successfully'
            }
        );
    } catch (error) {
        console.error('Error during job scraping:', error);
        return NextResponse.json<ApiResponse<null>>(
            { success: false, error: `Scraping failed: ${error}` },
            { status: 500 }
        );
    }
}

// GET /api/jobs/scrape - Get scraping status and last run info
export async function GET(request: NextRequest) {
    try {
        const db = getAdminDb();

        // Get job statistics
        const jobsSnapshot = await db.collection('jobs').get();
        const jobs = jobsSnapshot.docs.map(doc => doc.data());

        const stats = {
            totalJobs: jobs.length,
            bySource: jobs.reduce((acc: Record<string, number>, job) => {
                const source = job.source_name || 'Unknown';
                acc[source] = (acc[source] || 0) + 1;
                return acc;
            }, {}),
            byCategory: jobs.reduce((acc: Record<string, number>, job) => {
                const category = job.category || 'Uncategorized';
                acc[category] = (acc[category] || 0) + 1;
                return acc;
            }, {}),
            fraudDetected: jobs.filter(j => j.is_fraud).length,
            lastScraped: jobs.length > 0
                ? jobs.reduce((latest: string, j) =>
                    j.created_at > latest ? j.created_at : latest, '')
                : null,
        };

        return NextResponse.json<ApiResponse<typeof stats>>(
            { success: true, data: stats }
        );
    } catch (error) {
        console.error('Error fetching scraping status:', error);
        return NextResponse.json<ApiResponse<null>>(
            { success: false, error: 'Failed to fetch scraping status' },
            { status: 500 }
        );
    }
}
