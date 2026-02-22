'use client';

import React from 'react';

/**
 * Base Skeleton component with animation
 */
interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
    width?: string | number;
    height?: string | number;
    animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
    className = '',
    variant = 'text',
    width,
    height,
    animation = 'pulse'
}: SkeletonProps) {
    const baseClasses = 'bg-gray-200';

    const variantClasses = {
        text: 'rounded h-4',
        circular: 'rounded-full',
        rectangular: '',
        rounded: 'rounded-lg',
    };

    const animationClasses = {
        pulse: 'animate-pulse',
        wave: 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]',
        none: '',
    };

    const style: React.CSSProperties = {};
    if (width) style.width = typeof width === 'number' ? `${width}px` : width;
    if (height) style.height = typeof height === 'number' ? `${height}px` : height;

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
            style={style}
        />
    );
}

/**
 * Job Card Skeleton
 */
export function JobCardSkeleton() {
    return (
        <div className="bg-white rounded-xl p-4 shadow-skeu-raised">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <Skeleton variant="rounded" className="h-6 w-3/4 mb-2" />
                    <Skeleton variant="text" className="h-4 w-1/2" />
                </div>
                <Skeleton variant="circular" width={36} height={36} />
            </div>

            {/* Meta Info */}
            <div className="flex gap-4 mb-3">
                <Skeleton variant="text" className="h-4 w-20" />
                <Skeleton variant="text" className="h-4 w-24" />
            </div>

            {/* Salary */}
            <Skeleton variant="text" className="h-5 w-32 mb-3" />

            {/* Skills */}
            <div className="flex gap-2 mb-3">
                <Skeleton variant="rounded" className="h-6 w-16" />
                <Skeleton variant="rounded" className="h-6 w-20" />
                <Skeleton variant="rounded" className="h-6 w-14" />
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <Skeleton variant="text" className="h-4 w-24" />
                <Skeleton variant="rounded" className="h-8 w-20" />
            </div>
        </div>
    );
}

/**
 * Job List Skeleton
 */
export function JobListSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: count }).map((_, i) => (
                <JobCardSkeleton key={i} />
            ))}
        </div>
    );
}

/**
 * Profile Skeleton
 */
export function ProfileSkeleton() {
    return (
        <div className="max-w-2xl mx-auto p-4">
            {/* Avatar and Name */}
            <div className="flex items-center gap-4 mb-6">
                <Skeleton variant="circular" width={80} height={80} />
                <div className="flex-1">
                    <Skeleton variant="text" className="h-8 w-48 mb-2" />
                    <Skeleton variant="text" className="h-4 w-32" />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="text-center p-4 bg-white rounded-xl">
                        <Skeleton variant="text" className="h-8 w-16 mx-auto mb-2" />
                        <Skeleton variant="text" className="h-4 w-20 mx-auto" />
                    </div>
                ))}
            </div>

            {/* Sections */}
            {['Experience', 'Education', 'Skills'].map((section) => (
                <div key={section} className="mb-6">
                    <Skeleton variant="text" className="h-6 w-32 mb-4" />
                    <div className="space-y-3">
                        {[1, 2].map((i) => (
                            <div key={i} className="p-4 bg-white rounded-xl">
                                <Skeleton variant="text" className="h-5 w-3/4 mb-2" />
                                <Skeleton variant="text" className="h-4 w-1/2 mb-2" />
                                <Skeleton variant="text" className="h-3 w-full" />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

/**
 * Application Card Skeleton
 */
export function ApplicationCardSkeleton() {
    return (
        <div className="bg-white rounded-xl p-4 shadow-skeu-raised">
            <div className="flex items-start gap-4">
                <Skeleton variant="rounded" width={48} height={48} />
                <div className="flex-1">
                    <Skeleton variant="text" className="h-5 w-3/4 mb-2" />
                    <Skeleton variant="text" className="h-4 w-1/2 mb-2" />
                    <div className="flex gap-2">
                        <Skeleton variant="rounded" className="h-6 w-20" />
                        <Skeleton variant="text" className="h-4 w-24" />
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Notification Skeleton
 */
export function NotificationSkeleton() {
    return (
        <div className="flex items-start gap-3 p-4 border-b border-gray-100">
            <Skeleton variant="circular" width={40} height={40} />
            <div className="flex-1">
                <Skeleton variant="text" className="h-4 w-3/4 mb-1" />
                <Skeleton variant="text" className="h-3 w-full mb-1" />
                <Skeleton variant="text" className="h-3 w-1/4" />
            </div>
        </div>
    );
}

/**
 * Stats Card Skeleton
 */
export function StatsCardSkeleton() {
    return (
        <div className="bg-white rounded-xl p-4 shadow-skeu-raised text-center">
            <Skeleton variant="circular" width={48} height={48} className="mx-auto mb-2" />
            <Skeleton variant="text" className="h-7 w-16 mx-auto mb-1" />
            <Skeleton variant="text" className="h-4 w-20 mx-auto" />
        </div>
    );
}

/**
 * Search Results Skeleton
 */
export function SearchResultsSkeleton() {
    return (
        <div className="space-y-4">
            {/* Search bar skeleton */}
            <div className="bg-white rounded-xl p-4 shadow-skeu-raised">
                <div className="flex gap-3">
                    <Skeleton variant="rounded" className="h-10 flex-1" />
                    <Skeleton variant="rounded" className="h-10 w-32" />
                    <Skeleton variant="rounded" className="h-10 w-24" />
                </div>
            </div>

            {/* Results */}
            <JobListSkeleton count={6} />
        </div>
    );
}

/**
 * Table Row Skeleton
 */
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
    return (
        <tr>
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} className="p-4">
                    <Skeleton variant="text" className="h-4 w-full" />
                </td>
            ))}
        </tr>
    );
}

/**
 * Full Page Loading Skeleton
 */
export function PageSkeleton() {
    return (
        <div className="min-h-screen bg-skeu-light p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Skeleton variant="rounded" width={40} height={40} />
                    <Skeleton variant="text" className="h-8 w-24" />
                </div>
                <div className="flex gap-2">
                    <Skeleton variant="circular" width={36} height={36} />
                    <Skeleton variant="circular" width={36} height={36} />
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto">
                <SearchResultsSkeleton />
            </div>
        </div>
    );
}

/**
 * Loading overlay component
 */
export function LoadingOverlay({ message = 'Loading...' }: { message?: string }) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 shadow-xl text-center">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-skeu-dark font-medium">{message}</p>
            </div>
        </div>
    );
}

export default {
    Skeleton,
    JobCardSkeleton,
    JobListSkeleton,
    ProfileSkeleton,
    ApplicationCardSkeleton,
    NotificationSkeleton,
    StatsCardSkeleton,
    SearchResultsSkeleton,
    TableRowSkeleton,
    PageSkeleton,
    LoadingOverlay,
};
