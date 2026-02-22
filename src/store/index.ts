import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Job, User, AppliedJob, Notification, Gamification, JobFilters } from '@/types/database';

// Auth Store
interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isLoading: true,
            setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
            setLoading: (loading) => set({ isLoading: loading }),
            logout: () => set({ user: null, isAuthenticated: false }),
        }),
        {
            name: 'jobora-auth',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
        }
    )
);

// Jobs Store
interface JobsState {
    jobs: Job[];
    filteredJobs: Job[];
    savedJobs: string[];
    currentJob: Job | null;
    filters: JobFilters;
    sortBy: 'relevance' | 'date' | 'salary';
    isLoading: boolean;
    page: number;
    hasMore: boolean;
    setJobs: (jobs: Job[]) => void;
    addJobs: (jobs: Job[]) => void;
    setCurrentJob: (job: Job | null) => void;
    setFilters: (filters: JobFilters) => void;
    setSortBy: (sort: 'relevance' | 'date' | 'salary') => void;
    setLoading: (loading: boolean) => void;
    setPage: (page: number) => void;
    setHasMore: (hasMore: boolean) => void;
    toggleSaveJob: (jobId: string) => void;
    resetFilters: () => void;
}

const defaultFilters: JobFilters = {
    keywords: '',
    location: '',
    job_type: [],
    salary_min: undefined,
    salary_max: undefined,
    experience_level: [],
    category: '',
    industry: '',
    is_remote: undefined,
    posted_within: 30,
    source: [],
};

export const useJobsStore = create<JobsState>()(
    persist(
        (set, get) => ({
            jobs: [],
            filteredJobs: [],
            savedJobs: [],
            currentJob: null,
            filters: defaultFilters,
            sortBy: 'relevance',
            isLoading: false,
            page: 1,
            hasMore: true,
            setJobs: (jobs) => set({ jobs, filteredJobs: jobs, page: 1, hasMore: true }),
            addJobs: (jobs) => set((state) => ({
                jobs: [...state.jobs, ...jobs],
                filteredJobs: [...state.filteredJobs, ...jobs],
            })),
            setCurrentJob: (job) => set({ currentJob: job }),
            setFilters: (filters) => set({ filters, page: 1 }),
            setSortBy: (sortBy) => set({ sortBy }),
            setLoading: (loading) => set({ isLoading: loading }),
            setPage: (page) => set({ page }),
            setHasMore: (hasMore) => set({ hasMore }),
            toggleSaveJob: (jobId) => set((state) => ({
                savedJobs: state.savedJobs.includes(jobId)
                    ? state.savedJobs.filter(id => id !== jobId)
                    : [...state.savedJobs, jobId],
            })),
            resetFilters: () => set({ filters: defaultFilters, page: 1 }),
        }),
        {
            name: 'jobora-jobs',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ savedJobs: state.savedJobs, filters: state.filters }),
        }
    )
);

// Applications Store
interface ApplicationsState {
    applications: AppliedJob[];
    isLoading: boolean;
    setApplications: (applications: AppliedJob[]) => void;
    addApplication: (application: AppliedJob) => void;
    updateApplication: (id: string, updates: Partial<AppliedJob>) => void;
    removeApplication: (id: string) => void;
    setLoading: (loading: boolean) => void;
}

export const useApplicationsStore = create<ApplicationsState>()(
    persist(
        (set, get) => ({
            applications: [],
            isLoading: false,
            setApplications: (applications) => set({ applications }),
            addApplication: (application) => set((state) => ({
                applications: [...state.applications, application],
            })),
            updateApplication: (id, updates) => set((state) => ({
                applications: state.applications.map(app =>
                    app.id === id ? { ...app, ...updates } : app
                ),
            })),
            removeApplication: (id) => set((state) => ({
                applications: state.applications.filter(app => app.id !== id),
            })),
            setLoading: (loading) => set({ isLoading: loading }),
        }),
        {
            name: 'jobora-applications',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

// Notifications Store
interface NotificationsState {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    setNotifications: (notifications: Notification[]) => void;
    addNotification: (notification: Notification) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    removeNotification: (id: string) => void;
    setLoading: (loading: boolean) => void;
}

export const useNotificationsStore = create<NotificationsState>()(
    persist(
        (set, get) => ({
            notifications: [],
            unreadCount: 0,
            isLoading: false,
            setNotifications: (notifications) => set({
                notifications,
                unreadCount: notifications.filter(n => !n.read).length,
            }),
            addNotification: (notification) => set((state) => ({
                notifications: [notification, ...state.notifications],
                unreadCount: state.unreadCount + 1,
            })),
            markAsRead: (id) => set((state) => ({
                notifications: state.notifications.map(n =>
                    n.id === id ? { ...n, read: true, read_at: new Date().toISOString() } : n
                ),
                unreadCount: Math.max(0, state.unreadCount - 1),
            })),
            markAllAsRead: () => set((state) => ({
                notifications: state.notifications.map(n => ({ ...n, read: true })),
                unreadCount: 0,
            })),
            removeNotification: (id) => set((state) => ({
                notifications: state.notifications.filter(n => n.id !== id),
            })),
            setLoading: (loading) => set({ isLoading: loading }),
        }),
        {
            name: 'jobora-notifications',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ notifications: state.notifications.slice(0, 50) }),
        }
    )
);

// Gamification Store
interface GamificationState {
    gamification: Gamification | null;
    isLoading: boolean;
    setGamification: (gamification: Gamification | null) => void;
    addPoints: (points: number) => void;
    incrementStreak: () => void;
    resetStreak: () => void;
    addBadge: (badge: { id: string; name: string; description: string; icon: string; tier: 'bronze' | 'silver' | 'gold' | 'platinum'; category: string }) => void;
    addAchievement: (achievement: { id: string; name: string; description: string; points: number; icon: string; category: string }) => void;
    setLoading: (loading: boolean) => void;
}

export const useGamificationStore = create<GamificationState>()(
    persist(
        (set, get) => ({
            gamification: null,
            isLoading: false,
            setGamification: (gamification) => set({ gamification }),
            addPoints: (points) => set((state) => {
                if (!state.gamification) return state;
                return {
                    gamification: {
                        ...state.gamification,
                        total_points: state.gamification.total_points + points,
                    },
                };
            }),
            incrementStreak: () => set((state) => {
                if (!state.gamification) return state;
                return {
                    gamification: {
                        ...state.gamification,
                        streak_days: state.gamification.streak_days + 1,
                        last_activity_date: new Date().toISOString().split('T')[0],
                    },
                };
            }),
            resetStreak: () => set((state) => {
                if (!state.gamification) return state;
                return {
                    gamification: {
                        ...state.gamification,
                        streak_days: 0,
                    },
                };
            }),
            addBadge: (badge) => set((state) => {
                if (!state.gamification) return state;
                return {
                    gamification: {
                        ...state.gamification,
                        badges: [...state.gamification.badges, { ...badge, earned_at: new Date().toISOString() }],
                    },
                };
            }),
            addAchievement: (achievement) => set((state) => {
                if (!state.gamification) return state;
                return {
                    gamification: {
                        ...state.gamification,
                        achievements: [...state.gamification.achievements, { ...achievement, earned_at: new Date().toISOString() }],
                        total_points: state.gamification.total_points + achievement.points,
                    },
                };
            }),
            setLoading: (loading) => set({ isLoading: loading }),
        }),
        {
            name: 'jobora-gamification',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

// UI Store
interface UIState {
    isSearchOpen: boolean;
    isFilterOpen: boolean;
    isMenuOpen: boolean;
    activeTab: string;
    toggleSearch: () => void;
    toggleFilter: () => void;
    toggleMenu: () => void;
    setActiveTab: (tab: string) => void;
    closeAll: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    isSearchOpen: false,
    isFilterOpen: false,
    isMenuOpen: false,
    activeTab: 'home',
    toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen, isFilterOpen: false, isMenuOpen: false })),
    toggleFilter: () => set((state) => ({ isFilterOpen: !state.isFilterOpen, isSearchOpen: false, isMenuOpen: false })),
    toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen, isSearchOpen: false, isFilterOpen: false })),
    setActiveTab: (tab) => set({ activeTab: tab }),
    closeAll: () => set({ isSearchOpen: false, isFilterOpen: false, isMenuOpen: false }),
}));

// Offline Store
interface OfflineState {
    isOnline: boolean;
    pendingActions: Array<{
        id: string;
        type: string;
        data: unknown;
        timestamp: string;
    }>;
    cachedJobs: Job[];
    setOnline: (online: boolean) => void;
    addPendingAction: (action: { id: string; type: string; data: unknown }) => void;
    removePendingAction: (id: string) => void;
    setCachedJobs: (jobs: Job[]) => void;
}

export const useOfflineStore = create<OfflineState>()(
    persist(
        (set) => ({
            isOnline: true,
            pendingActions: [],
            cachedJobs: [],
            setOnline: (online) => set({ isOnline: online }),
            addPendingAction: (action) => set((state) => ({
                pendingActions: [...state.pendingActions, { ...action, timestamp: new Date().toISOString() }],
            })),
            removePendingAction: (id) => set((state) => ({
                pendingActions: state.pendingActions.filter(a => a.id !== id),
            })),
            setCachedJobs: (jobs) => set({ cachedJobs: jobs }),
        }),
        {
            name: 'jobora-offline',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
