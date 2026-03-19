import { AnimatePresence, motion } from 'framer-motion';
import { TaskItem } from './TaskItem';
import { useTasks } from '../store/TaskContext';
import './TaskList.css';

export function TaskList() {
    const { tasks } = useTasks();

    const pendingTasks = tasks
        .filter(t => !t.completed)
        .sort((a, b) => {
            if (a.priority === 'high' && b.priority !== 'high') return -1;
            if (a.priority !== 'high' && b.priority === 'high') return 1;
            return 0;
        });
    const completedTasks = tasks.filter(t => t.completed);

    return (
        <div className="task-list-container">
            {tasks.length === 0 ? (
                <div className="empty-state">
                    <p>No tasks yet. Enjoy your day! ✨</p>
                </div>
            ) : (
                <>
                    <motion.div layout className="task-group">
                        <AnimatePresence mode="popLayout">
                            {pendingTasks.map((task) => (
                                <TaskItem key={task.id} task={task} />
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {completedTasks.length > 0 && (
                        <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="task-group completed-group">
                            <h3 className="group-title">Completed</h3>
                            <AnimatePresence mode="popLayout">
                                {completedTasks.map((task) => (
                                    <TaskItem key={task.id} task={task} />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </>
            )}
        </div>
    );
}
