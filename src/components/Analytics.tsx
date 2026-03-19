import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTasks } from '../store/TaskContext';
import './Analytics.css';

export function Analytics() {
    const { tasks } = useTasks();

    const stats = useMemo(() => {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
        return { total, completed, pending, percentage };
    }, [tasks]);

    const radius = 60;
    const circumference = 2 * Math.PI * radius;

    return (
        <div className="analytics-container">
            <div className="stats-header">
                <h2>Your Progress</h2>
                <p>Keep up the great work!</p>
            </div>

            <div className="chart-card">
                <div className="svg-container">
                    <svg width="160" height="160" viewBox="0 0 160 160">
                        <circle
                            cx="80"
                            cy="80"
                            r={radius}
                            className="chart-bg"
                            strokeWidth="16"
                            fill="none"
                        />
                        <motion.circle
                            cx="80"
                            cy="80"
                            r={radius}
                            className="chart-progress"
                            strokeWidth="16"
                            fill="none"
                            strokeDasharray={`${circumference} ${circumference}`}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: circumference - (stats.percentage / 100) * circumference }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            strokeLinecap="round"
                            transform="rotate(-90 80 80)"
                        />
                    </svg>
                    <div className="chart-center">
                        <span className="percentage">{stats.percentage}%</span>
                    </div>
                </div>

                <div className="legend">
                    <div className="legend-item">
                        <span className="dot completed"></span>
                        <span>Completed ({stats.completed})</span>
                    </div>
                    <div className="legend-item">
                        <span className="dot pending"></span>
                        <span>Pending ({stats.pending})</span>
                    </div>
                </div>
            </div>

            <div className="summary-cards">
                <div className="summary-card">
                    <h4>Total Tasks</h4>
                    <span className="stat-number">{stats.total}</span>
                </div>
                <div className="summary-card">
                    <h4>Consistency</h4>
                    <span className="stat-number">{stats.percentage >= 80 ? '🔥 High' : stats.percentage >= 50 ? '⭐ Good' : '🌱 Growing'}</span>
                </div>
            </div>
        </div>
    );
}
