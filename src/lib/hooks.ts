'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Debounced value hook
 * Returns a debounced version of the input value
 */
export function useDebouncedValue<T>(value: T, delay: number = 300): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}

/**
 * Debounced callback hook
 * Returns a debounced version of the callback function
 */
export function useDebouncedCallback<T extends (...args: never[]) => void>(
    callback: T,
    delay: number = 300
): (...args: Parameters<T>) => void {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const debouncedCallback = useCallback(
        (...args: Parameters<T>) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        },
        [callback, delay]
    );

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return debouncedCallback;
}

/**
 * Throttled callback hook
 * Returns a throttled version of the callback function
 */
export function useThrottledCallback<T extends (...args: never[]) => void>(
    callback: T,
    delay: number = 300
): (...args: Parameters<T>) => void {
    const lastRanRef = useRef<number>(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const throttledCallback = useCallback(
        (...args: Parameters<T>) => {
            const now = Date.now();
            const timeSinceLastRan = now - lastRanRef.current;

            if (timeSinceLastRan >= delay) {
                callback(...args);
                lastRanRef.current = now;
            } else {
                // Schedule to run at the end of the delay
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
                timeoutRef.current = setTimeout(() => {
                    callback(...args);
                    lastRanRef.current = Date.now();
                }, delay - timeSinceLastRan);
            }
        },
        [callback, delay]
    );

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return throttledCallback;
}

/**
 * Search hook with debouncing
 * Manages search state and provides debounced search functionality
 */
interface UseSearchOptions {
    debounceDelay?: number;
    minChars?: number;
    onSearch?: (query: string) => void | Promise<void>;
}

export function useSearch(options: UseSearchOptions = {}) {
    const { debounceDelay = 300, minChars = 2, onSearch } = options;

    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);

    const debouncedQuery = useDebouncedValue(query, debounceDelay);
    const previousQueryRef = useRef<string>('');

    // Execute search when debounced query changes
    useEffect(() => {
        if (debouncedQuery !== previousQueryRef.current) {
            previousQueryRef.current = debouncedQuery;

            if (debouncedQuery.length >= minChars && onSearch) {
                setIsSearching(true);
                Promise.resolve(onSearch(debouncedQuery))
                    .finally(() => setIsSearching(false));
            }
        }
    }, [debouncedQuery, minChars, onSearch]);

    // Add to search history
    const addToHistory = useCallback((searchQuery: string) => {
        if (searchQuery.trim().length >= minChars) {
            setSearchHistory(prev => {
                const filtered = prev.filter(q => q !== searchQuery);
                return [searchQuery, ...filtered].slice(0, 10); // Keep last 10 searches
            });
        }
    }, [minChars]);

    // Clear search history
    const clearHistory = useCallback(() => {
        setSearchHistory([]);
    }, []);

    // Clear current search
    const clearSearch = useCallback(() => {
        setQuery('');
    }, []);

    return {
        query,
        setQuery,
        debouncedQuery,
        isSearching,
        searchHistory,
        addToHistory,
        clearHistory,
        clearSearch,
    };
}

/**
 * Local storage hook with SSR safety
 */
export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    const setValue = useCallback((value: T | ((prev: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, storedValue]);

    return [storedValue, setValue];
}

/**
 * Media query hook
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const media = window.matchMedia(query);
        setMatches(media.matches);

        const listener = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, [query]);

    return matches;
}

/**
 * Common breakpoint hooks
 */
export function useIsMobile(): boolean {
    return useMediaQuery('(max-width: 639px)');
}

export function useIsTablet(): boolean {
    return useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
}

export function useIsDesktop(): boolean {
    return useMediaQuery('(min-width: 1024px)');
}

/**
 * Online status hook
 */
export function useOnlineStatus(): boolean {
    const [isOnline, setIsOnline] = useState(
        typeof navigator !== 'undefined' ? navigator.onLine : true
    );

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return isOnline;
}

/**
 * Click outside hook
 */
export function useClickOutside<T extends HTMLElement>(
    callback: () => void
): React.RefObject<T> {
    const ref = useRef<T>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [callback]);

    return ref;
}

/**
 * Intersection observer hook
 */
export function useIntersectionObserver(
    options: IntersectionObserverInit = {}
): [React.RefObject<HTMLDivElement>, boolean] {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting);
        }, options);

        observer.observe(element);
        return () => observer.disconnect();
    }, [options]);

    return [ref, isIntersecting];
}

/**
 * Infinite scroll hook
 */
interface UseInfiniteScrollOptions {
    onLoadMore: () => void | Promise<void>;
    hasMore: boolean;
    threshold?: number;
}

export function useInfiniteScroll(options: UseInfiniteScrollOptions) {
    const { onLoadMore, hasMore, threshold = 100 } = options;
    const [isLoading, setIsLoading] = useState(false);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = loadMoreRef.current;
        if (!element || !hasMore) return;

        const observer = new IntersectionObserver(
            async (entries) => {
                if (entries[0].isIntersecting && !isLoading) {
                    setIsLoading(true);
                    try {
                        await Promise.resolve(onLoadMore());
                    } finally {
                        setIsLoading(false);
                    }
                }
            },
            { rootMargin: `${threshold}px` }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [hasMore, isLoading, onLoadMore, threshold]);

    return { loadMoreRef, isLoading };
}

export default {
    useDebouncedValue,
    useDebouncedCallback,
    useThrottledCallback,
    useSearch,
    useLocalStorage,
    useMediaQuery,
    useIsMobile,
    useIsTablet,
    useIsDesktop,
    useOnlineStatus,
    useClickOutside,
    useIntersectionObserver,
    useInfiniteScroll,
};
