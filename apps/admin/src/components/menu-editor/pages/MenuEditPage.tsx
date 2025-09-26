import { MenuStructurePanel } from './MenuStructurePanel'
import { MenuEditorErrorBoundary } from '../components/MenuEditorErrorBoundary'
import MenuItemPanel from './MenuItemPanel'

/**
 * Main page component for the menu editor
 * Implements a two-panel layout with menu structure on the left and item editor on the right
 */
export function MenuEditPage() {
  return (
    <MenuEditorErrorBoundary>
      <div className="flex w-full h-full min-h-[600px]">
        {/* Left Panel - Menu Structure */}
        <div className="w-1/4 flex">
          <MenuStructurePanel />
        </div>
        
        {/* Right Panel - Item Editor (Future Implementation) */}
        <div className="w-3/4">
          <MenuItemPanel />
        </div>
      </div>
    </MenuEditorErrorBoundary>
  )
}