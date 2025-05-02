'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const feedbacks = [
  {
    id: 1,
    text: "This quote generator has been incredibly inspiring for my daily routine. It helps me start each day with a positive mindset!",
    author: "Sarah Johnson",
    imageUrl: "https://thispersondoesnotexist.com"
  },
  {
    id: 2,
    text: "I love how the quotes are always relevant and thought-provoking. It's become an essential part of my morning motivation.",
    author: "Michael Chen",
    imageUrl: "https://thispersondoesnotexist.com"
  },
  {
    id: 3,
    text: "The combination of wisdom and beautiful presentation makes this app stand out. It's my go-to source for daily inspiration.",
    author: "Emma Davis",
    imageUrl: "https://thispersondoesnotexist.com"
  },
];

export default function FeedbackCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [imageVersion, setImageVersion] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateSlide = (newIndex: number) => {
    setCurrentIndex(newIndex);
    setImageVersion(prev => prev + 1);
  };

  useEffect(() => {
    if (!mounted) return;

    const timer = setInterval(() => {
      const nextIndex = currentIndex === feedbacks.length - 1 ? 0 : currentIndex + 1;
      updateSlide(nextIndex);
    }, 8000);

    return () => clearInterval(timer);
  }, [currentIndex, mounted]);

  const handleDotClick = (index: number) => {
    updateSlide(index);
  };

  if (!mounted) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-4 mb-4 relative h-64">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg h-full">
          <div className="flex items-start space-x-6 h-full">
            <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-700" />
            <div className="flex-1 flex flex-col justify-between h-full">
              <p className="text-gray-600 dark:text-gray-300 text-base italic leading-relaxed">
                {feedbacks[currentIndex].text}
              </p>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-right mt-4">
                - {feedbacks[currentIndex].author}
              </h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-4 mb-4 relative h-64">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="absolute w-full h-full"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg h-full">
            <div className="flex items-start space-x-6 h-full">
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
                <p className="text-gray-600 dark:text-gray-300 text-base italic leading-relaxed">
                  {feedbacks[currentIndex].text}
                </p>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-right mt-4">
                  - {feedbacks[currentIndex].author}
                </h3>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
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