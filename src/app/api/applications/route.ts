import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { AppliedJob, ApiResponse, PaginatedResponse } from '@/types/database';
import { Timestamp } from 'firebase-admin/firestore';

// GET /api/applications - Fetch user's job applications
export async function GET(request: NextRequest) {
    try {
        const db = getAdminDb();
        const userId = request.headers.get('x-user-id');

        if (!userId) {
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const perPage = parseInt(searchParams.get('per_page') || '20');
        const status = searchParams.get('status');

        // Build query
        let query = db.collection('applied_jobs').where('user_id', '==', userId);

        if (status) {
            query = query.where('status', '==', status);
        }

        const snapshot = await query.orderBy('created_at', 'desc').limit(perPage).get();

        // Get total count
        let countQuery = db.collection('applied_jobs').where('user_id', '==', userId);
        if (status) {
            countQuery = countQuery.where('status', '==', status);
        }
        const countSnapshot = await countQuery.get();
        const total = countSnapshot.size;

        // Transform documents
        const applications: AppliedJob[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            applied_at: doc.data().applied_at?.toDate?.()?.toISOString() || doc.data().applied_at,
            created_at: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().created_at,
            updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || doc.data().updated_at,
        })) as AppliedJob[];

        const response: PaginatedResponse<AppliedJob> = {
            data: applications,
            total,
            page,
            per_page: perPage,
            total_pages: Math.ceil(total / perPage),
        };

        return NextResponse.json<ApiResponse<PaginatedResponse<AppliedJob>>>(
            { success: true, data: response }
        );
    } catch (error) {
        console.error('Error fetching applications:', error);
        return NextResponse.json<ApiResponse<null>>(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/applications - Create a new job application
export async function POST(request: NextRequest) {
    try {
        const db = getAdminDb();
        const userId = request.headers.get('x-user-id');

        if (!userId) {
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { job_id, status = 'saved', notes } = body;

        // Check if already applied
        const existingSnapshot = await db
            .collection('applied_jobs')
            .where('user_id', '==', userId)
            .where('job_id', '==', job_id)
            .get();

        if (!existingSnapshot.empty) {
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: 'Already applied to this job' },
                { status: 400 }
            );
        }

        const now = Timestamp.now();
        const applicationData = {
            user_id: userId,
            job_id,
            status,
            notes,
            applied_at: status === 'applied' ? now : null,
            created_at: now,
            updated_at: now,
        };

        const docRef = await db.collection('applied_jobs').add(applicationData);

        // Add gamification points if applied
        if (status === 'applied') {
            const gamificationRef = db.collection('gamification').doc(userId);
            const gamificationSnap = await gamificationRef.get();

            if (gamificationSnap.exists) {
                const currentPoints = gamificationSnap.data()?.total_points || 0;
                await gamificationRef.update({
                    total_points: currentPoints + 10,
                    updated_at: now,
                });
            }
        }

        const application: AppliedJob = {
            id: docRef.id,
            ...applicationData,
            applied_at: applicationData.applied_at?.toDate?.()?.toISOString() || undefined,
            created_at: now.toDate().toISOString(),
            updated_at: now.toDate().toISOString(),
        };

        return NextResponse.json<ApiResponse<AppliedJob>>(
            { success: true, data: application, message: 'Application created successfully' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating application:', error);
        return NextResponse.json<ApiResponse<null>>(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT /api/applications - Update an application
export async function PUT(request: NextRequest) {
    try {
        const db = getAdminDb();
        const userId = request.headers.get('x-user-id');

        if (!userId) {
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { id, status, notes, reminder_date } = body;

        const docRef = db.collection('applied_jobs').doc(id);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: 'Application not found' },
                { status: 404 }
            );
        }

        // Verify ownership
        if (docSnap.data()?.user_id !== userId) {
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: 'Unauthorized' },
                { status: 403 }
            );
        }

        const updateData: Record<string, unknown> = {
            updated_at: Timestamp.now(),
        };

        if (status) {
            updateData.status = status;
            if (status === 'applied' && !docSnap.data()?.applied_at) {
                updateData.applied_at = Timestamp.now();
            }
        }
        if (notes !== undefined) updateData.notes = notes;
        if (reminder_date !== undefined) updateData.reminder_date = reminder_date;

        await docRef.update(updateData);

        const updatedSnap = await docRef.get();
        const data = updatedSnap.data()!;
        const application: AppliedJob = {
            id: updatedSnap.id,
            ...data,
            applied_at: data.applied_at?.toDate?.()?.toISOString() || null,
            created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
            updated_at: data.updated_at?.toDate?.()?.toISOString() || data.updated_at,
        } as AppliedJob;

        return NextResponse.json<ApiResponse<AppliedJob>>(
            { success: true, data: application, message: 'Application updated successfully' }
        );
    } catch (error) {
        console.error('Error updating application:', error);
        return NextResponse.json<ApiResponse<null>>(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/applications - Delete an application
export async function DELETE(request: NextRequest) {
    try {
        const db = getAdminDb();
        const userId = request.headers.get('x-user-id');

        if (!userId) {
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: 'Application ID required' },
                { status: 400 }
            );
        }

        const docRef = db.collection('applied_jobs').doc(id);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: 'Application not found' },
                { status: 404 }
            );
        }

        // Verify ownership
        if (docSnap.data()?.user_id !== userId) {
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: 'Unauthorized' },
                { status: 403 }
            );
        }

        await docRef.delete();

        return NextResponse.json<ApiResponse<null>>(
            { success: true, message: 'Application deleted successfully' }
        );
    } catch (error) {
        console.error('Error deleting application:', error);
        return NextResponse.json<ApiResponse<null>>(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
