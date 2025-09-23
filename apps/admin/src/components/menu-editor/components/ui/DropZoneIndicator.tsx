import type { ReactNode } from 'react'

interface DropZoneIndicatorProps {
  isActive: boolean
  children: ReactNode
  className?: string
}

/**
 * Reusable drop zone indicator component with consistent animations
 */
export function DropZoneIndicator({ isActive, children, className = '' }: DropZoneIndicatorProps) {
  if (!isActive) return null

  return (
    <div className={`absolute inset-0 border-2 border-dashed border-primary/70 rounded-lg bg-primary/10 flex items-center justify-center pointer-events-none animate-pulse ${className}`}>
      <div className="bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-semibold shadow-lg border border-primary/30 animate-bounce">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
          {children}
          <div className="w-2 h-2 bg-primary rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
        </div>
      </div>
    </div>
  )
}