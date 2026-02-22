import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Format salary for display
export function formatSalary(
    min?: number,
    max?: number,
    currency: string = 'BDT',
    period: string = 'monthly'
): string {
    const formatNumber = (num: number) => {
        if (num >= 100000) {
            return `${(num / 100000).toFixed(1)}L`;
        } else if (num >= 1000) {
            return `${(num / 1000).toFixed(0)}K`;
        }
        return num.toString();
    };

    const periodLabel = period === 'monthly' ? '/mo' : period === 'yearly' ? '/yr' : '/hr';

    if (min && max) {
        return `${currency} ${formatNumber(min)} - ${formatNumber(max)}${periodLabel}`;
    } else if (min) {
        return `${currency} ${formatNumber(min)}+${periodLabel}`;
    } else if (max) {
        return `Up to ${currency} ${formatNumber(max)}${periodLabel}`;
    }
    return 'Salary not specified';
}

// Format date for display
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return date.toLocaleDateString('en-BD', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Calculate time until deadline
export function formatDeadline(deadlineString: string): string {
    const deadline = new Date(deadlineString);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Expires today';
    if (diffDays === 1) return '1 day left';
    if (diffDays < 7) return `${diffDays} days left`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks left`;
    return deadline.toLocaleDateString('en-BD', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

// Generate unique ID
export function generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return (...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// Throttle function
export function throttle<T extends (...args: unknown[]) => unknown>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;

    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

// Local storage helpers with SSR safety
export const storage = {
    get: <T>(key: string, defaultValue: T): T => {
        if (typeof window === 'undefined') return defaultValue;
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch {
            return defaultValue;
        }
    },
    set: <T>(key: string, value: T): void => {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {
            console.error('Failed to save to localStorage');
        }
    },
    remove: (key: string): void => {
        if (typeof window === 'undefined') return;
        try {
            localStorage.removeItem(key);
        } catch {
            console.error('Failed to remove from localStorage');
        }
    },
};

// Calculate level from points
export function calculateLevel(points: number): { level: number; title: string; nextLevelPoints: number } {
    const levels = [
        { level: 1, title: 'Job Seeker', minPoints: 0 },
        { level: 2, title: 'Active Searcher', minPoints: 100 },
        { level: 3, title: 'Career Explorer', minPoints: 300 },
        { level: 4, title: 'Job Hunter', minPoints: 600 },
        { level: 5, title: 'Professional', minPoints: 1000 },
        { level: 6, title: 'Expert', minPoints: 1500 },
        { level: 7, title: 'Master', minPoints: 2500 },
        { level: 8, title: 'Legend', minPoints: 4000 },
        { level: 9, title: 'Champion', minPoints: 6000 },
        { level: 10, title: 'Jobora Elite', minPoints: 10000 },
    ];

    let currentLevel = levels[0];
    let nextLevel = levels[1];

    for (let i = levels.length - 1; i >= 0; i--) {
        if (points >= levels[i].minPoints) {
            currentLevel = levels[i];
            nextLevel = levels[i + 1] || levels[i];
            break;
        }
    }

    return {
        level: currentLevel.level,
        title: currentLevel.title,
        nextLevelPoints: nextLevel.minPoints,
    };
}

// Badge tier from points
export function getBadgeTier(points: number): 'bronze' | 'silver' | 'gold' | 'platinum' {
    if (points >= 5000) return 'platinum';
    if (points >= 2000) return 'gold';
    if (points >= 500) return 'silver';
    return 'bronze';
}

// Validate email
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate phone (Bangladesh format)
export function isValidPhone(phone: string): boolean {
    const phoneRegex = /^(\+?880|0)?1[3-9]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Format phone number
export function formatPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('880')) {
        return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 8)} ${cleaned.slice(8)}`;
    } else if (cleaned.startsWith('0')) {
        return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
    }
    return phone;
}

// Get initials from name
export function getInitials(name: string): string {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

// Parse salary string to numbers
export function parseSalaryString(salaryString: string): { min: number; max: number } | null {
    const numbers = salaryString.match(/\d+/g);
    if (!numbers || numbers.length === 0) return null;

    const values = numbers.map(n => parseInt(n, 10));

    // Check for L (lakh) or K (thousand) multipliers
    const hasLakh = /l|lakh/i.test(salaryString);
    const hasK = /k|thousand/i.test(salaryString);

    const multiplier = hasLakh ? 100000 : hasK ? 1000 : 1;

    return {
        min: Math.min(...values) * multiplier,
        max: Math.max(...values) * multiplier,
    };
}

// Calculate distance between two coordinates (in km)
export function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
