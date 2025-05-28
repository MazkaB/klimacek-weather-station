import React, { useState, useEffect } from 'react';
import SensorPlot from './SensorPlot';
import TimeSeriesPlot from './TimeSeriesPlot';
import { 
  CloudIcon, 
  SunIcon, 
  EyeIcon, 
  CloudIcon as RainIcon,
  ArrowPathIcon,
  BoltIcon,
  SignalIcon,
  Battery100Icon
} from '@heroicons/react/24/outline';

const Dashboard = ({ sensorData, predictions, setPredictions }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [selectedSensor, setSelectedSensor] = useState('temperature');
  const [showPredictions, setShowPredictions] = useState(false);

  const sensorIcons = {
    humidity: CloudIcon,
    temperature: SunIcon,
    light_intensity: EyeIcon,
    rainfall: RainIcon,
    wind_speed: ArrowPathIcon,
    solar_voltage: BoltIcon,
    solar_wattage: SignalIcon,
    solar_current: Battery100Icon
  };

  const sensorUnits = {
    humidity: '%',
    temperature: '°C',
    light_intensity: 'lux',
    rainfall: 'mm',
    wind_speed: 'km/h',
    solar_voltage: 'V',
    solar_wattage: 'W',
    solar_current: 'A'
  };

  const sensorColors = {
    humidity: 'bg-blue-500',
    temperature: 'bg-orange-500',
    light_intensity: 'bg-yellow-500',
    rainfall: 'bg-blue-600',
    wind_speed: 'bg-gray-500',
    solar_voltage: 'bg-green-500',
    solar_wattage: 'bg-purple-500',
    solar_current: 'bg-indigo-500'
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 60000); // Update timestamp every minute

    return () => clearInterval(interval);
  }, []);

  const fetchPredictions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/predictions?days=30');
      const data = await response.json();
      
      if (data.success) {
        setPredictions(data.predictions);
        setShowPredictions(true);
      } else {
        console.error('Failed to fetch predictions:', data.error);
      }
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startRealtimeData = async () => {
    try {
      await fetch('http://localhost:5000/api/start-realtime', { method: 'POST' });
      console.log('Real-time data started');
    } catch (error) {
      console.error('Error starting real-time data:', error);
    }
  };

  const getSensorValue = (sensor) => {
    return sensorData ? sensorData[sensor] : '--';
  };

  const getSensorStatus = (sensor, value) => {
    // Define normal ranges for each sensor
    const ranges = {
      humidity: [30, 80],
      temperature: [18, 35],
      light_intensity: [100, 1000],
      rainfall: [0, 5],
      wind_speed: [0, 15],
      solar_voltage: [11, 13],
      solar_wattage: [10, 80],
      solar_current: [1, 6]
    };

    if (!ranges[sensor] || value === '--') return 'normal';
    
    const [min, max] = ranges[sensor];
    if (value < min || value > max) return 'warning';
    return 'normal';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🌤️ Klimacek Weather Dashboard
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          Real-time Weather Monitoring & AI Predictions
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
          <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
          <span>•</span>
          <span>Surakarta, Central Java, ID</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={fetchPredictions}
          disabled={isLoading}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <ArrowPathIcon className="h-5 w-5 animate-spin" />
          ) : (
            <SignalIcon className="h-5 w-5" />
          )}
          <span>{isLoading ? 'Generating...' : 'Generate AI Predictions'}</span>
        </button>
        
        <button
          onClick={startRealtimeData}
          className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <ArrowPathIcon className="h-5 w-5" />
          <span>Start Real-time Updates</span>
        </button>
      </div>

      {/* Sensor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(sensorIcons).map(([sensor, Icon]) => {
          const value = getSensorValue(sensor);
          const status = getSensorStatus(sensor, value);
          const colorClass = sensorColors[sensor];
          
          return (
            <div
              key={sensor}
              className={`bg-white rounded-xl shadow-lg p-6 border-l-4 hover:shadow-xl transition-shadow cursor-pointer ${
                selectedSensor === sensor ? 'ring-2 ring-blue-500' : ''
              } ${status === 'warning' ? 'border-l-red-500' : 'border-l-blue-500'}`}
              onClick={() => setSelectedSensor(sensor)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full ${colorClass} text-white`}>
                  <Icon className="h-6 w-6" />
                </div>
                {status === 'warning' && (
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {sensor.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </h3>
              
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-gray-900">
                  {typeof value === 'number' ? value.toFixed(1) : value}
                </span>
                <span className="text-lg text-gray-500">
                  {sensorUnits[sensor]}
                </span>
              </div>
              
              <div className={`mt-2 text-sm ${
                status === 'warning' ? 'text-red-600' : 'text-green-600'
              }`}>
                {status === 'warning' ? '⚠️ Out of range' : '✅ Normal'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Visualization Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Sensor Plot */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Live Sensor Data
            </h2>
            <select
              value={selectedSensor}
              onChange={(e) => setSelectedSensor(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Object.keys(sensorIcons).map(sensor => (
                <option key={sensor} value={sensor}>
                  {sensor.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
          
          <SensorPlot 
            sensor={selectedSensor}
            currentValue={getSensorValue(selectedSensor)}
            unit={sensorUnits[selectedSensor]}
          />
        </div>

        {/* Time Series Plot */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Historical Trends
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowPredictions(!showPredictions)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showPredictions 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {showPredictions ? 'Hide' : 'Show'} Predictions
              </button>
            </div>
          </div>
          
          <TimeSeriesPlot 
            sensor={selectedSensor}
            predictions={showPredictions ? predictions : null}
          />
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">System Status</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2 animate-pulse"></div>
            <p className="text-sm font-medium text-gray-900">Data Collection</p>
            <p className="text-xs text-gray-500">Active</p>
          </div>
          
          <div className="text-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mb-2"></div>
            <p className="text-sm font-medium text-gray-900">ML Model</p>
            <p className="text-xs text-gray-500">Ready</p>
          </div>
          
          <div className="text-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
            <p className="text-sm font-medium text-gray-900">Database</p>
            <p className="text-xs text-gray-500">Connected</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;