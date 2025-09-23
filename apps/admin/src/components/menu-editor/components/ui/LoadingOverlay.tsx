import { Loader2 } from 'lucide-react'

interface LoadingOverlayProps {
  isVisible: boolean
  title: string
  subtitle?: string
  className?: string
}

/**
 * Reusable loading overlay component with consistent animations
 */
export function LoadingOverlay({ 
  isVisible, 
  title, 
  subtitle,
  className = '' 
}: LoadingOverlayProps) {
  if (!isVisible) return null

  return (
    <div className={`absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300 ${className}`}>
      <div className="flex items-center gap-3 bg-card border-2 border-primary/20 rounded-lg px-4 py-3 shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
        <div className="relative">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <div className="absolute inset-0 h-5 w-5 border-2 border-primary/20 rounded-full animate-ping" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium">{title}</span>
          {subtitle && (
            <span className="text-xs text-muted-foreground">{subtitle}</span>
          )}
        </div>
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-primary rounded-full animate-bounce" />
          <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
      </div>
    </div>
  )
}