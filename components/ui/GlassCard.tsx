import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hoverEffect = false, onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      className={`
        relative overflow-hidden
        bg-black/60 backdrop-blur-xl
        border border-white/20
        shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]
        rounded-2xl
        ${hoverEffect ? 'hover:bg-white/10 hover:border-white/30 cursor-pointer transition-all duration-300' : ''}
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* "Silk" edge highlight */}
      <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none" />
      
      {children}
    </motion.div>
  );
};