import React from 'react'
import { Button } from '@workspace/ui/components/button'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface MenuEditorErrorBoundaryProps {
  children: React.ReactNode
}

/**
 * Error boundary component for the menu editor
 * Catches and displays errors that occur within the menu editor components
 */
export class MenuEditorErrorBoundary extends React.Component<
  MenuEditorErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: MenuEditorErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Menu Editor Error:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full min-h-[400px]">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-destructive mb-2">
                Something went wrong
              </h2>
              <p className="text-muted-foreground mb-4">
                An error occurred while loading the menu editor. Please try again.
              </p>
              {this.state.error && (
                <details className="text-left bg-muted p-3 rounded text-sm mb-4">
                  <summary className="cursor-pointer font-medium mb-2">
                    Error Details
                  </summary>
                  <pre className="whitespace-pre-wrap text-xs">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
            </div>
            <div className="space-x-2">
              <Button onClick={this.handleRetry} variant="default">
                Try Again
              </Button>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
              >
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}