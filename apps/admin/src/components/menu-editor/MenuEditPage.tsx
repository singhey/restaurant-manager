import React from 'react'
import { MenuStructurePanel } from './MenuStructurePanel'
import { MenuEditorErrorBoundary } from './MenuEditorErrorBoundary'

/**
 * Main page component for the menu editor
 * Implements a two-panel layout with menu structure on the left and item editor on the right
 */
export function MenuEditPage() {
  return (
    <MenuEditorErrorBoundary>
      <div className="flex h-full min-h-[600px] gap-4">
        {/* Left Panel - Menu Structure */}
        <div className="w-1/2 min-w-[400px] border-r border-border pr-4">
          <MenuStructurePanel />
        </div>
        
        {/* Right Panel - Item Editor (Future Implementation) */}
        <div className="w-1/2 min-w-[400px] pl-4">
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Item Editor</h3>
              <p className="text-sm">Select a category or subcategory to manage items</p>
            </div>
          </div>
        </div>
      </div>
    </MenuEditorErrorBoundary>
  )
}