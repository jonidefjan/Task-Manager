/**
 * Test suite for TaskService
 */

import { TaskService } from '../services/TaskService';
import type { TaskEntity, TaskCreationData } from '../types/core';

describe('TaskService', () => {
  let taskService: TaskService;

  beforeEach(() => {
    taskService = TaskService.getInstance();
  });

  describe('createTask', () => {
    it('creates a task with valid data', () => {
      const taskData: TaskCreationData = { title: 'Test task' };
      const task = taskService.createTask(taskData);

      expect(task.title).toBe('Test task');
      expect(task.status).toBe('pending');
      expect(task.id).toBeDefined();
      expect(task.createdAt).toBeInstanceOf(Date);
      expect(task.updatedAt).toBeInstanceOf(Date);
    });

    it('sanitizes task title', () => {
      const taskData: TaskCreationData = { title: '  Test task with spaces  ' };
      const task = taskService.createTask(taskData);

      expect(task.title).toBe('Test task with spaces');
    });

    it('throws error for empty title', () => {
      const taskData: TaskCreationData = { title: '' };

      expect(() => taskService.createTask(taskData)).toThrow(
        'Task title must be between 1 and 255 characters'
      );
    });

    it('throws error for title too long', () => {
      const longTitle = 'a'.repeat(256);
      const taskData: TaskCreationData = { title: longTitle };

      expect(() => taskService.createTask(taskData)).toThrow(
        'Task title must be between 1 and 255 characters'
      );
    });

    it('generates unique IDs', () => {
      const task1 = taskService.createTask({ title: 'Task 1' });
      const task2 = taskService.createTask({ title: 'Task 2' });

      expect(task1.id).not.toBe(task2.id);
    });
  });

  describe('updateTask', () => {
    let originalTask: TaskEntity;

    beforeEach(() => {
      originalTask = taskService.createTask({ title: 'Original task' });
    });

    it('updates task title', async () => {
      // Small delay to ensure different timestamp
      await new Promise(resolve => setTimeout(resolve, 2));
      const updatedTask = taskService.updateTask(originalTask, {
        title: 'Updated task',
      });

      expect(updatedTask.title).toBe('Updated task');
      expect(updatedTask.id).toBe(originalTask.id);
      expect(updatedTask.updatedAt.getTime()).toBeGreaterThan(
        originalTask.updatedAt.getTime()
      );
    });

    it('updates task status', async () => {
      // Small delay to ensure different timestamp
      await new Promise(resolve => setTimeout(resolve, 2));
      const updatedTask = taskService.updateTask(originalTask, {
        status: 'completed',
      });

      expect(updatedTask.status).toBe('completed');
      expect(updatedTask.id).toBe(originalTask.id);
      expect(updatedTask.updatedAt.getTime()).toBeGreaterThan(
        originalTask.updatedAt.getTime()
      );
    });

    it('does not update timestamp if no changes', () => {
      const updatedTask = taskService.updateTask(originalTask, {});

      expect(updatedTask.updatedAt.getTime()).toBe(
        originalTask.updatedAt.getTime()
      );
    });

    it('validates updated title', () => {
      expect(() => taskService.updateTask(originalTask, { title: '' })).toThrow(
        'Task title must be between 1 and 255 characters'
      );
    });
  });

  describe('toggleTaskStatus', () => {
    it('toggles pending to completed', () => {
      const task = taskService.createTask({ title: 'Test task' });
      const toggledTask = taskService.toggleTaskStatus(task);

      expect(toggledTask.status).toBe('completed');
      expect(toggledTask.id).toBe(task.id);
    });

    it('toggles completed to pending', () => {
      const task = taskService.createTask({ title: 'Test task' });
      const completedTask = taskService.updateTask(task, {
        status: 'completed',
      });
      const toggledTask = taskService.toggleTaskStatus(completedTask);

      expect(toggledTask.status).toBe('pending');
      expect(toggledTask.id).toBe(task.id);
    });
  });

  describe('filterTasks', () => {
    let tasks: TaskEntity[];

    beforeEach(() => {
      const task1 = taskService.createTask({ title: 'Pending task' });
      const task2 = taskService.createTask({ title: 'Completed task' });
      const completedTask = taskService.updateTask(task2, {
        status: 'completed',
      });

      tasks = [task1, completedTask];
    });

    it('filters all tasks', () => {
      const filtered = taskService.filterTasks(tasks, 'all');
      expect(filtered).toHaveLength(2);
    });

    it('filters active tasks', () => {
      const filtered = taskService.filterTasks(tasks, 'active');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].status).toBe('pending');
    });

    it('filters completed tasks', () => {
      const filtered = taskService.filterTasks(tasks, 'completed');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].status).toBe('completed');
    });
  });

  describe('calculateStats', () => {
    it('calculates correct statistics', () => {
      const task1 = taskService.createTask({ title: 'Task 1' });
      const task2 = taskService.createTask({ title: 'Task 2' });
      const task3 = taskService.createTask({ title: 'Task 3' });
      const completedTask = taskService.updateTask(task2, {
        status: 'completed',
      });

      const tasks = [task1, completedTask, task3];
      const stats = taskService.calculateStats(tasks);

      expect(stats.total).toBe(3);
      expect(stats.completed).toBe(1);
      expect(stats.pending).toBe(2);
      expect(stats.completionRate).toBe(33);
    });

    it('handles empty task list', () => {
      const stats = taskService.calculateStats([]);

      expect(stats.total).toBe(0);
      expect(stats.completed).toBe(0);
      expect(stats.pending).toBe(0);
      expect(stats.completionRate).toBe(0);
    });
  });

  describe('sortTasksByCreationDate', () => {
    it('sorts tasks ascending by default', async () => {
      // Create tasks with slight delay to ensure different timestamps
      const task1 = taskService.createTask({ title: 'First' });
      await new Promise(resolve => setTimeout(resolve, 2));
      const task2 = taskService.createTask({ title: 'Second' });

      const tasks = [task2, task1];
      const sorted = taskService.sortTasksByCreationDate(tasks);

      expect(sorted[0].title).toBe('First');
      expect(sorted[1].title).toBe('Second');
    });

    it('sorts tasks descending when specified', async () => {
      const task1 = taskService.createTask({ title: 'First' });
      await new Promise(resolve => setTimeout(resolve, 2));
      const task2 = taskService.createTask({ title: 'Second' });

      const tasks = [task1, task2];
      const sorted = taskService.sortTasksByCreationDate(tasks, true);

      expect(sorted[0].title).toBe('Second');
      expect(sorted[1].title).toBe('First');
    });
  });

  describe('searchTasks', () => {
    let tasks: TaskEntity[];

    beforeEach(() => {
      tasks = [
        taskService.createTask({ title: 'Learn React' }),
        taskService.createTask({ title: 'Learn TypeScript' }),
        taskService.createTask({ title: 'Build Todo App' }),
      ];
    });

    it('searches tasks by title', () => {
      const results = taskService.searchTasks(tasks, 'learn');
      expect(results).toHaveLength(2);
    });

    it('handles case insensitive search', () => {
      const results = taskService.searchTasks(tasks, 'REACT');
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Learn React');
    });

    it('returns all tasks for empty query', () => {
      const results = taskService.searchTasks(tasks, '');
      expect(results).toHaveLength(3);
    });

    it('returns empty array for no matches', () => {
      const results = taskService.searchTasks(tasks, 'nonexistent');
      expect(results).toHaveLength(0);
    });
  });
});
