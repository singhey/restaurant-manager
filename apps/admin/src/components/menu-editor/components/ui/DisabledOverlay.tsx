interface DisabledOverlayProps {
  isVisible: boolean
  message: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * Reusable disabled state overlay component
 */
export function DisabledOverlay({ 
  isVisible, 
  message, 
  size = 'md',
  className = '' 
}: DisabledOverlayProps) {
  if (!isVisible) return null

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-3 py-1',
    lg: 'text-sm px-4 py-2'
  }

  return (
    <div className={`absolute inset-0 bg-muted/20 rounded flex items-center justify-center pointer-events-none ${className}`}>
      <div className={`bg-muted/80 text-muted-foreground rounded font-medium border border-muted-foreground/20 ${sizeClasses[size]}`}>
        {message}
      </div>
    </div>
  )
}