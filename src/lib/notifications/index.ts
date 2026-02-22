// Notification Service for Jobora
// Handles email, push, and SMS notifications

import { JobAlert, JobAlertMatch, EmailNotification, PushNotification, SMSNotification } from '@/types/alerts';
import { Job } from '@/types/database';
import { getAdminDb } from '@/lib/firebase/admin';

// Email Service Configuration
interface EmailConfig {
    from: string;
    replyTo: string;
}

// Notification Service Class
export class NotificationService {
    private db: ReturnType<typeof getAdminDb>;
    private emailConfig: EmailConfig;

    constructor() {
        this.db = getAdminDb();
        this.emailConfig = {
            from: process.env.EMAIL_FROM || 'noreply@jobora.com',
            replyTo: process.env.EMAIL_REPLY_TO || 'support@jobora.com',
        };
    }

    // ==================== JOB ALERTS ====================

    /**
     * Create a new job alert for a user
     */
    async createAlert(userId: string, alertData: Omit<JobAlert, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<JobAlert> {
        const alertId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const alert: JobAlert = {
            id: alertId,
            user_id: userId,
            ...alertData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        await this.db.collection('job_alerts').doc(alertId).set(alert);
        return alert;
    }

    /**
     * Get all alerts for a user
     */
    async getUserAlerts(userId: string): Promise<JobAlert[]> {
        const snapshot = await this.db
            .collection('job_alerts')
            .where('user_id', '==', userId)
            .orderBy('created_at', 'desc')
            .get();

        return snapshot.docs.map(doc => doc.data() as JobAlert);
    }

    /**
     * Update an existing alert
     */
    async updateAlert(alertId: string, updates: Partial<JobAlert>): Promise<void> {
        await this.db.collection('job_alerts').doc(alertId).update({
            ...updates,
            updated_at: new Date().toISOString(),
        });
    }

    /**
     * Delete an alert
     */
    async deleteAlert(alertId: string): Promise<void> {
        await this.db.collection('job_alerts').doc(alertId).delete();
    }

    /**
     * Match jobs against all active alerts
     */
    async matchJobsToAlerts(jobs: Job[]): Promise<JobAlertMatch[]> {
        const matches: JobAlertMatch[] = [];

        // Get all active alerts
        const alertsSnapshot = await this.db
            .collection('job_alerts')
            .where('is_active', '==', true)
            .get();

        const alerts = alertsSnapshot.docs.map(doc => doc.data() as JobAlert);

        for (const alert of alerts) {
            for (const job of jobs) {
                const matchResult = this.calculateMatchScore(alert, job);

                if (matchResult.score > 0.5) { // 50% match threshold
                    const match: JobAlertMatch = {
                        alert_id: alert.id,
                        job_id: job.id!,
                        match_score: matchResult.score,
                        matched_keywords: matchResult.matchedKeywords,
                        sent_at: new Date().toISOString(),
                    };
                    matches.push(match);

                    // Store match in database
                    const matchId = `${alert.id}-${job.id}`;
                    await this.db.collection('alert_matches').doc(matchId).set(match);
                }
            }
        }

        return matches;
    }

    /**
     * Calculate match score between alert and job
     */
    private calculateMatchScore(alert: JobAlert, job: Job): { score: number; matchedKeywords: string[] } {
        let score = 0;
        let maxScore = 0;
        const matchedKeywords: string[] = [];

        // Keywords matching (weight: 30%)
        if (alert.keywords.length > 0) {
            maxScore += 30;
            const jobText = `${job.title} ${job.description} ${job.skills_required?.join(' ')}`.toLowerCase();
            const keywordMatches = alert.keywords.filter(kw =>
                jobText.includes(kw.toLowerCase())
            );
            if (keywordMatches.length > 0) {
                score += (keywordMatches.length / alert.keywords.length) * 30;
                matchedKeywords.push(...keywordMatches);
            }
        }

        // Location matching (weight: 20%)
        if (alert.locations.length > 0) {
            maxScore += 20;
            if (job.location && alert.locations.some(loc =>
                job.location!.toLowerCase().includes(loc.toLowerCase())
            )) {
                score += 20;
            }
        }

        // Job type matching (weight: 15%)
        if (alert.job_types.length > 0) {
            maxScore += 15;
            if (job.job_type && alert.job_types.includes(job.job_type)) {
                score += 15;
            }
        }

        // Experience level matching (weight: 15%)
        if (alert.experience_levels.length > 0) {
            maxScore += 15;
            if (job.experience_level && alert.experience_levels.includes(job.experience_level)) {
                score += 15;
            }
        }

        // Salary range matching (weight: 10%)
        if (alert.salary_min || alert.salary_max) {
            maxScore += 10;
            const jobMin = job.salary_min || 0;
            const jobMax = job.salary_max || Infinity;
            const alertMin = alert.salary_min || 0;
            const alertMax = alert.salary_max || Infinity;

            if (jobMax >= alertMin && jobMin <= alertMax) {
                score += 10;
            }
        }

        // Remote work matching (weight: 10%)
        if (alert.is_remote !== undefined) {
            maxScore += 10;
            if (job.is_remote === alert.is_remote) {
                score += 10;
            }
        }

        // Normalize score
        const normalizedScore = maxScore > 0 ? score / maxScore : 0;

        return { score: normalizedScore, matchedKeywords };
    }

    // ==================== EMAIL NOTIFICATIONS ====================

    /**
     * Send job alert email
     */
    async sendJobAlertEmail(
        userEmail: string,
        userName: string,
        jobs: Array<Job & { match_score: number; matched_keywords: string[] }>
    ): Promise<EmailNotification> {
        const emailId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const subject = `${jobs.length} New Jobs Match Your Alerts on Jobora`;
        const htmlBody = this.generateJobAlertEmailHTML(userName, jobs);
        const textBody = this.generateJobAlertEmailText(userName, jobs);

        const notification: EmailNotification = {
            id: emailId,
            user_id: '', // Will be set by caller
            to: userEmail,
            subject,
            body: textBody,
            html_body: htmlBody,
            status: 'pending',
            created_at: new Date().toISOString(),
        };

        // Store notification
        await this.db.collection('email_notifications').doc(emailId).set(notification);

        // In production, integrate with email service (SendGrid, Mailgun, etc.)
        // For now, we'll log it
        console.log(`[EMAIL] To: ${userEmail}`);
        console.log(`[EMAIL] Subject: ${subject}`);
        console.log(`[EMAIL] Jobs: ${jobs.length}`);

        // Update status
        await this.db.collection('email_notifications').doc(emailId).update({
            status: 'sent',
            sent_at: new Date().toISOString(),
        });

        return notification;
    }

    /**
     * Generate HTML email for job alerts
     */
    private generateJobAlertEmailHTML(
        userName: string,
        jobs: Array<Job & { match_score: number; matched_keywords: string[] }>
    ): string {
        const jobCards = jobs.map(job => `
            <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
                <h3 style="margin: 0 0 8px 0; color: #1f2937;">
                    <a href="https://joborafy.vercel.app/jobs/${job.id}" style="color: #2563eb; text-decoration: none;">
                        ${job.title}
                    </a>
                </h3>
                <p style="margin: 0 0 8px 0; color: #6b7280;">${job.company} • ${job.location}</p>
                <p style="margin: 0 0 8px 0; color: #059669; font-weight: 600;">
                    ${job.salary_min && job.salary_max
                ? `৳${job.salary_min.toLocaleString()} - ৳${job.salary_max.toLocaleString()}`
                : 'Salary not specified'}
                </p>
                <div style="margin-top: 8px;">
                    ${job.matched_keywords.map(kw =>
                    `<span style="background: #dbeafe; color: #1d4ed8; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-right: 4px;">${kw}</span>`
                ).join('')}
                </div>
                <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 12px;">
                    Match score: ${Math.round(job.match_score * 100)}%
                </p>
            </div>
        `).join('');

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f9fafb; margin: 0; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 24px;">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <h1 style="color: #2563eb; margin: 0;">Jobora</h1>
                        <p style="color: #6b7280; margin: 8px 0 0 0;">Your Job Alerts</p>
                    </div>
                    
                    <p style="color: #1f2937; font-size: 16px;">
                        Hi ${userName},
                    </p>
                    <p style="color: #4b5563;">
                        We found ${jobs.length} new job${jobs.length > 1 ? 's' : ''} that match your preferences:
                    </p>
                    
                    ${jobCards}
                    
                    <div style="text-align: center; margin-top: 24px;">
                        <a href="https://joborafy.vercel.app/saved" 
                           style="background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">
                            View All Saved Jobs
                        </a>
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
                    
                    <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                        You're receiving this email because you have active job alerts on Jobora.
                        <br>
                        <a href="https://joborafy.vercel.app/settings/notifications" style="color: #6b7280;">Manage your notification preferences</a>
                    </p>
                </div>
            </body>
            </html>
        `;
    }

    /**
     * Generate plain text email for job alerts
     */
    private generateJobAlertEmailText(
        userName: string,
        jobs: Array<Job & { match_score: number; matched_keywords: string[] }>
    ): string {
        const jobList = jobs.map(job =>
            `- ${job.title} at ${job.company} (${job.location})
  Salary: ${job.salary_min && job.salary_max
                ? `৳${job.salary_min.toLocaleString()} - ৳${job.salary_max.toLocaleString()}`
                : 'Not specified'}
  Matched: ${job.matched_keywords.join(', ')}
  View: https://joborafy.vercel.app/jobs/${job.id}`
        ).join('\n\n');

        return `
Hi ${userName},

We found ${jobs.length} new job${jobs.length > 1 ? 's' : ''} that match your preferences:

${jobList}

View all saved jobs: https://joborafy.vercel.app/saved

---
You're receiving this email because you have active job alerts on Jobora.
Manage preferences: https://joborafy.vercel.app/settings/notifications
        `.trim();
    }

    // ==================== PUSH NOTIFICATIONS ====================

    /**
     * Send push notification
     */
    async sendPushNotification(
        userId: string,
        title: string,
        body: string,
        url?: string
    ): Promise<PushNotification> {
        const notificationId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const notification: PushNotification = {
            id: notificationId,
            user_id: userId,
            title,
            body,
            url,
            status: 'pending',
            created_at: new Date().toISOString(),
        };

        // Store notification
        await this.db.collection('push_notifications').doc(notificationId).set(notification);

        // In production, integrate with FCM, OneSignal, etc.
        console.log(`[PUSH] User: ${userId}`);
        console.log(`[PUSH] Title: ${title}`);
        console.log(`[PUSH] Body: ${body}`);

        // Update status
        await this.db.collection('push_notifications').doc(notificationId).update({
            status: 'sent',
            sent_at: new Date().toISOString(),
        });

        return notification;
    }

    // ==================== SMS NOTIFICATIONS ====================

    /**
     * Send SMS notification
     */
    async sendSMS(
        userId: string,
        phone: string,
        message: string
    ): Promise<SMSNotification> {
        const notificationId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const notification: SMSNotification = {
            id: notificationId,
            user_id: userId,
            phone,
            message,
            status: 'pending',
            created_at: new Date().toISOString(),
        };

        // Store notification
        await this.db.collection('sms_notifications').doc(notificationId).set(notification);

        // In production, integrate with Twilio, Vonage, or Bangladesh SMS gateways
        console.log(`[SMS] Phone: ${phone}`);
        console.log(`[SMS] Message: ${message}`);

        // Update status
        await this.db.collection('sms_notifications').doc(notificationId).update({
            status: 'sent',
            sent_at: new Date().toISOString(),
        });

        return notification;
    }

    // ==================== NOTIFICATION PREFERENCES ====================

    /**
     * Get user notification preferences
     */
    async getUserNotificationPreferences(userId: string): Promise<{
        email: boolean;
        push: boolean;
        sms: boolean;
        jobAlerts: boolean;
        applicationUpdates: boolean;
        weeklyDigest: boolean;
    }> {
        const doc = await this.db.collection('notification_preferences').doc(userId).get();

        if (doc.exists) {
            return doc.data() as any;
        }

        // Default preferences
        return {
            email: true,
            push: true,
            sms: false,
            jobAlerts: true,
            applicationUpdates: true,
            weeklyDigest: true,
        };
    }

    /**
     * Update user notification preferences
     */
    async updateNotificationPreferences(
        userId: string,
        preferences: Partial<{
            email: boolean;
            push: boolean;
            sms: boolean;
            jobAlerts: boolean;
            applicationUpdates: boolean;
            weeklyDigest: boolean;
        }>
    ): Promise<void> {
        await this.db.collection('notification_preferences').doc(userId).set(
            { ...preferences, updated_at: new Date().toISOString() },
            { merge: true }
        );
    }
}

// Singleton instance
let notificationServiceInstance: NotificationService | null = null;

export function getNotificationService(): NotificationService {
    if (!notificationServiceInstance) {
        notificationServiceInstance = new NotificationService();
    }
    return notificationServiceInstance;
}
