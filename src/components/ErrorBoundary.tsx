"use client";

import { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 border-2 border-red-500 flex items-center justify-center">
              <span className="text-red-500 text-4xl">!</span>
            </div>
            <h1 className="text-2xl font-bold text-red-400 mb-2">System Breach Detected</h1>
            <p className="text-slate-400 mb-6 text-sm">
              An unexpected error occurred. Our team has been notified.
            </p>
            <Button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = "/";
              }}
              className="bg-cyan-600 hover:bg-cyan-500 text-white"
            >
              Return to Command Center
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
