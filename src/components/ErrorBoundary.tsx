'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { SkeuButton, SkeuCard } from './ui/skeuomorphic';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onReset?: () => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component to catch JavaScript errors anywhere in the child
 * component tree, log those errors, and display a fallback UI.
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Log error to console in development
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        // Store error info for display
        this.setState({ errorInfo });

        // In production, you could send this to an error reporting service
        // Example: Sentry.captureException(error, { extra: errorInfo });
    }

    handleReset = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
        this.props.onReset?.();
    };

    handleGoHome = (): void => {
        window.location.href = '/';
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // Custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <SkeuCard variant="raised" className="p-6 m-4 max-w-md mx-auto text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center mb-4 shadow-skeu-raised">
                        <AlertTriangle className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-skeu-dark mb-2">
                        Something went wrong
                    </h2>
                    <p className="text-skeu-brown mb-4">
                        We encountered an unexpected error. Please try again.
                    </p>
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <details className="text-left mb-4 p-3 bg-red-50 rounded-lg text-sm text-red-800 overflow-auto max-h-40">
                            <summary className="cursor-pointer font-medium">
                                Error Details
                            </summary>
                            <pre className="mt-2 whitespace-pre-wrap">
                                {this.state.error.toString()}
                                {this.state.errorInfo?.componentStack}
                            </pre>
                        </details>
                    )}
                    <div className="flex gap-3 justify-center">
                        <SkeuButton variant="secondary" onClick={this.handleReset}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Try Again
                        </SkeuButton>
                        <SkeuButton variant="primary" onClick={this.handleGoHome}>
                            <Home className="w-4 h-4 mr-2" />
                            Go Home
                        </SkeuButton>
                    </div>
                </SkeuCard>
            );
        }

        return this.props.children;
    }
}

/**
 * Lightweight error boundary for smaller components like cards
 */
export class CardErrorBoundary extends Component<{ children: ReactNode }, State> {
    constructor(props: { children: ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('CardErrorBoundary caught:', error);
    }

    render(): ReactNode {
        if (this.state.hasError) {
            return (
                <div className="p-4 bg-red-50 rounded-lg border border-red-200 text-center">
                    <AlertTriangle className="w-6 h-6 text-red-500 mx-auto mb-2" />
                    <p className="text-sm text-red-600">Failed to load content</p>
                </div>
            );
        }
        return this.props.children;
    }
}

/**
 * Hook to programmatically trigger error boundary reset
 */
export function useErrorBoundary() {
    const [error, setError] = React.useState<Error | null>(null);

    const resetBoundary = React.useCallback(() => {
        setError(null);
    }, []);

    const showBoundary = React.useCallback((error: Error) => {
        setError(error);
    }, []);

    if (error) {
        throw error;
    }

    return { resetBoundary, showBoundary };
}

export default ErrorBoundary;
