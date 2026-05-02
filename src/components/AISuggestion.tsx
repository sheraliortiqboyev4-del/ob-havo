import { useWeatherStore } from '@/store/useWeatherStore';
import { useTranslation } from '@/hooks/useTranslation';
import { GlassCard } from './GlassCard';
import { Sparkles } from 'lucide-react';

export const AISuggestion = () => {
  const { weather, theme } = useWeatherStore();
  const { t } = useTranslation();

  const isLight = theme === 'light' || (theme === 'dynamic' && new Date().getHours() >= 6 && new Date().getHours() < 20);

  if (!weather) return null;

  const getSuggestion = () => {
    if (weather.condition === 'Rainy' || weather.condition === 'Thunderstorm') return t('takeUmbrella');
    if (weather.temp > 30) return t('stayHydrated');
    if (weather.temp < 10) return t('wearWarm');
    return t('goodForWalk');
  };

  return (
    <GlassCard className={`p-4 ${isLight ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20'}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl ${isLight ? 'bg-indigo-500/20' : 'bg-white/20'}`}>
          <Sparkles size={20} className={`${isLight ? 'text-indigo-600' : 'text-yellow-300'} animate-pulse`} />
        </div>
        <div>
          <p className={`text-[10px] font-bold uppercase tracking-widest ${isLight ? 'text-indigo-600' : 'text-white/50'}`}>{t('aiSuggestion')}</p>
          <p className={`text-sm font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>{getSuggestion()}</p>
        </div>
      </div>
    </GlassCard>
  );
};
