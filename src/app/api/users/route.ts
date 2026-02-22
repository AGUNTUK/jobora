import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { User, ApiResponse } from '@/types/database';
import { Timestamp } from 'firebase-admin/firestore';

// GET /api/users - Fetch current user profile
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

        const docRef = db.collection('users').doc(userId);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        const data = docSnap.data();
        const user: User = {
            id: docSnap.id,
            ...data,
            created_at: data?.created_at?.toDate?.()?.toISOString() || data?.created_at,
            updated_at: data?.updated_at?.toDate?.()?.toISOString() || data?.updated_at,
            last_active: data?.last_active?.toDate?.()?.toISOString() || data?.last_active,
        } as User;

        return NextResponse.json<ApiResponse<User>>(
            { success: true, data: user }
        );
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json<ApiResponse<null>>(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/users - Create a new user
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
        const now = Timestamp.now();

        const userData = {
            id: userId,
            email: body.email || '',
            name: body.name || '',
            phone: body.phone || '',
            avatar_url: body.avatar_url || '',
            skills: body.skills || [],
            experience: body.experience || [],
            education: body.education || [],
            preferred_locations: body.preferred_locations || [],
            salary_expectation: body.salary_expectation || { min: 0, max: 0, currency: 'BDT', period: 'monthly' },
            job_types: body.job_types || [],
            created_at: now,
            updated_at: now,
            last_active: now,
            onboarding_completed: false,
        };

        await db.collection('users').doc(userId).set(userData);

        // Create initial gamification record
        await db.collection('gamification').doc(userId).set({
            user_id: userId,
            total_points: 0,
            current_level: 1,
            streak_days: 0,
            last_activity_date: now,
            badges: [],
            achievements: [],
            referrals: [],
            created_at: now,
            updated_at: now,
        });

        const user: User = {
            ...userData,
            created_at: now.toDate().toISOString(),
            updated_at: now.toDate().toISOString(),
            last_active: now.toDate().toISOString(),
        };

        return NextResponse.json<ApiResponse<User>>(
            { success: true, data: user, message: 'User created successfully' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json<ApiResponse<null>>(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT /api/users - Update user profile
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
        const docRef = db.collection('users').doc(userId);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        const updateData = {
            ...body,
            updated_at: Timestamp.now(),
            last_active: Timestamp.now(),
        };

        await docRef.update(updateData);

        const updatedSnap = await docRef.get();
        const data = updatedSnap.data();
        const user: User = {
            id: updatedSnap.id,
            ...data,
            created_at: data?.created_at?.toDate?.()?.toISOString() || data?.created_at,
            updated_at: data?.updated_at?.toDate?.()?.toISOString() || data?.updated_at,
            last_active: data?.last_active?.toDate?.()?.toISOString() || data?.last_active,
        } as User;

        return NextResponse.json<ApiResponse<User>>(
            { success: true, data: user, message: 'User updated successfully' }
        );
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json<ApiResponse<null>>(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/users - Delete user account
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

        // Delete user document
        await db.collection('users').doc(userId).delete();

        // Delete related data
        await db.collection('gamification').doc(userId).delete();

        // Delete user's job applications
        const applicationsSnapshot = await db
            .collection('applied_jobs')
            .where('user_id', '==', userId)
            .get();

        const batch = db.batch();
        applicationsSnapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();

        return NextResponse.json<ApiResponse<null>>(
            { success: true, message: 'User account deleted successfully' }
        );
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json<ApiResponse<null>>(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
