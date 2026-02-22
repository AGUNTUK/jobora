import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { Job, ApiResponse } from '@/types/database';
import { Timestamp } from 'firebase-admin/firestore';

// GET /api/jobs/[id] - Fetch a single job
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const db = getAdminDb();
        const { id } = params;

        const docRef = db.collection('jobs').doc(id);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: 'Job not found' },
                { status: 404 }
            );
        }

        const data = docSnap.data();
        const job: Job = {
            id: docSnap.id,
            ...data,
            post_date: data?.post_date?.toDate?.()?.toISOString() || data?.post_date,
            created_at: data?.created_at?.toDate?.()?.toISOString() || data?.created_at,
            updated_at: data?.updated_at?.toDate?.()?.toISOString() || data?.updated_at,
        } as Job;

        // Record job view (async, don't wait)
        const userId = request.headers.get('x-user-id');
        if (userId) {
            db.collection('job_views').add({
                job_id: id,
                user_id: userId,
                viewed_at: Timestamp.now(),
            }).catch(console.error);
        }

        return NextResponse.json<ApiResponse<Job>>(
            { success: true, data: job }
        );
    } catch (error) {
        console.error('Error fetching job:', error);
        return NextResponse.json<ApiResponse<null>>(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT /api/jobs/[id] - Update a job
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const db = getAdminDb();
        const { id } = params;
        const body = await request.json();

        const docRef = db.collection('jobs').doc(id);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: 'Job not found' },
                { status: 404 }
            );
        }

        const updateData = {
            ...body,
            updated_at: Timestamp.now(),
        };

        await docRef.update(updateData);

        const updatedSnap = await docRef.get();
        const data = updatedSnap.data();
        const job: Job = {
            id: updatedSnap.id,
            ...data,
            post_date: data?.post_date?.toDate?.()?.toISOString() || data?.post_date,
            created_at: data?.created_at?.toDate?.()?.toISOString() || data?.created_at,
            updated_at: data?.updated_at?.toDate?.()?.toISOString() || data?.updated_at,
        } as Job;

        return NextResponse.json<ApiResponse<Job>>(
            { success: true, data: job, message: 'Job updated successfully' }
        );
    } catch (error) {
        console.error('Error updating job:', error);
        return NextResponse.json<ApiResponse<null>>(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/jobs/[id] - Delete a job
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const db = getAdminDb();
        const { id } = params;

        const docRef = db.collection('jobs').doc(id);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: 'Job not found' },
                { status: 404 }
            );
        }

        await docRef.delete();

        return NextResponse.json<ApiResponse<null>>(
            { success: true, message: 'Job deleted successfully' }
        );
    } catch (error) {
        console.error('Error deleting job:', error);
        return NextResponse.json<ApiResponse<null>>(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
