import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useWeatherStore } from '@/store/useWeatherStore';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const GlassCard = ({ children, className, delay = 0 }: GlassCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "backdrop-blur-md border border-white/20 rounded-3xl shadow-xl overflow-hidden transition-colors duration-500 bg-white/10 shadow-white/5",
        className
      )}
    >
      {children}
    </motion.div>
  );
};
