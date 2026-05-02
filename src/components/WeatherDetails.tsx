import { GlassCard } from './GlassCard';
import { useTranslation } from '@/hooks/useTranslation';
import { useWeatherStore } from '@/store/useWeatherStore';
import { 
  Droplets, 
  Wind, 
  Thermometer, 
  Eye, 
  Sun, 
  ArrowDown, 
  Sunrise, 
  Sunset,
  Gauge
} from 'lucide-react';
import { format } from 'date-fns';

export const WeatherDetails = () => {
  const { weather, theme } = useWeatherStore();
  const { t } = useTranslation();

  const isLight = theme === 'light' || (theme === 'dynamic' && new Date().getHours() >= 6 && new Date().getHours() < 20);

  if (!weather) return null;

  const details = [
    { icon: Droplets, label: t('humidity'), value: `${weather.humidity}%`, color: isLight ? "text-blue-600" : "text-blue-500" },
    { icon: Wind, label: t('windSpeed'), value: `${weather.windSpeed} km/h`, color: isLight ? "text-teal-600" : "text-teal-500" },
    { icon: Gauge, label: t('pressure'), value: `${weather.pressure} hPa`, color: isLight ? "text-purple-600" : "text-purple-500" },
    { icon: Eye, label: t('visibility'), value: `${weather.visibility} km`, color: isLight ? "text-amber-600" : "text-amber-500" },
    { icon: Sun, label: t('uvIndex'), value: weather.uvIndex, color: isLight ? "text-orange-600" : "text-orange-500" },
    { icon: Wind, label: t('aqi'), value: weather.aqi, color: isLight ? "text-emerald-600" : "text-emerald-500" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
      {details.map((item, idx) => (
        <GlassCard key={idx} delay={0.1 * idx} className="p-3 sm:p-4 md:p-6 flex flex-col justify-between min-h-[100px] sm:min-h-[120px] md:min-h-[140px] group hover:bg-white/20 transition-all duration-300">
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
            <item.icon size={14} className={`${item.color} sm:size-4 md:size-5`} />
            <span className={`text-[7px] sm:text-[8px] md:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] ${isLight ? 'text-slate-600' : 'text-white'}`}>{item.label}</span>
          </div>
          <span className={`text-lg sm:text-xl md:text-3xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>{item.value}</span>
        </GlassCard>
      ))}
      
      <GlassCard delay={0.6} className={`p-3 sm:p-4 md:p-6 col-span-2 flex flex-col gap-3 sm:gap-4 md:gap-6 ${isLight ? 'bg-black/5' : 'bg-gradient-to-br from-white/10 to-transparent'}`}>
        <div className="flex justify-around items-center h-full gap-1.5 sm:gap-2 text-white">
          <div className="flex flex-col items-center gap-1.5 sm:gap-2">
            <div className={`p-1.5 sm:p-2 md:p-3 ${isLight ? 'bg-orange-500/10' : 'bg-orange-400/20'} rounded-lg sm:rounded-xl md:rounded-2xl`}>
              <Sunrise size={18} className={`${isLight ? 'text-orange-600' : 'text-orange-400'} sm:size-6 md:size-8`} />
            </div>
            <div className="text-center">
              <span className={`text-[7px] sm:text-[8px] md:text-[10px] font-bold uppercase tracking-widest block mb-0.5 sm:mb-1 ${isLight ? 'text-slate-500' : 'text-white/60'}`}>{t('sunrise')}</span>
              <span className={`text-sm sm:text-base md:text-xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>{format(weather.sunrise * 1000, 'HH:mm')}</span>
            </div>
          </div>
          
          <div className={`h-10 sm:h-12 md:h-16 w-[1px] ${isLight ? 'bg-black/10' : 'bg-gradient-to-b from-transparent via-white/20 to-transparent'}`} />
          
          <div className="flex flex-col items-center gap-1.5 sm:gap-2">
            <div className={`p-1.5 sm:p-2 md:p-3 ${isLight ? 'bg-purple-500/10' : 'bg-purple-400/20'} rounded-lg sm:rounded-xl md:rounded-2xl`}>
              <Sunset size={18} className={`${isLight ? 'text-purple-600' : 'text-purple-400'} sm:size-6 md:size-8`} />
            </div>
            <div className="text-center">
              <span className={`text-[7px] sm:text-[8px] md:text-[10px] font-bold uppercase tracking-widest block mb-0.5 sm:mb-1 ${isLight ? 'text-slate-500' : 'text-white/60'}`}>{t('sunset')}</span>
              <span className={`text-sm sm:text-base md:text-xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>{format(weather.sunset * 1000, 'HH:mm')}</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
