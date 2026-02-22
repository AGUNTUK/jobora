'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    FileText, Plus, Edit2, Trash2, Download, Copy, Eye,
    Briefcase, GraduationCap, Award, Languages, FolderOpen,
    ChevronDown, ChevronUp, Save, X, Check
} from 'lucide-react';
import { SkeuButton, SkeuCard, SkeuInput, SkeuTextarea, SkeuBadge } from '@/components/ui/skeuomorphic';

interface ResumeData {
    id: string;
    title: string;
    summary: string;
    skills: string[];
    experience: Array<{
        id: string;
        title: string;
        company: string;
        location: string;
        start_date: string;
        end_date?: string;
        current: boolean;
        description: string;
    }>;
    education: Array<{
        id: string;
        degree: string;
        institution: string;
        location: string;
        start_date: string;
        end_date?: string;
        current: boolean;
        field_of_study: string;
        gpa?: number;
    }>;
    certifications: Array<{
        id: string;
        name: string;
        issuer: string;
        date: string;
    }>;
    languages: Array<{
        name: string;
        proficiency: string;
    }>;
    is_primary: boolean;
    created_at: string;
    updated_at: string;
}

export default function ResumeBuilderPage() {
    const [resumes, setResumes] = useState<ResumeData[]>([
        {
            id: '1',
            title: 'Software Engineer Resume',
            summary: 'Experienced software engineer with 5+ years of expertise in full-stack development. Proficient in React, Node.js, and cloud technologies. Passionate about building scalable applications and mentoring junior developers.',
            skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
            experience: [
                {
                    id: '1',
                    title: 'Senior Software Engineer',
                    company: 'Tech Solutions BD',
                    location: 'Dhaka',
                    start_date: '2021-01',
                    current: true,
                    description: 'Lead development of web applications using React and Node.js. Mentored team of 5 junior developers.',
                },
                {
                    id: '2',
                    title: 'Software Engineer',
                    company: 'StartUp Inc',
                    location: 'Dhaka',
                    start_date: '2019-06',
                    end_date: '2020-12',
                    current: false,
                    description: 'Developed and maintained multiple client projects. Implemented CI/CD pipelines.',
                },
            ],
            education: [
                {
                    id: '1',
                    degree: 'BSc in Computer Science',
                    institution: 'University of Dhaka',
                    location: 'Dhaka',
                    start_date: '2015',
                    end_date: '2019',
                    current: false,
                    field_of_study: 'Computer Science',
                    gpa: 3.75,
                },
            ],
            certifications: [
                { id: '1', name: 'AWS Certified Developer', issuer: 'Amazon Web Services', date: '2023' },
            ],
            languages: [
                { name: 'Bengali', proficiency: 'Native' },
                { name: 'English', proficiency: 'Professional' },
            ],
            is_primary: true,
            created_at: '2024-01-01',
            updated_at: '2024-01-15',
        },
    ]);

    const [activeResume, setActiveResume] = useState<ResumeData | null>(resumes[0] || null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingSection, setEditingSection] = useState<string | null>(null);
    const [newSkill, setNewSkill] = useState('');

    const handleAddSkill = () => {
        if (newSkill.trim() && activeResume) {
            setActiveResume({
                ...activeResume,
                skills: [...activeResume.skills, newSkill.trim()],
            });
            setNewSkill('');
        }
    };

    const handleRemoveSkill = (skill: string) => {
        if (activeResume) {
            setActiveResume({
                ...activeResume,
                skills: activeResume.skills.filter(s => s !== skill),
            });
        }
    };

    return (
        <div className="min-h-screen pb-20 md:pb-8">
            {/* Header */}
            <header className="header sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold text-skeu-dark">Resume Builder</h1>
                        <div className="flex items-center gap-2">
                            <SkeuButton variant="primary" size="sm">
                                <Plus className="w-4 h-4 mr-1" />
                                New Resume
                            </SkeuButton>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-6">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Resume List Sidebar */}
                    <div className="lg:col-span-1">
                        <SkeuCard variant="raised" className="sticky top-24">
                            <h2 className="font-bold text-lg text-skeu-dark mb-4">Your Resumes</h2>
                            <div className="space-y-3">
                                {resumes.map((resume) => (
                                    <div
                                        key={resume.id}
                                        className={`p-3 rounded-lg cursor-pointer transition-all ${activeResume?.id === resume.id
                                                ? 'bg-gradient-to-b from-white to-skeu-light shadow-skeu-raised border border-primary-300'
                                                : 'bg-skeu-cream hover:bg-skeu-tan'
                                            }`}
                                        onClick={() => setActiveResume(resume)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-5 h-5 text-skeu-brown" />
                                                <span className="font-medium text-skeu-dark">{resume.title}</span>
                                            </div>
                                            {resume.is_primary && (
                                                <SkeuBadge variant="gold" size="sm">Primary</SkeuBadge>
                                            )}
                                        </div>
                                        <p className="text-xs text-skeu-brown mt-1">
                                            Updated {new Date(resume.updated_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full mt-4 p-3 border-2 border-dashed border-skeu-tan rounded-lg text-skeu-brown hover:border-skeu-brown transition-colors flex items-center justify-center gap-2">
                                <Plus className="w-5 h-5" />
                                Create New Resume
                            </button>
                        </SkeuCard>
                    </div>

                    {/* Resume Editor */}
                    <div className="lg:col-span-2 space-y-6">
                        {activeResume ? (
                            <>
                                {/* Resume Header */}
                                <SkeuCard variant="raised">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-skeu-dark">{activeResume.title}</h2>
                                            <p className="text-skeu-brown">Last updated: {new Date(activeResume.updated_at).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <SkeuButton variant="secondary" size="sm">
                                                <Eye className="w-4 h-4 mr-1" />
                                                Preview
                                            </SkeuButton>
                                            <SkeuButton variant="primary" size="sm">
                                                <Download className="w-4 h-4 mr-1" />
                                                Download
                                            </SkeuButton>
                                        </div>
                                    </div>

                                    {/* Professional Summary */}
                                    <div className="mb-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-bold text-skeu-dark">Professional Summary</h3>
                                            <button
                                                className="p-1 rounded hover:bg-skeu-cream"
                                                onClick={() => setEditingSection('summary')}
                                            >
                                                <Edit2 className="w-4 h-4 text-skeu-brown" />
                                            </button>
                                        </div>
                                        {editingSection === 'summary' ? (
                                            <div>
                                                <SkeuTextarea
                                                    value={activeResume.summary}
                                                    onChange={(e) => setActiveResume({ ...activeResume, summary: e.target.value })}
                                                    rows={4}
                                                />
                                                <div className="flex gap-2 mt-2">
                                                    <SkeuButton variant="primary" size="sm" onClick={() => setEditingSection(null)}>
                                                        <Check className="w-4 h-4 mr-1" />
                                                        Save
                                                    </SkeuButton>
                                                    <SkeuButton variant="secondary" size="sm" onClick={() => setEditingSection(null)}>
                                                        Cancel
                                                    </SkeuButton>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-skeu-dark">{activeResume.summary}</p>
                                        )}
                                    </div>

                                    {/* Skills */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-bold text-skeu-dark">Skills</h3>
                                            <button
                                                className="p-1 rounded hover:bg-skeu-cream"
                                                onClick={() => setEditingSection('skills')}
                                            >
                                                <Edit2 className="w-4 h-4 text-skeu-brown" />
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {activeResume.skills.map((skill, i) => (
                                                <span
                                                    key={i}
                                                    className="px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg font-medium text-sm flex items-center gap-1"
                                                >
                                                    {skill}
                                                    {editingSection === 'skills' && (
                                                        <button onClick={() => handleRemoveSkill(skill)}>
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    )}
                                                </span>
                                            ))}
                                        </div>
                                        {editingSection === 'skills' && (
                                            <div className="flex gap-2 mt-3">
                                                <SkeuInput
                                                    placeholder="Add a skill"
                                                    value={newSkill}
                                                    onChange={(e) => setNewSkill(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                                                />
                                                <SkeuButton variant="primary" size="sm" onClick={handleAddSkill}>
                                                    Add
                                                </SkeuButton>
                                                <SkeuButton variant="secondary" size="sm" onClick={() => setEditingSection(null)}>
                                                    Done
                                                </SkeuButton>
                                            </div>
                                        )}
                                    </div>
                                </SkeuCard>

                                {/* Experience */}
                                <SkeuCard variant="raised">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-lg text-skeu-dark flex items-center gap-2">
                                            <Briefcase className="w-5 h-5" />
                                            Work Experience
                                        </h3>
                                        <SkeuButton variant="secondary" size="sm">
                                            <Plus className="w-4 h-4 mr-1" />
                                            Add
                                        </SkeuButton>
                                    </div>
                                    <div className="space-y-4">
                                        {activeResume.experience.map((exp, index) => (
                                            <div key={exp.id} className={`p-4 rounded-lg bg-skeu-cream ${index > 0 ? 'border-t border-skeu-tan pt-4' : ''}`}>
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="font-bold text-skeu-dark">{exp.title}</h4>
                                                        <p className="text-primary-600 font-medium">{exp.company}</p>
                                                        <p className="text-sm text-skeu-brown">{exp.location} • {exp.start_date} - {exp.current ? 'Present' : exp.end_date}</p>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <button className="p-1.5 rounded hover:bg-skeu-tan">
                                                            <Edit2 className="w-4 h-4 text-skeu-brown" />
                                                        </button>
                                                        <button className="p-1.5 rounded hover:bg-red-100">
                                                            <Trash2 className="w-4 h-4 text-red-500" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-skeu-dark mt-2 text-sm">{exp.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </SkeuCard>

                                {/* Education */}
                                <SkeuCard variant="raised">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-lg text-skeu-dark flex items-center gap-2">
                                            <GraduationCap className="w-5 h-5" />
                                            Education
                                        </h3>
                                        <SkeuButton variant="secondary" size="sm">
                                            <Plus className="w-4 h-4 mr-1" />
                                            Add
                                        </SkeuButton>
                                    </div>
                                    <div className="space-y-4">
                                        {activeResume.education.map((edu) => (
                                            <div key={edu.id} className="p-4 rounded-lg bg-skeu-cream">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="font-bold text-skeu-dark">{edu.degree}</h4>
                                                        <p className="text-primary-600 font-medium">{edu.institution}</p>
                                                        <p className="text-sm text-skeu-brown">{edu.location} • {edu.start_date} - {edu.end_date}</p>
                                                        {edu.gpa && <p className="text-sm text-skeu-brown">GPA: {edu.gpa}</p>}
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <button className="p-1.5 rounded hover:bg-skeu-tan">
                                                            <Edit2 className="w-4 h-4 text-skeu-brown" />
                                                        </button>
                                                        <button className="p-1.5 rounded hover:bg-red-100">
                                                            <Trash2 className="w-4 h-4 text-red-500" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </SkeuCard>

                                {/* Certifications */}
                                <SkeuCard variant="raised">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-lg text-skeu-dark flex items-center gap-2">
                                            <Award className="w-5 h-5" />
                                            Certifications
                                        </h3>
                                        <SkeuButton variant="secondary" size="sm">
                                            <Plus className="w-4 h-4 mr-1" />
                                            Add
                                        </SkeuButton>
                                    </div>
                                    {activeResume.certifications.length > 0 ? (
                                        <div className="space-y-3">
                                            {activeResume.certifications.map((cert) => (
                                                <div key={cert.id} className="flex items-center justify-between p-3 rounded-lg bg-skeu-cream">
                                                    <div>
                                                        <h4 className="font-medium text-skeu-dark">{cert.name}</h4>
                                                        <p className="text-sm text-skeu-brown">{cert.issuer} • {cert.date}</p>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <button className="p-1.5 rounded hover:bg-skeu-tan">
                                                            <Edit2 className="w-4 h-4 text-skeu-brown" />
                                                        </button>
                                                        <button className="p-1.5 rounded hover:bg-red-100">
                                                            <Trash2 className="w-4 h-4 text-red-500" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-skeu-brown text-center py-4">No certifications added yet</p>
                                    )}
                                </SkeuCard>

                                {/* Languages */}
                                <SkeuCard variant="raised">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-lg text-skeu-dark flex items-center gap-2">
                                            <Languages className="w-5 h-5" />
                                            Languages
                                        </h3>
                                        <SkeuButton variant="secondary" size="sm">
                                            <Plus className="w-4 h-4 mr-1" />
                                            Add
                                        </SkeuButton>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {activeResume.languages.map((lang, i) => (
                                            <div key={i} className="px-4 py-2 bg-skeu-cream rounded-lg">
                                                <span className="font-medium text-skeu-dark">{lang.name}</span>
                                                <span className="text-skeu-brown text-sm ml-2">({lang.proficiency})</span>
                                            </div>
                                        ))}
                                    </div>
                                </SkeuCard>

                                {/* Save Button */}
                                <div className="flex justify-end gap-3">
                                    <SkeuButton variant="secondary">
                                        <Eye className="w-4 h-4 mr-2" />
                                        Preview Resume
                                    </SkeuButton>
                                    <SkeuButton variant="primary">
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </SkeuButton>
                                </div>
                            </>
                        ) : (
                            <SkeuCard variant="flat" className="text-center py-12">
                                <FileText className="w-16 h-16 mx-auto text-skeu-tan mb-4" />
                                <h3 className="text-lg font-bold text-skeu-dark mb-2">No Resume Selected</h3>
                                <p className="text-skeu-brown mb-4">Create a new resume or select an existing one to get started.</p>
                                <SkeuButton variant="primary">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create New Resume
                                </SkeuButton>
                            </SkeuCard>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
