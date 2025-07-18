/**
 * Task domain service with comprehensive business logic
 */

import type {
  TaskEntity,
  TaskId,
  TaskCreationData,
  TaskUpdateData,
  TaskStats,
  FilterType,
  TaskFilter,
} from '../types/core';

export class TaskService {
  private static instance: TaskService;

  private constructor() {}

  public static getInstance(): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService();
    }
    return TaskService.instance;
  }

  public createTask(data: TaskCreationData): TaskEntity {
    const now = new Date();
    const title = this.sanitizeTitle(data.title);

    if (!this.validateTitle(title)) {
      throw new Error('Task title must be between 1 and 255 characters');
    }

    return {
      id: this.generateId(),
      title,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };
  }

  public updateTask(task: TaskEntity, updates: TaskUpdateData): TaskEntity {
    const updatedTask = { ...task };
    let hasChanges = false;

    if (updates.title !== undefined) {
      const sanitizedTitle = this.sanitizeTitle(updates.title);
      if (!this.validateTitle(sanitizedTitle)) {
        throw new Error('Task title must be between 1 and 255 characters');
      }
      updatedTask.title = sanitizedTitle;
      hasChanges = true;
    }

    if (updates.status !== undefined && updates.status !== task.status) {
      updatedTask.status = updates.status;
      hasChanges = true;
    }

    if (hasChanges) {
      updatedTask.updatedAt = new Date();
    }

    return updatedTask;
  }

  public toggleTaskStatus(task: TaskEntity): TaskEntity {
    return this.updateTask(task, {
      status: task.status === 'pending' ? 'completed' : 'pending',
    });
  }

  public filterTasks(
    tasks: readonly TaskEntity[],
    filterType: FilterType
  ): TaskEntity[] {
    const filter = this.getFilter(filterType);
    return tasks.filter(filter.predicate);
  }

  public calculateStats(tasks: readonly TaskEntity[]): TaskStats {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    const pending = total - completed;
    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, completionRate };
  }

  public sortTasksByCreationDate(
    tasks: readonly TaskEntity[],
    descending = false
  ): TaskEntity[] {
    return [...tasks].sort((a, b) => {
      const comparison = a.createdAt.getTime() - b.createdAt.getTime();
      return descending ? -comparison : comparison;
    });
  }

  public searchTasks(
    tasks: readonly TaskEntity[],
    query: string
  ): TaskEntity[] {
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) return [...tasks];

    return tasks.filter(task =>
      task.title.toLowerCase().includes(normalizedQuery)
    );
  }

  private generateId(): TaskId {
    return `task_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  private sanitizeTitle(title: string): string {
    return title.trim().replace(/\s+/g, ' ');
  }

  private validateTitle(title: string): boolean {
    return title.length > 0 && title.length <= 255;
  }

  private getFilter(type: FilterType): TaskFilter {
    const filters: Record<FilterType, TaskFilter> = {
      all: {
        type: 'all',
        predicate: () => true,
      },
      active: {
        type: 'active',
        predicate: (task: TaskEntity) => task.status === 'pending',
      },
      completed: {
        type: 'completed',
        predicate: (task: TaskEntity) => task.status === 'completed',
      },
    };

    return filters[type];
  }
}
