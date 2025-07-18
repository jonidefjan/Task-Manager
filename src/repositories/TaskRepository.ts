/**
 * Repository pattern implementation for task persistence
 */

import type { TaskEntity, TaskId, TaskStatus } from '../types/core';

export interface TaskRepositoryInterface {
  findAll(): Promise<TaskEntity[]>;
  findById(id: TaskId): Promise<TaskEntity | null>;
  save(task: TaskEntity): Promise<TaskEntity>;
  delete(id: TaskId): Promise<boolean>;
  clear(): Promise<void>;
}

export class TaskRepository implements TaskRepositoryInterface {
  private static readonly STORAGE_KEY = 'todoapp_tasks_v1';

  async findAll(): Promise<TaskEntity[]> {
    try {
      const data = localStorage.getItem(TaskRepository.STORAGE_KEY);
      if (!data) {
        return [];
      }

      const tasks = JSON.parse(data);
      if (!Array.isArray(tasks)) {
        return [];
      }

      return tasks
        .map(taskData => this.deserializeTask(taskData))
        .filter((task): task is TaskEntity => task !== null);
    } catch (error) {
      console.error('Failed to load tasks from localStorage:', error);
      return [];
    }
  }

  async findById(id: TaskId): Promise<TaskEntity | null> {
    const tasks = await this.findAll();
    return tasks.find(task => task.id === id) || null;
  }

  async save(task: TaskEntity): Promise<TaskEntity> {
    const tasks = await this.findAll();
    const existingIndex = tasks.findIndex(t => t.id === task.id);

    if (existingIndex >= 0) {
      tasks[existingIndex] = task;
    } else {
      tasks.push(task);
    }

    await this.persistTasks(tasks);
    return task;
  }

  async delete(id: TaskId): Promise<boolean> {
    const tasks = await this.findAll();
    const initialLength = tasks.length;
    const filteredTasks = tasks.filter(task => task.id !== id);

    if (filteredTasks.length !== initialLength) {
      await this.persistTasks(filteredTasks);
      return true;
    }

    return false;
  }

  async clear(): Promise<void> {
    try {
      localStorage.removeItem(TaskRepository.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear tasks from localStorage:', error);
      throw new Error('Failed to clear tasks');
    }
  }

  private async persistTasks(tasks: TaskEntity[]): Promise<void> {
    try {
      const serializedTasks = tasks.map(task => this.serializeTask(task));
      localStorage.setItem(
        TaskRepository.STORAGE_KEY,
        JSON.stringify(serializedTasks)
      );
    } catch {
      throw new Error('Failed to save tasks to localStorage');
    }
  }

  private serializeTask(task: TaskEntity): Record<string, unknown> {
    return {
      id: task.id,
      title: task.title,
      status: task.status,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    };
  }

  private deserializeTask(data: unknown): TaskEntity | null {
    try {
      if (!this.isValidTaskData(data)) {
        return null;
      }

      const taskData = data as {
        id: string;
        title: string;
        status: string;
        createdAt: string;
        updatedAt: string;
      };

      return {
        id: taskData.id,
        title: taskData.title,
        status: taskData.status as TaskStatus,
        createdAt: new Date(taskData.createdAt),
        updatedAt: new Date(taskData.updatedAt),
      };
    } catch {
      return null;
    }
  }

  private isValidTaskData(data: unknown): boolean {
    return (
      typeof data === 'object' &&
      data !== null &&
      typeof (data as Record<string, unknown>).id === 'string' &&
      typeof (data as Record<string, unknown>).title === 'string' &&
      typeof (data as Record<string, unknown>).status === 'string' &&
      typeof (data as Record<string, unknown>).createdAt === 'string' &&
      typeof (data as Record<string, unknown>).updatedAt === 'string'
    );
  }
}
