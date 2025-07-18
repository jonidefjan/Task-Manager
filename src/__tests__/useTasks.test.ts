import { renderHook, act, waitFor } from '@testing-library/react';
import { useTasks } from '../hooks/useTasks';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useTasks', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with empty tasks array', async () => {
    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.tasks).toEqual([]);
    expect(result.current.filteredTasks).toEqual([]);
    expect(result.current.currentFilter).toBe('all');
    expect(result.current.editingTaskId).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it('creates a new task', async () => {
    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.addTask({ title: 'Test task' });
    });

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(1);
    });

    expect(result.current.tasks[0].title).toBe('Test task');
    expect(result.current.tasks[0].status).toBe('pending');
  });

  it('deletes a task', async () => {
    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.addTask({ title: 'Task to delete' });
    });

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(1);
    });

    const taskId = result.current.tasks[0].id;

    await act(async () => {
      await result.current.deleteTask(taskId);
    });

    expect(result.current.tasks).toHaveLength(0);
  });

  it('filters tasks by status', async () => {
    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.addTask({ title: 'Pending task' });
      await result.current.addTask({ title: 'Completed task' });
    });

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(2);
    });

    const completedTaskId = result.current.tasks[1].id;

    await act(async () => {
      await result.current.toggleTaskStatus(completedTaskId);
    });

    act(() => {
      result.current.setFilter('active');
    });

    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].status).toBe('pending');

    act(() => {
      result.current.setFilter('completed');
    });

    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].status).toBe('completed');

    act(() => {
      result.current.setFilter('all');
    });

    expect(result.current.filteredTasks).toHaveLength(2);
  });

  it('calculates stats correctly', async () => {
    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.addTask({ title: 'Task 1' });
      await result.current.addTask({ title: 'Task 2' });
      await result.current.addTask({ title: 'Task 3' });
    });

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(3);
    });

    const taskId = result.current.tasks[2].id;

    await act(async () => {
      await result.current.toggleTaskStatus(taskId);
    });

    expect(result.current.stats.total).toBe(3);
    expect(result.current.stats.pending).toBe(2);
    expect(result.current.stats.completed).toBe(1);
    expect(result.current.stats.completionRate).toBe(33);
  });

  it('manages editing state', async () => {
    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.addTask({ title: 'Test task' });
    });

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(1);
    });

    const taskId = result.current.tasks[0].id;

    expect(result.current.editingTaskId).toBe(null);

    act(() => {
      result.current.startEditing(taskId);
    });

    expect(result.current.editingTaskId).toBe(taskId);

    act(() => {
      result.current.cancelEditing();
    });

    expect(result.current.editingTaskId).toBe(null);
  });

  it('clears completed tasks', async () => {
    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.addTask({ title: 'Pending task' });
      await result.current.addTask({ title: 'Completed task' });
    });

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(2);
    });

    const completedTaskId = result.current.tasks[1].id;

    await act(async () => {
      await result.current.toggleTaskStatus(completedTaskId);
    });

    expect(result.current.tasks).toHaveLength(2);

    await act(async () => {
      await result.current.clearCompleted();
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].status).toBe('pending');
  });

  it('handles errors gracefully', async () => {
    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Test error handling for invalid task creation
    await act(async () => {
      try {
        await result.current.addTask({ title: '' });
      } catch {
        // Expected to throw
      }
    });

    expect(result.current.error).toBeTruthy();

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBe(null);
  });

  it('handles invalid localStorage data gracefully', async () => {
    localStorage.setItem('tasks', 'invalid json');

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.tasks).toEqual([]);
  });
});
