import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingProgress from './loading/LoadingProgress';
import TransitionDoors from './loading/TransitionDoors';
import { preloadImages, criticalImages, secondaryImages } from '../utils/imagePreloader';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen = memo(({ onLoadingComplete }: LoadingScreenProps) => {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'transition' | 'complete'>('loading');
  const [showCircle, setShowCircle] = useState(true);

  const handleLoadingComplete = useCallback(() => {
    setShowCircle(false);
    setTimeout(() => {
      setPhase('transition');
      setTimeout(() => {
        setPhase('complete');
        onLoadingComplete();
      }, 1000);
    }, 500);
  }, [onLoadingComplete]);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        // Preload critical images first
        await preloadImages(criticalImages);
        setCount(15); // Update progress to 50%
        
        // Then load secondary images
        await preloadImages(secondaryImages);
        setCount(30); // Complete the loading
        
        handleLoadingComplete();
      } catch (error) {
        console.error('Error preloading images:', error);
        // Still complete loading even if some images fail
        handleLoadingComplete();
      }
    };

    loadAssets();
  }, [handleLoadingComplete]);

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {phase !== 'complete' && (
          <>
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="fixed inset-0 z-40"
              style={{ backgroundColor: '#591C1C' }}
            >
              {showCircle && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="fixed inset-0 z-50 flex items-center justify-center"
                >
                  <LoadingProgress count={count} />
                </motion.div>
              )}

              {phase === 'transition' && <TransitionDoors />}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
});

LoadingScreen.displayName = 'LoadingScreen';

export default LoadingScreen;