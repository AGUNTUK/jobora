import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { Job, ApiResponse, PaginatedResponse } from '@/types/database';
import { collection, query, where, orderBy, limit, startAfter, getDocs, addDoc, Timestamp, QueryConstraint, DocumentSnapshot, DocumentData } from 'firebase-admin/firestore';

// GET /api/jobs - Fetch jobs with filters and pagination
export async function GET(request: NextRequest) {
    try {
        const db = getAdminDb();
        const searchParams = request.nextUrl.searchParams;

        // Pagination
        const page = parseInt(searchParams.get('page') || '1');
        const perPage = parseInt(searchParams.get('per_page') || '20');

        // Build query constraints
        const constraints: QueryConstraint[] = [];
        constraints.push(where('is_fraud', '==', false));

        // Apply filters
        const keywords = searchParams.get('keywords');
        if (keywords) {
            // Note: Firestore doesn't support OR queries across fields easily
            // For production, consider using Algolia or similar for full-text search
            constraints.push(where('keywords', 'array-contains', keywords.toLowerCase()));
        }

        const location = searchParams.get('location');
        if (location) {
            constraints.push(where('location', '==', location));
        }

        const jobType = searchParams.get('job_type');
        if (jobType) {
            constraints.push(where('job_type', 'in', jobType.split(',')));
        }

        const category = searchParams.get('category');
        if (category) {
            constraints.push(where('category', '==', category));
        }

        const experienceLevel = searchParams.get('experience_level');
        if (experienceLevel) {
            constraints.push(where('experience_level', 'in', experienceLevel.split(',')));
        }

        const salaryMin = searchParams.get('salary_min');
        if (salaryMin) {
            constraints.push(where('salary_max', '>=', parseInt(salaryMin)));
        }

        const salaryMax = searchParams.get('salary_max');
        if (salaryMax) {
            constraints.push(where('salary_min', '<=', parseInt(salaryMax)));
        }

        const isRemote = searchParams.get('is_remote');
        if (isRemote === 'true') {
            constraints.push(where('is_remote', '==', true));
        }

        const source = searchParams.get('source');
        if (source) {
            constraints.push(where('source_name', 'in', source.split(',')));
        }

        // Sorting
        const sortBy = searchParams.get('sort_by') || 'post_date';
        const sortOrder = searchParams.get('sort_order') || 'desc';

        if (sortBy === 'relevance') {
            constraints.push(orderBy('relevance_score', sortOrder === 'asc' ? 'asc' : 'desc'));
        } else if (sortBy === 'salary') {
            constraints.push(orderBy('salary_max', sortOrder === 'asc' ? 'asc' : 'desc'));
        } else {
            constraints.push(orderBy('post_date', sortOrder === 'asc' ? 'asc' : 'desc'));
        }

        // Apply pagination limit
        constraints.push(limit(perPage));

        // Execute query
        const jobsRef = collection(db, 'jobs');
        const q = query(jobsRef, ...constraints);
        const snapshot = await getDocs(q);

        // Get total count (separate query for counting)
        const countQuery = query(jobsRef, where('is_fraud', '==', false));
        const countSnapshot = await getDocs(countQuery);
        const total = countSnapshot.size;

        // Transform documents
        const jobs: Job[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            post_date: doc.data().post_date?.toDate?.()?.toISOString() || doc.data().post_date,
            created_at: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().created_at,
            updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || doc.data().updated_at,
        })) as Job[];

        const response: PaginatedResponse<Job> = {
            data: jobs,
            total,
            page,
            per_page: perPage,
            total_pages: Math.ceil(total / perPage),
        };

        return NextResponse.json<ApiResponse<PaginatedResponse<Job>>>(
            { success: true, data: response }
        );
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return NextResponse.json<ApiResponse<null>>(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/jobs - Create a new job (admin only)
export async function POST(request: NextRequest) {
    try {
        const db = getAdminDb();
        const body = await request.json();

        const now = Timestamp.now();
        const jobData = {
            ...body,
            created_at: now,
            updated_at: now,
        };

        const docRef = await addDoc(collection(db, 'jobs'), jobData);

        const job: Job = {
            id: docRef.id,
            ...jobData,
            created_at: now.toDate().toISOString(),
            updated_at: now.toDate().toISOString(),
        };

        return NextResponse.json<ApiResponse<Job>>(
            { success: true, data: job, message: 'Job created successfully' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating job:', error);
        return NextResponse.json<ApiResponse<null>>(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
