/**
 * Core domain types for the task management system
 */

export type TaskId = string;
export type TaskStatus = 'pending' | 'completed';
export type FilterType = 'all' | 'active' | 'completed';

export interface TaskEntity {
  readonly id: TaskId;
  readonly title: string;
  readonly status: TaskStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface TaskCreationData {
  readonly title: string;
}

export interface TaskUpdateData {
  readonly title?: string;
  readonly status?: TaskStatus;
}

export interface TaskStats {
  readonly total: number;
  readonly completed: number;
  readonly pending: number;
  readonly completionRate: number;
}

export interface TaskFilter {
  readonly type: FilterType;
  readonly predicate: (task: TaskEntity) => boolean;
}
