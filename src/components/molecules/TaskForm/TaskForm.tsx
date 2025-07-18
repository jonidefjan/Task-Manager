/**
 * Task form component for creating new tasks
 */

import { useState, useCallback } from 'react';
import { Button } from '../../atoms/Button/Button';
import { Input } from '../../atoms/Input/Input';
import type { TaskFormProps } from '../../../types/components';
import './TaskForm.css';

export const TaskForm = ({ 
  onSubmit, 
  isLoading = false, 
  className = '', 
  testId 
}: TaskFormProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !isLoading) {
      onSubmit({ title: trimmedValue });
      setInputValue('');
    }
  }, [inputValue, isLoading, onSubmit]);

  const handleKeyDown = useCallback((key: string) => {
    if (key === 'Enter' && inputValue.trim() && !isLoading) {
      onSubmit({ title: inputValue.trim() });
      setInputValue('');
    }
  }, [inputValue, isLoading, onSubmit]);

  const formStyles = {
    display: 'flex',
    gap: '12px',
    padding: '20px 0',
    borderBottom: '1px solid #e2e8f0',
  };

  return (
    <form 
      style={formStyles}
      className={className}
      onSubmit={handleSubmit}
      data-testid={testId}
    >
      <div style={{ flex: 1 }}>
        <Input
          value={inputValue}
          onChange={setInputValue}
          onKeyDown={handleKeyDown}
          placeholder="What needs to be done?"
          disabled={isLoading}
          autoFocus
          testId={`${testId}-input`}
        />
      </div>
      <Button
        type="submit"
        variant="primary"
        disabled={!inputValue.trim() || isLoading}
        testId={`${testId}-submit`}
      >
        {isLoading ? 'Adding...' : 'Add Task'}
      </Button>
    </form>
  );
};
