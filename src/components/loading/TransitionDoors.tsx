import React from 'react';
import { motion } from 'framer-motion';

const TransitionDoors = () => {
  return (
    <>
      <motion.div
        variants={{
          initial: { x: 0 },
          animate: { 
            x: '-100%',
            transition: { duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }
          }
        }}
        initial="initial"
        animate="animate"
        className="fixed inset-0 z-50 w-1/2 bg-gradient-to-r from-[#591C1C] to-[#4a1717]"
        style={{
          boxShadow: '10px 0 20px rgba(0,0,0,0.3)',
          borderRight: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-[url('/logo.png')] bg-center bg-no-repeat bg-contain opacity-10"
        />
      </motion.div>
      <motion.div
        variants={{
          initial: { x: 0 },
          animate: { 
            x: '100%',
            transition: { duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }
          }
        }}
        initial="initial"
        animate="animate"
        className="fixed inset-0 z-50 w-1/2 left-1/2 bg-gradient-to-l from-[#591C1C] to-[#4a1717]"
        style={{
          boxShadow: '-10px 0 20px rgba(0,0,0,0.3)',
          borderLeft: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-[url('/logo.png')] bg-center bg-no-repeat bg-contain opacity-10"
        />
      </motion.div>
    </>
  );
};

export default TransitionDoors;