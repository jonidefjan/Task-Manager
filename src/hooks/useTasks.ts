/**
 * Custom hooks for task management with advanced patterns
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type {
  TaskEntity,
  TaskId,
  TaskCreationData,
  FilterType,
  TaskStats,
} from '../types/core';
import { TaskService } from '../services/TaskService';
import { TaskRepository } from '../repositories/TaskRepository';

interface UseTasksOptions {
  autoSave?: boolean;
  sortByCreation?: boolean;
}

interface UseTasksReturn {
  tasks: readonly TaskEntity[];
  filteredTasks: readonly TaskEntity[];
  stats: TaskStats;
  currentFilter: FilterType;
  editingTaskId: TaskId | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  addTask: (data: TaskCreationData) => Promise<void>;
  updateTask: (id: TaskId, title: string) => Promise<void>;
  toggleTaskStatus: (id: TaskId) => Promise<void>;
  deleteTask: (id: TaskId) => Promise<void>;
  setFilter: (filter: FilterType) => void;
  startEditing: (id: TaskId) => void;
  cancelEditing: () => void;
  clearCompleted: () => Promise<void>;
  clearError: () => void;
}

export function useTasks(options: UseTasksOptions = {}): UseTasksReturn {
  const { sortByCreation = true } = options;

  const [tasks, setTasks] = useState<TaskEntity[]>([]);
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');
  const [editingTaskId, setEditingTaskId] = useState<TaskId | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const taskService = useMemo(() => TaskService.getInstance(), []);
  const repository = useMemo(() => new TaskRepository(), []);

  // Load tasks on mount
  useEffect(() => {
    let isMounted = true;

    const loadTasks = async () => {
      try {
        setIsLoading(true);
        const loadedTasks = await repository.findAll();
        if (isMounted) {
          setTasks(loadedTasks);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load tasks');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadTasks();

    return () => {
      isMounted = false;
    };
  }, [repository]);

  // Auto-save individual tasks when they change
  const saveTask = useCallback(
    async (task: TaskEntity) => {
      try {
        await repository.save(task);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save task');
      }
    },
    [repository]
  );

  // Memoized sorted tasks
  const sortedTasks = useMemo(() => {
    return sortByCreation
      ? [...tasks].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      : tasks;
  }, [tasks, sortByCreation]);

  // Memoized filtered tasks
  const filteredTasks = useMemo(() => {
    return taskService.filterTasks(sortedTasks, currentFilter);
  }, [sortedTasks, currentFilter, taskService]);

  // Memoized stats
  const stats = useMemo(() => {
    return taskService.calculateStats(tasks);
  }, [tasks, taskService]);

  // Error handler
  const handleError = useCallback((err: unknown) => {
    setError(
      err instanceof Error ? err.message : 'An unexpected error occurred'
    );
  }, []);

  // Add new task
  const addTask = useCallback(
    async (data: TaskCreationData) => {
      try {
        const newTask = taskService.createTask(data);
        setTasks(prev => [...prev, newTask]);
        await saveTask(newTask);
        setError(null);
      } catch (err) {
        handleError(err);
        throw err;
      }
    },
    [taskService, saveTask, handleError]
  );

  // Update task
  const updateTask = useCallback(
    async (id: TaskId, title: string) => {
      try {
        const taskToUpdate = tasks.find(task => task.id === id);
        if (!taskToUpdate) {
          throw new Error('Task not found');
        }

        const updatedTask = taskService.updateTask(taskToUpdate, { title });
        setTasks(prev =>
          prev.map(task => (task.id === id ? updatedTask : task))
        );
        await saveTask(updatedTask);

        if (editingTaskId === id) {
          setEditingTaskId(null);
        }
        setError(null);
      } catch (err) {
        handleError(err);
        throw err;
      }
    },
    [tasks, taskService, saveTask, editingTaskId, handleError]
  );

  // Toggle task status
  const toggleTaskStatus = useCallback(
    async (id: TaskId) => {
      try {
        const taskToToggle = tasks.find(task => task.id === id);
        if (!taskToToggle) {
          throw new Error('Task not found');
        }

        const newStatus =
          taskToToggle.status === 'completed' ? 'pending' : 'completed';
        const updatedTask = taskService.updateTask(taskToToggle, {
          status: newStatus,
        });

        setTasks(prev =>
          prev.map(task => (task.id === id ? updatedTask : task))
        );
        await saveTask(updatedTask);

        if (editingTaskId === id) {
          setEditingTaskId(null);
        }
        setError(null);
      } catch (err) {
        handleError(err);
        throw err;
      }
    },
    [tasks, taskService, saveTask, editingTaskId, handleError]
  );

  // Delete task
  const deleteTask = useCallback(
    async (id: TaskId) => {
      try {
        await repository.delete(id);
        setTasks(prev => prev.filter(task => task.id !== id));

        if (editingTaskId === id) {
          setEditingTaskId(null);
        }
        setError(null);
      } catch (err) {
        handleError(err);
        throw err;
      }
    },
    [repository, editingTaskId, handleError]
  );

  // Set filter
  const setFilter = useCallback((filter: FilterType) => {
    setCurrentFilter(filter);
  }, []);

  // Start editing
  const startEditing = useCallback((id: TaskId) => {
    setEditingTaskId(id);
  }, []);

  // Cancel editing
  const cancelEditing = useCallback(() => {
    setEditingTaskId(null);
  }, []);

  // Clear completed tasks
  const clearCompleted = useCallback(async () => {
    try {
      const completedTasks = tasks.filter(task => task.status === 'completed');

      for (const task of completedTasks) {
        await repository.delete(task.id);
      }

      setTasks(prev => prev.filter(task => task.status !== 'completed'));
      setError(null);
    } catch (err) {
      handleError(err);
      throw err;
    }
  }, [tasks, repository, handleError]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    tasks: sortedTasks,
    filteredTasks,
    stats,
    currentFilter,
    editingTaskId,
    isLoading,
    error,

    // Actions
    addTask,
    updateTask,
    toggleTaskStatus,
    deleteTask,
    setFilter,
    startEditing,
    cancelEditing,
    clearCompleted,
    clearError,
  };
}
