import { useWeatherStore } from '@/store/useWeatherStore';
import { GlassCard } from './GlassCard';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

export const WeatherChart = () => {
  const { weather } = useWeatherStore();

  if (!weather) return null;

  const data = weather.hourly.slice(0, 12).map(hour => ({
    time: format(hour.time * 1000, 'HH:mm'),
    temp: hour.temp,
  }));

  return (
    <GlassCard className="p-6 h-[240px] md:h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fff" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#fff" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="time" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
          />
          <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '8px', color: '#fff' }}
            itemStyle={{ color: '#fff' }}
          />
          <Area 
            type="monotone" 
            dataKey="temp" 
            stroke="#fff" 
            fillOpacity={1} 
            fill="url(#colorTemp)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </GlassCard>
  );
};
