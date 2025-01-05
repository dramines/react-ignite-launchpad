import React from 'react';
import { motion } from 'framer-motion';

interface LoadingProgressProps {
  count: number;
}

const LoadingProgress = ({ count }: LoadingProgressProps) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-600/30 to-red-900/30 blur-xl" />
      <div className="relative backdrop-blur-md rounded-full p-6 bg-gradient-to-b from-white/10 to-transparent border border-white/10 shadow-2xl">
        <motion.svg
          className="w-16 h-16"
          viewBox="0 0 100 100"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 15,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${(count / 30) * 283} 283`}
            transform="rotate(-90 50 50)"
            className="filter drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]"
          />
          <defs>
            <linearGradient
              id="progressGradient"
              gradientTransform="rotate(90)"
            >
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="50%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
          </defs>
        </motion.svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="text-2xl font-bold text-white tracking-wider"
          >
            {count}
          </motion.span>
        </div>
      </div>
    </div>
  );
};

export default LoadingProgress;