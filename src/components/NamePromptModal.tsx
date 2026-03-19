import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import './NamePromptModal.css';

type Props = {
  open: boolean;
  onSubmit: (name: string) => void;
  onClose?: () => void;
};

function normalizeName(raw: string) {
  const trimmed = raw.trim().replace(/\s+/g, ' ');
  return trimmed;
}

export function NamePromptModal({ open, onSubmit, onClose }: Props) {
  const [name, setName] = useState('');

  const normalized = useMemo(() => normalizeName(name), [name]);
  const canSubmit = normalized.length >= 2;

  useEffect(() => {
    if (!open) return;
    setName('');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="name-modal-overlay" role="dialog" aria-modal="true" aria-label="Set your name">
          <motion.div
            className="name-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onClose?.()}
          />

          <motion.div
            className="name-modal-content"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
          >
            <div className="name-modal-header">
              <h3>Welcome</h3>
              {onClose && (
                <button className="name-close-btn" onClick={onClose} aria-label="Close">
                  <X size={20} />
                </button>
              )}
            </div>

            <p className="name-modal-subtitle">What should I call you?</p>

            <form
              className="name-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (!canSubmit) return;
                onSubmit(normalized);
              }}
            >
              <input
                className="name-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoFocus
                inputMode="text"
                autoComplete="name"
              />
              <button className="name-submit-btn" type="submit" disabled={!canSubmit}>
                Save
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

