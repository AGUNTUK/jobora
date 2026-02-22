'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    DollarSign, TrendingUp, TrendingDown, BarChart3, PieChart, Search, Bell, User, Award, Bookmark, Briefcase,
    Menu, X, MapPin, Filter, ChevronDown, Info
} from 'lucide-react';
import { SkeuButton, SkeuCard, SkeuBadge } from '@/components/ui/skeuomorphic';
import { useAuthStore, useUIStore } from '@/store';

// Sample salary data
const salaryData = {
    byCategory: [
        { category: 'Technology', avgSalary: 85000, minSalary: 40000, maxSalary: 200000, jobCount: 1250, trend: 12 },
        { category: 'Marketing', avgSalary: 65000, minSalary: 30000, maxSalary: 150000, jobCount: 450, trend: 8 },
        { category: 'Finance', avgSalary: 75000, minSalary: 35000, maxSalary: 180000, jobCount: 380, trend: 5 },
        { category: 'Design', avgSalary: 55000, minSalary: 25000, maxSalary: 120000, jobCount: 280, trend: 15 },
        { category: 'Sales', avgSalary: 60000, minSalary: 25000, maxSalary: 150000, jobCount: 520, trend: -3 },
        { category: 'HR', avgSalary: 50000, minSalary: 25000, maxSalary: 100000, jobCount: 180, trend: 2 },
    ],
    byLocation: [
        { location: 'Dhaka', avgSalary: 72000, jobCount: 2500, trend: 10 },
        { location: 'Chittagong', avgSalary: 55000, jobCount: 450, trend: 7 },
        { location: 'Sylhet', avgSalary: 48000, jobCount: 180, trend: 5 },
        { location: 'Khulna', avgSalary: 45000, jobCount: 150, trend: 3 },
        { location: 'Rajshahi', avgSalary: 42000, jobCount: 120, trend: 2 },
        { location: 'Remote', avgSalary: 95000, jobCount: 380, trend: 25 },
    ],
    byExperience: [
        { level: 'Entry Level', avgSalary: 35000, range: '25,000 - 50,000' },
        { level: 'Mid Level', avgSalary: 65000, range: '50,000 - 100,000' },
        { level: 'Senior Level', avgSalary: 120000, range: '80,000 - 180,000' },
        { level: 'Executive', avgSalary: 200000, range: '150,000 - 350,000+' },
    ],
    trendingRoles: [
        { role: 'Software Engineer', avgSalary: 95000, growth: 18 },
        { role: 'Data Scientist', avgSalary: 110000, growth: 25 },
        { role: 'Product Manager', avgSalary: 100000, growth: 15 },
        { role: 'UX Designer', avgSalary: 70000, growth: 20 },
        { role: 'Digital Marketing Manager', avgSalary: 75000, growth: 12 },
    ],
    salaryTrend: [
        { month: 'Jan', avg: 68000 },
        { month: 'Feb', avg: 70000 },
        { month: 'Mar', avg: 72000 },
        { month: 'Apr', avg: 71000 },
        { month: 'May', avg: 74000 },
        { month: 'Jun', avg: 76000 },
        { month: 'Jul', avg: 78000 },
        { month: 'Aug', avg: 80000 },
        { month: 'Sep', avg: 82000 },
        { month: 'Oct', avg: 81000 },
        { month: 'Nov', avg: 83000 },
        { month: 'Dec', avg: 85000 },
    ],
};

export default function SalaryInsightsPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { isMenuOpen, toggleMenu } = useUIStore();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const [compareMode, setCompareMode] = useState(false);
    const [compareItems, setCompareItems] = useState<string[]>([]);

    const formatSalary = (amount: number) => {
        return `৳${amount.toLocaleString()}`;
    };

    const toggleCompare = (item: string) => {
        if (compareItems.includes(item)) {
            setCompareItems(compareItems.filter(i => i !== item));
        } else if (compareItems.length < 3) {
            setCompareItems([...compareItems, item]);
        }
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
            <main className="max-w-7xl mx-auto px-4 py-6">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-display font-bold text-skeu-dark">Salary Insights</h1>
                    <p className="text-skeu-brown mt-1">Explore salary trends across Bangladesh job market</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <SkeuCard className="text-center">
                        <DollarSign className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-skeu-dark">৳72K</p>
                        <p className="text-sm text-skeu-brown">Avg. Salary</p>
                    </SkeuCard>
                    <SkeuCard className="text-center">
                        <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-skeu-dark">+12%</p>
                        <p className="text-sm text-skeu-brown">YoY Growth</p>
                    </SkeuCard>
                    <SkeuCard className="text-center">
                        <Briefcase className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-skeu-dark">3,780</p>
                        <p className="text-sm text-skeu-brown">Jobs Analyzed</p>
                    </SkeuCard>
                    <SkeuCard className="text-center">
                        <BarChart3 className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-skeu-dark">25+</p>
                        <p className="text-sm text-skeu-brown">Categories</p>
                    </SkeuCard>
                </div>

                <div className="grid lg:grid-cols-2 gap-6 mb-8">
                    {/* Salary by Category */}
                    <SkeuCard>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-skeu-dark">Salary by Category</h2>
                            <button className="text-sm text-primary-500 hover:text-primary-600">View All</button>
                        </div>
                        <div className="space-y-4">
                            {salaryData.byCategory.map((cat) => (
                                <div key={cat.category} className="group">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-skeu-dark">{cat.category}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-skeu-brown">{formatSalary(cat.avgSalary)}/mo</span>
                                            <span className={`flex items-center text-xs ${cat.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                {cat.trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                                {Math.abs(cat.trend)}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-skeu-cream rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all group-hover:opacity-80"
                                            style={{ width: `${(cat.avgSalary / 200000) * 100}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs text-skeu-brown mt-1">
                                        <span>Min: {formatSalary(cat.minSalary)}</span>
                                        <span>Max: {formatSalary(cat.maxSalary)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SkeuCard>

                    {/* Salary by Location */}
                    <SkeuCard>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-skeu-dark">Salary by Location</h2>
                            <button className="text-sm text-primary-500 hover:text-primary-600">View All</button>
                        </div>
                        <div className="space-y-4">
                            {salaryData.byLocation.map((loc) => (
                                <div key={loc.location} className="flex items-center justify-between p-3 rounded-lg hover:bg-skeu-cream transition-colors">
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-5 h-5 text-skeu-brown" />
                                        <div>
                                            <p className="font-medium text-skeu-dark">{loc.location}</p>
                                            <p className="text-xs text-skeu-brown">{loc.jobCount.toLocaleString()} jobs</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-skeu-dark">{formatSalary(loc.avgSalary)}</p>
                                        <p className={`text-xs flex items-center justify-end ${loc.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {loc.trend > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                                            {loc.trend}%
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SkeuCard>
                </div>

                {/* Experience Level Salary */}
                <SkeuCard className="mb-8">
                    <h2 className="text-lg font-semibold text-skeu-dark mb-4">Salary by Experience Level</h2>
                    <div className="grid md:grid-cols-4 gap-4">
                        {salaryData.byExperience.map((exp) => (
                            <div key={exp.level} className="p-4 rounded-xl bg-skeu-cream text-center">
                                <p className="font-semibold text-skeu-dark mb-1">{exp.level}</p>
                                <p className="text-2xl font-bold text-primary-500">{formatSalary(exp.avgSalary)}</p>
                                <p className="text-sm text-skeu-brown mt-1">{exp.range}</p>
                            </div>
                        ))}
                    </div>
                </SkeuCard>

                {/* Trending Roles */}
                <SkeuCard className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-skeu-dark">Trending Roles</h2>
                        <SkeuBadge variant="gold">Hot Jobs</SkeuBadge>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-skeu-tan/20">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-skeu-brown">Role</th>
                                    <th className="text-right py-3 px-4 text-sm font-medium text-skeu-brown">Avg. Salary</th>
                                    <th className="text-right py-3 px-4 text-sm font-medium text-skeu-brown">Growth</th>
                                    <th className="text-right py-3 px-4 text-sm font-medium text-skeu-brown">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salaryData.trendingRoles.map((role) => (
                                    <tr key={role.role} className="border-b border-skeu-tan/10 hover:bg-skeu-cream">
                                        <td className="py-3 px-4 font-medium text-skeu-dark">{role.role}</td>
                                        <td className="py-3 px-4 text-right text-skeu-dark">{formatSalary(role.avgSalary)}</td>
                                        <td className="py-3 px-4 text-right">
                                            <span className="inline-flex items-center text-green-500">
                                                <TrendingUp className="w-4 h-4 mr-1" />
                                                {role.growth}%
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <Link href={`/?search=${encodeURIComponent(role.role)}`}>
                                                <SkeuButton variant="secondary" size="sm">View Jobs</SkeuButton>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </SkeuCard>

                {/* Salary Trend Chart */}
                <SkeuCard>
                    <h2 className="text-lg font-semibold text-skeu-dark mb-4">Salary Trend (2024)</h2>
                    <div className="h-48 flex items-end justify-between gap-2">
                        {salaryData.salaryTrend.map((data, index) => (
                            <div key={data.month} className="flex-1 flex flex-col items-center">
                                <div
                                    className="w-full bg-gradient-to-t from-primary-500 to-primary-300 rounded-t-lg transition-all hover:from-primary-600 hover:to-primary-400"
                                    style={{ height: `${(data.avg / 90000) * 100}%` }}
                                    title={`${data.month}: ${formatSalary(data.avg)}`}
                                />
                                <span className="text-xs text-skeu-brown mt-2">{data.month}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-center gap-4 mt-4 text-sm text-skeu-brown">
                        <span>Min: ৳68,000</span>
                        <span>•</span>
                        <span>Max: ৳85,000</span>
                        <span>•</span>
                        <span className="text-green-500 flex items-center">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            +25% YoY
                        </span>
                    </div>
                </SkeuCard>

                {/* Info Banner */}
                <div className="mt-8 p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm text-blue-800">
                            <strong>How we calculate:</strong> Salary data is aggregated from job postings across multiple sources including Bdjobs, LinkedIn, and company websites. Data is updated weekly.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
