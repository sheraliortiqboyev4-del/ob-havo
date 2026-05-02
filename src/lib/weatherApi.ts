import axios from 'axios';
import { WeatherData, City, WeatherCondition } from '../types/weather';

const API_KEY = 'e2dc022efe3bd321d4b9eb96f5e20676'; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

export const getCityCoords = async (city: string): Promise<City[]> => {
  try {
    // OpenWeatherMap-da butun dunyo bo'ylab qidirish
    const response = await axios.get(`${GEO_URL}/direct`, {
      params: {
        q: city,
        limit: 10, // Natijalar sonini oshirdik
        appid: API_KEY,
      },
      timeout: 5000 
    });

    if (response.data && response.data.length > 0) {
      return response.data.map((item: any) => ({
        name: item.name,
        lat: item.lat,
        lon: item.lon,
        country: item.country,
        state: item.state,
      }));
    }
    
    // Agar API natija bermasa, namunaviy shaharlardan qidirish
    return mockCities.filter(c => c.name.toLowerCase().includes(city.toLowerCase()));
  } catch (error) {
    console.warn("API Error (Coords), using mock data:", error);
    return mockCities.filter(c => c.name.toLowerCase().includes(city.toLowerCase()));
  }
};

export const getWeatherData = async (lat: number, lon: number, unit: 'metric' | 'imperial' = 'metric', lang: string = 'uz'): Promise<WeatherData> => {
  const apiLang = lang === 'uz' ? 'uz' : lang === 'ru' ? 'ru' : 'en';
  try {
    const [weatherRes, forecastRes, airRes] = await Promise.all([
      axios.get(`${BASE_URL}/weather`, {
        params: { lat, lon, units: unit, lang: apiLang, appid: API_KEY },
      }),
      axios.get(`${BASE_URL}/forecast`, {
        params: { lat, lon, units: unit, lang: apiLang, appid: API_KEY },
      }),
      axios.get(`${BASE_URL}/air_pollution`, {
        params: { lat, lon, appid: API_KEY },
      }),
    ]);

    const weather = weatherRes.data;
    const forecast = forecastRes.data;
    const air = airRes.data;

    const mapCondition = (id: number): WeatherCondition => {
      if (id >= 200 && id < 300) return 'Thunderstorm';
      if (id >= 300 && id < 400) return 'Drizzle';
      if (id >= 500 && id < 600) return 'Rainy';
      if (id >= 600 && id < 700) return 'Snow';
      if (id >= 700 && id < 800) return 'Mist';
      if (id === 800) return 'Sunny';
      return 'Cloudy';
    };

    return {
      city: weather.name,
      country: weather.sys.country,
      temp: Math.round(weather.main.temp),
      condition: mapCondition(weather.weather[0].id),
      description: weather.weather[0].description.charAt(0).toUpperCase() + weather.weather[0].description.slice(1),
      feelsLike: Math.round(weather.main.feels_like),
      humidity: weather.main.humidity,
      windSpeed: Math.round(weather.wind.speed * 10) / 10,
      pressure: weather.main.pressure,
      visibility: weather.visibility / 1000,
      uvIndex: 0,
      aqi: air.list[0].main.aqi,
      timezone: weather.timezone,
      sunrise: weather.sys.sunrise,
      sunset: weather.sys.sunset,
      hourly: forecast.list.slice(0, 24).map((item: any) => ({
        time: item.dt,
        temp: Math.round(item.main.temp),
        condition: mapCondition(item.weather[0].id),
        icon: item.weather[0].icon,
      })),
      daily: forecast.list
        .filter((_: any, index: number) => index % 8 === 0)
        .map((item: any) => ({
          date: item.dt,
          tempMin: Math.round(item.main.temp_min),
          tempMax: Math.round(item.main.temp_max),
          condition: mapCondition(item.weather[0].id),
          icon: item.weather[0].icon,
        })),
    };
  } catch (error) {
    console.warn("API Error (Weather), using mock data:", error);
    // Fallback to mock data on error
    const seed = Math.abs(lat + lon);
    
    // Tarjima qilingan tavsiflar
    const descriptions: Record<string, string> = {
      uz: 'Musafo osmon',
      ru: 'Ясное небо',
      en: 'Clear sky'
    };

    const temp = Math.round(15 + Math.sin(seed) * 15);
    
    // Shaharga qarab vaqt mintaqasini aniqlash (mock ma'lumotlar uchun)
    const getTimezone = (cityName: string) => {
      const zones: Record<string, number> = {
        'Tashkent': 18000, // UTC+5
        'Moscow': 10800,   // UTC+3
        'London': 3600,    // UTC+1 (BST)
        'New York': -14400, // UTC-4 (EDT)
        'Dubai': 14400,    // UTC+4
      };
      return zones[cityName] || 18000;
    };

    const cityName = mockCities.find(c => Math.abs(c.lat - lat) < 0.1 && Math.abs(c.lon - lon) < 0.1)?.name || "Ob-havo";
    const timezone = getTimezone(cityName);
    
    return {
      city: cityName,
      country: mockCities.find(c => c.name === cityName)?.country || "UZ",
      temp: temp,
      condition: 'Sunny',
      description: descriptions[lang] || descriptions.en,
      feelsLike: temp + 2,
      humidity: Math.round(40 + Math.sin(seed) * 20),
      windSpeed: Number((5 + Math.abs(Math.cos(seed) * 10)).toFixed(1)),
      pressure: Math.round(1010 + Math.sin(seed) * 10),
      visibility: 10,
      uvIndex: 5,
      aqi: 2,
      timezone: timezone,
      sunrise: Math.floor(Date.now() / 1000) - 3600 * 6,
      sunset: Math.floor(Date.now() / 1000) + 3600 * 6,
      hourly: Array.from({ length: 24 }).map((_, i) => ({
        time: Math.floor(Date.now() / 1000) + i * 3600,
        temp: Math.round(temp + Math.sin(i / 4 + seed) * 5),
        condition: i > 18 || i < 6 ? 'Night' : 'Sunny',
        icon: '01d',
      })),
      daily: Array.from({ length: 7 }).map((_, i) => ({
        date: Math.floor(Date.now() / 1000) + i * 86400,
        tempMin: Math.round(temp - 5 + Math.sin(i + seed) * 2),
        tempMax: Math.round(temp + 5 + Math.cos(i + seed) * 2),
        condition: (i + Math.floor(seed)) % 3 === 0 ? 'Cloudy' : 'Sunny',
        icon: '01d',
      })),
    };
  }
};

const mockCities: City[] = [
  { name: 'Tashkent', lat: 41.2995, lon: 69.2401, country: 'UZ' },
  { name: 'Moscow', lat: 55.7558, lon: 37.6173, country: 'RU' },
  { name: 'London', lat: 51.5074, lon: -0.1278, country: 'GB' },
  { name: 'New York', lat: 40.7128, lon: -74.006, country: 'US' },
];

const mockWeatherData: WeatherData = {
  city: 'Tashkent',
  country: 'UZ',
  temp: 25,
  condition: 'Sunny',
  description: 'Musafo osmon',
  feelsLike: 27,
  humidity: 40,
  windSpeed: 5.4,
  pressure: 1012,
  visibility: 10,
  uvIndex: 6,
  aqi: 2,
  timezone: 18000,
  sunrise: 1714521600,
  sunset: 1714572000,
  hourly: Array.from({ length: 24 }).map((_, i) => ({
    time: Math.floor(Date.now() / 1000) + i * 3600,
    temp: 20 + Math.sin(i / 4) * 5,
    condition: i > 18 || i < 6 ? 'Night' : 'Sunny',
    icon: '01d',
  })),
  daily: Array.from({ length: 7 }).map((_, i) => ({
    date: Math.floor(Date.now() / 1000) + i * 86400,
    tempMin: 15,
    tempMax: 28,
    condition: i % 3 === 0 ? 'Cloudy' : 'Sunny',
    icon: '01d',
  })),
};
