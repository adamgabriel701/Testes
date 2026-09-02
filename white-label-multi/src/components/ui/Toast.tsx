'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

let toastFn: ((msg: string) => void) | null = null;

export const showToast = (msg: string) => {
  if (toastFn) toastFn(msg);
};

export default function Toast() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    toastFn = (msg: string) => {
      setMessage(msg);
      setTimeout(() => setMessage(''), 3000); // Some em 3 segundos
    };
  }, []);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-secondary text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2"
        >
          <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium text-sm">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
