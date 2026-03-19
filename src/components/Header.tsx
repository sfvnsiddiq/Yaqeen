import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Quote } from 'lucide-react';
import './Header.css';

const QUOTES = [
    "The secret of getting ahead is getting started.",
    "It always seems impossible until it's done.",
    "Don't watch the clock; do what it does. Keep going.",
    "You are never too old to set another goal.",
    "Start where you are. Use what you have. Do what you can.",
    "Success is not final, failure is not fatal.",
    "Do one thing every day that scares you.",
    "With hardship comes ease. 🌟",
    "Focus on the step in front of you."
];

export function Header() {
    const [quote, setQuote] = useState('');
    const currentDate = new Date();

    useEffect(() => {
        // Pick a quote based on the day of the year so it changes daily
        const start = new Date(currentDate.getFullYear(), 0, 0);
        const diff = currentDate.getTime() - start.getTime();
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        setQuote(QUOTES[dayOfYear % QUOTES.length]);
    }, []);

    return (
        <div className="header-section">
            <div className="date-display">
                <h2>{format(currentDate, 'eeee, MMMM d')}</h2>
                <p className="subtitle">Let's make today productive.</p>
            </div>

            <div className="quote-card">
                <Quote className="quote-icon" size={24} />
                <p className="quote-text">"{quote}"</p>
            </div>
        </div>
    );
}
