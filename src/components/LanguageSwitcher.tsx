import { useWeatherStore } from '@/store/useWeatherStore';
import { motion } from 'framer-motion';

export const LanguageSwitcher = () => {
  const { language, setLanguage, theme } = useWeatherStore();

  const isLight = theme === 'light';

  const langs = [
    { code: 'uz', label: 'UZ' },
    { code: 'ru', label: 'RU' },
    { code: 'en', label: 'EN' },
  ];

  return (
    <div className={`flex backdrop-blur-md border rounded-full p-1 transition-colors duration-500 ${
      isLight ? 'bg-black/5 border-black/10' : 'bg-white/10 border-white/20'
    }`}>
      {langs.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code as any)}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
            language === lang.code 
              ? (isLight ? 'bg-slate-800 text-white shadow-lg' : 'bg-white text-black shadow-lg')
              : (isLight ? 'text-slate-600 hover:bg-black/5' : 'text-white hover:bg-white/10')
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};
