import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const SensorPlot = ({ sensor, currentValue, unit }) => {
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistoricalData();
  }, [sensor]);

  const fetchHistoricalData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/sensors/history?days=1&limit=288'); // 5-minute intervals for 24 hours
      const data = await response.json();
      
      if (data.success) {
        // Filter and format data for the selected sensor
        const formattedData = data.data
          .filter(reading => reading[sensor] !== null && reading[sensor] !== undefined)
          .map(reading => ({
            timestamp: new Date(reading.timestamp).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            value: parseFloat(reading[sensor]),
            fullTime: new Date(reading.timestamp)
          }))
          .sort((a, b) => a.fullTime - b.fullTime)
          .slice(-50); // Show last 50 readings

        setHistoricalData(formattedData);
      }
    } catch (error) {
      console.error('Error fetching historical data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSensorColor = (sensor) => {
    const colors = {
      humidity: '#3B82F6',
      temperature: '#F97316',
      light_intensity: '#EAB308',
      rainfall: '#2563EB',
      wind_speed: '#6B7280',
      solar_voltage: '#10B981',
      solar_wattage: '#8B5CF6',
      solar_current: '#6366F1'
    };
    return colors[sensor] || '#3B82F6';
  };

  const getSensorRange = (sensor) => {
    const ranges = {
      humidity: [0, 100],
      temperature: [0, 50],
      light_intensity: [0, 1200],
      rainfall: [0, 20],
      wind_speed: [0, 30],
      solar_voltage: [0, 15],
      solar_wattage: [0, 120],
      solar_current: [0, 10]
    };
    return ranges[sensor] || [0, 100];
  };

  const getRecommendation = (sensor, value) => {
    const recommendations = {
      humidity: {
        low: 'Low humidity detected. Consider using a humidifier.',
        normal: 'Humidity levels are optimal for comfort.',
        high: 'High humidity may cause discomfort. Ensure good ventilation.'
      },
      temperature: {
        low: 'Temperature is below comfortable range. Heating may be needed.',
        normal: 'Temperature is in the comfortable range.',
        high: 'High temperature detected. Consider cooling or ventilation.'
      },
      light_intensity: {
        low: 'Low light conditions. Artificial lighting may be needed.',
        normal: 'Good lighting conditions for most activities.',
        high: 'Very bright conditions. Consider sun protection.'
      },
      rainfall: {
        low: 'No precipitation. Good conditions for outdoor activities.',
        normal: 'Light rainfall detected. Take appropriate precautions.',
        high: 'Heavy rainfall. Avoid outdoor activities if possible.'
      },
      wind_speed: {
        low: 'Calm conditions with minimal wind.',
        normal: 'Moderate wind conditions.',
        high: 'Strong winds detected. Secure loose objects.'
      },
      solar_voltage: {
        low: 'Solar panel voltage is low. Check connections or clean panels.',
        normal: 'Solar panels operating at good voltage levels.',
        high: 'Excellent solar panel performance.'
      },
      solar_wattage: {
        low: 'Low solar power generation. Check panel condition.',
        normal: 'Good solar power generation.',
        high: 'Excellent solar power output.'
      },
      solar_current: {
        low: 'Low solar current. Check for shading or panel issues.',
        normal: 'Normal solar current levels.',
        high: 'High solar current - excellent conditions.'
      }
    };

    if (!recommendations[sensor] || typeof value !== 'number') {
      return 'Monitoring sensor readings...';
    }

    const ranges = {
      humidity: { low: 30, high: 80 },
      temperature: { low: 18, high: 28 },
      light_intensity: { low: 200, high: 800 },
      rainfall: { low: 0.1, high: 5 },
      wind_speed: { low: 5, high: 15 },
      solar_voltage: { low: 11, high: 13 },
      solar_wattage: { low: 20, high: 60 },
      solar_current: { low: 2, high: 5 }
    };

    const range = ranges[sensor];
    if (value < range.low) return recommendations[sensor].low;
    if (value > range.high) return recommendations[sensor].high;
    return recommendations[sensor].normal;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900">{`Time: ${label}`}</p>
          <p className="text-sm text-blue-600">
            {`${sensor.replace('_', ' ')}: ${payload[0].value.toFixed(2)} ${unit}`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sensor data...</p>
        </div>
      </div>
    );
  }

  const sensorColor = getSensorColor(sensor);
  const [minRange, maxRange] = getSensorRange(sensor);

  return (
    <div className="space-y-4">
      {/* Current Value Display */}
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <div className="text-3xl font-bold" style={{ color: sensorColor }}>
          {typeof currentValue === 'number' ? currentValue.toFixed(2) : '--'}
          <span className="text-lg text-gray-500 ml-2">{unit}</span>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {getRecommendation(sensor, currentValue)}
        </p>
      </div>

      {/* Historical Chart */}
      <div className="h-64">
        {historicalData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historicalData}>
              <defs>
                <linearGradient id={`gradient-${sensor}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={sensorColor} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={sensorColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="timestamp" 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={[minRange, maxRange]}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}${unit}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={sensorColor}
                fillOpacity={1}
                fill={`url(#gradient-${sensor})`}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p>No historical data available</p>
              <p className="text-sm">Data will appear as readings are collected</p>
            </div>
          </div>
        )}
      </div>

      {/* Statistics */}
      {historicalData.length > 0 && (
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Min</p>
            <p className="text-lg font-semibold text-blue-600">
              {Math.min(...historicalData.map(d => d.value)).toFixed(1)}{unit}
            </p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Avg</p>
            <p className="text-lg font-semibold text-green-600">
              {(historicalData.reduce((sum, d) => sum + d.value, 0) / historicalData.length).toFixed(1)}{unit}
            </p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <p className="text-sm text-gray-600">Max</p>
            <p className="text-lg font-semibold text-red-600">
              {Math.max(...historicalData.map(d => d.value)).toFixed(1)}{unit}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SensorPlot;