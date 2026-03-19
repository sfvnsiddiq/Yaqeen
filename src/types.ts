export type RepeatInterval = 'none' | 'daily' | 'every_3_days' | 'weekly' | 'monthly';

export interface Task {
    id: string;
    title: string;
    completed: boolean;
    createdAt: number;
    repeat: RepeatInterval;
    lastCompletedDate?: number;
    priority?: 'normal' | 'high';
}
