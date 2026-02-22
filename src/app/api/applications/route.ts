import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { AppliedJob, ApiResponse, PaginatedResponse } from '@/types/database';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, startAfter, Timestamp, QueryConstraint } from 'firebase-admin/firestore';

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

        // Build query constraints
        const constraints: QueryConstraint[] = [
            where('user_id', '==', userId),
            orderBy('created_at', 'desc'),
            limit(perPage),
        ];

        if (status) {
            constraints.splice(1, 0, where('status', '==', status));
        }

        const applicationsRef = collection(db, 'applied_jobs');
        const q = query(applicationsRef, ...constraints);
        const snapshot = await getDocs(q);

        // Get total count
        const countConstraints: QueryConstraint[] = [where('user_id', '==', userId)];
        if (status) {
            countConstraints.push(where('status', '==', status));
        }
        const countQuery = query(applicationsRef, ...countConstraints);
        const countSnapshot = await getDocs(countQuery);
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
        const existingQuery = query(
            collection(db, 'applied_jobs'),
            where('user_id', '==', userId),
            where('job_id', '==', job_id)
        );
        const existingSnapshot = await getDocs(existingQuery);

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

        const docRef = await addDoc(collection(db, 'applied_jobs'), applicationData);

        // Add gamification points if applied
        if (status === 'applied') {
            const gamificationRef = doc(db, 'gamification', userId);
            const gamificationSnap = await getDoc(gamificationRef);

            if (gamificationSnap.exists) {
                const currentPoints = gamificationSnap.data()?.total_points || 0;
                await updateDoc(gamificationRef, {
                    total_points: currentPoints + 10,
                    updated_at: now,
                });
            }
        }

        const application: AppliedJob = {
            id: docRef.id,
            ...applicationData,
            applied_at: applicationData.applied_at?.toDate?.()?.toISOString() || null,
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

        const docRef = doc(db, 'applied_jobs', id);
        const docSnap = await getDoc(docRef);

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

        await updateDoc(docRef, updateData);

        const updatedSnap = await getDoc(docRef);
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

        const docRef = doc(db, 'applied_jobs', id);
        const docSnap = await getDoc(docRef);

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

        await deleteDoc(docRef);

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
