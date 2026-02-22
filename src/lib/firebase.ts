// Firebase Configuration for Jobora
// Provides: Auth, Firestore, Storage, and Cloud Messaging

import { initializeApp, FirebaseApp, getApps } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getMessaging, Messaging, getToken, onMessage } from 'firebase/messaging';

// Firebase client configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase (singleton pattern)
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let messaging: Messaging | null = null;

function initializeFirebase() {
    if (getApps().length === 0) {
        app = initializeApp(firebaseConfig);
    } else {
        app = getApps()[0];
    }

    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);

    // Messaging only works in browser environment
    if (typeof window !== 'undefined') {
        try {
            messaging = getMessaging(app);
        } catch (error) {
            console.warn('Firebase messaging not supported:', error);
        }
    }

    return { app, auth, db, storage, messaging };
}

// Initialize and export services
const services = initializeFirebase();
export const firebaseApp = services.app;
export const firebaseAuth = services.auth;
export const firebaseDb = services.db;
export const firebaseStorage = services.storage;
export const firebaseMessaging = services.messaging;

// Re-export types
export type { User } from 'firebase/auth';
export type { DocumentReference, CollectionReference, QuerySnapshot, DocumentSnapshot } from 'firebase/firestore';

// ==================== PUSH NOTIFICATIONS ====================

// Request permission and get FCM token
export async function requestNotificationPermission(): Promise<string | null> {
    if (!messaging) {
        console.warn('Firebase messaging not initialized');
        return null;
    }

    try {
        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
            const token = await getToken(messaging, {
                vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
            });
            return token;
        }

        return null;
    } catch (error) {
        console.error('Error requesting notification permission:', error);
        return null;
    }
}

// Listen for messages while app is in foreground
export function onMessageListener(callback: (payload: unknown) => void) {
    if (!messaging) {
        console.warn('Firebase messaging not initialized');
        return () => { };
    }

    return onMessage(messaging, (payload) => {
        callback(payload);
    });
}

// Send notification to server to store token
export async function registerDeviceToken(userId: string, token: string): Promise<boolean> {
    try {
        const response = await fetch('/api/notifications/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, token }),
        });

        return response.ok;
    } catch (error) {
        console.error('Error registering device token:', error);
        return false;
    }
}

// Notification types
export interface NotificationPayload {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    image?: string;
    data?: Record<string, string>;
    actions?: Array<{
        action: string;
        title: string;
        icon?: string;
    }>;
}

// Show local notification
export function showLocalNotification(payload: NotificationPayload): void {
    if ('serviceWorker' in navigator && Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification(payload.title, {
                body: payload.body,
                icon: payload.icon || '/icons/icon-192x192.png',
                badge: payload.badge || '/icons/badge.png',
                data: payload.data,
                actions: payload.actions,
            } as NotificationOptions);
        });
    }
}

// ==================== FIRESTORE HELPERS ====================

// Collection names
export const COLLECTIONS = {
    USERS: 'users',
    JOBS: 'jobs',
    APPLICATIONS: 'applications',
    NOTIFICATIONS: 'notifications',
    RESUMES: 'resumes',
    SKILLS: 'skills',
    COMPANIES: 'companies',
    SAVED_JOBS: 'saved_jobs',
    JOB_ALERTS: 'job_alerts',
} as const;

// ==================== STORAGE HELPERS ====================

// Storage paths
export const STORAGE_PATHS = {
    RESUMES: 'resumes',
    PROFILE_PICTURES: 'profile-pictures',
    COMPANY_LOGOS: 'company-logos',
} as const;
