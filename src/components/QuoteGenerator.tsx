'use client';

import { useState, useEffect } from 'react';
import styles from './QuoteGenerator.module.css';
import { setBackgroundImage, getRandomImage } from '@/utils/background';
import { useTheme } from 'next-themes';
import themeStyles from './ThemeToggle.module.css';
import FeedbackCarousel from './FeedbackCarousel';
import { motion } from 'framer-motion';

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
    <div className="max-w-3xl mx-auto p-6 pb-12 min-h-[560px] bg-white/10 dark:bg-black/10 backdrop-blur-lg rounded-xl shadow-2xl flex flex-col">
      {/* Quote Box */}
      <div className={`${styles.quoteCard} w-full mb-8`}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400"></div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className={styles.quote}>{quote}</p>
            <p className={styles.author}>- {author}</p>
          </motion.div>
        )}
      </div>

      {/* Feedback Carousel */}
      <div className="w-full mb-12">
        <FeedbackCarousel currentQuote={quote} currentAuthor={author} />
      </div>

      {/* New Quote Button */}
      <div className="w-full flex justify-center">
        <button
          onClick={fetchQuote}
          className={`${styles.button} px-12 py-4 text-base w-48`}
        >
          New Quote
        </button>
      </div>
    </div>
  );
} 