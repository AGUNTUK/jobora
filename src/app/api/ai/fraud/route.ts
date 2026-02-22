import { NextRequest, NextResponse } from 'next/server';
import { getAIService } from '@/lib/ai';
import { ApiResponse } from '@/types/database';

// POST /api/ai/fraud - Detect job fraud
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { jobTitle, company, description, salaryMin, salaryMax, sourceUrl, contactEmail } = body;

        if (!jobTitle || !company || !description) {
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: 'Job title, company, and description are required' },
                { status: 400 }
            );
        }

        const aiService = getAIService();
        const response = await aiService.detectFraud({
            jobTitle,
            company,
            description,
            salaryMin,
            salaryMax,
            sourceUrl,
            contactEmail,
        });

        if (!response.success) {
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: response.error || 'AI service error' },
                { status: 500 }
            );
        }

        return NextResponse.json<ApiResponse<typeof response.data>>(
            { success: true, data: response.data }
        );
    } catch (error) {
        console.error('Fraud detection error:', error);
        return NextResponse.json<ApiResponse<null>>(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
