import { useWeatherStore } from '@/store/useWeatherStore';
import { useTranslation } from '@/hooks/useTranslation';
import { GlassCard } from './GlassCard';
import { WeatherIcon } from './WeatherIcon';
import { format } from 'date-fns';

export const ForecastScroll = () => {
  const { weather, theme } = useWeatherStore();
  const { t } = useTranslation();

  const isLight = theme === 'light' || (theme === 'dynamic' && new Date().getHours() >= 6 && new Date().getHours() < 20);

  if (!weather) return null;

  return (
    <GlassCard className="p-4 sm:p-6">
      <h3 className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider mb-3 sm:mb-4 px-1 ${isLight ? 'text-slate-500' : 'text-white/50'}`}>{t('hourlyForecast')}</h3>
      <div className="flex gap-4 sm:gap-8 overflow-x-auto pb-2 sm:pb-4 scrollbar-hide">
        {weather.hourly.map((hour, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2 sm:gap-4 min-w-[60px] sm:min-w-[80px] shrink-0">
            <span className={`text-xs sm:text-sm font-semibold ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
              {idx === 0 ? t('now') : format(hour.time * 1000, 'HH:mm')}
            </span>
            <WeatherIcon condition={hour.condition} size={24} className={`sm:size-8 ${isLight ? 'text-slate-800' : 'text-white'} drop-shadow-lg`} />
            <span className={`text-lg sm:text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{Math.round(hour.temp)}°</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
