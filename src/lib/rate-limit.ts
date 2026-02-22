/**
 * Rate Limiting Middleware for API Routes
 * 
 * Provides in-memory rate limiting for API endpoints.
 * For production, consider using Redis or Vercel Edge Config.
 */

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

interface RateLimitConfig {
    /** Maximum number of requests allowed in the window */
    limit: number;
    /** Time window in milliseconds */
    windowMs: number;
    /** Key generator function (default: IP-based) */
    keyGenerator?: (request: Request) => string;
    /** Custom error message */
    message?: string;
    /** Include rate limit headers in response */
    standardHeaders?: boolean;
}

// In-memory store for rate limit entries
// Note: This will reset on server restart. Use Redis for production.
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every minute
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        rateLimitStore.forEach((entry, key) => {
            if (now > entry.resetTime) {
                rateLimitStore.delete(key);
            }
        });
    }, 60000);
}

/**
 * Default key generator using IP address
 */
function defaultKeyGenerator(request: Request): string {
    // Try various headers for IP address
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfIp = request.headers.get('cf-connecting-ip');

    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }
    if (realIp) {
        return realIp;
    }
    if (cfIp) {
        return cfIp;
    }

    // Fallback to a default key (not ideal for production)
    return 'unknown-ip';
}

/**
 * Rate limit result
 */
export interface RateLimitResult {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
    error?: string;
}

/**
 * Check rate limit for a request
 */
export function checkRateLimit(
    request: Request,
    config: RateLimitConfig
): RateLimitResult {
    const {
        limit,
        windowMs,
        keyGenerator = defaultKeyGenerator,
        standardHeaders = true,
    } = config;

    const key = keyGenerator(request);
    const now = Date.now();

    // Get or create entry
    let entry = rateLimitStore.get(key);

    // Reset if window has passed
    if (!entry || now > entry.resetTime) {
        entry = {
            count: 0,
            resetTime: now + windowMs,
        };
    }

    // Increment count
    entry.count++;
    rateLimitStore.set(key, entry);

    const remaining = Math.max(0, limit - entry.count);
    const reset = Math.ceil(entry.resetTime / 1000);

    return {
        success: entry.count <= limit,
        limit,
        remaining,
        reset,
        error: entry.count > limit
            ? config.message || 'Too many requests, please try again later.'
            : undefined,
    };
}

/**
 * Create rate limit headers for response
 */
export function createRateLimitHeaders(result: RateLimitResult): Headers {
    const headers = new Headers();
    headers.set('X-RateLimit-Limit', String(result.limit));
    headers.set('X-RateLimit-Remaining', String(result.remaining));
    headers.set('X-RateLimit-Reset', String(result.reset));
    return headers;
}

/**
 * Higher-order function to wrap API handlers with rate limiting
 */
export function withRateLimit(
    handler: (request: Request) => Promise<Response>,
    config: RateLimitConfig
) {
    return async (request: Request): Promise<Response> => {
        const result = checkRateLimit(request, config);

        if (!result.success) {
            const headers = createRateLimitHeaders(result);
            headers.set('Content-Type', 'application/json');

            return new Response(
                JSON.stringify({
                    success: false,
                    error: result.error,
                    retryAfter: result.reset - Math.ceil(Date.now() / 1000),
                }),
                {
                    status: 429,
                    headers,
                }
            );
        }

        const response = await handler(request);

        // Add rate limit headers to successful response
        const headers = createRateLimitHeaders(result);
        response.headers.forEach((value, key) => {
            headers.set(key, value);
        });

        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers,
        });
    };
}

/**
 * Pre-configured rate limiters for common use cases
 */
export const rateLimiters = {
    /** Strict rate limit for authentication endpoints */
    auth: {
        limit: 5,
        windowMs: 60 * 1000, // 5 requests per minute
        message: 'Too many authentication attempts. Please try again later.',
    },

    /** Standard rate limit for API endpoints */
    api: {
        limit: 60,
        windowMs: 60 * 1000, // 60 requests per minute
        message: 'API rate limit exceeded. Please slow down.',
    },

    /** Relaxed rate limit for read operations */
    read: {
        limit: 100,
        windowMs: 60 * 1000, // 100 requests per minute
        message: 'Too many requests. Please wait before fetching more data.',
    },

    /** Strict rate limit for write operations */
    write: {
        limit: 20,
        windowMs: 60 * 1000, // 20 requests per minute
        message: 'Too many write operations. Please wait before submitting.',
    },

    /** Very strict rate limit for AI endpoints */
    ai: {
        limit: 10,
        windowMs: 60 * 1000, // 10 requests per minute
        message: 'AI request limit reached. Please wait before making more AI requests.',
    },

    /** Rate limit for scraping endpoints */
    scrape: {
        limit: 3,
        windowMs: 60 * 60 * 1000, // 3 requests per hour
        message: 'Scraping rate limit exceeded. Please wait before triggering another scrape.',
    },
};

/**
 * Rate limit middleware for Next.js API routes
 */
export function rateLimitMiddleware(config: RateLimitConfig) {
    return (request: Request): RateLimitResult => {
        return checkRateLimit(request, config);
    };
}

export default {
    checkRateLimit,
    createRateLimitHeaders,
    withRateLimit,
    rateLimiters,
    rateLimitMiddleware,
};
