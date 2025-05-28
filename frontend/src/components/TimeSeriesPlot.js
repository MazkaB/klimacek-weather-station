import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  ComposedChart,
  ReferenceLine
} from 'recharts';

const TimeSeriesPlot = ({ sensor, predictions }) => {
  const [historicalData, setHistoricalData] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');
  const [showConfidence, setShowConfidence] = useState(true);

  useEffect(() => {
    fetchHistoricalData();
  }, [sensor, timeRange]);

  useEffect(() => {
    if (historicalData.length > 0) {
      combineHistoricalAndPredictions();
    }
  }, [historicalData, predictions, sensor]);

  const fetchHistoricalData = async () => {
    setLoading(true);
    try {
      const daysMap = {
        '24h': 1,
        '7d': 7,
        '30d': 30
      };
      
      const days = daysMap[timeRange] || 1;
      const response = await fetch(`http://localhost:5000/api/sensors/history?days=${days}&limit=500`);
      const data = await response.json();
      
      if (data.success) {
        const formattedData = data.data
          .filter(reading => reading[sensor] !== null && reading[sensor] !== undefined)
          .map(reading => ({
            timestamp: new Date(reading.timestamp),
            value: parseFloat(reading[sensor]),
            type: 'historical'
          }))
          .sort((a, b) => a.timestamp - b.timestamp);

        setHistoricalData(formattedData);
      }
    } catch (error) {
      console.error('Error fetching historical data:', error);
    } finally {
      setLoading(false);
    }
  };

  const combineHistoricalAndPredictions = () => {
    let combined = [...historicalData];

    // Add predictions if available
    if (predictions && predictions[sensor]) {
      const predictionData = predictions[sensor].map(pred => ({
        timestamp: new Date(pred.date || pred.timestamp),
        value: pred.predicted_value || pred.value,
        confidence: pred.confidence,
        type: 'prediction'
      }));

      combined = [...combined, ...predictionData];
    }

    // Sort by timestamp and format for chart
    const chartData = combined
      .sort((a, b) => a.timestamp - b.timestamp)
      .map((item, index) => ({
        ...item,
        timeLabel: formatTimeLabel(item.timestamp, timeRange),
        index: index,
        historicalValue: item.type === 'historical' ? item.value : null,
        predictedValue: item.type === 'prediction' ? item.value : null,
        confidenceBand: item.type === 'prediction' && item.confidence ? 
          item.value * (1 - (100 - item.confidence) / 200) : null
      }));

    setCombinedData(chartData);
  };

  const formatTimeLabel = (timestamp, range) => {
    const date = new Date(timestamp);
    
    switch (range) {
      case '24h':
        return date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      case '7d':
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      case '30d':
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      default:
        return date.toLocaleString();
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

  const getSensorUnit = (sensor) => {
    const units = {
      humidity: '%',
      temperature: '°C',
      light_intensity: 'lux',
      rainfall: 'mm',
      wind_speed: 'km/h',
      solar_voltage: 'V',
      solar_wattage: 'W',
      solar_current: 'A'
    };
    return units[sensor] || '';
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900">{`Time: ${label}`}</p>
          {data.historicalValue !== null && (
            <p className="text-sm text-blue-600">
              Historical: {data.historicalValue.toFixed(2)} {getSensorUnit(sensor)}
            </p>
          )}
          {data.predictedValue !== null && (
            <>
              <p className="text-sm text-red-600">
                Predicted: {data.predictedValue.toFixed(2)} {getSensorUnit(sensor)}
              </p>
              {data.confidence && (
                <p className="text-xs text-gray-500">
                  Confidence: {data.confidence.toFixed(0)}%
                </p>
              )}
            </>
          )}
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
          <p className="mt-4 text-gray-600">Loading time series data...</p>
        </div>
      </div>
    );
  }

  const sensorColor = getSensorColor(sensor);
  const unit = getSensorUnit(sensor);
  const currentTime = new Date();

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Time Range:</label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>

        {predictions && predictions[sensor] && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showConfidence"
              checked={showConfidence}
              onChange={(e) => setShowConfidence(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="showConfidence" className="text-sm text-gray-700">
              Show Confidence Band
            </label>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="h-80">
        {combinedData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={combinedData}>
              <defs>
                <linearGradient id={`gradient-historical-${sensor}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={sensorColor} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={sensorColor} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id={`gradient-prediction-${sensor}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="timeLabel" 
                tick={{ fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => `${value}${unit}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {/* Historical Data Line */}
              <Line
                type="monotone"
                dataKey="historicalValue"
                stroke={sensorColor}
                strokeWidth={2}
                dot={false}
                name="Historical Data"
                connectNulls={false}
              />

              {/* Prediction Line */}
              {predictions && predictions[sensor] && (
                <Line
                  type="monotone"
                  dataKey="predictedValue"
                  stroke="#EF4444"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#EF4444', r: 3 }}
                  name="AI Predictions"
                  connectNulls={false}
                />
              )}

              {/* Confidence Band */}
              {showConfidence && predictions && predictions[sensor] && (
                <Area
                  type="monotone"
                  dataKey="confidenceBand"
                  stroke="none"
                  fillOpacity={0.1}
                  fill="#EF4444"
                  name="Confidence Band"
                />
              )}

              {/* Current Time Reference Line */}
              <ReferenceLine 
                x={formatTimeLabel(currentTime, timeRange)} 
                stroke="#10B981"
                strokeWidth={2}
                strokeDasharray="2 2"
                label={{ value: "Now", position: "top" }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p>No time series data available</p>
              <p className="text-sm">Historical data will appear here</p>
            </div>
          </div>
        )}
      </div>

      {/* Statistics and Insights */}
      {combinedData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Historical Statistics */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Historical Statistics</h4>
            {(() => {
              const historicalValues = combinedData
                .filter(d => d.historicalValue !== null)
                .map(d => d.historicalValue);
              
              if (historicalValues.length === 0) return <p className="text-sm text-gray-500">No historical data</p>;
              
              const avg = historicalValues.reduce((sum, val) => sum + val, 0) / historicalValues.length;
              const min = Math.min(...historicalValues);
              const max = Math.max(...historicalValues);
              
              return (
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600">Average</p>
                    <p className="text-lg font-semibold" style={{ color: sensorColor }}>
                      {avg.toFixed(1)}{unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Min</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {min.toFixed(1)}{unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Max</p>
                    <p className="text-lg font-semibold text-red-600">
                      {max.toFixed(1)}{unit}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Predictions Statistics */}
          {predictions && predictions[sensor] && (
            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Prediction Insights</h4>
              {(() => {
                const predictionValues = predictions[sensor];
                const avgConfidence = predictionValues.reduce((sum, pred) => 
                  sum + (pred.confidence || 0), 0) / predictionValues.length;
                const trend = predictionValues.length > 1 ? 
                  predictionValues[predictionValues.length - 1].predicted_value - predictionValues[0].predicted_value : 0;
                
                return (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Avg Confidence:</span>
                      <span className="text-sm font-semibold text-red-600">
                        {avgConfidence.toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Trend:</span>
                      <span className={`text-sm font-semibold ${trend > 0 ? 'text-red-600' : trend < 0 ? 'text-blue-600' : 'text-gray-600'}`}>
                        {trend > 0 ? '↗️ Increasing' : trend < 0 ? '↘️ Decreasing' : '→ Stable'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Forecast Days:</span>
                      <span className="text-sm font-semibold text-gray-700">
                        {predictionValues.length} days
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TimeSeriesPlot;