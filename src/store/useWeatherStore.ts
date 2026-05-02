import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WeatherData, City } from '../types/weather';

interface WeatherState {
  weather: WeatherData | null;
  favorites: City[];
  currentCity: City | null;
  language: 'uz' | 'ru' | 'en';
  unit: 'metric' | 'imperial';
  theme: 'light' | 'dark' | 'dynamic';
  setWeather: (weather: WeatherData) => void;
  addFavorite: (city: City) => void;
  removeFavorite: (cityName: string) => void;
  setCurrentCity: (city: City) => void;
  setLanguage: (lang: 'uz' | 'ru' | 'en') => void;
  setUnit: (unit: 'metric' | 'imperial') => void;
  setTheme: (theme: 'light' | 'dark' | 'dynamic') => void;
}

export const useWeatherStore = create<WeatherState>()(
  persist(
    (set) => ({
      weather: null,
      favorites: [],
      currentCity: null,
      language: 'en',
      unit: 'metric',
      theme: 'dynamic',
      setWeather: (weather) => set({ weather }),
      addFavorite: (city) =>
        set((state) => ({
          favorites: [...state.favorites, city],
        })),
      removeFavorite: (cityName) =>
        set((state) => ({
          favorites: state.favorites.filter((c) => c.name !== cityName),
        })),
      setCurrentCity: (city) => set({ currentCity: city }),
      setLanguage: (lang) => set({ language: lang }),
      setUnit: (unit) => set({ unit }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'weather-storage',
    }
  )
);
