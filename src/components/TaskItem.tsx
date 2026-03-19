import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Check, RotateCw } from 'lucide-react';
import type { Task } from '../types';
import { useTasks } from '../store/TaskContext';
import './TaskItem.css';

let strikeAudioBuffer: AudioBuffer | null = null;
let audioCtx: AudioContext | null = null;

const initAudio = async () => {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (!strikeAudioBuffer) {
            const response = await fetch('/strike.mp3');
            const arrayBuffer = await response.arrayBuffer();
            strikeAudioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        }
    } catch (e) {
        console.error('Failed to load strike sound', e);
    }
};

interface TaskItemProps {
    task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
    useEffect(() => {
        initAudio();
    }, []);
    const { toggleTask, deleteTask } = useTasks();

    const handleToggle = () => {
        if (!task.completed) {
            playStrikeSound();
        }
        toggleTask(task.id);
    };

    const playStrikeSound = () => {
        try {
            if (!audioCtx || !strikeAudioBuffer) {
                const audio = new Audio('/strike.mp3');
                audio.play().catch(e => console.warn(e));
                setTimeout(() => {
                    audio.pause();
                    audio.currentTime = 0;
                }, 350);
                return;
            }

            const source = audioCtx.createBufferSource();
            source.buffer = strikeAudioBuffer;

            const gainNode = audioCtx.createGain();
            gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
            gainNode.gain.setValueAtTime(1, audioCtx.currentTime + 0.25);
            gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.35);

            source.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            source.start(0);
            source.stop(audioCtx.currentTime + 0.35);
        } catch (e) {
            // Ignore audio errors
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ duration: 0.2 }}
            className={`task-item ${task.completed ? 'completed' : ''} ${task.priority === 'high' ? 'priority-high' : ''}`}
        >
            <button
                className="checkbox"
                onClick={handleToggle}
                aria-label="Toggle completion"
            >
                {task.completed && <Check size={14} strokeWidth={3} />}
            </button>

            <div className="task-content">
                <span className="task-title">
                    {task.title}
                    <span className="strike-line"></span>
                </span>
                {task.repeat !== 'none' && (
                    <div className="repeat-badge">
                        <RotateCw size={10} />
                        <span>{task.repeat.replace(/_/g, ' ')}</span>
                    </div>
                )}
            </div>

            <button
                className="delete-btn"
                onClick={() => deleteTask(task.id)}
                aria-label="Delete task"
            >
                <Trash2 size={18} />
            </button>
        </motion.div>
    );
}
