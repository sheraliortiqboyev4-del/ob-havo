import { useWeatherStore } from '../store/useWeatherStore';
import { translations } from '../i18n/translations';

export const useTranslation = () => {
  const language = useWeatherStore((state) => state.language);
  const t = (key: keyof typeof translations.en) => {
    return translations[language][key] || translations.en[key] || key;
  };

  const translateDescription = (description: string) => {
    if (!description) return '';
    
    const mapping: Record<string, keyof typeof translations.en> = {
      'overcast clouds': 'overcastClouds',
      'broken clouds': 'brokenClouds',
      'scattered clouds': 'scatteredClouds',
      'few clouds': 'fewClouds',
      'clear sky': 'clearSky',
      'light rain': 'lightRain',
      'moderate rain': 'moderateRain',
      'heavy intensity rain': 'heavyIntensityRain',
    };

    const key = mapping[description.toLowerCase()];
    if (key) {
      return t(key);
    }

    return description;
  };

  return { t, translateDescription, language };
};
