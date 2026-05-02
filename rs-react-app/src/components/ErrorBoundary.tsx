import { Component, type ReactNode } from 'react';
import ErrorHandler from './ErrorHandler.tsx';

interface ErrorBoundaryState {
  error: Error | null;
}

export default class ErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(
      'Render error caught by ErrorBoundary:',
      error,
      info.componentStack
    );
  }

  render() {
    if (this.state.error) {
      return <ErrorHandler errorData={this.state.error} />;
    }
    return this.props.children;
  }
}
