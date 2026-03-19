import { useState, useEffect } from 'react';
import './App.css';
import { Sun, Moon } from 'lucide-react';
import { Header } from './components/Header';
import { TaskList } from './components/TaskList';
import { AddTaskModal } from './components/AddTaskModal';
import { Analytics } from './components/Analytics';
import { AnimatePresence, motion } from 'framer-motion';
import { NamePromptModal } from './components/NamePromptModal';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeTab, setActiveTab] = useState<'tasks' | 'analytics'>('tasks');
  const [userName, setUserName] = useState<string>('');
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('yaqeen-theme') as 'light' | 'dark';
    if (storedTheme) {
      setTheme(storedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('yaqeen-theme', theme);
  }, [theme]);

  useEffect(() => {
    const storedName = localStorage.getItem('yaqeen-user-name') || '';
    if (storedName.trim()) {
      setUserName(storedName);
      setIsNameModalOpen(false);
    } else {
      setIsNameModalOpen(true);
    }
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // Swipe handlers for tab switching
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;

    // Swipe left (next tab)
    if (distance > 50 && activeTab === 'tasks') setActiveTab('analytics');
    // Swipe right (prev tab)
    if (distance < -50 && activeTab === 'analytics') setActiveTab('tasks');
    setTouchStart(null);
  };

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="logo-container">
          <h1 className="logo-en">Yaqeen</h1>
          <span className="logo-ar">يقين</span>
          {userName && <span className="greeting">Hi, {userName}</span>}
        </div>
        <button onClick={toggleTheme} className="icon-btn" aria-label="Toggle theme">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </header>

      <NamePromptModal
        open={isNameModalOpen}
        onSubmit={(name) => {
          localStorage.setItem('yaqeen-user-name', name);
          setUserName(name);
          setIsNameModalOpen(false);
        }}
      />

      <main
        className="app-main"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Header />

        <AnimatePresence mode="wait">
          {activeTab === 'tasks' ? (
            <motion.div
              key="tasks-view"
              initial={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <TaskList />
            </motion.div>
          ) : (
            <motion.div
              key="analytics-view"
              initial={{ opacity: 0, x: 20, filter: 'blur(4px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: 20, filter: 'blur(4px)' }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <Analytics />
            </motion.div>
          )}
        </AnimatePresence>

        {activeTab === 'tasks' && <AddTaskModal />}
      </main>

      <nav className="app-nav">
        <button
          className={`nav-item ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          Tasks
        </button>
        <button
          className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </nav>
    </div>
  );
}

export default App;
