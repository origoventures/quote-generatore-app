'use client';

import { useState, useEffect } from 'react';
import styles from './QuoteGenerator.module.css';
import { setBackgroundImage, getRandomImage } from '@/utils/background';
import { useTheme } from 'next-themes';
import themeStyles from './ThemeToggle.module.css';

export default function QuoteGenerator() {
  const [quote, setQuote] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const { theme } = useTheme();

  const updateBackground = async () => {
    const backgroundImage = document.querySelector(`.${themeStyles.backgroundImage}`) as HTMLElement;
    if (backgroundImage) {
      const newImage = await getRandomImage();
      setBackgroundImage(backgroundImage, newImage, theme === 'dark');
    }
  };

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
    await updateBackground();
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <>
      <div className={styles.quoteCard}>
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <>
            <p className={styles.quote}>{quote}</p>
            <p className={styles.author}>- {author}</p>
          </>
        )}
      </div>
      <button
        onClick={fetchQuote}
        className={styles.button}
      >
        New Quote
      </button>
    </>
  );
} 