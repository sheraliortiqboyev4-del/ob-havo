"use client";

import { useEffect, useState } from "react";
import { useWeatherStore } from "@/store/useWeatherStore";
import { getWeatherData } from "@/lib/weatherApi";
import { DynamicBackground } from "@/components/DynamicBackground";
import { SearchBox } from "@/components/SearchBox";
import { WeatherSummary } from "@/components/WeatherSummary";
import { WeatherDetails } from "@/components/WeatherDetails";
import { ForecastScroll } from "@/components/ForecastScroll";
import { DailyForecast } from "@/components/DailyForecast";
import { WeatherChart } from "@/components/WeatherChart";
import { AISuggestion } from "@/components/AISuggestion";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, MapPin, X, Thermometer, Globe, Languages } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { useTranslation } from "@/hooks/useTranslation";

export default function Home() {
  const { weather, setWeather, currentCity, setCurrentCity, unit, setUnit, language, setLanguage, theme, setTheme } = useWeatherStore();
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const lat = currentCity?.lat || 41.2995;
        const lon = currentCity?.lon || 69.2401;
        const data = await getWeatherData(lat, lon, unit, language);
        setWeather(data);
      } catch (error) {
        console.error("Failed to fetch weather:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentCity, unit, language, setWeather]);

  useEffect(() => {
    if (!currentCity && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const data = await getWeatherData(latitude, longitude, unit, language);
          setWeather(data);
        },
        (error) => {
          console.warn("Geolocation denied:", error);
        }
      );
    }
  }, []);

  return (
    <main className={`min-h-screen relative overflow-x-hidden transition-colors duration-500 text-white`}>
      <DynamicBackground condition={weather?.condition || "Sunny"} />

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-6xl relative z-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-12">
          <div className="flex w-full md:w-auto items-center justify-between gap-2 sm:gap-3">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 sm:gap-3"
            >
              <button 
                onClick={() => setShowSettings(true)}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-md rounded-lg sm:rounded-xl flex items-center justify-center border border-white/30 hover:bg-white/30 transition-all"
              >
                <Settings className="text-white w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Ob-havo</h1>
            </motion.div>
            
            <div className="md:hidden">
              <LanguageSwitcher />
            </div>
          </div>

          <div className="w-full md:max-w-md order-3 md:order-2">
            <SearchBox />
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex items-center gap-4 order-2 md:order-3"
          >
            <LanguageSwitcher />
          </motion.div>
        </header>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-[60vh]"
            >
              <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-6 md:gap-8"
            >
              {/* Main Weather Section */}
              <div className="w-full space-y-6 md:space-y-8">
                <WeatherSummary />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-6 md:space-y-8">
                    <AISuggestion />
                    <ForecastScroll />
                    <WeatherChart />
                  </div>
                  <WeatherDetails />
                </div>
              </div>

              {/* 7 Day Forecast Section - Now at the Bottom */}
              <div className="w-full">
                <DailyForecast />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-md relative"
            >
              <GlassCard className="p-8 bg-slate-900/90 border-white/20">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <Settings className="text-white/70" size={24} />
                    <h2 className="text-2xl font-bold text-white">{t('settings')}</h2>
                  </div>
                  <button 
                    onClick={() => setShowSettings(false)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="text-white/70" size={24} />
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Language */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-white/50">
                      <Languages size={18} />
                      <span className="text-xs font-bold uppercase tracking-widest">{t('language')}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {['uz', 'ru', 'en'].map((lang) => (
                        <button
                          key={lang}
                          onClick={() => setLanguage(lang as any)}
                          className={`py-3 rounded-xl font-bold transition-all ${
                            language === lang 
                              ? 'bg-white text-black shadow-xl scale-105' 
                              : 'bg-white/5 text-white hover:bg-white/10'
                          }`}
                        >
                          {lang.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Units */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-white/50">
                      <Thermometer size={18} />
                      <span className="text-xs font-bold uppercase tracking-widest">{t('unit')}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'metric', label: '°C' },
                        { id: 'imperial', label: '°F' }
                      ].map((u) => (
                        <button
                          key={u.id}
                          onClick={() => setUnit(u.id as 'metric' | 'imperial')}
                          className={`py-3 rounded-xl font-bold transition-all ${
                            unit === u.id 
                              ? 'bg-white text-black shadow-xl scale-105' 
                              : 'bg-white/5 text-white hover:bg-white/10'
                          }`}
                        >
                          {u.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Theme */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-white/50">
                      <Globe size={18} />
                      <span className="text-xs font-bold uppercase tracking-widest">{t('theme')}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'light', label: t('light') },
                        { id: 'dark', label: t('dark') },
                        { id: 'dynamic', label: t('dynamic') }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setTheme(item.id as 'light' | 'dark' | 'dynamic')}
                          className={`py-3 rounded-xl font-bold transition-all ${
                            theme === item.id 
                              ? 'bg-white text-black shadow-xl scale-105' 
                              : 'bg-white/5 text-white hover:bg-white/10'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full mt-10 py-4 bg-white text-black font-black rounded-2xl hover:bg-opacity-90 transition-all shadow-xl active:scale-95"
                >
                  OK
                </button>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
