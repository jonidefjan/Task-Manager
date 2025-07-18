/**
 * Task filter component for filtering and managing tasks
 */

import { memo } from 'react';
import { Button } from '../../atoms/Button/Button';
import type { TaskFilterProps } from '../../../types/components';

export const TaskFilter = memo(
  ({
    currentFilter,
    taskCount,
    completedCount,
    onFilterChange,
    onClearCompleted,
    className = '',
    testId,
  }: TaskFilterProps) => {
    const containerStyles = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      padding: '16px 0',
      borderTop: '1px solid #e2e8f0',
      flexWrap: 'wrap' as const,
    };

    const filtersContainerStyles = {
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
    };

    const filterButtonStyles = {
      padding: '8px 16px',
      fontSize: '14px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      backgroundColor: 'transparent',
      color: '#64748b',
      fontFamily: 'inherit',
    };

    const activeFilterStyles = {
      ...filterButtonStyles,
      backgroundColor: '#3b82f6',
      color: '#ffffff',
    };

    const statsStyles = {
      fontSize: '14px',
      color: '#64748b',
      fontWeight: '500',
    };

    const pendingCount = taskCount - completedCount;

    return (
      <div style={containerStyles} className={className} data-testid={testId}>
        <div style={statsStyles}>
          {pendingCount} {pendingCount === 1 ? 'item' : 'items'} left
        </div>

        <div style={filtersContainerStyles}>
          <button
            style={
              currentFilter === 'all' ? activeFilterStyles : filterButtonStyles
            }
            onClick={() => onFilterChange('all')}
            data-testid={`${testId}-all`}
          >
            All
          </button>
          <button
            style={
              currentFilter === 'active'
                ? activeFilterStyles
                : filterButtonStyles
            }
            onClick={() => onFilterChange('active')}
            data-testid={`${testId}-active`}
          >
            Active
          </button>
          <button
            style={
              currentFilter === 'completed'
                ? activeFilterStyles
                : filterButtonStyles
            }
            onClick={() => onFilterChange('completed')}
            data-testid={`${testId}-completed`}
          >
            Completed
          </button>
        </div>

        {completedCount > 0 && (
          <Button
            variant='secondary'
            size='small'
            onClick={onClearCompleted}
            testId={`${testId}-clear`}
          >
            Clear completed
          </Button>
        )}
      </div>
    );
  }
);

TaskFilter.displayName = 'TaskFilter';
