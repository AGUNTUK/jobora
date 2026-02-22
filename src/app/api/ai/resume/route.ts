import { NextRequest, NextResponse } from 'next/server';
import { getAIService } from '@/lib/ai';
import { ApiResponse } from '@/types/database';

// POST /api/ai/resume - Parse resume with AI
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { resumeText } = body;

        if (!resumeText) {
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: 'Resume text is required' },
                { status: 400 }
            );
        }

        const aiService = getAIService();
        const response = await aiService.parseResume({ resumeText });

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
        console.error('Resume parsing error:', error);
        return NextResponse.json<ApiResponse<null>>(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
