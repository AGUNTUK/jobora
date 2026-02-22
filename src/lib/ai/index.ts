// AI Integration for Jobora
// Uses OpenRouter API with configurable model

interface AIConfig {
    openrouterApiKey?: string;
    openrouterModel?: string;
    maxRetries?: number;
    timeout?: number;
}

interface JobRankingInput {
    jobTitle: string;
    jobDescription: string;
    jobRequirements: string[];
    userSkills: string[];
    userExperience: string;
    userPreferences: {
        locations: string[];
        salaryExpectation: { min: number; max: number };
        jobTypes: string[];
    };
}

interface FraudDetectionInput {
    jobTitle: string;
    company: string;
    description: string;
    salaryMin?: number;
    salaryMax?: number;
    sourceUrl: string;
    contactEmail?: string;
}

interface ResumeParsingInput {
    resumeText: string;
}

interface AIResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    model?: string;
}

// Circuit breaker state
interface CircuitBreakerState {
    isOpen: boolean;
    failureCount: number;
    lastFailureTime: number;
    nextAttemptTime: number;
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calculate exponential backoff delay with jitter
 */
function calculateBackoff(attempt: number, baseDelay: number = 1000, maxDelay: number = 30000): number {
    const exponentialDelay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
    // Add jitter (±25%)
    const jitter = exponentialDelay * 0.25 * (Math.random() * 2 - 1);
    return Math.floor(exponentialDelay + jitter);
}

// OpenRouter API Client with retry logic and circuit breaker
class OpenRouterClient {
    private apiKey: string;
    private model: string;
    private baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
    private maxRetries: number;
    private timeout: number;
    private circuitBreaker: CircuitBreakerState = {
        isOpen: false,
        failureCount: 0,
        lastFailureTime: 0,
        nextAttemptTime: 0,
    };

    // Circuit breaker configuration
    private readonly FAILURE_THRESHOLD = 5;
    private readonly RECOVERY_TIMEOUT = 60000; // 1 minute

    constructor(
        apiKey: string,
        model: string = 'anthropic/claude-3.5-sonnet',
        maxRetries: number = 3,
        timeout: number = 30000
    ) {
        this.apiKey = apiKey;
        this.model = model;
        this.maxRetries = maxRetries;
        this.timeout = timeout;
    }

    /**
     * Check if circuit breaker should allow request
     */
    private checkCircuitBreaker(): boolean {
        const now = Date.now();

        if (this.circuitBreaker.isOpen) {
            if (now >= this.circuitBreaker.nextAttemptTime) {
                // Half-open state - allow one request to test
                return true;
            }
            return false;
        }
        return true;
    }

    /**
     * Record successful request
     */
    private recordSuccess(): void {
        this.circuitBreaker.failureCount = 0;
        this.circuitBreaker.isOpen = false;
    }

    /**
     * Record failed request
     */
    private recordFailure(): void {
        const now = Date.now();
        this.circuitBreaker.failureCount++;
        this.circuitBreaker.lastFailureTime = now;

        if (this.circuitBreaker.failureCount >= this.FAILURE_THRESHOLD) {
            this.circuitBreaker.isOpen = true;
            this.circuitBreaker.nextAttemptTime = now + this.RECOVERY_TIMEOUT;
            console.warn('Circuit breaker opened due to repeated failures');
        }
    }

    /**
     * Make a single API request with timeout
     */
    private async makeRequest(
        messages: Array<{ role: string; content: string }>,
        options?: {
            temperature?: number;
            maxTokens?: number;
            model?: string;
        }
    ): Promise<string> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
                    'X-Title': 'Jobora',
                },
                body: JSON.stringify({
                    model: options?.model || this.model,
                    messages,
                    temperature: options?.temperature ?? 0.7,
                    max_tokens: options?.maxTokens ?? 2000,
                }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorBody = await response.text().catch(() => 'Unknown error');
                throw new Error(`OpenRouter API error: ${response.status} - ${errorBody}`);
            }

            const data = await response.json();

            if (!data.choices?.[0]?.message?.content) {
                throw new Error('Invalid response format from OpenRouter API');
            }

            return data.choices[0].message.content;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    /**
     * Chat with retry logic and circuit breaker
     */
    async chat(
        messages: Array<{ role: string; content: string }>,
        options?: {
            temperature?: number;
            maxTokens?: number;
            model?: string;
        }
    ): Promise<string> {
        // Check circuit breaker
        if (!this.checkCircuitBreaker()) {
            throw new Error('Service temporarily unavailable due to repeated failures. Please try again later.');
        }

        let lastError: Error | null = null;

        for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
            try {
                const result = await this.makeRequest(messages, options);
                this.recordSuccess();
                return result;
            } catch (error) {
                lastError = error instanceof Error ? error : new Error(String(error));

                // Don't retry on certain errors
                if (lastError.message.includes('401') || lastError.message.includes('403')) {
                    throw new Error('Authentication failed. Please check your API key.');
                }

                // Don't retry on abort (timeout)
                if (lastError.name === 'AbortError') {
                    lastError = new Error(`Request timed out after ${this.timeout}ms`);
                }

                console.error(`OpenRouter API attempt ${attempt + 1} failed:`, lastError.message);

                // Record failure for circuit breaker
                this.recordFailure();

                // Don't wait after last attempt
                if (attempt < this.maxRetries) {
                    const delay = calculateBackoff(attempt);
                    console.log(`Retrying in ${delay}ms...`);
                    await sleep(delay);
                }
            }
        }

        throw lastError || new Error('Failed to complete AI request after retries');
    }

    /**
     * Get circuit breaker status
     */
    getCircuitBreakerStatus(): { isOpen: boolean; failureCount: number } {
        return {
            isOpen: this.circuitBreaker.isOpen,
            failureCount: this.circuitBreaker.failureCount,
        };
    }

    /**
     * Reset circuit breaker (useful for testing or manual recovery)
     */
    resetCircuitBreaker(): void {
        this.circuitBreaker = {
            isOpen: false,
            failureCount: 0,
            lastFailureTime: 0,
            nextAttemptTime: 0,
        };
    }
}

// Main AI Service
export class AIService {
    private openrouter?: OpenRouterClient;
    private defaultModel: string;

    constructor(config: AIConfig) {
        this.defaultModel = config.openrouterModel || 'anthropic/claude-3.5-sonnet';
        if (config.openrouterApiKey) {
            this.openrouter = new OpenRouterClient(
                config.openrouterApiKey,
                this.defaultModel,
                config.maxRetries ?? 3,
                config.timeout ?? 30000
            );
        }
    }

    // Rank job relevance
    async rankJobRelevance(input: JobRankingInput): Promise<AIResponse<{
        score: number;
        reasoning: string;
        matchedSkills: string[];
        missingSkills: string[];
    }>> {
        const prompt = `You are an AI job matching assistant. Analyze the job posting and candidate profile to determine relevance.

JOB DETAILS:
Title: ${input.jobTitle}
Description: ${input.jobDescription}
Requirements: ${input.jobRequirements.join(', ')}

CANDIDATE PROFILE:
Skills: ${input.userSkills.join(', ')}
Experience: ${input.userExperience}
Preferred Locations: ${input.userPreferences.locations.join(', ')}
Expected Salary Range: ${input.userPreferences.salaryExpectation.min} - ${input.userPreferences.salaryExpectation.max} BDT
Preferred Job Types: ${input.userPreferences.jobTypes.join(', ')}

Provide a JSON response with:
1. "score": A relevance score from 0-100
2. "reasoning": Brief explanation of the score
3. "matchedSkills": Array of skills the candidate has that match the job
4. "missingSkills": Array of required skills the candidate lacks

Respond ONLY with valid JSON, no additional text.`;

        try {
            const response = await this.openrouter?.chat([
                { role: 'system', content: 'You are a precise job matching AI. Always respond with valid JSON only.' },
                { role: 'user', content: prompt },
            ], { temperature: 0.3 });

            if (response) {
                const data = JSON.parse(response);
                return { success: true, data, model: this.defaultModel };
            }
            return { success: false, error: 'OpenRouter client not configured' };
        } catch (error) {
            return { success: false, error: String(error) };
        }
    }

    // Detect fraud
    async detectFraud(input: FraudDetectionInput): Promise<AIResponse<{
        fraudScore: number;
        riskLevel: 'low' | 'medium' | 'high';
        redFlags: string[];
        recommendation: string;
    }>> {
        const prompt = `You are a fraud detection AI for job postings. Analyze this job posting for potential fraud indicators.

JOB DETAILS:
Title: ${input.jobTitle}
Company: ${input.company}
Description: ${input.description}
Salary Range: ${input.salaryMin ?? 'Not specified'} - ${input.salaryMax ?? 'Not specified'} BDT
Source URL: ${input.sourceUrl}
Contact Email: ${input.contactEmail ?? 'Not provided'}

Analyze for common job scam indicators:
- Unrealistic salary offers
- Vague job descriptions
- Request for personal/financial information
- Poor grammar/spelling
- Urgency to apply
- No company verification
- Suspicious contact methods

Provide a JSON response with:
1. "fraudScore": Risk score from 0-100 (0 = legitimate, 100 = definite scam)
2. "riskLevel": "low", "medium", or "high"
3. "redFlags": Array of specific concerns found
4. "recommendation": Brief advice for the job seeker

Respond ONLY with valid JSON, no additional text.`;

        try {
            const response = await this.openrouter?.chat([
                { role: 'system', content: 'You are a fraud detection AI. Always respond with valid JSON only.' },
                { role: 'user', content: prompt },
            ], { temperature: 0.2 });

            if (response) {
                const data = JSON.parse(response);
                return { success: true, data, model: this.defaultModel };
            }
            return { success: false, error: 'OpenRouter client not configured' };
        } catch (error) {
            return { success: false, error: String(error) };
        }
    }

    // Parse resume
    async parseResume(input: ResumeParsingInput): Promise<AIResponse<{
        skills: string[];
        experience: Array<{
            title: string;
            company: string;
            duration: string;
            description: string;
        }>;
        education: Array<{
            degree: string;
            institution: string;
            year: string;
        }>;
        summary: string;
    }>> {
        const prompt = `You are a resume parsing AI. Extract structured information from this resume text.

RESUME TEXT:
${input.resumeText}

Extract and return a JSON response with:
1. "skills": Array of technical and soft skills found
2. "experience": Array of work experiences with title, company, duration, description
3. "education": Array of education entries with degree, institution, year
4. "summary": A brief 2-3 sentence professional summary

Respond ONLY with valid JSON, no additional text.`;

        try {
            const response = await this.openrouter?.chat([
                { role: 'system', content: 'You are a precise resume parsing AI. Always respond with valid JSON only.' },
                { role: 'user', content: prompt },
            ], { temperature: 0.2, maxTokens: 3000 });

            if (response) {
                const data = JSON.parse(response);
                return { success: true, data, model: this.defaultModel };
            }
            return { success: false, error: 'OpenRouter client not configured' };
        } catch (error) {
            return { success: false, error: String(error) };
        }
    }

    // Summarize job description
    async summarizeJobDescription(description: string): Promise<AIResponse<string>> {
        const prompt = `Summarize this job description in 3-4 concise bullet points. Focus on key responsibilities, requirements, and benefits.

Job Description:
${description}

Provide only the bullet points, each starting with "•".`;

        try {
            const response = await this.openrouter?.chat([
                { role: 'system', content: 'You are a concise job description summarizer.' },
                { role: 'user', content: prompt },
            ], { temperature: 0.5, maxTokens: 500 });

            if (response) {
                return { success: true, data: response, model: this.defaultModel };
            }
            return { success: false, error: 'OpenRouter client not configured' };
        } catch (error) {
            return { success: false, error: String(error) };
        }
    }

    // Generate job recommendations
    async generateRecommendations(
        userProfile: {
            skills: string[];
            experience: string;
            preferences: string[];
        },
        recentJobs: Array<{ title: string; company: string }>
    ): Promise<AIResponse<string[]>> {
        const prompt = `Based on the user's profile and recent job activity, suggest career recommendations.

USER PROFILE:
Skills: ${userProfile.skills.join(', ')}
Experience: ${userProfile.experience}
Preferences: ${userProfile.preferences.join(', ')}

RECENTLY VIEWED/APPLIED JOBS:
${recentJobs.map(j => `- ${j.title} at ${j.company}`).join('\n')}

Provide 5 personalized career recommendations as a JSON array of strings. Each recommendation should be actionable and specific.

Respond ONLY with a valid JSON array, no additional text.`;

        try {
            const response = await this.openrouter?.chat([
                { role: 'system', content: 'You are a career advisor AI. Always respond with valid JSON only.' },
                { role: 'user', content: prompt },
            ], { temperature: 0.7 });

            if (response) {
                const data = JSON.parse(response);
                return { success: true, data, model: this.defaultModel };
            }
            return { success: false, error: 'OpenRouter client not configured' };
        } catch (error) {
            return { success: false, error: String(error) };
        }
    }

    // Career guidance chatbot
    async careerGuidanceChat(
        userMessage: string,
        conversationHistory: Array<{ role: string; content: string }> = []
    ): Promise<AIResponse<string>> {
        const systemPrompt = `You are Jobora AI, a friendly and helpful career guidance assistant for job seekers in Bangladesh. 
You provide advice on:
- Job search strategies
- Resume and cover letter tips
- Interview preparation
- Career development
- Salary negotiation
- Workplace etiquette in Bangladesh

Be encouraging, practical, and culturally aware. Keep responses concise but helpful.`;

        const messages = [
            { role: 'system', content: systemPrompt },
            ...conversationHistory,
            { role: 'user', content: userMessage },
        ];

        try {
            const response = await this.openrouter?.chat(messages, {
                temperature: 0.8,
                maxTokens: 1000,
            });

            if (response) {
                return { success: true, data: response, model: this.defaultModel };
            }
            return { success: false, error: 'OpenRouter client not configured' };
        } catch (error) {
            return { success: false, error: String(error) };
        }
    }

    // Detect duplicate jobs
    async detectDuplicate(job1: { title: string; company: string; description: string }, job2: { title: string; company: string; description: string }): Promise<AIResponse<{
        isDuplicate: boolean;
        similarityScore: number;
        reasoning: string;
    }>> {
        const prompt = `Compare these two job postings and determine if they are duplicates.

JOB 1:
Title: ${job1.title}
Company: ${job1.company}
Description: ${job1.description.substring(0, 500)}

JOB 2:
Title: ${job2.title}
Company: ${job2.company}
Description: ${job2.description.substring(0, 500)}

Provide a JSON response with:
1. "isDuplicate": boolean - true if these are the same job
2. "similarityScore": number from 0-100
3. "reasoning": brief explanation

Consider them duplicates if they're the same position at the same company, even with minor differences in wording.

Respond ONLY with valid JSON, no additional text.`;

        try {
            const response = await this.openrouter?.chat([
                { role: 'system', content: 'You are a duplicate detection AI. Always respond with valid JSON only.' },
                { role: 'user', content: prompt },
            ], { temperature: 0.1 });

            if (response) {
                const data = JSON.parse(response);
                return { success: true, data, model: this.defaultModel };
            }
            return { success: false, error: 'OpenRouter client not configured' };
        } catch (error) {
            return { success: false, error: String(error) };
        }
    }
}

// Factory function to create AI service instance
export function createAIService(): AIService {
    return new AIService({
        openrouterApiKey: process.env.OPENROUTER_API_KEY,
        openrouterModel: process.env.OPENROUTER_MODEL,
    });
}

// Export singleton instance
let aiServiceInstance: AIService | null = null;

export function getAIService(): AIService {
    if (!aiServiceInstance) {
        aiServiceInstance = createAIService();
    }
    return aiServiceInstance;
}
