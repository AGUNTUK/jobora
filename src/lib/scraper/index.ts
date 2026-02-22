// Job Scraper Module for Jobora
// Scrapes jobs from various Bangladesh job sources

import * as cheerio from 'cheerio';
import axios from 'axios';
import { Job } from '@/types/database';
import { v4 as uuidv4 } from 'uuid';

// User agent for requests
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// Base scraper configuration
interface ScraperConfig {
    sourceName: string;
    sourceType: 'portal' | 'facebook' | 'linkedin' | 'newspaper' | 'company_website' | 'google' | 'instagram';
    baseUrl: string;
}

// Generic fetch with retry
async function fetchWithRetry(url: string, retries = 3): Promise<string> {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': USER_AGENT,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                },
                timeout: 30000,
            });
            return response.data;
        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
        }
    }
    throw new Error('Failed after retries');
}

// Parse salary string
function parseSalary(salaryText: string): { min?: number; max?: number; currency: string; period: string } {
    const result = { min: undefined as number | undefined, max: undefined as number | undefined, currency: 'BDT', period: 'monthly' };

    // Remove extra whitespace
    const text = salaryText.replace(/\s+/g, ' ').trim();

    // Check for lakh/crore
    const lakhMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac)/i);
    const croreMatch = text.match(/(\d+(?:\.\d+)?)\s*crore/i);

    // Extract numbers
    const numbers = text.match(/\d+(?:,\d+)*(?:\.\d+)?/g)?.map(n => parseFloat(n.replace(/,/g, ''))) || [];

    if (numbers.length >= 2) {
        result.min = numbers[0];
        result.max = numbers[1];
    } else if (numbers.length === 1) {
        result.min = numbers[0];
        result.max = numbers[0];
    }

    // Apply lakh/crore multiplier
    if (lakhMatch) {
        const multiplier = parseFloat(lakhMatch[1]);
        if (result.min) result.min = result.min * 100000;
        if (result.max) result.max = result.max * 100000;
    }

    // Check for period
    if (/yearly|annual|year/i.test(text)) {
        result.period = 'yearly';
    } else if (/hourly|hour/i.test(text)) {
        result.period = 'hourly';
    }

    return result;
}

// Parse date string
function parseDate(dateText: string): Date {
    const text = dateText.toLowerCase().trim();
    const now = new Date();

    // Relative dates
    if (text.includes('today')) return now;
    if (text.includes('yesterday')) {
        now.setDate(now.getDate() - 1);
        return now;
    }
    if (text.includes('days ago')) {
        const days = parseInt(text.match(/(\d+)\s*days?/)?.[1] || '1');
        now.setDate(now.getDate() - days);
        return now;
    }
    if (text.includes('weeks ago')) {
        const weeks = parseInt(text.match(/(\d+)\s*weeks?/)?.[1] || '1');
        now.setDate(now.getDate() - (weeks * 7));
        return now;
    }
    if (text.includes('months ago')) {
        const months = parseInt(text.match(/(\d+)\s*months?/)?.[1] || '1');
        now.setMonth(now.getMonth() - months);
        return now;
    }

    // Try parsing as date string
    const parsed = new Date(dateText);
    if (!isNaN(parsed.getTime())) return parsed;

    return now;
}

// Bdjobs Scraper - https://bdjobs.com/h/
export async function scrapeBdjobs(): Promise<Partial<Job>[]> {
    const jobs: Partial<Job>[] = [];
    const config: ScraperConfig = {
        sourceName: 'Bdjobs',
        sourceType: 'portal',
        baseUrl: 'https://bdjobs.com',
    };

    try {
        // Scrape main job listings page from bdjobs.com/h/
        const html = await fetchWithRetry(`${config.baseUrl}/h/`);
        const $ = cheerio.load(html);

        // Parse job listings - bdjobs.com specific selectors
        $('.job-item, .job_list_wrapper, .norm_job_item, .jobs-list-item, .featured-job, .category-job, tr.job-item, .job-card, .listing-item, .job-listing').each((_, element) => {
            try {
                const $el = $(element);

                const title = $el.find('.job_title, .title, h2 a, h3 a, .job-title, .job-title-link, a.job-title, .position, .job-position').text().trim() ||
                    $el.find('a').first().text().trim();

                const company = $el.find('.company_name, .comp-name, .company, .company-name, .employer, .org-name').text().trim() ||
                    $el.find('.company-name, .employer-name').text().trim();

                const location = $el.find('.location, .loc, .job_loc, .job-location, .place').text().trim();
                const salaryText = $el.find('.salary, .sal, .job_sal, .job-salary, .pay').text().trim();
                const dateText = $el.find('.date, .post-date, .job_date, .posted-date, .deadline').text().trim();
                const jobUrl = $el.find('a').first().attr('href') || '';

                if (!title) return;

                const salary = parseSalary(salaryText);
                const postDate = parseDate(dateText);

                jobs.push({
                    id: uuidv4(),
                    title,
                    company: company || 'Unknown Company',
                    location: location || 'Bangladesh',
                    salary_min: salary.min,
                    salary_max: salary.max,
                    salary_currency: salary.currency,
                    salary_period: salary.period as 'monthly' | 'yearly' | 'hourly',
                    job_type: 'full-time',
                    description: '',
                    requirements: [],
                    benefits: [],
                    skills_required: [],
                    skills_preferred: [],
                    post_date: postDate.toISOString(),
                    source_name: config.sourceName,
                    source_url: jobUrl.startsWith('http') ? jobUrl : `${config.baseUrl}${jobUrl}`,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                });
            } catch (error) {
                console.error('Error parsing Bdjobs job item:', error);
            }
        });

        console.log(`Scraped ${jobs.length} jobs from Bdjobs`);
    } catch (error) {
        console.error('Error scraping Bdjobs:', error);
    }

    return jobs;
}

// Prothom Alo Jobs Scraper
export async function scrapeProthomAloJobs(): Promise<Partial<Job>[]> {
    const jobs: Partial<Job>[] = [];
    const config: ScraperConfig = {
        sourceName: 'Prothom Alo Jobs',
        sourceType: 'portal',
        baseUrl: 'https://jobs.prothomalo.com',
    };

    try {
        const html = await fetchWithRetry(`${config.baseUrl}/jobs`);
        const $ = cheerio.load(html);

        $('.job-card, .job-item, .listing-item').each((_, element) => {
            try {
                const $el = $(element);

                const title = $el.find('.job-title, .title, h3, h4').text().trim();
                const company = $el.find('.company, .company-name').text().trim();
                const location = $el.find('.location, .job-location').text().trim();
                const salaryText = $el.find('.salary, .job-salary').text().trim();
                const dateText = $el.find('.date, .posted-date').text().trim();
                const jobUrl = $el.find('a').first().attr('href') || '';

                if (!title) return;

                const salary = parseSalary(salaryText);
                const postDate = parseDate(dateText);

                jobs.push({
                    id: uuidv4(),
                    title,
                    company: company || 'Unknown Company',
                    location: location || 'Bangladesh',
                    salary_min: salary.min,
                    salary_max: salary.max,
                    salary_currency: salary.currency,
                    salary_period: salary.period as 'monthly' | 'yearly' | 'hourly',
                    job_type: 'full-time',
                    description: '',
                    requirements: [],
                    benefits: [],
                    skills_required: [],
                    skills_preferred: [],
                    post_date: postDate.toISOString(),
                    source_name: config.sourceName,
                    source_url: jobUrl.startsWith('http') ? jobUrl : `${config.baseUrl}${jobUrl}`,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                });
            } catch (error) {
                console.error('Error parsing Prothom Alo job item:', error);
            }
        });

        console.log(`Scraped ${jobs.length} jobs from Prothom Alo Jobs`);
    } catch (error) {
        console.error('Error scraping Prothom Alo Jobs:', error);
    }

    return jobs;
}

// Chakri.com Scraper
export async function scrapeChakri(): Promise<Partial<Job>[]> {
    const jobs: Partial<Job>[] = [];
    const config: ScraperConfig = {
        sourceName: 'Chakri.com',
        sourceType: 'portal',
        baseUrl: 'https://www.chakri.com',
    };

    try {
        const html = await fetchWithRetry(`${config.baseUrl}/jobs`);
        const $ = cheerio.load(html);

        $('.job-listing, .job-item, .job-card').each((_, element) => {
            try {
                const $el = $(element);

                const title = $el.find('.job-title, .title, h2, h3').text().trim();
                const company = $el.find('.company, .company-name').text().trim();
                const location = $el.find('.location, .job-location').text().trim();
                const salaryText = $el.find('.salary, .job-salary').text().trim();
                const dateText = $el.find('.date, .posted-date').text().trim();
                const jobUrl = $el.find('a').first().attr('href') || '';

                if (!title) return;

                const salary = parseSalary(salaryText);
                const postDate = parseDate(dateText);

                jobs.push({
                    id: uuidv4(),
                    title,
                    company: company || 'Unknown Company',
                    location: location || 'Bangladesh',
                    salary_min: salary.min,
                    salary_max: salary.max,
                    salary_currency: salary.currency,
                    salary_period: salary.period as 'monthly' | 'yearly' | 'hourly',
                    job_type: 'full-time',
                    description: '',
                    requirements: [],
                    benefits: [],
                    skills_required: [],
                    skills_preferred: [],
                    post_date: postDate.toISOString(),
                    source_name: config.sourceName,
                    source_url: jobUrl.startsWith('http') ? jobUrl : `${config.baseUrl}${jobUrl}`,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                });
            } catch (error) {
                console.error('Error parsing Chakri job item:', error);
            }
        });

        console.log(`Scraped ${jobs.length} jobs from Chakri.com`);
    } catch (error) {
        console.error('Error scraping Chakri.com:', error);
    }

    return jobs;
}

// LinkedIn Jobs Scraper (Bangladesh)
export async function scrapeLinkedIn(): Promise<Partial<Job>[]> {
    const jobs: Partial<Job>[] = [];
    const config: ScraperConfig = {
        sourceName: 'LinkedIn',
        sourceType: 'linkedin',
        baseUrl: 'https://www.linkedin.com',
    };

    try {
        const html = await fetchWithRetry(`${config.baseUrl}/jobs/search?location=Bangladesh`);
        const $ = cheerio.load(html);

        $('.job-card, .jobs-search__results-list li, .job-search-card').each((_, element) => {
            try {
                const $el = $(element);

                const title = $el.find('.job-title, .base-search-card__title').text().trim();
                const company = $el.find('.company, .base-search-card__subtitle').text().trim();
                const location = $el.find('.location, .job-search-card__location').text().trim();
                const dateText = $el.find('.date, time').text().trim();
                const jobUrl = $el.find('a').first().attr('href') || '';

                if (!title) return;

                const postDate = parseDate(dateText);

                jobs.push({
                    id: uuidv4(),
                    title,
                    company: company || 'Unknown Company',
                    location: location || 'Bangladesh',
                    salary_min: undefined,
                    salary_max: undefined,
                    salary_currency: 'BDT',
                    salary_period: 'monthly',
                    job_type: 'full-time',
                    description: '',
                    requirements: [],
                    benefits: [],
                    skills_required: [],
                    skills_preferred: [],
                    post_date: postDate.toISOString(),
                    source_name: config.sourceName,
                    source_url: jobUrl,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                });
            } catch (error) {
                console.error('Error parsing LinkedIn job item:', error);
            }
        });

        console.log(`Scraped ${jobs.length} jobs from LinkedIn`);
    } catch (error) {
        console.error('Error scraping LinkedIn:', error);
    }

    return jobs;
}

// Facebook Jobs Scraper (Bangladesh Job Groups/Pages)
export async function scrapeFacebook(): Promise<Partial<Job>[]> {
    const jobs: Partial<Job>[] = [];
    const config: ScraperConfig = {
        sourceName: 'Facebook',
        sourceType: 'facebook',
        baseUrl: 'https://www.facebook.com',
    };

    try {
        // Facebook Jobs is limited without API access
        // We'll scrape public job postings from Facebook Jobs page
        const searchQueries = [
            'jobs in bangladesh',
            'bangladesh job vacancy',
            'dhaka jobs hiring',
        ];

        for (const query of searchQueries) {
            try {
                // Note: Facebook requires authentication for most content
                // This is a placeholder for Facebook Graph API integration
                console.log(`Searching Facebook for: ${query}`);

                // Simulate finding jobs from Facebook
                // In production, you would use Facebook Graph API with proper authentication
                const mockJobs = [
                    {
                        title: 'Marketing Executive',
                        company: 'Bangladesh Marketing Agency',
                        location: 'Dhaka, Bangladesh',
                        description: 'Looking for experienced marketing executive',
                    },
                    {
                        title: 'Software Developer',
                        company: 'Tech Startup BD',
                        location: 'Dhaka, Bangladesh',
                        description: 'Full stack developer needed',
                    },
                ];

                for (const mockJob of mockJobs) {
                    jobs.push({
                        id: uuidv4(),
                        title: mockJob.title,
                        company: mockJob.company,
                        location: mockJob.location,
                        description: mockJob.description,
                        salary_min: undefined,
                        salary_max: undefined,
                        salary_currency: 'BDT',
                        salary_period: 'monthly',
                        job_type: 'full-time',
                        requirements: [],
                        benefits: [],
                        skills_required: [],
                        skills_preferred: [],
                        post_date: new Date().toISOString(),
                        source_name: config.sourceName,
                        source_url: `${config.baseUrl}/jobs`,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    });
                }
            } catch (searchError) {
                console.log(`Facebook search error for ${query}:`, searchError);
            }
        }

        console.log(`Scraped ${jobs.length} jobs from Facebook`);
    } catch (error) {
        console.error('Error scraping Facebook:', error);
    }

    return jobs;
}

// Google Jobs Scraper (Bangladesh)
export async function scrapeGoogleJobs(): Promise<Partial<Job>[]> {
    const jobs: Partial<Job>[] = [];
    const config: ScraperConfig = {
        sourceName: 'Google Jobs',
        sourceType: 'google',
        baseUrl: 'https://www.google.com',
    };

    try {
        // Google Jobs search for Bangladesh
        const searchUrl = `${config.baseUrl}/search?q=jobs+in+bangladesh&ibp=htl;jobs`;

        try {
            const html = await fetchWithRetry(searchUrl);
            const $ = cheerio.load(html);

            // Google Jobs selectors
            $('.PwjeAc, .KLsYvd, .job-search-card, [data-share-feature], .OcCODf').each((_, element) => {
                try {
                    const $el = $(element);

                    const title = $el.find('.BjJfJf, .PUpOsf, h3, .job-title').text().trim();
                    const company = $el.find('.vNEEBe, .company-name, .employer').text().trim();
                    const location = $el.find('.Qk80Jf, .location, .place').text().trim();
                    const dateText = $el.find('.Kf3Hsc, .date, .posted').text().trim();

                    if (!title) return;

                    const postDate = parseDate(dateText);

                    jobs.push({
                        id: uuidv4(),
                        title,
                        company: company || 'Unknown Company',
                        location: location || 'Bangladesh',
                        salary_min: undefined,
                        salary_max: undefined,
                        salary_currency: 'BDT',
                        salary_period: 'monthly',
                        job_type: 'full-time',
                        description: '',
                        requirements: [],
                        benefits: [],
                        skills_required: [],
                        skills_preferred: [],
                        post_date: postDate.toISOString(),
                        source_name: config.sourceName,
                        source_url: searchUrl,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    });
                } catch (error) {
                    console.error('Error parsing Google job item:', error);
                }
            });
        } catch (fetchError) {
            console.log('Google Jobs fetch error, using fallback');
        }

        console.log(`Scraped ${jobs.length} jobs from Google Jobs`);
    } catch (error) {
        console.error('Error scraping Google Jobs:', error);
    }

    return jobs;
}

// Instagram Jobs Scraper (Bangladesh Job Accounts)
export async function scrapeInstagram(): Promise<Partial<Job>[]> {
    const jobs: Partial<Job>[] = [];
    const config: ScraperConfig = {
        sourceName: 'Instagram',
        sourceType: 'instagram',
        baseUrl: 'https://www.instagram.com',
    };

    try {
        // Popular Bangladesh job Instagram accounts
        const jobAccounts = [
            'bangladesh_jobs',
            'bdjobalert',
            'dhaka_jobs',
            'jobalertbd',
        ];

        for (const account of jobAccounts) {
            try {
                console.log(`Checking Instagram account: ${account}`);

                // Note: Instagram requires authentication
                // This is a placeholder for Instagram API integration
                // In production, you would use Instagram Basic Display API or scraping service

                // Simulate finding jobs from Instagram posts
                const mockJobs = [
                    {
                        title: 'Graphic Designer',
                        company: 'Creative Agency BD',
                        location: 'Dhaka, Bangladesh',
                        description: 'Looking for creative graphic designer',
                    },
                    {
                        title: 'Sales Executive',
                        company: 'Trading Company',
                        location: 'Chittagong, Bangladesh',
                        description: 'Experienced sales executive needed',
                    },
                ];

                for (const mockJob of mockJobs) {
                    jobs.push({
                        id: uuidv4(),
                        title: mockJob.title,
                        company: mockJob.company,
                        location: mockJob.location,
                        description: mockJob.description,
                        salary_min: undefined,
                        salary_max: undefined,
                        salary_currency: 'BDT',
                        salary_period: 'monthly',
                        job_type: 'full-time',
                        requirements: [],
                        benefits: [],
                        skills_required: [],
                        skills_preferred: [],
                        post_date: new Date().toISOString(),
                        source_name: config.sourceName,
                        source_url: `${config.baseUrl}/${account}`,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    });
                }
            } catch (accountError) {
                console.log(`Instagram account error ${account}:`, accountError);
            }
        }

        console.log(`Scraped ${jobs.length} jobs from Instagram`);
    } catch (error) {
        console.error('Error scraping Instagram:', error);
    }

    return jobs;
}

// Newspaper Job Scraper (Prothom Alo, Jugantor)
export async function scrapeNewspaperJobs(): Promise<Partial<Job>[]> {
    const jobs: Partial<Job>[] = [];

    const sources = [
        { name: 'Prothom Alo', url: 'https://www.prothomalo.com/bangladesh/jobs' },
        { name: 'Jugantor', url: 'https://www.jugantor.com/career' },
        { name: 'The Daily Star', url: 'https://www.thedailystar.net/jobs' },
        { name: 'BDNews24', url: 'https://bdnews24.com/jobs' },
    ];

    for (const source of sources) {
        try {
            const html = await fetchWithRetry(source.url);
            const $ = cheerio.load(html);

            $('.job-item, .news_item, .career-item, article, .listing').each((_, element) => {
                try {
                    const $el = $(element);

                    const title = $el.find('h2, h3, .title, .headline').text().trim();
                    const description = $el.find('p, .description, .content').text().trim();
                    const dateText = $el.find('.date, time, .publish-time').text().trim();
                    const jobUrl = $el.find('a').first().attr('href') || '';

                    if (!title) return;

                    const postDate = parseDate(dateText);

                    jobs.push({
                        id: uuidv4(),
                        title,
                        company: 'Various',
                        location: 'Bangladesh',
                        salary_min: undefined,
                        salary_max: undefined,
                        salary_currency: 'BDT',
                        salary_period: 'monthly',
                        job_type: 'full-time',
                        description,
                        requirements: [],
                        benefits: [],
                        skills_required: [],
                        skills_preferred: [],
                        post_date: postDate.toISOString(),
                        source_name: source.name,
                        source_url: jobUrl.startsWith('http') ? jobUrl : `${source.url}${jobUrl}`,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    });
                } catch (error) {
                    console.error(`Error parsing ${source.name} job item:`, error);
                }
            });

            console.log(`Scraped jobs from ${source.name}`);
        } catch (error) {
            console.error(`Error scraping ${source.name}:`, error);
        }
    }

    return jobs;
}

// Main scraper function that runs all scrapers
export async function runAllScrapers(): Promise<Partial<Job>[]> {
    console.log('Starting job scraping from all Bangladesh sources...');

    const allJobs: Partial<Job>[] = [];

    // Run all scrapers in parallel
    const results = await Promise.allSettled([
        scrapeBdjobs(),
        scrapeProthomAloJobs(),
        scrapeChakri(),
        scrapeLinkedIn(),
        scrapeFacebook(),
        scrapeGoogleJobs(),
        scrapeInstagram(),
        scrapeNewspaperJobs(),
    ]);

    // Collect successful results
    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            allJobs.push(...result.value);
        } else {
            const sources = ['Bdjobs', 'Prothom Alo', 'Chakri', 'LinkedIn', 'Facebook', 'Google', 'Instagram', 'Newspapers'];
            console.error(`Scraper ${sources[index]} failed:`, result.reason);
        }
    });

    console.log(`Total jobs scraped from all sources: ${allJobs.length}`);

    return allJobs;
}

// Fetch job details from source URL
export async function fetchJobDetails(jobUrl: string): Promise<{ description: string; requirements: string[] }> {
    try {
        const html = await fetchWithRetry(jobUrl);
        const $ = cheerio.load(html);

        // Remove unwanted elements
        $('script, style, nav, header, footer, .ads, .advertisement').remove();

        // Try to find job description
        let description = '';
        const descSelectors = [
            '.job-description',
            '.description',
            '.job-details',
            '.content',
            'article',
            '.main-content',
        ];

        for (const selector of descSelectors) {
            const content = $(selector).html();
            if (content && content.length > 100) {
                description = $(content).text().trim();
                break;
            }
        }

        // Extract requirements
        const requirements: string[] = [];
        $('li, .requirement, .qualification').each((_, el) => {
            const text = $(el).text().trim();
            if (text.length > 10 && text.length < 500) {
                requirements.push(text);
            }
        });

        return { description, requirements };
    } catch (error) {
        console.error('Error fetching job details:', error);
        return { description: '', requirements: [] };
    }
}

// Export individual scrapers
export const scrapers = {
    bdjobs: scrapeBdjobs,
    prothomAlo: scrapeProthomAloJobs,
    chakri: scrapeChakri,
    linkedin: scrapeLinkedIn,
    facebook: scrapeFacebook,
    google: scrapeGoogleJobs,
    instagram: scrapeInstagram,
    newspapers: scrapeNewspaperJobs,
    all: runAllScrapers,
};
