import { NextRequest, NextResponse } from 'next/server';
import { getAIService } from '@/lib/ai';
import { ApiResponse } from '@/types/database';

// POST /api/ai/recommendations - Generate job recommendations
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userProfile, recentJobs } = body;

        if (!userProfile || !userProfile.skills) {
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: 'User profile with skills is required' },
                { status: 400 }
            );
        }

        const aiService = getAIService();
        const response = await aiService.generateRecommendations(userProfile, recentJobs || []);

        if (!response.success) {
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: response.error || 'AI service error' },
                { status: 500 }
            );
        }

        return NextResponse.json<ApiResponse<string[]>>(
            { success: true, data: response.data }
        );
    } catch (error) {
        console.error('Recommendations error:', error);
        return NextResponse.json<ApiResponse<null>>(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
