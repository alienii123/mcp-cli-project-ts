export type WeatherCondition = 
  | 'sunny' 
  | 'cloudy' 
  | 'rainy' 
  | 'snowy' 
  | 'partly-cloudy' 
  | 'stormy';

export interface WeatherData {
  city: string;
  condition: WeatherCondition;
  temperature: number;
  humidity: number;
  windSpeed: number;
  timestamp: string;
}