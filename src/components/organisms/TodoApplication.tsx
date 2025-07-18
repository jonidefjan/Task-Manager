/**
 * Main application component with advanced state management
 */

import { memo, Suspense } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { TaskForm } from '../molecules/TaskForm/TaskForm';
import { TaskList } from './TaskList';
import { TaskFilter } from '../molecules/TaskFilter/TaskFilter';

const LoadingSpinner = memo(() => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px',
      fontSize: '18px',
      color: '#64748b',
    }}
  >
    Loading tasks...
  </div>
));

const ErrorBoundary = memo(
  ({ error, onClear }: { error: string; onClear: () => void }) => (
    <div
      style={{
        padding: '16px',
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '8px',
        margin: '16px 0',
      }}
    >
      <div style={{ color: '#dc2626', fontWeight: 500, marginBottom: '8px' }}>
        Error
      </div>
      <div style={{ color: '#7f1d1d', marginBottom: '12px' }}>{error}</div>
      <button
        onClick={onClear}
        style={{
          padding: '6px 12px',
          backgroundColor: '#dc2626',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Dismiss
      </button>
    </div>
  )
);

const TaskStats = memo(
  ({
    total,
    completed,
    pending,
  }: {
    total: number;
    completed: number;
    pending: number;
  }) => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '16px',
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        margin: '16px 0',
        fontSize: '14px',
        color: '#475569',
      }}
    >
      <span>Total: {total}</span>
      <span>Completed: {completed}</span>
      <span>Pending: {pending}</span>
    </div>
  )
);

export const TodoApplication = memo(() => {
  const {
    filteredTasks,
    stats,
    currentFilter,
    editingTaskId,
    isLoading,
    error,
    addTask,
    updateTask,
    toggleTaskStatus,
    deleteTask,
    setFilter,
    startEditing,
    cancelEditing,
    clearCompleted,
    clearError,
  } = useTasks({
    autoSave: true,
    sortByCreation: true,
  });

  const containerStyles = {
    maxWidth: '768px',
    margin: '0 auto',
    padding: '24px',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  };

  const headerStyles = {
    textAlign: 'center' as const,
    marginBottom: '32px',
  };

  const titleStyles = {
    fontSize: '36px',
    fontWeight: 700,
    color: '#1e293b',
    margin: '0 0 8px 0',
  };

  const subtitleStyles = {
    fontSize: '18px',
    color: '#64748b',
    margin: 0,
  };

  if (isLoading) {
    return (
      <div style={containerStyles}>
        <Suspense fallback={<LoadingSpinner />}>
          <LoadingSpinner />
        </Suspense>
      </div>
    );
  }

  return (
    <div style={containerStyles}>
      <header style={headerStyles}>
        <h1 style={titleStyles}>Task Manager</h1>
        <p style={subtitleStyles}>Organize your work efficiently</p>
      </header>

      {error && <ErrorBoundary error={error} onClear={clearError} />}

      <TaskStats
        total={stats.total}
        completed={stats.completed}
        pending={stats.pending}
      />

      <TaskForm onSubmit={addTask} testId='task-form' />

      <TaskFilter
        currentFilter={currentFilter}
        taskCount={stats.pending}
        completedCount={stats.completed}
        onFilterChange={setFilter}
        onClearCompleted={clearCompleted}
        testId='task-filter'
      />

      <TaskList
        tasks={filteredTasks}
        editingTaskId={editingTaskId ?? undefined}
        onToggleStatus={toggleTaskStatus}
        onDelete={deleteTask}
        onStartEdit={startEditing}
        onSaveEdit={updateTask}
        onCancelEdit={cancelEditing}
        testId='task-list'
      />

      {filteredTasks.length === 0 && stats.total > 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '48px 24px',
            color: '#64748b',
            fontSize: '16px',
          }}
        >
          No tasks match the current filter
        </div>
      )}

      {stats.total === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '48px 24px',
            color: '#64748b',
            fontSize: '16px',
          }}
        >
          No tasks yet. Create your first task above!
        </div>
      )}
    </div>
  );
});

TodoApplication.displayName = 'TodoApplication';
