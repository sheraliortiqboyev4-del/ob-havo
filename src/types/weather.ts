export type WeatherCondition = 'Sunny' | 'Rainy' | 'Snow' | 'Cloudy' | 'Night' | 'Thunderstorm' | 'Drizzle' | 'Mist';

export interface WeatherData {
  city: string;
  country: string;
  temp: number;
  condition: WeatherCondition;
  description: string;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  aqi: number;
  timezone: number; // Seconds from UTC
  sunrise: number; // Unix timestamp
  sunset: number; // Unix timestamp
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

export interface HourlyForecast {
  time: number; // Unix timestamp
  temp: number;
  condition: WeatherCondition;
  icon: string;
}

export interface DailyForecast {
  date: number; // Unix timestamp
  tempMin: number;
  tempMax: number;
  condition: WeatherCondition;
  icon: string;
}

export interface City {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}
