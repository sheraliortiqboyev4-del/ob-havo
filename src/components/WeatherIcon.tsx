import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  CloudDrizzle, 
  CloudFog, 
  Moon,
  Wind
} from 'lucide-react';
import { WeatherCondition } from '@/types/weather';
import { motion } from 'framer-motion';

interface WeatherIconProps {
  condition: WeatherCondition;
  className?: string;
  size?: number;
}

export const WeatherIcon = ({ condition, className, size = 24 }: WeatherIconProps) => {
  const iconMap = {
    Sunny: Sun,
    Cloudy: Cloud,
    Rainy: CloudRain,
    Snow: CloudSnow,
    Thunderstorm: CloudLightning,
    Drizzle: CloudDrizzle,
    Mist: CloudFog,
    Night: Moon,
  };

  const Icon = iconMap[condition] || Cloud;

  const animation = {
    Sunny: { rotate: [0, 10, 0], scale: [1, 1.1, 1] },
    Rainy: { y: [0, 5, 0] },
    Cloudy: { x: [-2, 2, -2] },
    Night: { rotate: [-5, 5, -5] },
  }[condition] || {};

  return (
    <motion.div
      animate={animation}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className={className}
    >
      <Icon size={size} strokeWidth={1.5} />
    </motion.div>
  );
};
