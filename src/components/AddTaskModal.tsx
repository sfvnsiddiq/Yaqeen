import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { useTasks } from '../store/TaskContext';
import type { RepeatInterval } from '../types';
import './AddTaskModal.css';

export function AddTaskModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [repeat, setRepeat] = useState<RepeatInterval>('none');
    const [priority, setPriority] = useState<'normal' | 'high'>('normal');
    const { addTask } = useTasks();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        addTask(title.trim(), repeat, priority);
        setTitle('');
        setRepeat('none');
        setPriority('normal');
        setIsOpen(false);
    };

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    return (
        <>
            <button
                className="fab"
                onClick={() => setIsOpen(true)}
                aria-label="Add task"
            >
                <Plus size={24} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="modal-overlay">
                        <motion.div
                            className="modal-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            className="modal-content"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        >
                            <div className="modal-header">
                                <h3>New Task</h3>
                                <button className="close-btn" onClick={() => setIsOpen(false)}>
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="add-task-form">
                                <input
                                    type="text"
                                    placeholder="What needs to be done?"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    autoFocus
                                    className="task-input"
                                />

                                <div className="repeat-selector">
                                    <label>Priority:</label>
                                    <select
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value as 'normal' | 'high')}
                                        className="repeat-select"
                                    >
                                        <option value="normal">Normal</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>

                                <div className="repeat-selector">
                                    <label>Repeat:</label>
                                    <select
                                        value={repeat}
                                        onChange={(e) => setRepeat(e.target.value as RepeatInterval)}
                                        className="repeat-select"
                                    >
                                        <option value="none">Never</option>
                                        <option value="daily">Daily</option>
                                        <option value="every_3_days">Every 3 Days</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="submit-btn"
                                    disabled={!title.trim()}
                                >
                                    Create Task
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
