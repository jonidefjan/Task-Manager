/**
 * Task item component for displaying and editing individual tasks
 */

import { useState, useCallback } from 'react';
import { Button } from '../../atoms/Button/Button';
import { Input } from '../../atoms/Input/Input';
import { Checkbox } from '../../atoms/Checkbox/Checkbox';
import type { TaskItemProps } from '../../../types/components';
import './TaskItem.css';

export const TaskItem = ({
  task,
  onToggleStatus,
  onDelete,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  isEditing = false,
  className = '',
  testId,
}: TaskItemProps) => {
  const [editValue, setEditValue] = useState(task.title);
  const isCompleted = task.status === 'completed';

  const handleToggle = useCallback(() => {
    onToggleStatus(task.id);
  }, [task.id, onToggleStatus]);

  const handleDelete = useCallback(() => {
    onDelete(task.id);
  }, [task.id, onDelete]);

  const handleStartEdit = useCallback(() => {
    onStartEdit(task.id);
    setEditValue(task.title);
  }, [task.id, task.title, onStartEdit]);

  const handleSaveEdit = useCallback(() => {
    const trimmedValue = editValue.trim();
    if (trimmedValue && trimmedValue !== task.title) {
      onSaveEdit(task.id, trimmedValue);
    } else {
      onCancelEdit();
    }
  }, [task.id, task.title, editValue, onSaveEdit, onCancelEdit]);

  const handleCancelEdit = useCallback(() => {
    onCancelEdit();
    setEditValue(task.title);
  }, [task.title, onCancelEdit]);

  const handleKeyDown = useCallback((key: string) => {
    if (key === 'Enter') {
      handleSaveEdit();
    } else if (key === 'Escape') {
      handleCancelEdit();
    }
  }, [handleSaveEdit, handleCancelEdit]);

  const itemStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 0',
    borderBottom: '1px solid #f1f5f9',
    backgroundColor: isCompleted ? '#f8fafc' : 'transparent',
  };

  const textStyles = {
    flex: 1,
    textDecoration: isCompleted ? 'line-through' : 'none',
    color: isCompleted ? '#64748b' : '#1e293b',
    cursor: 'pointer',
  };

  const actionsStyles = {
    display: 'flex',
    gap: '8px',
  };

  return (
    <div 
      style={itemStyles}
      className={className}
      data-testid={testId}
    >
      <Checkbox
        checked={isCompleted}
        onChange={handleToggle}
        testId={`${testId}-checkbox`}
      />
      
      {isEditing ? (
        <div style={{ flex: 1, display: 'flex', gap: '8px' }}>
          <Input
            value={editValue}
            onChange={setEditValue}
            onKeyDown={handleKeyDown}
            autoFocus
            testId={`${testId}-edit-input`}
          />
          <Button
            variant="primary"
            size="small"
            onClick={handleSaveEdit}
            testId={`${testId}-save`}
          >
            Save
          </Button>
          <Button
            variant="secondary"
            size="small"
            onClick={handleCancelEdit}
            testId={`${testId}-cancel`}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <>
          <span 
            style={textStyles}
            onClick={handleStartEdit}
            data-testid={`${testId}-text`}
          >
            {task.title}
          </span>
          <div style={actionsStyles}>
            <Button
              variant="secondary"
              size="small"
              onClick={handleStartEdit}
              testId={`${testId}-edit`}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="small"
              onClick={handleDelete}
              testId={`${testId}-delete`}
            >
              Delete
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
