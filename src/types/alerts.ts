// Job Alert Types

export interface JobAlert {
    id: string;
    user_id: string;
    name: string;
    keywords: string[];
    locations: string[];
    job_types: ('full-time' | 'part-time' | 'contract' | 'internship' | 'freelance')[];
    experience_levels: ('entry' | 'mid' | 'senior' | 'executive')[];
    salary_min?: number;
    salary_max?: number;
    categories: string[];
    is_remote?: boolean;
    frequency: 'instant' | 'daily' | 'weekly';
    is_active: boolean;
    notification_channels: ('email' | 'push' | 'sms')[];
    last_triggered?: string;
    created_at: string;
    updated_at: string;
}

export interface JobAlertMatch {
    alert_id: string;
    job_id: string;
    match_score: number;
    matched_keywords: string[];
    sent_at: string;
    opened_at?: string;
    clicked_at?: string;
}

export interface NotificationTemplate {
    id: string;
    type: 'job_alert' | 'application_update' | 'interview_reminder' | 'weekly_digest';
    subject: string;
    body: string;
    html_body?: string;
    variables: string[];
}

export interface EmailNotification {
    id: string;
    user_id: string;
    to: string;
    subject: string;
    body: string;
    html_body?: string;
    status: 'pending' | 'sent' | 'failed';
    error?: string;
    sent_at?: string;
    created_at: string;
}

export interface PushNotification {
    id: string;
    user_id: string;
    title: string;
    body: string;
    icon?: string;
    url?: string;
    status: 'pending' | 'sent' | 'failed';
    sent_at?: string;
    created_at: string;
}

export interface SMSNotification {
    id: string;
    user_id: string;
    phone: string;
    message: string;
    status: 'pending' | 'sent' | 'failed';
    sent_at?: string;
    created_at: string;
}

// Alert Statistics
export interface AlertStats {
    total_alerts: number;
    active_alerts: number;
    total_matches: number;
    emails_sent: number;
    push_sent: number;
    sms_sent: number;
    open_rate: number;
    click_rate: number;
}
