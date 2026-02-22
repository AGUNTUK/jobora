import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { Job, ApiResponse } from '@/types/database';
import { collection, doc, getDoc, updateDoc, deleteDoc, Timestamp, addDoc } from 'firebase-admin/firestore';

// GET /api/jobs/[id] - Fetch a single job
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const db = getAdminDb();
        const { id } = params;

        const docRef = doc(db, 'jobs', id);
        const docSnap = await getDoc(docRef);

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
            post_date: data.post_date?.toDate?.()?.toISOString() || data.post_date,
            created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
            updated_at: data.updated_at?.toDate?.()?.toISOString() || data.updated_at,
        } as Job;

        // Record job view (async, don't wait)
        const userId = request.headers.get('x-user-id');
        if (userId) {
            addDoc(collection(db, 'job_views'), {
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

        const docRef = doc(db, 'jobs', id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists) {
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: 'Job not found' },
                { status: 404 }
            );
        }

        await updateDoc(docRef, {
            ...body,
            updated_at: Timestamp.now(),
        });

        const updatedSnap = await getDoc(docRef);
        const data = updatedSnap.data()!;
        const job: Job = {
            id: updatedSnap.id,
            ...data,
            post_date: data.post_date?.toDate?.()?.toISOString() || data.post_date,
            created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
            updated_at: data.updated_at?.toDate?.()?.toISOString() || data.updated_at,
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

        const docRef = doc(db, 'jobs', id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists) {
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: 'Job not found' },
                { status: 404 }
            );
        }

        await deleteDoc(docRef);

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
