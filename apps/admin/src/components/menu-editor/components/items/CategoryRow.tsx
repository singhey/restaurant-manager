import React, { useState } from 'react';
import { GripVertical, Edit, Trash2, Check, X, ChevronDown } from 'lucide-react';
import type { Category } from "@workspace/db/generated/prisma/client";
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';

// Reusable Drag Handle Component
interface DragHandleProps {
  className?: string;
}

export function DragHandle({ className = "" }: DragHandleProps) {
  return (
    <div className={`cursor-grab active:cursor-grabbing p-3 hover:bg-muted ${className}`}>
      <GripVertical className="h-4 w-4 text-muted-foreground" />
    </div>
  );
}

// Reusable Action Buttons Component
interface ActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
  className?: string;
}

export function ActionButtons({ onEdit, onDelete}: ActionButtonsProps) {
  return (
    <div className={`flex`}>
      <Button
        onClick={onEdit}
        variant={"ghost"}
        size={"icon"}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        onClick={onDelete}
        variant={"ghost"}
        size={"icon"}
        className='text-red-400 hover:text-red-600'
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

// Reusable Inline Edit Component
interface InlineEditProps {
  value: string;
  onSave: (value: string) => void;
  onCancel: () => void;
  className?: string;
}

export function InlineEdit({ value, onSave, onCancel, className = "" }: InlineEditProps) {
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    if (editValue.trim() && editValue !== value) {
      onSave(editValue.trim());
    } else {
      onCancel();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className={`flex items-center flex-1 ${className}`}>
      <Input
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
        onBlur={handleSave}
      />
      <Button
        onClick={handleSave}
        variant={"ghost"}
        size={"icon"}
      >
        <Check className="h-4 w-4" />
      </Button>
    </div>
  );
}

// Main CategoryRow Component
type CategoryRowProps = {
  category: Category & {
    children: Category[]
  };
  onEdit?: (categoryId: string, newName: string) => void;
  onDelete?: (categoryId: string) => void;
  className?: string;
}

export function CategoryRow({ category, onEdit, onDelete, className = "" }: CategoryRowProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (newName: string) => {
    onEdit?.(category.id, newName);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete?.(category.id);
  };

  return (
    <div className={`flex items-center border-b group w-full h-12 ${className}`}>
      <DragHandle />

      <div className="flex-1 flex items-center border-l">
        {isEditing ? (
          <InlineEdit
            value={category.name}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <span className="text-sm font-medium px-3 py-3 flex-1 cursor-pointer">
            {category.name}
          </span>
        )}
      </div>
      <div className={`${isEditing ? 'hidden' : 'hidden group-hover:flex'}`}>
        <ActionButtons onEdit={handleEdit} onDelete={handleDelete} />
      </div>
        <ChevronDown className='mr-2 h-4 animate rotate-270'/>
    </div>
  );
}

export default CategoryRow;