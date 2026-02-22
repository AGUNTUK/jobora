import { NextRequest, NextResponse } from 'next/server';
import { getNotificationService } from '@/lib/notifications';
import { getAdminDb } from '@/lib/firebase/admin';
import { JobAlert } from '@/types/alerts';
import { ApiResponse } from '@/types/database';

// GET /api/alerts - Get user's job alerts
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('user_id');

        if (!userId) {
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: 'User ID is required' },
                { status: 400 }
            );
        }

        const notificationService = getNotificationService();
        const alerts = await notificationService.getUserAlerts(userId);

        return NextResponse.json<ApiResponse<JobAlert[]>>({
            success: true,
            data: alerts,
        });
    } catch (error) {
        console.error('Error fetching alerts:', error);
        return NextResponse.json<ApiResponse<null>>(
            { success: false, error: `Failed to fetch alerts: ${error}` },
            { status: 500 }
        );
    }
}

// POST /api/alerts - Create a new job alert
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { user_id, ...alertData } = body;

        if (!user_id) {
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: 'User ID is required' },
                { status: 400 }
            );
        }

        const notificationService = getNotificationService();
        const alert = await notificationService.createAlert(user_id, alertData);

        return NextResponse.json<ApiResponse<JobAlert>>({
            success: true,
            data: alert,
            message: 'Job alert created successfully',
        });
    } catch (error) {
        console.error('Error creating alert:', error);
        return NextResponse.json<ApiResponse<null>>(
            { success: false, error: `Failed to create alert: ${error}` },
            { status: 500 }
        );
    }
}

// PUT /api/alerts - Update an existing alert
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { alert_id, ...updates } = body;

        if (!alert_id) {
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: 'Alert ID is required' },
                { status: 400 }
            );
        }

        const notificationService = getNotificationService();
        await notificationService.updateAlert(alert_id, updates);

        return NextResponse.json<ApiResponse<null>>({
            success: true,
            message: 'Alert updated successfully',
        });
    } catch (error) {
        console.error('Error updating alert:', error);
        return NextResponse.json<ApiResponse<null>>(
            { success: false, error: `Failed to update alert: ${error}` },
            { status: 500 }
        );
    }
}

// DELETE /api/alerts - Delete an alert
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const alertId = searchParams.get('alert_id');

        if (!alertId) {
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: 'Alert ID is required' },
                { status: 400 }
            );
        }

        const notificationService = getNotificationService();
        await notificationService.deleteAlert(alertId);

        return NextResponse.json<ApiResponse<null>>({
            success: true,
            message: 'Alert deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting alert:', error);
        return NextResponse.json<ApiResponse<null>>(
            { success: false, error: `Failed to delete alert: ${error}` },
            { status: 500 }
        );
    }
}
