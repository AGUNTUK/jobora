import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { User, ApiResponse } from '@/types/database';
import { collection, doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase-admin/firestore';

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

        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);

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
            created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
            updated_at: data.updated_at?.toDate?.()?.toISOString() || data.updated_at,
            last_active: data.last_active?.toDate?.()?.toISOString() || data.last_active,
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
        const body = await request.json();
        const userId = body.id || request.headers.get('x-user-id');

        if (!userId) {
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: 'User ID required' },
                { status: 400 }
            );
        }

        const now = Timestamp.now();
        const userData = {
            ...body,
            id: userId,
            created_at: now,
            updated_at: now,
            last_active: now,
            onboarding_completed: false,
            skills: body.skills || [],
            experience: body.experience || [],
            education: body.education || [],
            preferred_locations: body.preferred_locations || [],
            job_types: body.job_types || [],
        };

        await setDoc(doc(db, 'users', userId), userData);

        // Create gamification record for new user
        await setDoc(doc(db, 'gamification', userId), {
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
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists) {
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        await updateDoc(docRef, {
            ...body,
            updated_at: Timestamp.now(),
        });

        const updatedSnap = await getDoc(docRef);
        const data = updatedSnap.data()!;
        const user: User = {
            id: updatedSnap.id,
            ...data,
            created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
            updated_at: data.updated_at?.toDate?.()?.toISOString() || data.updated_at,
            last_active: data.last_active?.toDate?.()?.toISOString() || data.last_active,
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
