'use client';

import Link from 'next/link';
import {
    Briefcase, Mail, Phone, MapPin, Facebook, Twitter,
    Instagram, Linkedin, Youtube, Heart, ExternalLink
} from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        company: [
            { label: 'About Us', href: '/about' },
            { label: 'Careers', href: '/careers' },
            { label: 'Press', href: '/press' },
            { label: 'Blog', href: '/blog' },
        ],
        jobSeekers: [
            { label: 'Browse Jobs', href: '/' },
            { label: 'Career Advice', href: '/career-advice' },
            { label: 'Resume Builder', href: '/resume' },
            { label: 'Salary Guide', href: '/salary-insights' },
        ],
        employers: [
            { label: 'Post a Job', href: '/employers/post' },
            { label: 'Pricing', href: '/employers/pricing' },
            { label: 'Resources', href: '/employers/resources' },
        ],
        support: [
            { label: 'Help Center', href: '/help' },
            { label: 'Contact Us', href: '/contact' },
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Service', href: '/terms' },
        ],
    };

    const socialLinks = [
        { icon: Facebook, href: 'https://facebook.com/jobora', label: 'Facebook' },
        { icon: Twitter, href: 'https://twitter.com/jobora_bd', label: 'Twitter' },
        { icon: Instagram, href: 'https://instagram.com/jobora', label: 'Instagram' },
        { icon: Linkedin, href: 'https://linkedin.com/company/jobora', label: 'LinkedIn' },
        { icon: Youtube, href: 'https://youtube.com/jobora', label: 'YouTube' },
    ];

    return (
        <footer className="bg-gradient-to-b from-skeu-tan to-skeu-brown text-white">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                <Briefcase className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-display font-bold">Jobora</span>
                        </Link>
                        <p className="text-white/80 text-sm mb-4">
                            AI-powered job aggregator for Bangladesh. Find your dream job with smart recommendations and fraud protection.
                        </p>
                        <div className="space-y-2 text-sm">
                            <a href="mailto:hello@jobora.app" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                                <Mail className="w-4 h-4" />
                                hello@jobora.app
                            </a>
                            <a href="tel:+8801234567890" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                                <Phone className="w-4 h-4" />
                                +880 1234-567890
                            </a>
                            <div className="flex items-center gap-2 text-white/80">
                                <MapPin className="w-4 h-4" />
                                Dhaka, Bangladesh
                            </div>
                        </div>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Company</h3>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-white/80 hover:text-white transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Job Seekers Links */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Job Seekers</h3>
                        <ul className="space-y-2">
                            {footerLinks.jobSeekers.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-white/80 hover:text-white transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Employers Links */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Employers</h3>
                        <ul className="space-y-2">
                            {footerLinks.employers.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-white/80 hover:text-white transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Support</h3>
                        <ul className="space-y-2">
                            {footerLinks.support.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-white/80 hover:text-white transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Social Links */}
                <div className="mt-8 pt-8 border-t border-white/20">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>

                        {/* App Download Badges */}
                        <div className="flex items-center gap-4">
                            <a href="#" className="flex items-center gap-2 px-4 py-2 bg-black/20 rounded-lg hover:bg-black/30 transition-colors">
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                </svg>
                                <div className="text-left">
                                    <div className="text-xs text-white/60">Download on the</div>
                                    <div className="text-sm font-semibold">App Store</div>
                                </div>
                            </a>
                            <a href="#" className="flex items-center gap-2 px-4 py-2 bg-black/20 rounded-lg hover:bg-black/30 transition-colors">
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
                                </svg>
                                <div className="text-left">
                                    <div className="text-xs text-white/60">Get it on</div>
                                    <div className="text-sm font-semibold">Google Play</div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/60">
                        <div className="flex items-center gap-1">
                            <span>© {currentYear} Jobora. Made with</span>
                            <Heart className="w-4 h-4 text-red-400 fill-current" />
                            <span>in Bangladesh</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="/privacy" className="hover:text-white transition-colors">
                                Privacy
                            </Link>
                            <Link href="/terms" className="hover:text-white transition-colors">
                                Terms
                            </Link>
                            <Link href="/cookies" className="hover:text-white transition-colors">
                                Cookies
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
