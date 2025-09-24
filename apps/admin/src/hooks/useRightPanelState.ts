import { useState } from 'react'
import type { RightPanelState, RightPanelStateHook } from '@/types/menu-editor'
/**
 * Hook for managing right panel state for menu item creation and editing
 * Handles switching between empty, create, and edit modes
 */
export function useRightPanelState(): RightPanelStateHook {
  const [state, setState] = useState<RightPanelState>({
    mode: 'empty',
    isFormDirty: false
  })

  const selectMenuItemForEdit = (menuItem: any) => {
    setState({
      mode: 'edit',
      selectedMenuItem: menuItem,
      selectedSubcategoryId: undefined,
      isFormDirty: false
    })
  }

  const selectSubcategoryForCreate = (subcategoryId: string) => {
    setState({
      mode: 'create',
      selectedMenuItem: undefined,
      selectedSubcategoryId: subcategoryId,
      isFormDirty: false
    })
  }

  const clearSelection = () => {
    setState({
      mode: 'empty',
      selectedMenuItem: undefined,
      selectedSubcategoryId: undefined,
      isFormDirty: false
    })
  }

  const setFormDirty = (dirty: boolean) => {
    setState(prev => ({ ...prev, isFormDirty: dirty }))
  }

  return {
    ...state,
    selectMenuItemForEdit,
    selectSubcategoryForCreate,
    clearSelection,
    setFormDirty
  }
}