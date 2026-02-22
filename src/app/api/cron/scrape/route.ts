import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/types/database';

// Cron endpoint for scheduled job scraping
// This can be called by Vercel Cron Jobs or external schedulers

export async function GET(request: NextRequest) {
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
                return NextResponse.json<ApiResponse<null>>(
                    { success: false, error: 'Unauthorized - Invalid cron secret' },
                    { status: 401 }
                );
            }
        }

        // Call the scrape endpoint
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : 'http://localhost:3000';

        const scrapeResponse = await fetch(`${baseUrl}/api/jobs/scrape`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cronSecret || ''}`,
            },
        });

        const result = await scrapeResponse.json();

        if (!scrapeResponse.ok) {
            console.error('Cron scrape failed:', result);
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: 'Scraping failed', data: result },
                { status: 500 }
            );
        }

        console.log('Cron scrape completed:', result);

        return NextResponse.json<ApiResponse<typeof result>>(
            {
                success: true,
                data: result,
                message: 'Scheduled scraping completed successfully'
            }
        );
    } catch (error) {
        console.error('Cron job error:', error);
        return NextResponse.json<ApiResponse<null>>(
            { success: false, error: `Cron job failed: ${error}` },
            { status: 500 }
        );
    }
}

// Also support POST for manual triggers
export async function POST(request: NextRequest) {
    return GET(request);
}
