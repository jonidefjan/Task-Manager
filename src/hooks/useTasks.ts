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
import { LocalStorageTaskRepository } from '../repositories/TaskRepository';

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
  const { autoSave = true, sortByCreation = true } = options;

  const [tasks, setTasks] = useState<TaskEntity[]>([]);
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');
  const [editingTaskId, setEditingTaskId] = useState<TaskId | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const taskService = useMemo(() => TaskService.getInstance(), []);
  const repository = useMemo(() => new LocalStorageTaskRepository(), []);

  // Load tasks on mount
  useEffect(() => {
    let isMounted = true;

    const loadTasks = async () => {
      try {
        setIsLoading(true);
        const loadedTasks = await repository.findAll();

        if (isMounted) {
          setTasks(loadedTasks);
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

  // Auto-save when tasks change
  useEffect(() => {
    if (!autoSave || isLoading) return;

    const saveTask = async () => {
      try {
        await repository.save(tasks);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save tasks');
      }
    };

    const timeoutId = setTimeout(saveTask, 500); // Debounce saves
    return () => clearTimeout(timeoutId);
  }, [tasks, repository, autoSave, isLoading]);

  const sortedTasks = useMemo(() => {
    return sortByCreation
      ? taskService.sortTasksByCreationDate(tasks, true)
      : tasks;
  }, [tasks, taskService, sortByCreation]);

  const filteredTasks = useMemo(() => {
    return taskService.filterTasks(sortedTasks, currentFilter);
  }, [sortedTasks, currentFilter, taskService]);

  const stats = useMemo(() => {
    return taskService.calculateStats(tasks);
  }, [tasks, taskService]);

  const handleError = useCallback((err: unknown) => {
    const message =
      err instanceof Error ? err.message : 'An unexpected error occurred';
    setError(message);
  }, []);

  const addTask = useCallback(
    async (data: TaskCreationData) => {
      try {
        setError(null);
        const newTask = taskService.createTask(data);
        setTasks(prev => [...prev, newTask]);
      } catch (err) {
        handleError(err);
        throw err;
      }
    },
    [taskService, handleError]
  );

  const updateTask = useCallback(
    async (id: TaskId, title: string) => {
      try {
        setError(null);
        setTasks(prev =>
          prev.map(task =>
            task.id === id ? taskService.updateTask(task, { title }) : task
          )
        );
        setEditingTaskId(null);
      } catch (err) {
        handleError(err);
        throw err;
      }
    },
    [taskService, handleError]
  );

  const toggleTaskStatus = useCallback(
    async (id: TaskId) => {
      try {
        setError(null);
        setTasks(prev =>
          prev.map(task =>
            task.id === id ? taskService.toggleTaskStatus(task) : task
          )
        );
      } catch (err) {
        handleError(err);
      }
    },
    [taskService, handleError]
  );

  const deleteTask = useCallback(
    async (id: TaskId) => {
      try {
        setError(null);
        setTasks(prev => prev.filter(task => task.id !== id));
        if (editingTaskId === id) {
          setEditingTaskId(null);
        }
      } catch (err) {
        handleError(err);
      }
    },
    [editingTaskId, handleError]
  );

  const clearCompleted = useCallback(async () => {
    try {
      setError(null);
      setTasks(prev => prev.filter(task => task.status !== 'completed'));
    } catch (err) {
      handleError(err);
    }
  }, [handleError]);

  const setFilter = useCallback((filter: FilterType) => {
    setCurrentFilter(filter);
  }, []);

  const startEditing = useCallback((id: TaskId) => {
    setEditingTaskId(id);
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingTaskId(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    tasks: sortedTasks,
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
  };
}
