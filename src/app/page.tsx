'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import ThemeToggle from '@/components/ThemeToggle';
import QuoteGenerator from '@/components/QuoteGenerator';
import FeedbackCarousel from '@/components/FeedbackCarousel';
import themeStyles from '@/components/ThemeToggle.module.css';

export default function Home() {
  const [quote, setQuote] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/quote');
      const data = await response.json();
      console.log('API Response:', data);
      if (Array.isArray(data) && data.length > 0) {
        setQuote(data[0].q);
        setAuthor(data[0].a);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
      // Fallback quotes in case the API fails
      const fallbackQuotes = [
        {
          content: "The only way to do great work is to love what you do.",
          author: "Steve Jobs"
        },
        {
          content: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
          author: "Winston Churchill"
        },
        {
          content: "Believe you can and you're halfway there.",
          author: "Theodore Roosevelt"
        },
        {
          content: "Everything you've ever wanted is on the other side of fear.",
          author: "George Addair"
        },
        {
          content: "The future belongs to those who believe in the beauty of their dreams.",
          author: "Eleanor Roosevelt"
        }
      ];
      const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
      setQuote(randomQuote.content);
      setAuthor(randomQuote.author);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <main className={styles.main}>
      <div className={themeStyles.backgroundImage}></div>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="max-w-xl w-full bg-white/10 dark:bg-black/10 rounded-xl shadow-2xl flex flex-col justify-between items-center p-8 min-h-[600px]">
          <div className="flex-1 flex flex-col gap-8 w-full">
            <h1 className="text-2xl font-bold text-center mb-6">Daily Motivation</h1>
            <QuoteGenerator quote={quote} author={author} loading={loading} />
          </div>
          <button
            onClick={fetchQuote}
            className="px-12 py-5 min-w-[180px] rounded-lg text-base font-semibold shadow transition-all duration-200
              bg-blue-500 text-white hover:bg-blue-600
              dark:bg-gray-800 dark:text-blue-100 dark:hover:bg-gray-700"
          >
            New Quote
          </button>
        </div>
      </div>
      <ThemeToggle />
    </main>
  );
}
