'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from 'next-themes';

interface Feedback {
  id: number;
  text: string;
  author: string;
  role: string;
  imageUrl: string;
}

interface Props {
  currentQuote: string;
  currentAuthor: string;
}

const MAX_FEEDBACKS = 4;

export default function FeedbackCarousel({ currentQuote, currentAuthor }: Props) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [imageVersion, setImageVersion] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastQuote, setLastQuote] = useState('');
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate new feedbacks when quote changes
  useEffect(() => {
    if (currentQuote && currentAuthor && mounted && currentQuote !== lastQuote) {
      setFeedbacks([]); // Reset feedbacks
      setCurrentIndex(0);
      setLastQuote(currentQuote);
      generateFeedbacks();
    }
  }, [currentQuote, currentAuthor, mounted]);

  const generateFeedbacks = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quote: currentQuote,
          author: currentAuthor,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate feedback');
      }

      const newFeedbacks = await response.json();
      
      // Transform the feedbacks and add images
      const feedbacksWithImages = newFeedbacks.map((feedback: any, index: number) => ({
        id: index + 1,
        text: feedback.text,
        author: feedback.author,
        role: feedback.role,
        imageUrl: "https://thispersondoesnotexist.com"
      }));

      setFeedbacks(feedbacksWithImages);
    } catch (error) {
      // Silenzio l'errore per evitare log in console
    } finally {
      setIsGenerating(false);
    }
  };

  const updateSlide = (newIndex: number) => {
    setCurrentIndex(newIndex);
    setImageVersion(prev => prev + 1);
  };

  useEffect(() => {
    if (!mounted) return;

    const timer = setInterval(() => {
      if (feedbacks.length > 0) {
        const nextIndex = currentIndex === feedbacks.length - 1 ? 0 : currentIndex + 1;
        updateSlide(nextIndex);
      }
    }, 8000);

    return () => clearInterval(timer);
  }, [currentIndex, mounted, feedbacks.length]);

  const handleDotClick = (index: number) => {
    updateSlide(index);
  };

  if (!mounted) return null;

  if (feedbacks.length === 0) {
    if (isGenerating) {
      return (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400"></div>
        </div>
      );
    } else {
      return (
        <div className="w-full max-w-2xl mx-auto mb-4 h-64 mt-12 flex items-center justify-center">
          <div className="text-gray-700 dark:text-gray-300 text-lg font-semibold">
            Feedback non disponibili al momento.
          </div>
        </div>
      );
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto mb-4 h-64 mt-12">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-8 shadow-lg h-full`}>
            <div className={`flex items-start space-x-6 h-full border ${theme === 'dark' ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'} rounded-lg p-6`}>
              <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={`${feedbacks[currentIndex].imageUrl}?v=${imageVersion}`}
                  alt={`Profile of ${feedbacks[currentIndex].author}`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex-1 flex flex-col justify-between h-full">
                <p className={`${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'} text-base italic leading-relaxed`}>
                  {feedbacks[currentIndex].text}
                </p>
                <div className="text-right mt-4">
                  <h3 className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-semibold`}>
                    {feedbacks[currentIndex].author}
                  </h3>
                  <p className={`text-sm italic ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {feedbacks[currentIndex].role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {feedbacks.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
              index === currentIndex ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
            }`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </div>
  );
}