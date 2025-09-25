import React, { type ReactNode } from 'react';

interface LoadingWrapperProps<T> {
  loading: boolean;
  results: T[] | Record<string, any> | null | undefined;
  render: (results: NonNullable<T[]>) => ReactNode;
  loadingComponent?: ReactNode;
  noResultsComponent?: ReactNode;
}

function DefaultLoadingComponent() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <span className="ml-2 text-gray-600">Loading...</span>
    </div>
  );
}

function DefaultNoResultsComponent() {
  return (
    <div className="flex items-center justify-center p-8 text-gray-500">
      <p>No results found</p>
    </div>
  );
}

export function LoadingWrapper<T>({
  loading,
  results,
  render,
  loadingComponent,
  noResultsComponent
}: LoadingWrapperProps<T>) {
  // Show loading state
  if (loading) {
    return <>{loadingComponent || <DefaultLoadingComponent />}</>;
  }

  // Handle null/undefined results
  if (!results) {
    return <>{noResultsComponent || <DefaultNoResultsComponent />}</>;
  }

  // Handle empty arrays
  if (Array.isArray(results) && results.length === 0) {
    return <>{noResultsComponent || <DefaultNoResultsComponent />}</>;
  }

  // Handle empty objects
  if (typeof results === 'object' && !Array.isArray(results) && Object.keys(results).length === 0) {
    return <>{noResultsComponent || <DefaultNoResultsComponent />}</>;
  }

  // Render results
  return <>{render(results as NonNullable<T[]>)}</>;
}

export default LoadingWrapper;