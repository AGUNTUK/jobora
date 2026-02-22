import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { Job, ApiResponse, PaginatedResponse } from '@/types/database';
import { Timestamp } from 'firebase-admin/firestore';

// GET /api/jobs - Fetch jobs with filters and pagination
export async function GET(request: NextRequest) {
    try {
        const db = getAdminDb();
        const searchParams = request.nextUrl.searchParams;

        // Pagination
        const page = parseInt(searchParams.get('page') || '1');
        const perPage = parseInt(searchParams.get('per_page') || '20');

        // Build query
        let query = db.collection('jobs').where('is_fraud', '==', false);

        // Apply filters
        const keywords = searchParams.get('keywords');
        if (keywords) {
            query = query.where('keywords', 'array-contains', keywords.toLowerCase());
        }

        const location = searchParams.get('location');
        if (location) {
            query = query.where('location', '==', location);
        }

        const jobType = searchParams.get('job_type');
        if (jobType) {
            query = query.where('job_type', 'in', jobType.split(','));
        }

        const category = searchParams.get('category');
        if (category) {
            query = query.where('category', '==', category);
        }

        const experienceLevel = searchParams.get('experience_level');
        if (experienceLevel) {
            query = query.where('experience_level', 'in', experienceLevel.split(','));
        }

        const salaryMin = searchParams.get('salary_min');
        if (salaryMin) {
            query = query.where('salary_max', '>=', parseInt(salaryMin));
        }

        const salaryMax = searchParams.get('salary_max');
        if (salaryMax) {
            query = query.where('salary_min', '<=', parseInt(salaryMax));
        }

        const isRemote = searchParams.get('is_remote');
        if (isRemote === 'true') {
            query = query.where('is_remote', '==', true);
        }

        const source = searchParams.get('source');
        if (source) {
            query = query.where('source_name', 'in', source.split(','));
        }

        // Sorting
        const sortBy = searchParams.get('sort_by') || 'post_date';
        const sortOrder = searchParams.get('sort_order') || 'desc';

        if (sortBy === 'relevance') {
            query = query.orderBy('relevance_score', sortOrder === 'asc' ? 'asc' : 'desc');
        } else if (sortBy === 'salary') {
            query = query.orderBy('salary_max', sortOrder === 'asc' ? 'asc' : 'desc');
        } else {
            query = query.orderBy('post_date', sortOrder === 'asc' ? 'asc' : 'desc');
        }

        // Apply pagination limit
        query = query.limit(perPage);

        // Execute query
        const snapshot = await query.get();

        // Get total count (separate query for counting)
        const countSnapshot = await db.collection('jobs').where('is_fraud', '==', false).get();
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

        const docRef = await db.collection('jobs').add(jobData);

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
