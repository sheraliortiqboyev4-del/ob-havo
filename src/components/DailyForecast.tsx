import { useWeatherStore } from '@/store/useWeatherStore';
import { useTranslation } from '@/hooks/useTranslation';
import { GlassCard } from './GlassCard';
import { WeatherIcon } from './WeatherIcon';
import { format } from 'date-fns';
import { uz, ru, enUS } from 'date-fns/locale';

export const DailyForecast = () => {
  const { weather, theme, language } = useWeatherStore();
  const { t } = useTranslation();

  const isLight = theme === 'light' || (theme === 'dynamic' && new Date().getHours() >= 6 && new Date().getHours() < 20);

  const getLocale = () => {
    switch (language) {
      case 'uz': return uz;
      case 'ru': return ru;
      default: return enUS;
    }
  };

  if (!weather) return null;

  return (
    <GlassCard className="p-4 sm:p-6 md:p-8 h-full">
      <h3 className={`text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] mb-4 sm:mb-6 md:mb-8 px-1 ${isLight ? 'text-slate-500' : 'text-white/60'}`}>{t('dailyForecast')}</h3>
      <div className="flex flex-col gap-3 sm:gap-4 md:gap-6">
        {weather.daily.map((day, idx) => (
          <div key={idx} className="flex items-center justify-between group cursor-default gap-2 sm:gap-4 p-1.5 sm:p-2 hover:bg-white/5 rounded-xl sm:rounded-2xl transition-colors">
            <span className={`text-xs sm:text-sm md:text-base font-bold w-16 sm:w-20 md:w-24 ${isLight ? 'text-slate-800' : 'text-white'} capitalize`}>
              {idx === 0 ? t('today') : format(day.date * 1000, 'EEEE', { locale: getLocale() })}
            </span>
            <div className="flex items-center gap-2 sm:gap-4 flex-1">
              <WeatherIcon condition={day.condition} size={20} className={`sm:size-7 md:size-8 drop-shadow-md ${isLight ? 'text-slate-700' : 'text-white'}`} />
              <span className={`text-[8px] sm:text-[10px] font-bold uppercase tracking-widest ${isLight ? 'text-slate-500' : 'text-white/60'} hidden xs:inline`}>
                {t(day.condition as any)}
              </span>
            </div>
            <div className="flex gap-3 sm:gap-6 md:gap-8 w-24 sm:w-32 md:w-40 justify-end">
              <div className="flex flex-col items-end">
                <span className={`text-[7px] sm:text-[8px] font-bold uppercase ${isLight ? 'text-slate-400' : 'text-white/40'} tracking-tighter`}>{t('high')}</span>
                <span className={`text-sm sm:text-lg md:text-xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>{day.tempMax}°</span>
              </div>
              <div className="flex flex-col items-end">
                <span className={`text-[7px] sm:text-[8px] font-bold uppercase ${isLight ? 'text-slate-400' : 'text-white/40'} tracking-tighter`}>{t('low')}</span>
                <span className={`text-sm sm:text-lg md:text-xl font-bold ${isLight ? 'text-slate-500' : 'text-white/40'}`}>{day.tempMin}°</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
