import { motion, AnimatePresence } from 'framer-motion';
import { WeatherCondition } from '@/types/weather';
import { useEffect, useState } from 'react';
import { useWeatherStore } from '@/store/useWeatherStore';

interface DynamicBackgroundProps {
  condition: WeatherCondition;
}

const MoonAnimation = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    className="absolute top-20 right-20 w-32 h-32 bg-indigo-100 rounded-full blur-xl shadow-[0_0_80px_rgba(255,255,255,0.4)]"
  >
    <div className="absolute top-2 left-2 w-full h-full bg-slate-900 rounded-full translate-x-4 -translate-y-2" />
  </motion.div>
);

export const DynamicBackground = ({ condition }: DynamicBackgroundProps) => {
  const { theme, weather } = useWeatherStore();
  const [isNightTime, setIsNightTime] = useState(false);

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      let hour = now.getHours();

      // If we have weather data with timezone, use local time of the city
      if (weather && weather.timezone) {
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const cityTime = new Date(utc + (weather.timezone * 1000));
        hour = cityTime.getHours();
      }

      setIsNightTime(hour >= 20 || hour < 6);
    };

    checkTime();
    const timer = setInterval(checkTime, 60000);
    return () => clearInterval(timer);
  }, [weather]);
  
  const backgrounds = {
    Sunny: "bg-gradient-to-br from-sky-400 via-blue-300 to-sky-200",
    Rainy: "bg-gradient-to-br from-slate-700 via-blue-900 to-slate-900",
    Snow: "bg-gradient-to-br from-blue-50 via-indigo-100 to-white",
    Cloudy: "bg-gradient-to-br from-gray-400 via-slate-400 to-zinc-500",
    Night: "bg-gradient-to-br from-slate-900 via-purple-900 to-black",
    Thunderstorm: "bg-gradient-to-br from-gray-900 via-purple-900 to-slate-900",
    Drizzle: "bg-gradient-to-br from-slate-400 via-blue-300 to-slate-600",
    Mist: "bg-gradient-to-br from-gray-300 via-slate-300 to-gray-400",
  };

  const getBackground = () => {
    if (theme === 'dynamic') {
      if (isNightTime && (condition === 'Sunny' || condition === 'Cloudy' || condition === 'Mist')) {
        return backgrounds.Night;
      }
      return backgrounds[condition] || backgrounds.Sunny;
    }
    return theme === 'dark' ? backgrounds.Night : backgrounds.Sunny;
  };

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden transition-colors duration-1000">
      <AnimatePresence mode="wait">
        <motion.div
          key={theme === 'dynamic' ? `${condition}-${isNightTime}` : theme}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className={`absolute inset-0 ${getBackground()}`}
        >
          {theme === 'dynamic' ? (
            <>
              {isNightTime ? (
                <>
                  <StarAnimation />
                  <MoonAnimation />
                </>
              ) : (
                (condition === 'Sunny' || condition === 'Mist') && <SunAnimation />
              )}
              {condition === 'Rainy' && <RainAnimation />}
              {condition === 'Snow' && <SnowAnimation />}
              {condition === 'Cloudy' && !isNightTime && <CloudAnimation />}
              {condition === 'Thunderstorm' && <LightningAnimation />}
              {condition === 'Drizzle' && <RainAnimation />}
            </>
          ) : (
            <>
              {theme === 'light' && (
                <>
                  <SunAnimation />
                  <CloudAnimation />
                </>
              )}
              {theme === 'dark' && (
                <>
                  <StarAnimation />
                  <MoonAnimation />
                </>
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const SunAnimation = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    className="absolute top-20 right-20 w-40 h-40 bg-yellow-300 rounded-full blur-2xl shadow-[0_0_100px_rgba(253,224,71,0.8)]"
  />
);

const RainAnimation = () => (
  <div className="absolute inset-0 opacity-30">
    {Array.from({ length: 50 }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ y: -20, x: Math.random() * 100 + "%" }}
        animate={{ y: "110vh" }}
        transition={{
          duration: Math.random() * 1 + 0.5,
          repeat: Infinity,
          ease: "linear",
          delay: Math.random() * 2,
        }}
        className="absolute w-[1px] h-8 bg-white"
      />
    ))}
  </div>
);

const SnowAnimation = () => (
  <div className="absolute inset-0 opacity-50">
    {Array.from({ length: 50 }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ y: -20, x: Math.random() * 100 + "%", opacity: 0 }}
        animate={{ y: "110vh", opacity: [0, 1, 1, 0], x: (Math.random() * 100 + (Math.sin(i) * 5)) + "%" }}
        transition={{
          duration: Math.random() * 3 + 2,
          repeat: Infinity,
          ease: "linear",
          delay: Math.random() * 5,
        }}
        className="absolute w-2 h-2 bg-white rounded-full blur-[1px]"
      />
    ))}
  </div>
);

const StarAnimation = () => (
  <div className="absolute inset-0">
    {Array.from({ length: 100 }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: Math.random() }}
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{
          duration: Math.random() * 3 + 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: Math.random() * 5,
        }}
        style={{
          left: Math.random() * 100 + "%",
          top: Math.random() * 100 + "%",
        }}
        className="absolute w-[2px] h-[2px] bg-white rounded-full shadow-[0_0_2px_white]"
      />
    ))}
  </div>
);

const CloudAnimation = () => (
  <div className="absolute inset-0 overflow-hidden opacity-20">
    {Array.from({ length: 5 }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ x: "-50%", y: Math.random() * 60 + "%" }}
        animate={{ x: "150%" }}
        transition={{
          duration: Math.random() * 30 + 30,
          repeat: Infinity,
          ease: "linear",
          delay: Math.random() * 10,
        }}
        className="absolute w-[400px] h-[200px] bg-white/30 rounded-full blur-3xl"
      />
    ))}
  </div>
);

const LightningAnimation = () => {
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const trigger = () => {
      setFlash(true);
      setTimeout(() => setFlash(false), 50);
      setTimeout(() => {
        setFlash(true);
        setTimeout(() => setFlash(false), 100);
      }, 100);
      
      setTimeout(trigger, Math.random() * 5000 + 2000);
    };
    
    const timeout = setTimeout(trigger, 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={`absolute inset-0 bg-white transition-opacity duration-75 pointer-events-none ${flash ? 'opacity-20' : 'opacity-0'}`} />
  );
};
