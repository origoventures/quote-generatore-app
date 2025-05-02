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
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Daily Motivation</h1>
          <div className={styles.quoteCard}>
            <QuoteGenerator />
          </div>
        </div>
      </div>
      <ThemeToggle />
    </main>
  );
}
