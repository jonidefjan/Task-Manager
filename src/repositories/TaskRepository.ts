/**
 * Repository pattern implementation for task persistence
 */

import type { TaskEntity, TaskId } from '../types/core';

export interface TaskRepository {
  findAll(): Promise<TaskEntity[]>;
  findById(id: TaskId): Promise<TaskEntity | null>;
  save(tasks: readonly TaskEntity[]): Promise<void>;
  clear(): Promise<void>;
}

export class LocalStorageTaskRepository implements TaskRepository {
  private static readonly STORAGE_KEY = 'todoapp_tasks_v1';
  private static readonly MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB

  public async findAll(): Promise<TaskEntity[]> {
    try {
      const data = localStorage.getItem(LocalStorageTaskRepository.STORAGE_KEY);

      if (!data) {
        return [];
      }

      const parsed = JSON.parse(data);

      if (!Array.isArray(parsed)) {
        console.warn('Invalid task data format in localStorage');
        return [];
      }

      return parsed.map(this.deserializeTask).filter(Boolean) as TaskEntity[];
    } catch (error) {
      console.error('Failed to load tasks from localStorage:', error);
      return [];
    }
  }

  public async findById(id: TaskId): Promise<TaskEntity | null> {
    const tasks = await this.findAll();
    return tasks.find(task => task.id === id) ?? null;
  }

  public async save(tasks: readonly TaskEntity[]): Promise<void> {
    try {
      const serialized = JSON.stringify(tasks.map(this.serializeTask));

      if (serialized.length > LocalStorageTaskRepository.MAX_STORAGE_SIZE) {
        throw new Error('Data exceeds maximum storage size');
      }

      localStorage.setItem(LocalStorageTaskRepository.STORAGE_KEY, serialized);
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded. Please clear some tasks.');
      }
      throw new Error(
        `Failed to save tasks: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  public async clear(): Promise<void> {
    try {
      localStorage.removeItem(LocalStorageTaskRepository.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear tasks from localStorage:', error);
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

  private deserializeTask(data: any): TaskEntity | null {
    try {
      if (!this.isValidTaskData(data)) {
        return null;
      }

      return {
        id: data.id,
        title: data.title,
        status: data.status,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      };
    } catch {
      return null;
    }
  }

  private isValidTaskData(data: any): boolean {
    return (
      typeof data === 'object' &&
      data !== null &&
      typeof data.id === 'string' &&
      typeof data.title === 'string' &&
      (data.status === 'pending' || data.status === 'completed') &&
      typeof data.createdAt === 'string' &&
      typeof data.updatedAt === 'string'
    );
  }
}
