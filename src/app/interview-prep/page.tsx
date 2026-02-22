'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    MessageSquare, Mic, Video, BookOpen, Award, Clock, ChevronRight, Search, Bell, User, Bookmark, Briefcase,
    Menu, X, Play, Pause, RotateCcw, Check, XCircle, Lightbulb, Star
} from 'lucide-react';
import { SkeuButton, SkeuCard, SkeuBadge } from '@/components/ui/skeuomorphic';
import { useAuthStore, useUIStore } from '@/store';

const interviewCategories = [
    { id: 'behavioral', name: 'Behavioral', icon: '🧠', count: 25 },
    { id: 'technical', name: 'Technical', icon: '💻', count: 30 },
    { id: 'situational', name: 'Situational', icon: '🎯', count: 20 },
    { id: 'experience', name: 'Experience', icon: '📊', count: 15 },
];

const sampleQuestions = [
    {
        id: 1,
        category: 'behavioral',
        question: 'Tell me about a time when you had to work with a difficult team member.',
        tips: [
            'Use the STAR method (Situation, Task, Action, Result)',
            'Focus on how you handled the situation professionally',
            'Highlight what you learned from the experience',
        ],
        sampleAnswer: 'In my previous role, I worked with a colleague who often missed deadlines. I scheduled a private conversation to understand their challenges and discovered they were overwhelmed with tasks. I suggested we break down the project into smaller milestones and set up weekly check-ins. This approach improved our collaboration and we successfully delivered the project on time.',
    },
    {
        id: 2,
        category: 'technical',
        question: 'Explain how you would design a scalable web application.',
        tips: [
            'Start with the basic architecture',
            'Discuss database choices and caching strategies',
            'Mention load balancing and horizontal scaling',
        ],
        sampleAnswer: 'I would start with a microservices architecture, using a load balancer to distribute traffic. For the database, I\'d choose PostgreSQL for relational data and Redis for caching. I\'d implement horizontal scaling with containerization using Docker and Kubernetes. For static assets, I\'d use a CDN, and implement message queues for async processing.',
    },
    {
        id: 3,
        category: 'situational',
        question: 'What would you do if you disagreed with your manager\'s decision?',
        tips: [
            'Show respect for hierarchy while demonstrating critical thinking',
            'Explain how you would present your perspective',
            'Emphasize commitment to the final decision',
        ],
        sampleAnswer: 'I would first ensure I understand the reasoning behind the decision by asking clarifying questions. If I still had concerns, I would schedule a private meeting to present my perspective with data and alternative solutions. However, once a final decision is made, I would fully support it and work towards its success.',
    },
    {
        id: 4,
        category: 'experience',
        question: 'Describe a project you\'re most proud of.',
        tips: [
            'Choose a project that demonstrates relevant skills',
            'Quantify the impact if possible',
            'Explain your specific contribution',
        ],
        sampleAnswer: 'I led the development of a customer portal that reduced support tickets by 40%. I architected the frontend using React, implemented real-time notifications, and integrated with our existing CRM. The project was delivered two weeks ahead of schedule and received positive feedback from both customers and stakeholders.',
    },
];

export default function InterviewPrepPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { isMenuOpen, toggleMenu } = useUIStore();

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedTime, setRecordedTime] = useState(0);
    const [practiceMode, setPracticeMode] = useState<'questions' | 'mock'>('questions');
    const [score, setScore] = useState<number | null>(null);

    const filteredQuestions = selectedCategory
        ? sampleQuestions.filter(q => q.category === selectedCategory)
        : sampleQuestions;

    const currentQ = filteredQuestions[currentQuestion];

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRecording) {
            interval = setInterval(() => {
                setRecordedTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleNext = () => {
        setShowAnswer(false);
        setIsRecording(false);
        setRecordedTime(0);
        setCurrentQuestion(prev => (prev + 1) % filteredQuestions.length);
    };

    const handlePrev = () => {
        setShowAnswer(false);
        setIsRecording(false);
        setRecordedTime(0);
        setCurrentQuestion(prev => (prev - 1 + filteredQuestions.length) % filteredQuestions.length);
    };

    const handleScore = (rating: number) => {
        setScore(rating);
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
                        <MessageSquare className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-display font-bold text-skeu-dark">Interview Preparation</h1>
                    <p className="text-skeu-brown mt-1">Practice with AI-powered interview questions</p>
                </div>

                {/* Mode Toggle */}
                <div className="flex justify-center gap-2 mb-8">
                    <button
                        onClick={() => setPracticeMode('questions')}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${practiceMode === 'questions'
                                ? 'bg-primary-500 text-white shadow-skeu-pressed'
                                : 'bg-white text-skeu-brown border border-skeu-tan/30'
                            }`}
                    >
                        <BookOpen className="w-4 h-4 inline mr-2" />
                        Practice Questions
                    </button>
                    <button
                        onClick={() => setPracticeMode('mock')}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${practiceMode === 'mock'
                                ? 'bg-primary-500 text-white shadow-skeu-pressed'
                                : 'bg-white text-skeu-brown border border-skeu-tan/30'
                            }`}
                    >
                        <Video className="w-4 h-4 inline mr-2" />
                        Mock Interview
                    </button>
                </div>

                {practiceMode === 'questions' ? (
                    <>
                        {/* Category Filter */}
                        <div className="flex flex-wrap justify-center gap-2 mb-6">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === null
                                        ? 'bg-primary-500 text-white'
                                        : 'bg-white text-skeu-brown border border-skeu-tan/30 hover:border-primary-300'
                                    }`}
                            >
                                All Questions
                            </button>
                            {interviewCategories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === cat.id
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-white text-skeu-brown border border-skeu-tan/30 hover:border-primary-300'
                                        }`}
                                >
                                    {cat.icon} {cat.name}
                                </button>
                            ))}
                        </div>

                        {/* Question Card */}
                        {currentQ && (
                            <SkeuCard className="mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <SkeuBadge>{currentQ.category}</SkeuBadge>
                                    <span className="text-sm text-skeu-brown">
                                        Question {currentQuestion + 1} of {filteredQuestions.length}
                                    </span>
                                </div>

                                <h2 className="text-xl font-semibold text-skeu-dark mb-6">
                                    {currentQ.question}
                                </h2>

                                {/* Recording Controls */}
                                <div className="flex items-center justify-center gap-4 mb-6">
                                    <button
                                        onClick={() => setIsRecording(!isRecording)}
                                        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isRecording
                                                ? 'bg-red-500 text-white animate-pulse'
                                                : 'bg-primary-500 text-white'
                                            }`}
                                    >
                                        {isRecording ? <Pause className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                                    </button>
                                    <div className="text-2xl font-mono text-skeu-dark">
                                        {formatTime(recordedTime)}
                                    </div>
                                    <button
                                        onClick={() => {
                                            setIsRecording(false);
                                            setRecordedTime(0);
                                        }}
                                        className="w-12 h-12 rounded-full bg-skeu-cream flex items-center justify-center text-skeu-brown"
                                    >
                                        <RotateCcw className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Tips */}
                                <div className="bg-blue-50 rounded-xl p-4 mb-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Lightbulb className="w-5 h-5 text-blue-500" />
                                        <span className="font-medium text-blue-800">Tips</span>
                                    </div>
                                    <ul className="space-y-1">
                                        {currentQ.tips.map((tip, i) => (
                                            <li key={i} className="text-sm text-blue-700 flex items-start gap-2">
                                                <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Show Answer Button */}
                                {!showAnswer ? (
                                    <SkeuButton
                                        variant="secondary"
                                        className="w-full"
                                        onClick={() => setShowAnswer(true)}
                                    >
                                        Show Sample Answer
                                    </SkeuButton>
                                ) : (
                                    <div className="bg-green-50 rounded-xl p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Check className="w-5 h-5 text-green-500" />
                                            <span className="font-medium text-green-800">Sample Answer</span>
                                        </div>
                                        <p className="text-green-700">{currentQ.sampleAnswer}</p>

                                        {/* Self Rating */}
                                        <div className="mt-4 pt-4 border-t border-green-200">
                                            <p className="text-sm text-green-800 mb-2">How would you rate your answer?</p>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        onClick={() => handleScore(star)}
                                                        className="p-1"
                                                    >
                                                        <Star
                                                            className={`w-6 h-6 ${score && star <= score
                                                                    ? 'text-yellow-400 fill-yellow-400'
                                                                    : 'text-gray-300'
                                                                }`}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Navigation */}
                                <div className="flex justify-between mt-6">
                                    <SkeuButton variant="secondary" onClick={handlePrev}>
                                        Previous
                                    </SkeuButton>
                                    <SkeuButton onClick={handleNext}>
                                        Next Question
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </SkeuButton>
                                </div>
                            </SkeuCard>
                        )}
                    </>
                ) : (
                    /* Mock Interview Mode */
                    <SkeuCard className="text-center py-12">
                        <Video className="w-16 h-16 text-primary-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-skeu-dark mb-2">Mock Interview Mode</h3>
                        <p className="text-skeu-brown mb-6">
                            Practice a full mock interview with AI-generated questions tailored to your target role
                        </p>
                        <div className="max-w-md mx-auto space-y-4 mb-6">
                            <select className="w-full px-4 py-3 rounded-lg border border-skeu-tan/30 focus:outline-none focus:ring-2 focus:ring-primary-500">
                                <option>Software Engineer</option>
                                <option>Product Manager</option>
                                <option>Data Scientist</option>
                                <option>UX Designer</option>
                                <option>Marketing Manager</option>
                            </select>
                            <select className="w-full px-4 py-3 rounded-lg border border-skeu-tan/30 focus:outline-none focus:ring-2 focus:ring-primary-500">
                                <option>5 Questions (15 min)</option>
                                <option>10 Questions (30 min)</option>
                                <option>15 Questions (45 min)</option>
                            </select>
                        </div>
                        <SkeuButton size="lg">
                            <Play className="w-5 h-5 mr-2" />
                            Start Mock Interview
                        </SkeuButton>
                    </SkeuCard>
                )}

                {/* Progress Stats */}
                <div className="grid grid-cols-3 gap-4 mt-8">
                    <SkeuCard className="text-center">
                        <p className="text-2xl font-bold text-primary-500">12</p>
                        <p className="text-sm text-skeu-brown">Questions Practiced</p>
                    </SkeuCard>
                    <SkeuCard className="text-center">
                        <p className="text-2xl font-bold text-green-500">4.2</p>
                        <p className="text-sm text-skeu-brown">Avg. Rating</p>
                    </SkeuCard>
                    <SkeuCard className="text-center">
                        <p className="text-2xl font-bold text-blue-500">45m</p>
                        <p className="text-sm text-skeu-brown">Practice Time</p>
                    </SkeuCard>
                </div>
            </main>
        </div>
    );
}
