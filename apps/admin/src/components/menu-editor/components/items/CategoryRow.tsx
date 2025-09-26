import React, { useState, type Dispatch, type SetStateAction } from 'react';
import { GripVertical, Edit, Trash2, Check, X, ChevronDown, Plus } from 'lucide-react';
import type { Category, MenuItem } from "@workspace/db/generated/prisma/client";
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Modal } from '@/components/generic/Modal';
import { AddSubcategoryForm } from '../forms/AddSubcategoryForm';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Confirm } from '@/components/generic/Confirm';
import { useDeleteMenuItem } from '@workspace/db/hooks/trpc';

// Reusable Drag Handle Component
interface DragHandleProps {
  className?: string;
}

export function DragHandle({ className = "" }: DragHandleProps) {
  return (
    <div className={`cursor-grab active:cursor-grabbing p-3 border-l hover:bg-muted ${className}`}>
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

export function ActionButtons({ onEdit, onDelete }: ActionButtonsProps) {
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
    children?: Category[]
  };
  onEdit?: (categoryId: string, newName: string) => void;
  onDelete?: (categoryId: string) => void;
  className?: string;
}

type SubCategoryRowProps = {
  category: Category & {
    menuItems?: MenuItem[]
  },
  onEdit?: (categoryId: string, newName: string) => void;
  onDelete?: (categoryId: string) => void;
  className?: string;
}

export function SubCategoryRender({category, onEdit, onDelete, className = ""}: SubCategoryRowProps) {
  const [opened, setOpened] = useState(false)
  const {dish} = useSearch({strict: false}) as any
  const {mutate: deleteDish} = useDeleteMenuItem()
  const navigate = useNavigate()
  return <>
    <div className={`flex flex-col items-center border-b group w-full h-10 ${className} ${opened && ''}`}>
      <CategoryRowComp category={category} onDelete={onDelete} onEdit={onEdit} opened={opened} setOpened={setOpened} />
    </div>
    {
      opened && category.menuItems?.map(menuItem => <div className='w-full pl-4'>
        <div className={`flex w-full h-full items-center group relative ${dish === menuItem.id && 'bg-accent border-r-2 border-r-red-800'}`} onClick={() => navigate({
          from: '/restaurant/manage/$restaurantId/menu/edit',
          search: {
            dish: menuItem.id,
          }})
        }>
          <DragHandle />
          <span className="text-sm font-medium p-3 flex-1 cursor-pointer truncate overflow-ellipsis">
            {menuItem.name}
          </span>
          <Button size="icon" variant="ghost" className='bg-background hidden group-hover:flex mr-2' onClick={async (e) => {
            e.stopPropagation()
            if(await Confirm.call({
              title: "Confirm Delete?",
              description: "Do you wish to delete dish " + menuItem.name
            })) {
              deleteDish({
                where: {
                  id: menuItem.id
                }
              })
            }
          }}>
            <Trash2 />
          </Button>
        </div>
      </div>)
    }
  </>
}

export function CategoryRow({ category, onEdit, onDelete, className = "" }: CategoryRowProps) {
  const [opened, setOpened] = useState(false)

  return (<>
    <div className={`flex flex-col items-center border-b group w-full h-10 ${className} ${opened && 'bg-primary-foreground'}`}>
      <CategoryRowComp category={category} onDelete={onDelete} onEdit={onEdit} opened={opened} setOpened={setOpened} />
    </div>
    {opened && <div className='pl-10 w-full'>
      {category.children?.map(category => <SubCategoryRender key={category.id} category={category} onDelete={onDelete} onEdit={onEdit} />)}
      <div className='flex justify-start py-2 w-full'>
        {opened && <Button variant={"ghost"} className='' onClick={() => Modal.call({
          title: "Add Subcategory",
          description: `Add a subcategory to ${category.name}`,
          dialogContent: <AddSubcategoryForm
            parentCategoryId={category.id}
            onCancel={() => Modal.end(false)}
            onSubmit={() => Modal.end(true)} />
        })}> <Plus /> Add SubCategory</Button>}
      </div>
    </div>}
  </>
  );
}

export function CategoryRowComp({ category, onEdit, onDelete, opened, setOpened }: CategoryRowProps & { opened: boolean, setOpened: Dispatch<SetStateAction<boolean>> }) {
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
  return <div className='flex w-full h-full items-center relative'>
    <DragHandle />

    <div className="flex-1 flex items-center">
      {isEditing ? (
        <InlineEdit
          value={category.name}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <span className="text-sm font-medium p-3 flex-1 cursor-pointer truncate overflow-ellipsis" onClick={() => setOpened(!opened)}>
          {category.name}
        </span>
      )}
    </div>
    <div className={`${isEditing ? 'hidden' : 'hidden group-hover:flex absolute right-8 bg-background'}`}>
      <ActionButtons onEdit={handleEdit} onDelete={handleDelete} />
    </div>
    <ChevronDown className={`mr-2 h-4 transition ${opened ? 'rotate-0' : 'rotate-[-90deg]'}`} />
  </div>
}

export default CategoryRow;