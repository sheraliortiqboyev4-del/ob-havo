import { useState, useEffect } from 'react';
import { useWeatherStore } from '@/store/useWeatherStore';
import { useTranslation } from '@/hooks/useTranslation';
import { WeatherIcon } from './WeatherIcon';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { MapPin } from 'lucide-react';
import { uz, ru, enUS } from 'date-fns/locale';

export const WeatherSummary = () => {
  const { weather, unit, language, theme } = useWeatherStore();
  const { t, translateDescription } = useTranslation();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Calculate local time for the city
  const getCityTime = () => {
    if (!weather) return new Date();
    const now = new Date();
    // UTC time
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    // City time
    return new Date(utc + (weather.timezone * 1000));
  };

  const [cityTime, setCityTime] = useState(getCityTime());
  const isLight = theme === 'light' || (theme === 'dynamic' && cityTime.getHours() >= 6 && cityTime.getHours() < 20);

  const getLocale = () => {
    switch (language) {
      case 'uz': return uz;
      case 'ru': return ru;
      default: return enUS;
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCityTime(getCityTime());
    }, 1000);
    return () => clearInterval(timer);
  }, [weather]); // Update when city changes

  if (!weather) return null;

  return (
    <div className={`flex flex-col items-center justify-center py-4 md:py-12 transition-colors duration-500 ${isLight ? 'text-slate-800' : 'text-white'} w-full max-w-6xl mx-auto relative min-h-[400px] md:min-h-[550px]`}>
      <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8 md:gap-4 px-4">
        {/* Left: Temp & Condition */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col items-center md:items-start order-2 md:order-1"
        >
          <div className="flex items-start">
            <span className="text-[7rem] sm:text-[10rem] md:text-[14rem] font-black tracking-tighter leading-[0.8]">{weather.temp}</span>
            <span className={`text-2xl sm:text-4xl md:text-6xl font-light mt-4 sm:mt-8 md:mt-12 ml-1 sm:ml-2 ${isLight ? 'opacity-40' : 'opacity-30'}`}>{unit === 'metric' ? '°' : '°'}</span>
          </div>
          <div className="mt-2 sm:mt-4 text-center md:text-left">
            <h3 className="text-xl sm:text-3xl md:text-5xl font-black uppercase tracking-wider mb-1 sm:mb-2 text-glow">
              {translateDescription(weather.description)}
            </h3>
            <div className="flex items-center gap-2 sm:gap-3 justify-center md:justify-start">
              <div className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full ${isLight ? 'bg-black/5' : 'bg-white/10'} backdrop-blur-md border border-white/5`}>
                <span className="text-[10px] sm:text-sm font-bold uppercase tracking-widest">{t('feelsLike')} {weather.feelsLike}°</span>
              </div>
              <div className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full ${isLight ? 'bg-black/5' : 'bg-white/10'} backdrop-blur-md border border-white/5`}>
                <span className="text-[10px] sm:text-sm font-bold uppercase tracking-widest">H:{weather.daily[0]?.tempMax}° L:{weather.daily[0]?.tempMin}°</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Center: Hero Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 12, stiffness: 100 }}
          className="relative order-1 md:order-2"
        >
          <div className={`absolute inset-0 ${isLight ? 'bg-blue-400/30' : 'bg-white/20'} rounded-full blur-[80px] sm:blur-[120px] scale-110 sm:scale-125 animate-pulse`} />
          <WeatherIcon 
            condition={weather.condition} 
            size={160} 
            className={`sm:size-[240px] md:size-[380px] relative z-10 drop-shadow-[0_0_60px_rgba(${isLight ? '59,130,246,0.4' : '255,255,255,0.6'})]`} 
          />
        </motion.div>

        {/* Right: Location & Time */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col items-center md:items-end order-3"
        >
          <div className={`${isLight ? 'bg-black/10' : 'bg-white/10'} px-4 sm:px-6 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl backdrop-blur-md border ${isLight ? 'border-black/10' : 'border-white/10'} mb-4 sm:mb-6 group hover:scale-105 transition-transform cursor-default`}>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <MapPin size={12} className={isLight ? 'text-blue-600' : 'text-blue-400'} />
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em]">{weather.city}, {weather.country}</span>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <span className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter leading-none block">{format(cityTime, 'HH:mm')}</span>
            <div className="mt-1 sm:mt-2 space-y-0.5 sm:space-y-1">
              <span className={`text-lg sm:text-xl md:text-2xl font-bold ${isLight ? 'opacity-80' : 'opacity-70'} uppercase tracking-[0.2em] sm:tracking-[0.3em] block`}>
                {format(cityTime, 'EEEE', { locale: getLocale() })}
              </span>
              <span className={`text-xs sm:text-sm md:text-lg font-medium ${isLight ? 'opacity-50' : 'opacity-40'} uppercase tracking-[0.15em] sm:tracking-[0.2em] block`}>
                {format(cityTime, 'd MMMM', { locale: getLocale() })}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
