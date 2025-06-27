import { useState, useCallback } from 'react';

interface ErrorState {
  hasError: boolean;
  message: string;
  code?: string;
  details?: any;
}

export function useErrorHandler() {
  const [error, setError] = useState<ErrorState>({
    hasError: false,
    message: '',
  });

  const handleError = useCallback((err: any) => {
    console.error('Error caught by useErrorHandler:', err);
    
    // Format error message based on error type
    let errorMessage = 'An unexpected error occurred';
    let errorCode = 'unknown_error';
    let errorDetails = undefined;
    
    if (err instanceof Error) {
      errorMessage = err.message;
      // @ts-ignore
      errorCode = err.code || 'error';
      // @ts-ignore
      errorDetails = err.details;
    } else if (typeof err === 'string') {
      errorMessage = err;
    } else if (err && typeof err === 'object') {
      errorMessage = err.message || err.error || 'An unexpected error occurred';
      errorCode = err.code || 'error';
      errorDetails = err.details || err.data;
    }
    
    // Set error state
    setError({
      hasError: true,
      message: errorMessage,
      code: errorCode,
      details: errorDetails,
    });
    
    // Return formatted error for additional handling if needed
    return {
      message: errorMessage,
      code: errorCode,
      details: errorDetails,
    };
  }, []);

  const clearError = useCallback(() => {
    setError({
      hasError: false,
      message: '',
    });
  }, []);

  return {
    error,
    handleError,
    clearError,
  };
}