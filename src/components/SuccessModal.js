import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SuccessModal = ({ isOpen, onClose, title = "Success!", message = "Action completed successfully.", buttonText = "Continue" }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(8px)',
            }}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              background: 'var(--surface)',
              borderRadius: '24px',
              padding: '40px 32px',
              width: '100%',
              maxWidth: '420px',
              boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.25)',
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            {/* Success Icon Animated */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.1 }}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: '#A5DC86',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                boxShadow: '0 0 0 8px rgba(165, 220, 134, 0.2)'
              }}
            >
              <svg width="40" height="40" viewBox="0 0 50 50">
                <motion.path
                  d="M14.1 27.2l7.1 7.2 16.7-16.8"
                  fill="transparent"
                  stroke="#ffffff"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
                />
              </svg>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{ 
                fontSize: '28px', 
                fontWeight: 800, 
                color: 'var(--ink)', 
                marginBottom: '12px',
                fontFamily: 'var(--ff-h)'
              }}
            >
              {title}
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{ 
                fontSize: '16px', 
                color: 'var(--muted)', 
                marginBottom: '32px',
                lineHeight: 1.5,
                fontWeight: 500
              }}
            >
              {message}
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              onClick={onClose}
              whileHover={{ scale: 1.02, backgroundColor: 'var(--accent2)' }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: 'var(--accent)',
                color: '#fff',
                border: 'none',
                padding: '14px 32px',
                borderRadius: '16px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
                width: '100%',
                boxShadow: '0 8px 20px rgba(79, 70, 229, 0.25)',
                transition: 'background 0.2s'
              }}
            >
              {buttonText}
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal;
