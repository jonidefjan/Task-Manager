/**
 * Task list component with optimized rendering
 */

import { memo, useMemo } from 'react';
import { TaskItem } from '../molecules/TaskItem/TaskItem';
import type { TaskListProps } from '../../types/components';

export const TaskList = memo(
  ({
    tasks,
    editingTaskId,
    onToggleStatus,
    onDelete,
    onStartEdit,
    onSaveEdit,
    onCancelEdit,
    testId,
  }: TaskListProps) => {
    const listStyles = {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px',
    };

    const emptyStyles = {
      textAlign: 'center' as const,
      padding: '48px 24px',
      color: '#64748b',
      fontSize: '16px',
      fontStyle: 'italic' as const,
    };

    const taskItems = useMemo(() => {
      return tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          isEditing={editingTaskId === task.id}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
          onStartEdit={onStartEdit}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
          testId={`${testId}-item-${task.id}`}
        />
      ));
    }, [
      tasks,
      editingTaskId,
      onToggleStatus,
      onDelete,
      onStartEdit,
      onSaveEdit,
      onCancelEdit,
      testId,
    ]);

    if (tasks.length === 0) {
      return (
        <div style={emptyStyles} data-testid={`${testId}-empty`}>
          No tasks found. Add a task to get started!
        </div>
      );
    }

    return (
      <div style={listStyles} data-testid={testId} role='list'>
        {taskItems}
      </div>
    );
  }
);

TaskList.displayName = 'TaskList';
