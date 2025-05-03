'use client';

import { useState, useEffect } from 'react';
import styles from './QuoteGenerator.module.css';
import { setBackgroundImage, getRandomImage } from '@/utils/background';
import { useTheme } from 'next-themes';
import themeStyles from './ThemeToggle.module.css';
import FeedbackCarousel from './FeedbackCarousel';
import { motion } from 'framer-motion';

export default function QuoteGenerator({quote, author, loading}: {quote: string, author: string, loading: boolean}) {
  return (
    <div className="max-w-3xl mx-auto p-6 min-h-[500px] bg-white/10 dark:bg-black/10 backdrop-blur-lg rounded-xl shadow-2xl flex flex-col justify-between relative">
      <div className="flex-1 flex flex-col">
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
        <div className="w-full mb-0">
          <FeedbackCarousel currentQuote={quote} currentAuthor={author} />
        </div>
      </div>
    </div>
  );
} 