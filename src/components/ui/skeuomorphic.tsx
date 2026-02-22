import React from 'react';
import { cn } from '@/lib/utils';

// Skeuomorphic Button Component
interface SkeuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'metallic' | 'leather';
    size?: 'sm' | 'md' | 'lg';
    raised?: boolean;
    children: React.ReactNode;
}

export const SkeuButton: React.FC<SkeuButtonProps> = ({
    variant = 'primary',
    size = 'md',
    raised = true,
    className,
    children,
    disabled,
    ...props
}) => {
    const baseStyles = `
    relative font-semibold rounded-lg
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    active:translate-y-0.5
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
  `;

    const variants = {
        primary: `
      bg-gradient-to-b from-orange-400 to-orange-600
      text-white
      border border-orange-700
      shadow-skeu-button
      hover:from-orange-500 hover:to-orange-700
      hover:shadow-skeu-button-hover
      focus:ring-orange-500
      before:absolute before:inset-0 before:rounded-lg
      before:bg-gradient-to-b before:from-white/20 before:to-transparent
      before:pointer-events-none
    `,
        secondary: `
      bg-gradient-to-b from-skeu-cream to-skeu-tan
      text-skeu-dark
      border border-skeu-brown
      shadow-skeu-button
      hover:from-skeu-tan hover:to-skeu-brown
      hover:shadow-skeu-button-hover
      focus:ring-skeu-brown
    `,
        success: `
      bg-gradient-to-b from-green-400 to-green-600
      text-white
      border border-green-700
      shadow-skeu-button
      hover:from-green-500 hover:to-green-700
      hover:shadow-skeu-button-hover
      focus:ring-green-500
    `,
        danger: `
      bg-gradient-to-b from-red-400 to-red-600
      text-white
      border border-red-700
      shadow-skeu-button
      hover:from-red-500 hover:to-red-700
      hover:shadow-skeu-button-hover
      focus:ring-red-500
    `,
        metallic: `
      bg-gradient-to-br from-gray-200 via-gray-400 to-gray-300
      text-gray-800
      border border-gray-500
      shadow-metallic
      hover:from-gray-300 hover:via-gray-500 hover:to-gray-400
      focus:ring-gray-400
      before:absolute before:inset-0 before:rounded-lg
      before:bg-gradient-to-b before:from-white/40 before:to-transparent
      before:pointer-events-none
    `,
        leather: `
      bg-gradient-to-b from-skeu-brown to-skeu-dark
      text-skeu-cream
      border border-skeu-dark
      shadow-skeu-button
      hover:from-skeu-dark hover:to-gray-900
      hover:shadow-skeu-button-hover
      focus:ring-skeu-brown
    `,
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    return (
        <button
            className={cn(
                baseStyles,
                variants[variant],
                sizes[size],
                raised && 'hover:-translate-y-0.5',
                className
            )}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

// Skeuomorphic Input Component
interface SkeuInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const SkeuInput: React.FC<SkeuInputProps> = ({
    label,
    error,
    icon,
    className,
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-skeu-dark mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-skeu-brown">
                        {icon}
                    </div>
                )}
                <input
                    className={cn(
                        `w-full px-4 py-2.5 rounded-lg`,
                        `bg-gradient-to-b from-skeu-light to-skeu-cream`,
                        `border-2 border-skeu-tan`,
                        `shadow-skeu-inset`,
                        `text-skeu-dark placeholder-skeu-brown/50`,
                        `focus:outline-none focus:border-skeu-brown focus:ring-2 focus:ring-skeu-brown/20`,
                        `transition-all duration-200`,
                        icon && 'pl-10',
                        error && 'border-red-400 focus:border-red-500 focus:ring-red-200',
                        className
                    )}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

// Skeuomorphic Textarea Component
interface SkeuTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const SkeuTextarea: React.FC<SkeuTextareaProps> = ({
    label,
    error,
    className,
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-skeu-dark mb-1.5">
                    {label}
                </label>
            )}
            <textarea
                className={cn(
                    `w-full px-4 py-2.5 rounded-lg`,
                    `bg-gradient-to-b from-skeu-light to-skeu-cream`,
                    `border-2 border-skeu-tan`,
                    `shadow-skeu-inset`,
                    `text-skeu-dark placeholder-skeu-brown/50`,
                    `focus:outline-none focus:border-skeu-brown focus:ring-2 focus:ring-skeu-brown/20`,
                    `transition-all duration-200`,
                    `resize-y min-h-[100px]`,
                    error && 'border-red-400 focus:border-red-500 focus:ring-red-200',
                    className
                )}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

// Skeuomorphic Card Component
interface SkeuCardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'raised' | 'flat' | 'inset';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    onClick?: () => void;
}

export const SkeuCard: React.FC<SkeuCardProps> = ({
    children,
    className,
    variant = 'raised',
    padding = 'md',
    onClick,
}) => {
    const variants = {
        raised: `
      bg-gradient-to-b from-white to-skeu-light
      border border-skeu-tan
      shadow-skeu-card
    `,
        flat: `
      bg-skeu-cream
      border border-skeu-tan
    `,
        inset: `
      bg-gradient-to-b from-skeu-light to-skeu-cream
      border border-skeu-tan
      shadow-skeu-inset
    `,
    };

    const paddings = {
        none: '',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
    };

    return (
        <div
            className={cn(
                'rounded-xl',
                variants[variant],
                paddings[padding],
                onClick && 'cursor-pointer hover:shadow-lg transition-shadow',
                className
            )}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

// Skeuomorphic Badge Component
interface SkeuBadgeProps {
    children: React.ReactNode;
    variant?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'default';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const SkeuBadge: React.FC<SkeuBadgeProps> = ({
    children,
    variant = 'default',
    size = 'md',
    className,
}) => {
    const variants = {
        bronze: `
      bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800
      text-amber-100
      border border-amber-900
      shadow-skeu-badge
    `,
        silver: `
      bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500
      text-gray-800
      border border-gray-600
      shadow-skeu-badge
    `,
        gold: `
      bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600
      text-yellow-900
      border border-yellow-700
      shadow-skeu-badge
      before:absolute before:inset-0 before:rounded-full
      before:bg-gradient-to-br before:from-white/30 before:to-transparent
      before:pointer-events-none
    `,
        platinum: `
      bg-gradient-to-br from-gray-100 via-blue-100 to-gray-200
      text-gray-700
      border border-gray-400
      shadow-skeu-badge
    `,
        default: `
      bg-gradient-to-b from-skeu-tan to-skeu-brown
      text-white
      border border-skeu-dark
      shadow-skeu-badge
    `,
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1.5 text-base',
    };

    return (
        <span
            className={cn(
                'relative inline-flex items-center rounded-full font-semibold',
                variants[variant],
                sizes[size],
                className
            )}
        >
            {children}
        </span>
    );
};

// Skeuomorphic 3D Badge (for achievements)
interface Skeu3DBadgeProps {
    icon: React.ReactNode;
    title: string;
    description?: string;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
    earned?: boolean;
    className?: string;
}

export const Skeu3DBadge: React.FC<Skeu3DBadgeProps> = ({
    icon,
    title,
    description,
    tier,
    earned = true,
    className,
}) => {
    const tierStyles = {
        bronze: `
      bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800
      border-amber-900
      text-amber-100
    `,
        silver: `
      bg-gradient-to-br from-gray-200 via-gray-400 to-gray-300
      border-gray-500
      text-gray-800
    `,
        gold: `
      bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600
      border-yellow-700
      text-yellow-900
    `,
        platinum: `
      bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100
      border-gray-300
      text-gray-600
    `,
    };

    return (
        <div
            className={cn(
                'relative flex flex-col items-center p-4 rounded-2xl',
                'border-4',
                'shadow-2xl',
                earned ? tierStyles[tier] : 'bg-gray-200 border-gray-400 text-gray-500 opacity-50',
                className
            )}
        >
            {/* Shine effect */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-transparent to-black/10" />
            </div>

            {/* Icon */}
            <div className={cn(
                'relative w-16 h-16 rounded-full flex items-center justify-center mb-2',
                'bg-gradient-to-br from-white/30 to-black/10',
                'border-2 border-inherit',
                'shadow-inner'
            )}>
                <span className="text-3xl">{icon}</span>
            </div>

            {/* Title */}
            <h4 className="font-bold text-center text-sm">{title}</h4>

            {/* Description */}
            {description && (
                <p className="text-xs text-center mt-1 opacity-80">{description}</p>
            )}

            {/* Tier indicator */}
            <div className={cn(
                'absolute -top-2 -right-2 w-6 h-6 rounded-full',
                'flex items-center justify-center text-xs font-bold',
                'border-2',
                tier === 'bronze' && 'bg-amber-800 border-amber-900 text-amber-200',
                tier === 'silver' && 'bg-gray-500 border-gray-600 text-white',
                tier === 'gold' && 'bg-yellow-600 border-yellow-700 text-white',
                tier === 'platinum' && 'bg-blue-200 border-blue-300 text-blue-800',
            )}>
                {tier === 'platinum' ? '★' : tier === 'gold' ? '✦' : tier === 'silver' ? '◆' : '●'}
            </div>
        </div>
    );
};

// Skeuomorphic Toggle Switch
interface SkeuToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
    className?: string;
}

export const SkeuToggle: React.FC<SkeuToggleProps> = ({
    checked,
    onChange,
    label,
    disabled = false,
    className,
}) => {
    return (
        <label className={cn('inline-flex items-center cursor-pointer', disabled && 'opacity-50 cursor-not-allowed', className)}>
            <div className="relative">
                <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={(e) => !disabled && onChange(e.target.checked)}
                    disabled={disabled}
                />
                <div
                    className={cn(
                        'w-14 h-8 rounded-full transition-colors duration-200',
                        'border-2',
                        checked
                            ? 'bg-gradient-to-b from-green-400 to-green-600 border-green-700'
                            : 'bg-gradient-to-b from-gray-300 to-gray-400 border-gray-500',
                        'shadow-inner'
                    )}
                />
                <div
                    className={cn(
                        'absolute top-1 w-6 h-6 rounded-full transition-transform duration-200',
                        'bg-gradient-to-b from-white to-gray-100',
                        'border-2 border-gray-300',
                        'shadow-md',
                        checked ? 'translate-x-7' : 'translate-x-1'
                    )}
                />
            </div>
            {label && (
                <span className="ml-3 text-sm font-medium text-skeu-dark">{label}</span>
            )}
        </label>
    );
};

// Skeuomorphic Progress Bar
interface SkeuProgressProps {
    value: number;
    max?: number;
    label?: string;
    showValue?: boolean;
    variant?: 'default' | 'gold' | 'silver' | 'bronze';
    className?: string;
}

export const SkeuProgress: React.FC<SkeuProgressProps> = ({
    value,
    max = 100,
    label,
    showValue = true,
    variant = 'default',
    className,
}) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    const variants = {
        default: 'bg-gradient-to-r from-orange-400 to-orange-600',
        gold: 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600',
        silver: 'bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500',
        bronze: 'bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800',
    };

    return (
        <div className={cn('w-full', className)}>
            {(label || showValue) && (
                <div className="flex justify-between items-center mb-1">
                    {label && <span className="text-sm font-medium text-skeu-dark">{label}</span>}
                    {showValue && (
                        <span className="text-sm font-semibold text-skeu-brown">
                            {value} / {max}
                        </span>
                    )}
                </div>
            )}
            <div className="relative h-4 rounded-full bg-gradient-to-b from-skeu-light to-skeu-cream border-2 border-skeu-tan shadow-inner overflow-hidden">
                <div
                    className={cn(
                        'h-full rounded-full transition-all duration-500 ease-out',
                        variants[variant]
                    )}
                    style={{ width: `${percentage}%` }}
                >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
                </div>
            </div>
        </div>
    );
};

// Skeuomorphic Select Dropdown
interface SkeuSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: Array<{ value: string; label: string }>;
    label?: string;
    placeholder?: string;
    className?: string;
}

export const SkeuSelect: React.FC<SkeuSelectProps> = ({
    value,
    onChange,
    options,
    label,
    placeholder = 'Select...',
    className,
}) => {
    return (
        <div className={cn('w-full', className)}>
            {label && (
                <label className="block text-sm font-medium text-skeu-dark mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={cn(
                        'w-full px-4 py-2.5 rounded-lg appearance-none',
                        'bg-gradient-to-b from-skeu-light to-skeu-cream',
                        'border-2 border-skeu-tan',
                        'shadow-skeu-inset',
                        'text-skeu-dark',
                        'focus:outline-none focus:border-skeu-brown focus:ring-2 focus:ring-skeu-brown/20',
                        'transition-all duration-200',
                        'cursor-pointer'
                    )}
                >
                    <option value="" disabled>{placeholder}</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {/* Dropdown arrow */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-skeu-brown">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

// Skeuomorphic Avatar
interface SkeuAvatarProps {
    src?: string;
    name: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export const SkeuAvatar: React.FC<SkeuAvatarProps> = ({
    src,
    name,
    size = 'md',
    className,
}) => {
    const sizes = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-14 h-14 text-base',
        xl: 'w-20 h-20 text-xl',
    };

    const initials = name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div
            className={cn(
                'relative rounded-full overflow-hidden',
                'bg-gradient-to-br from-skeu-tan to-skeu-brown',
                'border-2 border-skeu-dark',
                'shadow-skeu-raised',
                'flex items-center justify-center',
                'font-bold text-white',
                sizes[size],
                className
            )}
        >
            {src ? (
                <img src={src} alt={name} className="w-full h-full object-cover" />
            ) : (
                <span>{initials}</span>
            )}
        </div>
    );
};

// Skeuomorphic Tab Component
interface SkeuTabsProps {
    tabs: Array<{ id: string; label: string; icon?: React.ReactNode }>;
    activeTab: string;
    onChange: (tabId: string) => void;
    className?: string;
}

export const SkeuTabs: React.FC<SkeuTabsProps> = ({
    tabs,
    activeTab,
    onChange,
    className,
}) => {
    return (
        <div
            className={cn(
                'flex rounded-xl p-1',
                'bg-gradient-to-b from-skeu-cream to-skeu-tan',
                'border border-skeu-brown',
                'shadow-skeu-inset',
                className
            )}
        >
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={cn(
                        'flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200',
                        'flex items-center justify-center gap-2',
                        activeTab === tab.id
                            ? 'bg-gradient-to-b from-white to-skeu-light text-skeu-dark shadow-skeu-raised'
                            : 'text-skeu-brown hover:text-skeu-dark'
                    )}
                >
                    {tab.icon}
                    {tab.label}
                </button>
            ))}
        </div>
    );
};
