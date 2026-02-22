import { NextRequest, NextResponse } from 'next/server';
import { getAIService } from '@/lib/ai';
import { ApiResponse } from '@/types/database';

// POST /api/ai/summarize - Summarize job description
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { description } = body;

        if (!description) {
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: 'Job description is required' },
                { status: 400 }
            );
        }

        const aiService = getAIService();
        const response = await aiService.summarizeJobDescription(description);

        if (!response.success) {
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: response.error || 'AI service error' },
                { status: 500 }
            );
        }

        return NextResponse.json<ApiResponse<string>>(
            { success: true, data: response.data }
        );
    } catch (error) {
        console.error('Job summarization error:', error);
        return NextResponse.json<ApiResponse<null>>(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
