/**
 * Component prop interfaces following strict typing conventions
 */

import type { ReactNode } from 'react';
import type { TaskEntity, TaskId, TaskCreationData, FilterType } from './core';

export interface BaseComponentProps {
  readonly className?: string;
  readonly testId?: string;
}

export interface ButtonProps extends BaseComponentProps {
  readonly children: ReactNode;
  readonly variant?: 'primary' | 'secondary' | 'danger';
  readonly size?: 'small' | 'medium' | 'large';
  readonly disabled?: boolean;
  readonly onClick?: () => void;
  readonly type?: 'button' | 'submit';
}

export interface InputProps extends BaseComponentProps {
  readonly value: string;
  readonly placeholder?: string;
  readonly disabled?: boolean;
  readonly autoFocus?: boolean;
  readonly maxLength?: number;
  readonly onChange: (value: string) => void;
  readonly onBlur?: () => void;
  readonly onKeyDown?: (key: string) => void;
}

export interface CheckboxProps extends BaseComponentProps {
  readonly checked: boolean;
  readonly disabled?: boolean;
  readonly label?: string;
  readonly onChange: (checked: boolean) => void;
}

export interface TaskItemProps extends BaseComponentProps {
  readonly task: TaskEntity;
  readonly isEditing?: boolean;
  readonly onToggleStatus: (id: TaskId) => void;
  readonly onDelete: (id: TaskId) => void;
  readonly onStartEdit: (id: TaskId) => void;
  readonly onSaveEdit: (id: TaskId, title: string) => void;
  readonly onCancelEdit: () => void;
}

export interface TaskFormProps extends BaseComponentProps {
  readonly onSubmit: (data: TaskCreationData) => void;
  readonly isLoading?: boolean;
}

export interface TaskListProps extends BaseComponentProps {
  readonly tasks: readonly TaskEntity[];
  readonly editingTaskId?: TaskId;
  readonly onToggleStatus: (id: TaskId) => void;
  readonly onDelete: (id: TaskId) => void;
  readonly onStartEdit: (id: TaskId) => void;
  readonly onSaveEdit: (id: TaskId, title: string) => void;
  readonly onCancelEdit: () => void;
}

export interface TaskFilterProps extends BaseComponentProps {
  readonly currentFilter: FilterType;
  readonly taskCount: number;
  readonly completedCount: number;
  readonly onFilterChange: (filter: FilterType) => void;
  readonly onClearCompleted: () => void;
}
