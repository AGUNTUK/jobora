import { NextRequest, NextResponse } from 'next/server';
import { runAllScrapers } from '@/lib/scraper';
import { ApiResponse } from '@/types/database';

// Test endpoint for scraping without AI enhancement (faster)
export async function POST(request: NextRequest) {
    try {
        console.log('Starting test job scraping (no AI enhancement)...');

        // Run all scrapers
        const scrapedJobs = await runAllScrapers();
        console.log(`Scraped ${scrapedJobs.length} jobs total`);

        const result = {
            totalScraped: scrapedJobs.length,
            jobs: scrapedJobs.slice(0, 10).map(job => ({
                title: job.title,
                company: job.company,
                location: job.location,
                source: job.source_name,
                url: job.source_url,
            })),
            sources: Array.from(new Set(scrapedJobs.map(j => j.source_name).filter(Boolean))),
        };

        return NextResponse.json<ApiResponse<typeof result>>(
            {
                success: true,
                data: result,
                message: 'Test scraping completed'
            }
        );
    } catch (error) {
        console.error('Error during test scraping:', error);
        return NextResponse.json<ApiResponse<null>>(
            { success: false, error: `Test scraping failed: ${error}` },
            { status: 500 }
        );
    }
}
