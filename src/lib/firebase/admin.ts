// Firebase Admin SDK for Server-Side Operations
// This file should only be imported in server-side code (API routes, server actions)

import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getStorage, Storage } from 'firebase-admin/storage';

// Firebase Admin configuration
const adminConfig = {
    projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

// Singleton instances
let adminApp: App | null = null;
let adminAuth: Auth | null = null;
let adminDb: Firestore | null = null;
let adminStorage: Storage | null = null;

// Initialize Firebase Admin
function initializeAdminApp(): App {
    if (getApps().length === 0) {
        adminApp = initializeApp({
            credential: cert(adminConfig),
            projectId: adminConfig.projectId,
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        });
    } else {
        adminApp = getApps()[0];
    }
    return adminApp;
}

// Get Firebase Admin Auth
export function getAdminAuth(): Auth {
    if (!adminAuth) {
        const app = initializeAdminApp();
        adminAuth = getAuth(app);
    }
    return adminAuth;
}

// Get Firebase Admin Firestore
export function getAdminDb(): Firestore {
    if (!adminDb) {
        const app = initializeAdminApp();
        adminDb = getFirestore(app);
    }
    return adminDb;
}

// Get Firebase Admin Storage
export function getAdminStorage(): Storage {
    if (!adminStorage) {
        const app = initializeAdminApp();
        adminStorage = getStorage(app);
    }
    return adminStorage;
}

// Verify ID token from client
export async function verifyIdToken(token: string) {
    try {
        const auth = getAdminAuth();
        const decodedToken = await auth.verifyIdToken(token);
        return { success: true, uid: decodedToken.uid, email: decodedToken.email };
    } catch (error) {
        console.error('Error verifying ID token:', error);
        return { success: false, uid: null, email: null };
    }
}

// Get user by UID
export async function getUserByUid(uid: string) {
    try {
        const auth = getAdminAuth();
        const userRecord = await auth.getUser(uid);
        return { success: true, user: userRecord };
    } catch (error) {
        console.error('Error fetching user:', error);
        return { success: false, user: null };
    }
}

// Create custom token for authentication
export async function createCustomToken(uid: string, claims?: Record<string, unknown>) {
    try {
        const auth = getAdminAuth();
        const token = await auth.createCustomToken(uid, claims);
        return { success: true, token };
    } catch (error) {
        console.error('Error creating custom token:', error);
        return { success: false, token: null };
    }
}

// Set custom user claims
export async function setUserClaims(uid: string, claims: Record<string, unknown>) {
    try {
        const auth = getAdminAuth();
        await auth.setCustomUserClaims(uid, claims);
        return { success: true };
    } catch (error) {
        console.error('Error setting user claims:', error);
        return { success: false };
    }
}

// Export initialized services
export const adminAppInstance = () => initializeAdminApp();
