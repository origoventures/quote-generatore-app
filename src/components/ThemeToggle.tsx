'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import styles from './ThemeToggle.module.css';
import { setBackgroundImage, getRandomImage } from '@/utils/background';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    
    // Set initial background image
    const loadInitialImage = async () => {
      const backgroundImage = document.querySelector(`.${styles.backgroundImage}`) as HTMLElement;
      if (backgroundImage) {
        const initialImage = await getRandomImage();
        setBackgroundImage(backgroundImage, initialImage, theme === 'dark');
      }
    };
    
    loadInitialImage();
  }, [theme]);

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    
    // Update background image
    const backgroundImage = document.querySelector(`.${styles.backgroundImage}`) as HTMLElement;
    if (backgroundImage) {
      const newImage = await getRandomImage();
      setBackgroundImage(backgroundImage, newImage, newTheme === 'dark');
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <button
      className={styles.themeToggle}
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? '🌙' : '🌞'}
    </button>
  );
} 