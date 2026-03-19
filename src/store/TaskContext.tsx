import React, { createContext, useContext, useState, useEffect } from 'react';
import { get, set } from 'idb-keyval';
import type { Task, RepeatInterval } from '../types';

interface TaskContextType {
    tasks: Task[];
    addTask: (title: string, repeat: RepeatInterval, priority: 'normal' | 'high') => void;
    toggleTask: (id: string) => void;
    deleteTask: (id: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load initial tasks
    useEffect(() => {
        get('yaqeen-tasks').then((val: Task[]) => {
            if (val) {
                const now = new Date();
                now.setHours(0, 0, 0, 0);
                const todayTime = now.getTime();

                // Process repeating tasks to un-complete them if their interval has passed
                const processedTasks = val.map(t => {
                    if (t.completed && t.repeat !== 'none' && t.lastCompletedDate) {
                        const completedDate = new Date(t.lastCompletedDate);
                        completedDate.setHours(0, 0, 0, 0);
                        const compTime = completedDate.getTime();

                        const daysDiff = Math.floor((todayTime - compTime) / (1000 * 60 * 60 * 24));

                        let shouldReset = false;
                        if (t.repeat === 'daily' && daysDiff >= 1) shouldReset = true;
                        if (t.repeat === 'every_3_days' && daysDiff >= 3) shouldReset = true;
                        if (t.repeat === 'weekly' && daysDiff >= 7) shouldReset = true;
                        if (t.repeat === 'monthly' && daysDiff >= 30) shouldReset = true;

                        if (shouldReset) {
                            return { ...t, completed: false, lastCompletedDate: undefined };
                        }
                    }
                    return t;
                });
                setTasks(processedTasks);
            }
            setIsLoaded(true);
        });
    }, []);

    // Save tasks on change
    useEffect(() => {
        if (isLoaded) {
            set('yaqeen-tasks', tasks);
        }
    }, [tasks, isLoaded]);

    const addTask = (title: string, repeat: RepeatInterval, priority: 'normal' | 'high' = 'normal') => {
        const newTask: Task = {
            id: crypto.randomUUID(),
            title,
            completed: false,
            createdAt: Date.now(),
            repeat,
            priority
        };
        setTasks(prev => [newTask, ...prev]);
    };

    const toggleTask = (id: string) => {
        setTasks(prev => prev.map(t => {
            if (t.id === id) {
                const isCompleting = !t.completed;
                return {
                    ...t,
                    completed: isCompleting,
                    lastCompletedDate: isCompleting ? Date.now() : undefined
                };
            }
            return t;
        }));
    };

    const deleteTask = (id: string) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    return (
        <TaskContext.Provider value={{ tasks, addTask, toggleTask, deleteTask }}>
            {isLoaded ? children : null}
        </TaskContext.Provider>
    );
}

export const useTasks = () => {
    const context = useContext(TaskContext);
    if (!context) throw new Error('useTasks must be used within TaskProvider');
    return context;
};
