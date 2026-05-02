import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { getCityCoords } from '@/lib/weatherApi';
import { City } from '@/types/weather';
import { useWeatherStore } from '@/store/useWeatherStore';
import { motion, AnimatePresence } from 'framer-motion';

const mockCities = [
  { name: 'Tashkent', lat: 41.2995, lon: 69.2401, country: 'UZ' },
  { name: 'Samarkand', lat: 39.6542, lon: 66.9597, country: 'UZ' },
  { name: 'Bukhara', lat: 39.7747, lon: 64.4286, country: 'UZ' },
  { name: 'Andijan', lat: 40.7821, lon: 72.3442, country: 'UZ' },
  { name: 'Moscow', lat: 55.7558, lon: 37.6173, country: 'RU' },
  { name: 'London', lat: 51.5074, lon: -0.1278, country: 'GB' },
  { name: 'New York', lat: 40.7128, lon: -74.006, country: 'US' },
  { name: 'Dubai', lat: 25.2048, lon: 55.2708, country: 'AE' },
];

export const SearchBox = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<City[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const { setCurrentCity, theme } = useWeatherStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const isLight = theme === 'light';

  useEffect(() => {
    const search = async () => {
      if (query.trim().length > 1) {
        try {
          const cities = await getCityCoords(query.trim());
          setResults(cities);
        } catch (error) {
          console.error("Search error:", error);
          setResults([]);
        }
      } else {
        setResults([]);
      }
    };

    const timer = setTimeout(search, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: City) => {
    setCurrentCity(city);
    setQuery('');
    setResults([]);
    setIsFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const currentResults = results.length > 0 ? results : mockCities.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));
      if (currentResults.length > 0) {
        handleSelect(currentResults[0]);
      }
    }
  };

  const displayResults = results.length > 0 
    ? results 
    : query.length > 0 
      ? mockCities.filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
      : [];

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto z-[999]">
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search size={18} className={`${isLight ? 'text-slate-400' : 'text-white/60'} group-focus-within:text-indigo-500 transition-colors`} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsFocused(true);
          }}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={t('searchPlaceholder')}
          className={`w-full backdrop-blur-2xl border rounded-xl sm:rounded-2xl py-3 sm:py-4 pl-10 sm:pl-12 pr-4 transition-all shadow-2xl text-base sm:text-lg font-medium outline-none focus:ring-2 ${
            isLight 
              ? 'bg-white/80 border-black/10 text-slate-900 placeholder-slate-400 focus:ring-indigo-500/30' 
              : 'bg-black/40 border-white/30 text-white placeholder-white/50 focus:ring-white/40'
          }`}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className="absolute inset-y-0 right-4 flex items-center"
          >
            <X size={18} className={isLight ? 'text-slate-400 hover:text-slate-600' : 'text-white/60 hover:text-white'} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isFocused && displayResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`absolute top-full left-0 right-0 mt-2 backdrop-blur-2xl border rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-[1000] ${
              isLight ? 'bg-white/95 border-black/10' : 'bg-slate-900/95 border-white/20'
            }`}
          >
            <div className="p-2 max-h-[300px] overflow-y-auto">
              {displayResults.map((city, idx) => (
                <button
                  key={`${city.name}-${idx}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(city);
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors text-left group/item ${
                    isLight ? 'hover:bg-indigo-50 text-slate-800' : 'hover:bg-white/10 text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className={isLight ? 'text-indigo-500' : 'text-white/40 group-hover/item:text-white'} />
                    <div>
                      <p className="font-bold">{city.name}</p>
                      <p className={`${isLight ? 'text-slate-400' : 'text-white/40'} text-xs`}>{city.country}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
