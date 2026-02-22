'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    FileText, Sparkles, Copy, Download, RefreshCw, Search, Bell, User, Award, Bookmark, Briefcase,
    Menu, X, ChevronRight, Check, Loader2
} from 'lucide-react';
import { SkeuButton, SkeuCard, SkeuBadge } from '@/components/ui/skeuomorphic';
import { useAuthStore, useUIStore } from '@/store';

const coverLetterTemplates = [
    {
        id: 'professional',
        name: 'Professional',
        description: 'Traditional and formal cover letter',
        icon: '💼',
    },
    {
        id: 'creative',
        name: 'Creative',
        description: 'Modern and engaging cover letter',
        icon: '🎨',
    },
    {
        id: 'technical',
        name: 'Technical',
        description: 'Focus on skills and experience',
        icon: '⚙️',
    },
    {
        id: 'entry',
        name: 'Entry Level',
        description: 'For fresh graduates and new professionals',
        icon: '🎓',
    },
];

export default function CoverLetterGeneratorPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { isMenuOpen, toggleMenu } = useUIStore();

    const [step, setStep] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedLetter, setGeneratedLetter] = useState('');

    const [formData, setFormData] = useState({
        jobTitle: '',
        companyName: '',
        jobDescription: '',
        yourName: user?.name || '',
        yourEmail: user?.email || '',
        yourPhone: '',
        yourExperience: '',
        yourSkills: '',
        whyInterested: '',
        template: 'professional',
        tone: 'professional' as 'professional' | 'friendly' | 'enthusiastic',
    });

    const handleGenerate = async () => {
        setIsGenerating(true);

        // Simulate AI generation
        await new Promise(resolve => setTimeout(resolve, 2000));

        const letter = generateCoverLetter(formData);
        setGeneratedLetter(letter);
        setStep(4);
        setIsGenerating(false);
    };

    const generateCoverLetter = (data: typeof formData): string => {
        const templates: Record<string, string> = {
            professional: `
${data.yourName}
${data.yourEmail}
${data.yourPhone}

${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}

${data.companyName}

Dear Hiring Manager,

I am writing to express my strong interest in the ${data.jobTitle} position at ${data.companyName}. With ${data.yourExperience || 'relevant experience'} in the field, I am confident that my skills and passion make me an excellent candidate for this role.

${data.whyInterested ? `What draws me to ${data.companyName} is ${data.whyInterested}. I am excited about the opportunity to contribute to your team and help achieve your company's goals.` : 'I am excited about the opportunity to contribute to your team and help achieve your company\'s goals.'}

${data.yourSkills ? `Throughout my career, I have developed strong expertise in ${data.yourSkills}. These skills, combined with my dedication to continuous learning and professional growth, enable me to deliver high-quality results in challenging environments.` : 'Throughout my career, I have developed strong expertise in my field. My dedication to continuous learning and professional growth enables me to deliver high-quality results in challenging environments.'}

I am particularly drawn to this role because it aligns perfectly with my career aspirations and allows me to leverage my strengths in meaningful ways. I am confident that my background and enthusiasm would make me a valuable addition to your team.

I would welcome the opportunity to discuss how my experience and skills can benefit ${data.companyName}. Thank you for considering my application. I look forward to the possibility of contributing to your esteemed organization.

Sincerely,
${data.yourName}
            `.trim(),
            creative: `
Hey there! 👋

I'm ${data.yourName}, and I'm thrilled to apply for the ${data.jobTitle} role at ${data.companyName}!

${data.whyInterested ? `Here's the thing – ${data.whyInterested}. That's exactly why I knew I had to throw my hat in the ring.` : 'Something about your company really resonates with me, and I knew I had to throw my hat in the ring.'}

${data.yourSkills ? `Let me tell you what I bring to the table: ${data.yourSkills}. But beyond the skills, I bring passion, creativity, and a genuine love for what I do.` : 'I bring passion, creativity, and a genuine love for what I do.'}

${data.yourExperience ? `With ${data.yourExperience} under my belt, I've learned that the best work comes from combining technical expertise with creative thinking.` : 'I\'ve learned that the best work comes from combining technical expertise with creative thinking.'}

I'd love to chat more about how we can create something amazing together. Let's connect!

Cheers,
${data.yourName}
${data.yourEmail}
            `.trim(),
            technical: `
${data.yourName}
${data.yourEmail} | ${data.yourPhone}

TECHNICAL COVER LETTER
Position: ${data.jobTitle}
Company: ${data.companyName}

Dear Technical Hiring Team,

I am applying for the ${data.jobTitle} position at ${data.companyName}. Below is a summary of my technical qualifications and relevant experience.

TECHNICAL SKILLS:
${data.yourSkills || 'Technical skills as per resume'}

EXPERIENCE:
${data.yourExperience || 'Professional experience as per resume'}

WHY THIS ROLE:
${data.whyInterested || 'I am interested in this role because it aligns with my technical expertise and career goals.'}

I am confident that my technical background and problem-solving abilities would be valuable assets to your engineering team. I am particularly interested in the technical challenges this role presents and the opportunity to work with cutting-edge technologies.

I would appreciate the opportunity to discuss my technical qualifications in more detail. Thank you for your consideration.

Best regards,
${data.yourName}
            `.trim(),
            entry: `
${data.yourName}
${data.yourEmail}
${data.yourPhone}

Dear Hiring Manager,

I am excited to apply for the ${data.jobTitle} position at ${data.companyName}. As a recent graduate${data.yourExperience ? ` with ${data.yourExperience}` : ''}, I am eager to begin my career and contribute to your organization.

${data.whyInterested ? `I am particularly drawn to ${data.companyName} because ${data.whyInterested}. Your company's commitment to excellence and innovation aligns with my own values and career aspirations.` : 'I am particularly drawn to your company\'s commitment to excellence and innovation, which aligns with my own values and career aspirations.'}

${data.yourSkills ? `During my studies and internships, I have developed skills in ${data.yourSkills}. I am eager to apply these skills in a professional setting and continue learning from experienced professionals.` : 'During my studies and internships, I have developed relevant skills that I am eager to apply in a professional setting.'}

What I lack in extensive professional experience, I make up for with enthusiasm, a strong work ethic, and a genuine passion for learning. I am a quick learner and thrive in collaborative environments where I can contribute while growing professionally.

I would be honored to begin my career at ${data.companyName} and contribute to your team's success. Thank you for considering my application. I look forward to the opportunity to discuss how I can add value to your organization.

Sincerely,
${data.yourName}
            `.trim(),
        };

        return templates[data.template] || templates.professional;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedLetter);
    };

    const handleDownload = () => {
        const blob = new Blob([generatedLetter], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cover-letter-${formData.companyName}-${formData.jobTitle}.txt`.toLowerCase().replace(/\s+/g, '-');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-skeu-cream">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-skeu-cream/95 backdrop-blur-sm border-b border-skeu-tan/20">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-skeu-raised">
                                <span className="text-white font-bold text-lg">J</span>
                            </div>
                            <span className="font-display font-bold text-xl text-skeu-dark hidden sm:block">Jobora</span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-1">
                            <Link href="/" className="nav-item">
                                <Search className="w-4 h-4" />
                                <span>Search</span>
                            </Link>
                            <Link href="/saved" className="nav-item">
                                <Bookmark className="w-4 h-4" />
                                <span>Saved</span>
                            </Link>
                            <Link href="/applications" className="nav-item">
                                <Briefcase className="w-4 h-4" />
                                <span>Applications</span>
                            </Link>
                            <Link href="/gamification" className="nav-item">
                                <Award className="w-4 h-4" />
                                <span>Rewards</span>
                            </Link>
                        </nav>

                        <div className="flex items-center gap-2">
                            <Link href="/notifications" className="p-2 rounded-lg hover:bg-skeu-cream transition-colors relative">
                                <Bell className="w-5 h-5 text-skeu-brown" />
                            </Link>
                            <Link href="/profile" className="hidden md:flex">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-skeu-tan to-skeu-brown flex items-center justify-center text-white font-semibold shadow-skeu-raised">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                            </Link>
                            <button onClick={toggleMenu} className="md:hidden p-2 rounded-lg hover:bg-skeu-cream">
                                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <nav className="flex flex-col p-4 gap-2 md:hidden">
                            <Link href="/" className="nav-item" onClick={() => toggleMenu()}>
                                <Search className="w-4 h-4" />
                                <span>Search</span>
                            </Link>
                            <Link href="/saved" className="nav-item" onClick={() => toggleMenu()}>
                                <Bookmark className="w-4 h-4" />
                                <span>Saved</span>
                            </Link>
                            <Link href="/applications" className="nav-item" onClick={() => toggleMenu()}>
                                <Briefcase className="w-4 h-4" />
                                <span>Applications</span>
                            </Link>
                            <Link href="/gamification" className="nav-item" onClick={() => toggleMenu()}>
                                <Award className="w-4 h-4" />
                                <span>Rewards</span>
                            </Link>
                            <Link href="/profile" className="nav-item" onClick={() => toggleMenu()}>
                                <User className="w-4 h-4" />
                                <span>Profile</span>
                            </Link>
                        </nav>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 py-6">
                {/* Page Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto mb-4 shadow-skeu-raised">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-display font-bold text-skeu-dark">AI Cover Letter Generator</h1>
                    <p className="text-skeu-brown mt-1">Create a professional cover letter in minutes</p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {[1, 2, 3, 4].map((s) => (
                        <div key={s} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= s
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-skeu-cream text-skeu-brown'
                                }`}>
                                {step > s ? <Check className="w-4 h-4" /> : s}
                            </div>
                            {s < 4 && (
                                <div className={`w-12 h-1 ${step > s ? 'bg-primary-500' : 'bg-skeu-cream'}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step 1: Job Details */}
                {step === 1 && (
                    <SkeuCard>
                        <h2 className="text-lg font-semibold text-skeu-dark mb-4">Job Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-skeu-dark mb-2">
                                    Job Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.jobTitle}
                                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                    placeholder="e.g., Software Engineer"
                                    className="w-full px-4 py-3 rounded-lg border border-skeu-tan/30 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-skeu-dark mb-2">
                                    Company Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                    placeholder="e.g., Tech Solutions BD"
                                    className="w-full px-4 py-3 rounded-lg border border-skeu-tan/30 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-skeu-dark mb-2">
                                    Job Description (Optional)
                                </label>
                                <textarea
                                    value={formData.jobDescription}
                                    onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                                    placeholder="Paste the job description here for a more tailored cover letter..."
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-lg border border-skeu-tan/30 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <SkeuButton
                                onClick={() => setStep(2)}
                                disabled={!formData.jobTitle || !formData.companyName}
                            >
                                Continue
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </SkeuButton>
                        </div>
                    </SkeuCard>
                )}

                {/* Step 2: Your Information */}
                {step === 2 && (
                    <SkeuCard>
                        <h2 className="text-lg font-semibold text-skeu-dark mb-4">Your Information</h2>
                        <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-skeu-dark mb-2">
                                        Your Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.yourName}
                                        onChange={(e) => setFormData({ ...formData, yourName: e.target.value })}
                                        placeholder="Full name"
                                        className="w-full px-4 py-3 rounded-lg border border-skeu-tan/30 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-skeu-dark mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.yourEmail}
                                        onChange={(e) => setFormData({ ...formData, yourEmail: e.target.value })}
                                        placeholder="email@example.com"
                                        className="w-full px-4 py-3 rounded-lg border border-skeu-tan/30 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-skeu-dark mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={formData.yourPhone}
                                    onChange={(e) => setFormData({ ...formData, yourPhone: e.target.value })}
                                    placeholder="+880 1XXX-XXXXXX"
                                    className="w-full px-4 py-3 rounded-lg border border-skeu-tan/30 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-skeu-dark mb-2">
                                    Your Experience
                                </label>
                                <input
                                    type="text"
                                    value={formData.yourExperience}
                                    onChange={(e) => setFormData({ ...formData, yourExperience: e.target.value })}
                                    placeholder="e.g., 5 years of experience in software development"
                                    className="w-full px-4 py-3 rounded-lg border border-skeu-tan/30 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-skeu-dark mb-2">
                                    Key Skills
                                </label>
                                <input
                                    type="text"
                                    value={formData.yourSkills}
                                    onChange={(e) => setFormData({ ...formData, yourSkills: e.target.value })}
                                    placeholder="e.g., JavaScript, React, Node.js, Project Management"
                                    className="w-full px-4 py-3 rounded-lg border border-skeu-tan/30 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-skeu-dark mb-2">
                                    Why are you interested in this role?
                                </label>
                                <textarea
                                    value={formData.whyInterested}
                                    onChange={(e) => setFormData({ ...formData, whyInterested: e.target.value })}
                                    placeholder="Tell us what excites you about this opportunity..."
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-lg border border-skeu-tan/30 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                                />
                            </div>
                        </div>
                        <div className="flex justify-between mt-6">
                            <SkeuButton variant="secondary" onClick={() => setStep(1)}>
                                Back
                            </SkeuButton>
                            <SkeuButton
                                onClick={() => setStep(3)}
                                disabled={!formData.yourName || !formData.yourEmail}
                            >
                                Continue
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </SkeuButton>
                        </div>
                    </SkeuCard>
                )}

                {/* Step 3: Choose Template */}
                {step === 3 && (
                    <SkeuCard>
                        <h2 className="text-lg font-semibold text-skeu-dark mb-4">Choose Template</h2>
                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                            {coverLetterTemplates.map((template) => (
                                <button
                                    key={template.id}
                                    onClick={() => setFormData({ ...formData, template: template.id })}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${formData.template === template.id
                                            ? 'border-primary-500 bg-primary-50'
                                            : 'border-skeu-tan/30 hover:border-primary-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{template.icon}</span>
                                        <div>
                                            <p className="font-semibold text-skeu-dark">{template.name}</p>
                                            <p className="text-sm text-skeu-brown">{template.description}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <h3 className="text-sm font-medium text-skeu-dark mb-3">Tone</h3>
                        <div className="flex gap-2 mb-6">
                            {['professional', 'friendly', 'enthusiastic'].map((tone) => (
                                <button
                                    key={tone}
                                    onClick={() => setFormData({ ...formData, tone: tone as any })}
                                    className={`px-4 py-2 rounded-lg text-sm capitalize transition-colors ${formData.tone === tone
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-skeu-cream text-skeu-brown hover:bg-primary-100'
                                        }`}
                                >
                                    {tone}
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-between">
                            <SkeuButton variant="secondary" onClick={() => setStep(2)}>
                                Back
                            </SkeuButton>
                            <SkeuButton onClick={handleGenerate} disabled={isGenerating}>
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Generate Cover Letter
                                    </>
                                )}
                            </SkeuButton>
                        </div>
                    </SkeuCard>
                )}

                {/* Step 4: Generated Letter */}
                {step === 4 && (
                    <SkeuCard>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-skeu-dark">Your Cover Letter</h2>
                            <div className="flex items-center gap-2">
                                <SkeuButton variant="secondary" size="sm" onClick={handleCopy}>
                                    <Copy className="w-4 h-4 mr-1" />
                                    Copy
                                </SkeuButton>
                                <SkeuButton variant="secondary" size="sm" onClick={handleDownload}>
                                    <Download className="w-4 h-4 mr-1" />
                                    Download
                                </SkeuButton>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 border border-skeu-tan/30 whitespace-pre-wrap font-mono text-sm text-skeu-dark leading-relaxed">
                            {generatedLetter}
                        </div>

                        <div className="flex justify-between mt-6">
                            <SkeuButton variant="secondary" onClick={() => setStep(3)}>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Regenerate
                            </SkeuButton>
                            <Link href="/">
                                <SkeuButton>
                                    Done
                                </SkeuButton>
                            </Link>
                        </div>
                    </SkeuCard>
                )}
            </main>
        </div>
    );
}
